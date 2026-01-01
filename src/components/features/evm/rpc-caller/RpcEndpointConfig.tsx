'use client';

import { useState, useEffect } from 'react';
import { getAllEndpoints, type ChainConfig, type RpcEndpoint } from '@/config/evm/rpc-endpoints';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { testRpcLatency, testRpcLatencies, selectBestRpc, type RpcLatencyResult } from './utils';
import { STORAGE_KEYS, type CustomEndpointsStorage } from './types';
import { toast } from "sonner"
import { AlertCircle } from 'lucide-react';
import ChainSelector from './ChainSelector';
import RpcEndpointSelector from './RpcEndpointSelector';
import CustomRpcList from './CustomRpcList';
import AddCustomRpcForm from './AddCustomRpcForm';

interface RpcEndpointConfigProps {
  selectedChain: ChainConfig | null;
  selectedEndpoint: RpcEndpoint | null;
  onChainChange: (chain: ChainConfig) => void;
  onEndpointChange: (endpoint: RpcEndpoint) => void;
  onCustomEndpointAdd: (endpoint: RpcEndpoint) => void;
}

export default function RpcEndpointConfig({
  selectedChain,
  selectedEndpoint,
  onChainChange,
  onEndpointChange,
  onCustomEndpointAdd,
}: RpcEndpointConfigProps) {
  const [customEndpoints, setCustomEndpoints] = useState<CustomEndpointsStorage>({});
  const [isTestingLatency, setIsTestingLatency] = useState(false);
  const [latencyResults, setLatencyResults] = useState<Map<string, number>>(new Map());
  const [showCustomRpc, setShowCustomRpc] = useState(false);
  const [testingCount, setTestingCount] = useState(0);
  const [totalEndpoints, setTotalEndpoints] = useState(0);

  // 加载自定义端点
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ENDPOINTS);
      if (stored) {
        setCustomEndpoints(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load custom endpoints:', error);
    }
  }, []);

  // 当链改变时，自动测试延迟并选择最佳端点
  useEffect(() => {
    if (selectedChain) {
      const allEndpoints = getAllEndpoints(selectedChain.chainId, customEndpoints[selectedChain.chainId] || []);
      if (allEndpoints.length > 0) {
        testAndSelectBestRpc(allEndpoints);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain?.chainId]);

  const testAndSelectBestRpc = async (endpoints: RpcEndpoint[]) => {
    setIsTestingLatency(true);
    setTestingCount(0);
    setTotalEndpoints(endpoints.length);
    const results: RpcLatencyResult[] = [];
    const latencyMap = new Map<string, number>();
    let hasSelectedFirst = false;
    let firstSuccessfulEndpoint: RpcEndpoint | null = null;

    // 并行测试所有端点，但一旦有成功的就立即选择
    const testPromises = endpoints.map(async (endpoint) => {
      const latency = await testRpcLatency(endpoint);
      const result: RpcLatencyResult = {
        endpoint,
        latency,
        timestamp: Date.now(),
      };
      
      latencyMap.set(endpoint.url, latency);
      setLatencyResults(new Map(latencyMap));
      setTestingCount((prev) => prev + 1);
      
      // 如果这是第一个成功的端点且还没有选择过，立即选择它
      if (!hasSelectedFirst && latency !== Infinity && selectedChain) {
        hasSelectedFirst = true;
        firstSuccessfulEndpoint = endpoint;
        onEndpointChange(endpoint);
      }
      
      return result;
    });

    // 等待所有测试完成
    const allResults = await Promise.all(testPromises);
    results.push(...allResults);

    // 所有测试完成后，选择最佳端点（可能比第一个成功的更好）
    const bestEndpoint = selectBestRpc(results);
    
    if (bestEndpoint && selectedChain) {
      // 只有当最佳端点与第一个成功的不同时才更新
      if (firstSuccessfulEndpoint !== null) {
        const firstEndpoint = firstSuccessfulEndpoint as RpcEndpoint;
        if (bestEndpoint.url !== firstEndpoint.url) {
          onEndpointChange(bestEndpoint);
        }
      } else {
        // 如果之前没有选择过，现在选择最佳端点
        onEndpointChange(bestEndpoint);
      }
    } else if (firstSuccessfulEndpoint !== null && selectedChain) {
      // 如果没有找到最佳端点（所有都失败），但之前有成功的，保持选择
      onEndpointChange(firstSuccessfulEndpoint as RpcEndpoint);
    }
    
    setIsTestingLatency(false);
    setTestingCount(0);
    setTotalEndpoints(0);
  };

  const handleAddCustomRpc = (url: string, name: string) => {
    if (!selectedChain || !url.trim()) return;

    const trimmedUrl = url.trim();
    
    // 检查 URL 是否已存在（包括公共端点和自定义端点）
    const allEndpoints = getAllEndpoints(
      selectedChain.chainId,
      customEndpoints[selectedChain.chainId] || []
    );
    
    const urlExists = allEndpoints.some((ep) => ep.url === trimmedUrl);
    
    if (urlExists) {
      toast('RPC URL already exists', {
        description: 'This RPC endpoint has already been added.',
        icon: <AlertCircle className="h-5 w-5" />,
        duration: 3000,
      });
      return;
    }

    const newEndpoint: RpcEndpoint = {
      url: trimmedUrl,
      name: name.trim() || 'Custom RPC',
      chainId: selectedChain.chainId,
      isPublic: false,
    };

    const updated = {
      ...customEndpoints,
      [selectedChain.chainId]: [...(customEndpoints[selectedChain.chainId] || []), newEndpoint],
    };

    setCustomEndpoints(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ENDPOINTS, JSON.stringify(updated));
    onCustomEndpointAdd(newEndpoint);

    // 测试新添加的端点
    testRpcLatencies([newEndpoint], (ep, latency) => {
      setLatencyResults((prev) => {
        const next = new Map(prev);
        next.set(ep.url, latency);
        return next;
      });
    });
  };

  const handleDeleteCustomRpc = (url: string) => {
    if (!selectedChain) return;

    const chainCustomEndpoints = customEndpoints[selectedChain.chainId] || [];
    const updated = {
      ...customEndpoints,
      [selectedChain.chainId]: chainCustomEndpoints.filter((ep) => ep.url !== url),
    };

    setCustomEndpoints(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ENDPOINTS, JSON.stringify(updated));

    // 如果删除的是当前选中的端点，需要重新选择
    if (selectedEndpoint?.url === url) {
      const remainingEndpoints = getAllEndpoints(selectedChain.chainId, updated[selectedChain.chainId] || []);
      if (remainingEndpoints.length > 0) {
        onEndpointChange(remainingEndpoints[0]);
      } else {
        // 如果没有剩余端点，选择第一个公共端点
        const publicEndpoints = selectedChain.publicEndpoints;
        if (publicEndpoints.length > 0) {
          onEndpointChange(publicEndpoints[0]);
        }
      }
    }

    // 从延迟结果中移除
    setLatencyResults((prev) => {
      const next = new Map(prev);
      next.delete(url);
      return next;
    });
  };

  const allEndpoints = selectedChain
    ? getAllEndpoints(selectedChain.chainId, customEndpoints[selectedChain.chainId] || [])
    : [];

  const customEndpointsForChain = selectedChain
    ? customEndpoints[selectedChain.chainId] || []
    : [];

  const handleRetest = () => {
    if (selectedChain) {
      const endpoints = getAllEndpoints(
        selectedChain.chainId,
        customEndpoints[selectedChain.chainId] || []
      );
      testAndSelectBestRpc(endpoints);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chain and RPC Configuration</CardTitle>
        <CardDescription>Select blockchain network and RPC endpoint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChainSelector
          selectedChain={selectedChain}
          onChainChange={onChainChange}
        />

        {selectedChain && (
          <>
            <RpcEndpointSelector
              endpoints={allEndpoints}
              selectedEndpoint={selectedEndpoint}
              latencyResults={latencyResults}
              isTestingLatency={isTestingLatency}
              testingCount={testingCount}
              totalEndpoints={totalEndpoints}
              onEndpointChange={onEndpointChange}
              onRetest={handleRetest}
            />

            <CustomRpcList
              endpoints={customEndpointsForChain}
              latencyResults={latencyResults}
              onDelete={handleDeleteCustomRpc}
            />

            {!showCustomRpc ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowCustomRpc(true)}
              >
                + Add Custom RPC
              </Button>
            ) : (
              <AddCustomRpcForm
                onSubmit={(url, name) => {
                  handleAddCustomRpc(url, name);
                  setShowCustomRpc(false);
                }}
                onCancel={() => setShowCustomRpc(false)}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

