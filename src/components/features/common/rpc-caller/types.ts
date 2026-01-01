/**
 * 通用 RPC Caller 类型定义
 */

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: unknown[];
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface CallHistoryItem {
  id: string;
  timestamp: number;
  chainId?: number | string;
  rpcUrl: string;
  method: string;
  params: unknown[];
  response?: JsonRpcResponse;
  error?: string;
  duration?: number;
}

export interface RpcMethod {
  name: string;
  description: string;
  category: string;
  params: ParamField[];
  returns: {
    type: string;
    description: string;
  };
  example?: {
    request: unknown;
    response: unknown;
  };
}

export interface ParamField {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
  example?: unknown;
  fields?: ParamField[];
}

