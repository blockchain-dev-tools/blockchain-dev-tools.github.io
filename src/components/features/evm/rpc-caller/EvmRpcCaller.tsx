'use client';

import { useState, useEffect } from 'react';
import { getChainConfigByShortName, type ChainConfig, type RpcEndpoint } from '@/config/evm/rpc-endpoints';
import { rpcMethods, getRpcMethod as getEvmRpcMethod } from '@/config/evm/rpc-methods';
import RpcEndpointConfig from './RpcEndpointConfig';
import MethodSelector from '@/components/features/common/rpc-caller/MethodSelector';
import ParameterInput from '@/components/features/common/rpc-caller/ParameterInput';
import ResponseDisplay from '@/components/features/common/rpc-caller/ResponseDisplay';
import CallHistory from '@/components/features/common/rpc-caller/CallHistory';
import { sendRpcRequest } from '@/components/features/common/rpc-caller/utils';
import { STORAGE_KEYS } from './types';
import { type JsonRpcResponse, type CallHistoryItem, type RpcMethod } from '@/components/features/common/rpc-caller/types';

export default function EvmRpcCaller() {
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<RpcEndpoint | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<RpcMethod | null>(null);
  const [customMethodName, setCustomMethodName] = useState('');
  const [methodParams, setMethodParams] = useState<string>('[]');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [response, setResponse] = useState<JsonRpcResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [lastRequest, setLastRequest] = useState<{
    endpoint: string;
    method: string;
    params: unknown[];
  } | null>(null);

  // 初始化：加载保存的链和端点
  useEffect(() => {
    try {
      const savedChainId = localStorage.getItem(STORAGE_KEYS.SELECTED_CHAIN);
      if (savedChainId) {
        const chain = getChainConfigByShortName(savedChainId);
        if (chain) {
          setSelectedChain(chain);
        }
      } else {
        // Default to Ethereum
        const ethChain = getChainConfigByShortName('eth');
        if (ethChain) {
          setSelectedChain(ethChain);
        }
      }
    } catch (error) {
      console.error('Failed to load saved chain:', error);
    }

    // 加载调用历史
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
      if (stored) {
        const history = JSON.parse(stored);
        setCallHistory(history.slice(0, 50)); // 只保留最近50条
      }
    } catch (error) {
      console.error('Failed to load call history:', error);
    }
  }, []);

  // 保存选中的链
  useEffect(() => {
    if (selectedChain) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CHAIN, selectedChain.shortName);
    }
  }, [selectedChain]);

  const handleSendRequest = async () => {
    if (!selectedEndpoint) {
      setError('Please select an RPC endpoint first');
      return;
    }

    const methodName = selectedMethod?.name || customMethodName.trim();
    if (!methodName) {
      setError('Please select or enter a method name');
      return;
    }

    let params: unknown[] = [];
    try {
      params = JSON.parse(methodParams);
      if (!Array.isArray(params)) {
        setError('Parameters must be in array format');
        return;
      }
    } catch (e) {
      setError('Invalid parameter format, please enter a valid JSON array');
      return;
    }

    setIsSendingRequest(true);
    setError(null);
    setResponse(null);

    // Save request info for cURL generation
    setLastRequest({
      endpoint: selectedEndpoint.url,
      method: methodName,
      params,
    });

    try {
      const { response: rpcResponse, duration } = await sendRpcRequest(
        selectedEndpoint.url,
        methodName,
        params
      );

      const jsonRpcResponse = rpcResponse as JsonRpcResponse;
      setResponse(jsonRpcResponse);

      // 保存到历史记录
      const historyItem: CallHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        chainId: selectedChain?.chainId || 0,
        rpcUrl: selectedEndpoint.url,
        method: methodName,
        params,
        response: jsonRpcResponse,
        duration,
      };

      const newHistory = [historyItem, ...callHistory].slice(0, 50);
      setCallHistory(newHistory);
      localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(newHistory));
    } catch (err: unknown) {
      const errorObj = err as { error?: Error; duration?: number };
      const errorMessage = errorObj.error instanceof Error
        ? errorObj.error.message
        : 'Request failed';
      setError(errorMessage);

      // 保存错误到历史记录
      const historyItem: CallHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        chainId: selectedChain?.chainId || 0,
        rpcUrl: selectedEndpoint.url,
        method: methodName,
        params,
        error: errorMessage,
        duration: errorObj.duration,
      };

      const newHistory = [historyItem, ...callHistory].slice(0, 50);
      setCallHistory(newHistory);
      localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(newHistory));
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleClear = () => {
    setMethodParams('[]');
    setResponse(null);
    setError(null);
    setSelectedMethod(null);
    setCustomMethodName('');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const newHistory = callHistory.filter((item) => item.id !== id);
    setCallHistory(newHistory);
    localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(newHistory));
  };

  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear all call history?')) {
      setCallHistory([]);
      localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify([]));
    }
  };

  const handleHistoryItemClick = (method: string, params: unknown[]) => {
    // 从历史记录点击时，尝试找到对应的方法配置
    const methodConfig = getEvmRpcMethod(method);
    if (methodConfig) {
      // Convert EVM RpcMethod to common RpcMethod
      const commonMethod: RpcMethod = {
        ...methodConfig,
        category: methodConfig.category,
      };
      handleMethodChange(commonMethod, '', JSON.stringify(params, null, 2));
    } else {
      // 如果是自定义方法，使用自定义方法名
      handleMethodChange(null, method, JSON.stringify(params, null, 2));
    }
  };

  const handleMethodChange = (method: RpcMethod | null, customName: string, defaultParams: string) => {
    setSelectedMethod(method);
    setCustomMethodName(customName);
    setMethodParams(defaultParams);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">EVM RPC API Caller</h1>
        <p className="text-muted-foreground">
          Directly call RPC interfaces of EVM-compatible chains
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：配置区域 */}
        <div className="space-y-6">
          {/* RPC 端点配置 */}
          <RpcEndpointConfig
            selectedChain={selectedChain}
            selectedEndpoint={selectedEndpoint}
            onChainChange={(chain) => {
              setSelectedChain(chain);
            }}
            onEndpointChange={(endpoint) => {
              setSelectedEndpoint(endpoint);
              localStorage.setItem(STORAGE_KEYS.SELECTED_ENDPOINT, endpoint.url);
            }}
            onCustomEndpointAdd={(endpoint) => {
              // 自定义端点已添加到配置中
            }}
          />

          <MethodSelector
            methods={rpcMethods.map(m => ({ ...m, category: m.category }))}
            categories={['account', 'block', 'transaction', 'contract', 'network', 'debug', 'other'] as const}
            getMethod={(name) => {
              const method = getEvmRpcMethod(name);
              return method ? { ...method, category: method.category } : null;
            }}
            selectedMethod={selectedMethod}
            customMethodName={customMethodName}
            placeholder="e.g., eth_getBalance"
            onMethodChange={handleMethodChange}
          />

          <ParameterInput
            methodParams={methodParams}
            isSendingRequest={isSendingRequest}
            canSend={!!selectedEndpoint && (!!selectedMethod || !!customMethodName.trim())}
            onParamsChange={setMethodParams}
            onSend={handleSendRequest}
            onClear={handleClear}
          />
        </div>

        {/* Right Side: Response Area */}
        <div className="space-y-6">
          <ResponseDisplay
            response={response}
            error={error}
            lastRequest={lastRequest}
          />

          <CallHistory
            callHistory={callHistory}
            onItemClick={handleHistoryItemClick}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
          />
        </div>
      </div>
    </div>
  );
}

