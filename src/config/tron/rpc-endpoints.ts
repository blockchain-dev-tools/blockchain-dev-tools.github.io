/**
 * Tron RPC 端点配置
 */

export interface TronRpcEndpoint {
  url: string;
  name: string;
  network: 'mainnet' | 'shasta' | 'nile';
  isPublic: boolean;
}

export interface TronNetworkConfig {
  network: 'mainnet' | 'shasta' | 'nile';
  name: string;
  publicEndpoints: TronRpcEndpoint[];
}

export const tronNetworkConfigs: TronNetworkConfig[] = [
  {
    network: 'mainnet',
    name: 'Tron Mainnet',
    publicEndpoints: [
      { url: 'https://api.trongrid.io', name: 'TronGrid Official', network: 'mainnet', isPublic: true },
      { url: 'https://api.tronstack.io', name: 'TronStack', network: 'mainnet', isPublic: true },
      { url: 'https://tron.blockpi.network/v1/rpc/public', name: 'BlockPI', network: 'mainnet', isPublic: true },
      { url: 'https://rpc.ankr.com/tron', name: 'Ankr', network: 'mainnet', isPublic: true },
    ],
  },
  {
    network: 'shasta',
    name: 'Tron Shasta Testnet',
    publicEndpoints: [
      { url: 'https://api.shasta.trongrid.io', name: 'TronGrid Shasta', network: 'shasta', isPublic: true },
    ],
  },
  {
    network: 'nile',
    name: 'Tron Nile Testnet',
    publicEndpoints: [
      { url: 'https://api.nileex.io', name: 'Nile Testnet', network: 'nile', isPublic: true },
    ],
  },
];

/**
 * Get network config by network name
 */
export function getTronNetworkConfig(network: 'mainnet' | 'shasta' | 'nile'): TronNetworkConfig | undefined {
  return tronNetworkConfigs.find((config) => config.network === network);
}

/**
 * Get all endpoints for a network (including custom endpoints)
 */
export function getAllTronEndpoints(
  network: 'mainnet' | 'shasta' | 'nile',
  customEndpoints: TronRpcEndpoint[] = []
): TronRpcEndpoint[] {
  const networkConfig = getTronNetworkConfig(network);
  if (!networkConfig) {
    return customEndpoints;
  }
  return [...networkConfig.publicEndpoints, ...customEndpoints];
}

