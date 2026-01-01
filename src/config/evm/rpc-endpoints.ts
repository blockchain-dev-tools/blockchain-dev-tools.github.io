/**
 * RPC 端点配置文件
 * 包含所有支持的链及其公共 RPC 端点
 * 数据来源：https://chainlist.org/
 */

export interface RpcEndpoint {
  url: string;
  name: string;
  chainId: number;
  isPublic: boolean; // 是否为公共端点
}

export interface ChainConfig {
  chainId: number;
  name: string;
  shortName: string; // eth, bnb, matic, base, arbitrum, morph
  publicEndpoints: RpcEndpoint[];
}

export const chainConfigs: ChainConfig[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    shortName: 'eth',
    publicEndpoints: [
      { url: 'https://eth.llamarpc.com', name: 'LlamaRPC', chainId: 1, isPublic: true },
      { url: 'https://rpc.ankr.com/eth', name: 'Ankr', chainId: 1, isPublic: true },
      { url: 'https://ethereum.publicnode.com', name: 'PublicNode', chainId: 1, isPublic: true },
      { url: 'https://eth.merkle.io', name: 'Merkle', chainId: 1, isPublic: true },
      { url: 'https://rpc.flashbots.net', name: 'Flashbots', chainId: 1, isPublic: true },
    ],
  },
  {
    chainId: 56,
    name: 'BNB Smart Chain',
    shortName: 'bnb',
    publicEndpoints: [
      { url: 'https://bsc-dataseed.binance.org', name: 'Binance', chainId: 56, isPublic: true },
      { url: 'https://bsc-dataseed1.defibit.io', name: 'DefiBit', chainId: 56, isPublic: true },
      { url: 'https://bsc-dataseed1.ninicoin.io', name: 'Ninicoin', chainId: 56, isPublic: true },
      { url: 'https://bsc-dataseed2.defibit.io', name: 'DefiBit 2', chainId: 56, isPublic: true },
      { url: 'https://bsc-dataseed3.defibit.io', name: 'DefiBit 3', chainId: 56, isPublic: true },
    ],
  },
  {
    chainId: 137,
    name: 'Polygon',
    shortName: 'matic',
    publicEndpoints: [
      { url: 'https://polygon-rpc.com', name: 'Polygon RPC', chainId: 137, isPublic: true },
      { url: 'https://rpc.ankr.com/polygon', name: 'Ankr', chainId: 137, isPublic: true },
      { url: 'https://polygon.llamarpc.com', name: 'LlamaRPC', chainId: 137, isPublic: true },
      { url: 'https://polygon.blockpi.network/v1/rpc/public', name: 'BlockPI', chainId: 137, isPublic: true },
      { url: 'https://polygon-bor.publicnode.com', name: 'PublicNode', chainId: 137, isPublic: true },
    ],
  },
  {
    chainId: 8453,
    name: 'Base',
    shortName: 'base',
    publicEndpoints: [
      { url: 'https://mainnet.base.org', name: 'Base Official', chainId: 8453, isPublic: true },
      { url: 'https://base.llamarpc.com', name: 'LlamaRPC', chainId: 8453, isPublic: true },
      { url: 'https://base-rpc.publicnode.com', name: 'PublicNode', chainId: 8453, isPublic: true },
      { url: 'https://base.gateway.tenderly.co', name: 'Tenderly', chainId: 8453, isPublic: true },
      { url: 'https://1rpc.io/base', name: '1RPC', chainId: 8453, isPublic: true },
    ],
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'arbitrum',
    publicEndpoints: [
      { url: 'https://arb1.arbitrum.io/rpc', name: 'Arbitrum Official', chainId: 42161, isPublic: true },
      { url: 'https://arbitrum.llamarpc.com', name: 'LlamaRPC', chainId: 42161, isPublic: true },
      { url: 'https://arbitrum-one-rpc.publicnode.com', name: 'PublicNode', chainId: 42161, isPublic: true },
      { url: 'https://rpc.ankr.com/arbitrum', name: 'Ankr', chainId: 42161, isPublic: true },
      { url: 'https://arbitrum.blockpi.network/v1/rpc/public', name: 'BlockPI', chainId: 42161, isPublic: true },
    ],
  },
  {
    chainId: 2819,
    name: 'Morph',
    shortName: 'morph',
    publicEndpoints: [
      { url: 'https://rpc.morphl2.io', name: 'Morph Official', chainId: 2819, isPublic: true },
      { url: 'https://rpc-quicknode.morphl2.io', name: 'QuickNode', chainId: 2819, isPublic: true },
    ],
  },
];

/**
 * 根据 chainId 获取链配置
 */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return chainConfigs.find((config) => config.chainId === chainId);
}

/**
 * 根据 shortName 获取链配置
 */
export function getChainConfigByShortName(shortName: string): ChainConfig | undefined {
  return chainConfigs.find((config) => config.shortName === shortName);
}

/**
 * 获取所有可用的 RPC 端点（包括公共端点和用户自定义端点）
 */
export function getAllEndpoints(chainId: number, customEndpoints: RpcEndpoint[] = []): RpcEndpoint[] {
  const chainConfig = getChainConfig(chainId);
  if (!chainConfig) {
    return customEndpoints;
  }
  return [...chainConfig.publicEndpoints, ...customEndpoints];
}

