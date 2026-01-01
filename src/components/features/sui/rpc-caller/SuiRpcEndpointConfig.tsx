'use client';

import { useState, useEffect } from 'react';
import { suiNetworkConfigs, getAllSuiEndpoints, type SuiNetworkConfig, type SuiRpcEndpoint } from '@/config/sui/rpc-endpoints';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { sendRpcRequest } from '@/components/features/common/rpc-caller/utils';

interface SuiRpcEndpointConfigProps {
  selectedNetwork: SuiNetworkConfig | null;
  selectedEndpoint: SuiRpcEndpoint | null;
  onNetworkChange: (network: SuiNetworkConfig) => void;
  onEndpointChange: (endpoint: SuiRpcEndpoint) => void;
}

export default function SuiRpcEndpointConfig({
  selectedNetwork,
  selectedEndpoint,
  onNetworkChange,
  onEndpointChange,
}: SuiRpcEndpointConfigProps) {
  const [latencyResults, setLatencyResults] = useState<Map<string, number>>(new Map());
  const [isTestingLatency, setIsTestingLatency] = useState(false);

  // Auto-select first endpoint when network changes
  useEffect(() => {
    if (selectedNetwork) {
      const endpoints = getAllSuiEndpoints(selectedNetwork.network);
      if (endpoints.length > 0 && !selectedEndpoint) {
        onEndpointChange(endpoints[0]);
      }
    }
  }, [selectedNetwork?.network]);

  const testLatency = async (endpoint: SuiRpcEndpoint) => {
    const startTime = Date.now();
    try {
      await sendRpcRequest(endpoint.url, 'sui_getChainIdentifier', []);
      const latency = Date.now() - startTime;
      setLatencyResults((prev) => {
        const next = new Map(prev);
        next.set(endpoint.url, latency);
        return next;
      });
      return latency;
    } catch {
      setLatencyResults((prev) => {
        const next = new Map(prev);
        next.set(endpoint.url, Infinity);
        return next;
      });
      return Infinity;
    }
  };

  const handleRetest = async () => {
    if (!selectedNetwork) return;
    setIsTestingLatency(true);
    const endpoints = getAllSuiEndpoints(selectedNetwork.network);
    for (const endpoint of endpoints) {
      await testLatency(endpoint);
    }
    setIsTestingLatency(false);
  };

  const allEndpoints = selectedNetwork
    ? getAllSuiEndpoints(selectedNetwork.network)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network and RPC Configuration</CardTitle>
        <CardDescription>Select Sui network and RPC endpoint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="network-select">Select Network</Label>
          <Select
            value={selectedNetwork?.network || ''}
            onValueChange={(value) => {
              const network = suiNetworkConfigs.find((n) => n.network === value as any);
              if (network) {
                onNetworkChange(network);
              }
            }}
          >
            <SelectTrigger id="network-select" className="w-full">
              <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent>
              {suiNetworkConfigs.map((network) => (
                <SelectItem key={network.network} value={network.network}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedNetwork && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="rpc-select">RPC Endpoint</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs font-normal hover:bg-transparent hover:text-foreground/80"
                onClick={handleRetest}
                disabled={isTestingLatency}
              >
                {isTestingLatency ? 'Testing...' : 'Retest'}
              </Button>
            </div>
            <Select
              value={selectedEndpoint?.url || ''}
              onValueChange={(value) => {
                const endpoint = allEndpoints.find((ep) => ep.url === value);
                if (endpoint) {
                  onEndpointChange(endpoint);
                }
              }}
              disabled={isTestingLatency && !selectedEndpoint}
            >
              <SelectTrigger id="rpc-select" className="w-full">
                <SelectValue placeholder="Select an RPC endpoint" />
              </SelectTrigger>
              <SelectContent>
                {allEndpoints.map((endpoint) => {
                  const latency = latencyResults.get(endpoint.url);
                  const latencyText = latency !== undefined
                    ? latency === Infinity
                      ? ' (Failed)'
                      : ` (${latency}ms)`
                    : isTestingLatency
                      ? ' (Testing...)'
                      : '';
                  return (
                    <SelectItem key={endpoint.url} value={endpoint.url}>
                      {endpoint.name} - {endpoint.url}{latencyText}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

