'use client';

import { useState, useEffect } from 'react';
import { tronNetworkConfigs, type TronNetworkConfig, type TronRpcEndpoint } from '@/config/tron/rpc-endpoints';
import { tronRpcMethods, getTronRpcMethod } from '@/config/tron/rpc-methods';
import { type RpcMethod } from '@/components/features/common/rpc-caller/types';
import TronRpcEndpointConfig from './TronRpcEndpointConfig';
import MethodSelector from '@/components/features/common/rpc-caller/MethodSelector';
import ParameterInput from '@/components/features/common/rpc-caller/ParameterInput';
import ResponseDisplay from '@/components/features/common/rpc-caller/ResponseDisplay';
import CallHistory from '@/components/features/common/rpc-caller/CallHistory';
import { sendRpcRequest } from '@/components/features/common/rpc-caller/utils';
import { type JsonRpcResponse, type CallHistoryItem } from '@/components/features/common/rpc-caller/types';

const STORAGE_KEYS = {
  SELECTED_NETWORK: 'tron_rpc_selected_network',
  CALL_HISTORY: 'tron_rpc_call_history',
};

export default function TronRpcCaller() {
  const [selectedNetwork, setSelectedNetwork] = useState<TronNetworkConfig | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<TronRpcEndpoint | null>(null);
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

  // Initialize: Load saved network
  useEffect(() => {
    try {
      const savedNetwork = localStorage.getItem(STORAGE_KEYS.SELECTED_NETWORK);
      if (savedNetwork) {
        const network = tronNetworkConfigs.find((n) => n.network === savedNetwork);
        if (network) {
          setSelectedNetwork(network);
        }
      } else {
        // Default to mainnet
        const mainnet = tronNetworkConfigs.find((n) => n.network === 'mainnet');
        if (mainnet) {
          setSelectedNetwork(mainnet);
        }
      }
    } catch (error) {
      console.error('Failed to load saved network:', error);
    }

    // Load call history
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
      if (stored) {
        const history = JSON.parse(stored);
        setCallHistory(history.slice(0, 50));
      }
    } catch (error) {
      console.error('Failed to load call history:', error);
    }
  }, []);

  // Save selected network
  useEffect(() => {
    if (selectedNetwork) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_NETWORK, selectedNetwork.network);
    }
  }, [selectedNetwork]);

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

      // Save to history
      const historyItem: CallHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        chainId: selectedNetwork?.network,
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

      // Save error to history
      const historyItem: CallHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        chainId: selectedNetwork?.network,
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
    const methodConfig = getTronRpcMethod(method);
    if (methodConfig) {
      handleMethodChange(methodConfig, '', JSON.stringify(params, null, 2));
    } else {
      handleMethodChange(null, method, JSON.stringify(params, null, 2));
    }
  };

  const handleMethodChange = (method: RpcMethod | null, customName: string, defaultParams: string) => {
    setSelectedMethod(method);
    setCustomMethodName(customName);
    setMethodParams(defaultParams);
  };

  const categories = ['account', 'block', 'transaction', 'network', 'event'] as const;

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tron RPC API Caller</h1>
        <p className="text-muted-foreground">
          Directly call RPC interfaces of Tron blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TronRpcEndpointConfig
            selectedNetwork={selectedNetwork}
            selectedEndpoint={selectedEndpoint}
            onNetworkChange={(network) => {
              setSelectedNetwork(network);
            }}
            onEndpointChange={(endpoint) => {
              setSelectedEndpoint(endpoint);
            }}
          />

          <MethodSelector
            methods={tronRpcMethods}
            categories={categories}
            getMethod={getTronRpcMethod}
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
