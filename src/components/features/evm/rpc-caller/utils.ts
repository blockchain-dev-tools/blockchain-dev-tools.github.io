/**
 * RPC 调用器工具函数
 */

import type { RpcEndpoint } from '@/config/evm/rpc-endpoints';
import { STORAGE_KEYS, type LatencyCacheStorage, type RpcLatencyResult} from './types';

// Re-export types for convenience
export type { RpcLatencyResult };

/**
 * 测试 RPC 端点的延迟
 */
export async function testRpcLatency(endpoint: RpcEndpoint, timeout = 5000): Promise<number> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const endTime = Date.now();

    if (response.ok) {
      const data = await response.json();
      if (data.error) {
        return Infinity;
      }
      return endTime - startTime;
    }
    return Infinity;
  } catch (error) {
    return Infinity;
  }
}

/**
 * 批量测试 RPC 端点延迟
 */
export async function testRpcLatencies(
  endpoints: RpcEndpoint[],
  onProgress?: (endpoint: RpcEndpoint, latency: number) => void
): Promise<RpcLatencyResult[]> {
  const results: RpcLatencyResult[] = [];

  for (const endpoint of endpoints) {
    const latency = await testRpcLatency(endpoint);
    const result: RpcLatencyResult = {
      endpoint,
      latency,
      timestamp: Date.now(),
    };
    results.push(result);
    onProgress?.(endpoint, latency);
  }

  return results;
}

/**
 * 选择延迟最短的 RPC 端点
 */
export function selectBestRpc(results: RpcLatencyResult[]): RpcEndpoint | null {
  const validResults = results.filter((r) => r.latency !== Infinity);
  if (validResults.length === 0) {
    return null;
  }

  const best = validResults.reduce((prev, current) =>
    prev.latency < current.latency ? prev : current
  );

  return best.endpoint;
}

/**
 * 从 localStorage 获取延迟缓存
 */
export function getLatencyCache(): LatencyCacheStorage {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.RPC_LATENCY_CACHE);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to get latency cache:', error);
  }
  return {};
}

/**
 * 保存延迟缓存到 localStorage
 */
export function saveLatencyCache(cache: LatencyCacheStorage): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RPC_LATENCY_CACHE, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save latency cache:', error);
  }
}

/**
 * 检查延迟缓存是否有效（5分钟内有效）
 */
export function isLatencyCacheValid(timestamp: number): boolean {
  const CACHE_DURATION = 5 * 60 * 1000; // 5分钟
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * 发送 JSON-RPC 请求
 */
export async function sendRpcRequest(
  endpoint: string,
  method: string,
  params: unknown[],
  timeout = 30000
): Promise<{ response: unknown; duration: number }> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const request = {
      jsonrpc: '2.0' as const,
      method,
      params,
      id: Date.now(),
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { response: data, duration };
  } catch (error) {
    clearTimeout(timeoutId);
    const endTime = Date.now();
    const duration = endTime - startTime;
    throw { error, duration };
  }
}

/**
 * 格式化数值（Wei 转 Ether）
 */
export function formatWeiToEther(wei: string): string {
  try {
    const weiBigInt = BigInt(wei);
    const ether = Number(weiBigInt) / 1e18;
    return ether.toFixed(6);
  } catch {
    return wei;
  }
}

/**
 * 格式化十六进制数值
 */
export function formatHexToDecimal(hex: string): string {
  try {
    if (hex.startsWith('0x')) {
      return BigInt(hex).toString(10);
    }
    return hex;
  } catch {
    return hex;
  }
}

/**
 * Generate cURL command from RPC request
 */
export function generateCurlCommand(
  endpoint: string,
  method: string,
  params: unknown[]
): string {
  const requestBody = {
    jsonrpc: '2.0',
    method,
    params,
    id: 1,
  };

  const jsonBody = JSON.stringify(requestBody);
  // Escape for shell: escape backslashes, then escape single quotes
  const escapedBody = jsonBody.replace(/\\/g, '\\\\').replace(/'/g, "'\\''");
  
  return `curl -X POST '${endpoint}' \\
  -H 'Content-Type: application/json' \\
  -d '${escapedBody}'`;
}

