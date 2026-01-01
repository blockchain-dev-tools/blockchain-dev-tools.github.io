/**
 * 通用 RPC 调用器工具函数
 */

export interface RpcEndpoint {
  url: string;
  name: string;
  chainId?: number | string;
  isPublic: boolean;
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

