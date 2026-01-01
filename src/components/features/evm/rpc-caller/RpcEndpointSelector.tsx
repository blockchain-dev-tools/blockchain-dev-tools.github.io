'use client';

import { type RpcEndpoint } from '@/config/evm/rpc-endpoints';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RpcEndpointSelectorProps {
  endpoints: RpcEndpoint[];
  selectedEndpoint: RpcEndpoint | null;
  latencyResults: Map<string, number>;
  isTestingLatency: boolean;
  testingCount: number;
  totalEndpoints: number;
  onEndpointChange: (endpoint: RpcEndpoint) => void;
  onRetest: () => void;
}

export default function RpcEndpointSelector({
  endpoints,
  selectedEndpoint,
  latencyResults,
  isTestingLatency,
  testingCount,
  totalEndpoints,
  onEndpointChange,
  onRetest,
}: RpcEndpointSelectorProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor="rpc-select">RPC Endpoint</Label>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs font-normal hover:bg-transparent hover:text-foreground/80"
          onClick={onRetest}
          disabled={isTestingLatency}
        >
          {isTestingLatency
            ? totalEndpoints > 0
              ? `Testing... (${testingCount}/${totalEndpoints})`
              : 'Testing...'
            : 'Retest'}
        </Button>
      </div>
      <Select
        value={selectedEndpoint?.url || ''}
        onValueChange={(value) => {
          const endpoint = endpoints.find((ep) => ep.url === value);
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
          {endpoints.map((endpoint) => {
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
      {selectedEndpoint && latencyResults.has(selectedEndpoint.url) && (
        <p className="text-xs text-muted-foreground mt-0">
          Current latency: {latencyResults.get(selectedEndpoint.url) === Infinity
            ? 'Connection failed'
            : `${latencyResults.get(selectedEndpoint.url)}ms`}
        </p>
      )}
    </div>
  );
}

