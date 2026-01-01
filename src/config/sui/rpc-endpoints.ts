/**
 * Sui RPC 端点配置
 */

export interface SuiRpcEndpoint {
  url: string;
  name: string;
  network: 'mainnet' | 'testnet' | 'devnet';
  isPublic: boolean;
}

export interface SuiNetworkConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  name: string;
  publicEndpoints: SuiRpcEndpoint[];
}

export const suiNetworkConfigs: SuiNetworkConfig[] = [
  {
    network: 'mainnet',
    name: 'Sui Mainnet',
    publicEndpoints: [
      { url: 'https://fullnode.mainnet.sui.io:443', name: 'Sui Official Mainnet', network: 'mainnet', isPublic: true },
      { url: 'https://sui-mainnet-endpoint.blockvision.org', name: 'BlockVision', network: 'mainnet', isPublic: true },
      { url: 'https://sui-mainnet-rpc.bartestnet.com', name: 'BarTestnet', network: 'mainnet', isPublic: true },
    ],
  },
  {
    network: 'testnet',
    name: 'Sui Testnet',
    publicEndpoints: [
      { url: 'https://fullnode.testnet.sui.io:443', name: 'Sui Official Testnet', network: 'testnet', isPublic: true },
    ],
  },
  {
    network: 'devnet',
    name: 'Sui Devnet',
    publicEndpoints: [
      { url: 'https://fullnode.devnet.sui.io:443', name: 'Sui Official Devnet', network: 'devnet', isPublic: true },
    ],
  },
];

/**
 * Get network config by network name
 */
export function getSuiNetworkConfig(network: 'mainnet' | 'testnet' | 'devnet'): SuiNetworkConfig | undefined {
  return suiNetworkConfigs.find((config) => config.network === network);
}

/**
 * Get all endpoints for a network (including custom endpoints)
 */
export function getAllSuiEndpoints(
  network: 'mainnet' | 'testnet' | 'devnet',
  customEndpoints: SuiRpcEndpoint[] = []
): SuiRpcEndpoint[] {
  const networkConfig = getSuiNetworkConfig(network);
  if (!networkConfig) {
    return customEndpoints;
  }
  return [...networkConfig.publicEndpoints, ...customEndpoints];
}

