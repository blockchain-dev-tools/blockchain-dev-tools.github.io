/**
 * RPC 调用器类型定义
 */

import type { RpcEndpoint, ChainConfig } from '@/config/evm/rpc-endpoints';
import type { RpcMethod } from '@/config/evm/rpc-methods';

// JSON-RPC 请求和响应类型
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: unknown[];
  id: number;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number;
}

// RPC 延迟测试结果
export interface RpcLatencyResult {
  endpoint: RpcEndpoint;
  latency: number; // 毫秒
  timestamp: number; // 测试时间戳
}

// 调用历史记录
export interface CallHistoryItem {
  id: string;
  timestamp: number;
  chainId: number;
  rpcUrl: string;
  method: string;
  params: unknown[];
  response?: JsonRpcResponse;
  error?: string;
  duration?: number; // 请求耗时（毫秒）
}

// 组件状态类型
export interface RpcCallerState {
  selectedChain: ChainConfig | null;
  selectedEndpoint: RpcEndpoint | null;
  availableEndpoints: RpcEndpoint[];
  endpointLatencies: Map<string, number>; // endpoint URL -> latency
  selectedMethod: RpcMethod | null;
  customMethodName: string;
  methodParams: Record<string, unknown>; // 参数名 -> 参数值
  isTestingLatency: boolean;
  isSendingRequest: boolean;
  response: JsonRpcResponse | null;
  error: string | null;
  callHistory: CallHistoryItem[];
}

// 存储键名
export const STORAGE_KEYS = {
  CUSTOM_ENDPOINTS: 'rpc-caller-custom-endpoints',
  CALL_HISTORY: 'rpc-caller-call-history',
  RPC_LATENCY_CACHE: 'rpc-caller-rpc-latency-cache',
  SELECTED_CHAIN: 'rpc-caller-selected-chain',
  SELECTED_ENDPOINT: 'rpc-caller-selected-endpoint',
} as const;

// localStorage 存储格式
export interface CustomEndpointsStorage {
  [chainId: number]: RpcEndpoint[];
}

export interface LatencyCacheStorage {
  [url: string]: {
    latency: number;
    timestamp: number;
  };
}

