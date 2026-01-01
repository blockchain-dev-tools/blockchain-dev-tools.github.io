/**
 * Solana RPC 端点配置
 */

export interface SolanaRpcEndpoint {
  url: string;
  name: string;
  network: 'mainnet-beta' | 'testnet' | 'devnet';
  isPublic: boolean;
}

export interface SolanaNetworkConfig {
  network: 'mainnet-beta' | 'testnet' | 'devnet';
  name: string;
  publicEndpoints: SolanaRpcEndpoint[];
}

export const solanaNetworkConfigs: SolanaNetworkConfig[] = [
  {
    network: 'mainnet-beta',
    name: 'Solana Mainnet',
    publicEndpoints: [
      { url: 'https://api.mainnet-beta.solana.com', name: 'Solana Official', network: 'mainnet-beta', isPublic: true },
      { url: 'https://solana-api.projectserum.com', name: 'Project Serum', network: 'mainnet-beta', isPublic: true },
      { url: 'https://rpc.ankr.com/solana', name: 'Ankr', network: 'mainnet-beta', isPublic: true },
      { url: 'https://solana.public-rpc.com', name: 'Public RPC', network: 'mainnet-beta', isPublic: true },
    ],
  },
  {
    network: 'testnet',
    name: 'Solana Testnet',
    publicEndpoints: [
      { url: 'https://api.testnet.solana.com', name: 'Solana Official', network: 'testnet', isPublic: true },
    ],
  },
  {
    network: 'devnet',
    name: 'Solana Devnet',
    publicEndpoints: [
      { url: 'https://api.devnet.solana.com', name: 'Solana Official', network: 'devnet', isPublic: true },
    ],
  },
];

/**
 * Get network config by network name
 */
export function getSolanaNetworkConfig(network: 'mainnet-beta' | 'testnet' | 'devnet'): SolanaNetworkConfig | undefined {
  return solanaNetworkConfigs.find((config) => config.network === network);
}

/**
 * Get all endpoints for a network (including custom endpoints)
 */
export function getAllSolanaEndpoints(
  network: 'mainnet-beta' | 'testnet' | 'devnet',
  customEndpoints: SolanaRpcEndpoint[] = []
): SolanaRpcEndpoint[] {
  const networkConfig = getSolanaNetworkConfig(network);
  if (!networkConfig) {
    return customEndpoints;
  }
  return [...networkConfig.publicEndpoints, ...customEndpoints];
}

