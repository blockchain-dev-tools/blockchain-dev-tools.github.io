/**
 * Solana RPC 方法配置
 * 参考: https://docs.solana.com/api/http
 */

import { type RpcMethod } from '@/components/features/common/rpc-caller/types';

export const solanaRpcMethods: RpcMethod[] = [
  {
    name: 'getAccountInfo',
    description: 'Returns all information associated with the account of provided Pubkey',
    category: 'account',
    params: [
      {
        name: 'pubkey',
        type: 'string',
        description: 'Pubkey of account to query, as base-58 encoded string',
        required: true,
        example: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      },
      {
        name: 'config',
        type: 'object',
        description: 'Configuration object containing optional commitment level and encoding',
        required: false,
        example: { encoding: 'jsonParsed', commitment: 'confirmed' },
        fields: [
          {
            name: 'encoding',
            type: 'string',
            description: 'Encoding format for the account data',
            required: false,
            example: 'jsonParsed',
          },
          {
            name: 'commitment',
            type: 'string',
            description: 'Commitment level',
            required: false,
            example: 'confirmed',
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Account information or null if not found',
    },
  },
  {
    name: 'getBalance',
    description: 'Returns the balance of the account of provided Pubkey',
    category: 'account',
    params: [
      {
        name: 'pubkey',
        type: 'string',
        description: 'Pubkey of account to query, as base-58 encoded string',
        required: true,
        example: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      },
      {
        name: 'commitment',
        type: 'string',
        description: 'Commitment level',
        required: false,
        example: 'confirmed',
      },
    ],
    returns: {
      type: 'object',
      description: 'Balance in lamports',
    },
  },
  {
    name: 'getBlockHeight',
    description: 'Returns the current block height of the cluster',
    category: 'block',
    params: [
      {
        name: 'commitment',
        type: 'string',
        description: 'Commitment level',
        required: false,
        example: 'confirmed',
      },
    ],
    returns: {
      type: 'number',
      description: 'Current block height',
    },
  },
  {
    name: 'getBlock',
    description: 'Returns identity and transaction information about a confirmed block',
    category: 'block',
    params: [
      {
        name: 'slot',
        type: 'number',
        description: 'Slot, as u64 integer',
        required: true,
        example: 123456789,
      },
      {
        name: 'config',
        type: 'object',
        description: 'Configuration object',
        required: false,
        example: { encoding: 'json', transactionDetails: 'full' },
        fields: [
          {
            name: 'encoding',
            type: 'string',
            description: 'Encoding format',
            required: false,
            example: 'json',
          },
          {
            name: 'transactionDetails',
            type: 'string',
            description: 'Level of transaction detail to return',
            required: false,
            example: 'full',
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Block information',
    },
  },
  {
    name: 'getTransaction',
    description: 'Returns transaction details for a confirmed transaction',
    category: 'transaction',
    params: [
      {
        name: 'signature',
        type: 'string',
        description: 'Transaction signature, as base-58 encoded string',
        required: true,
        example: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW',
      },
      {
        name: 'config',
        type: 'object',
        description: 'Configuration object',
        required: false,
        example: { encoding: 'json', commitment: 'confirmed' },
        fields: [
          {
            name: 'encoding',
            type: 'string',
            description: 'Encoding format',
            required: false,
            example: 'json',
          },
          {
            name: 'commitment',
            type: 'string',
            description: 'Commitment level',
            required: false,
            example: 'confirmed',
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction information or null if not found',
    },
  },
  {
    name: 'sendTransaction',
    description: 'Send a transaction',
    category: 'transaction',
    params: [
      {
        name: 'transaction',
        type: 'string',
        description: 'Fully-signed Transaction, as base-58 encoded string',
        required: true,
        example: 'base58-encoded-transaction',
      },
      {
        name: 'config',
        type: 'object',
        description: 'Configuration object',
        required: false,
        example: { skipPreflight: false, preflightCommitment: 'confirmed' },
        fields: [
          {
            name: 'skipPreflight',
            type: 'boolean',
            description: 'If true, skip the preflight transaction checks',
            required: false,
            example: false,
          },
          {
            name: 'preflightCommitment',
            type: 'string',
            description: 'Commitment level to use for preflight',
            required: false,
            example: 'confirmed',
          },
        ],
      },
    ],
    returns: {
      type: 'string',
      description: 'Transaction signature, as base-58 encoded string',
    },
  },
  {
    name: 'getSlot',
    description: 'Returns the current slot the node is processing',
    category: 'network',
    params: [
      {
        name: 'commitment',
        type: 'string',
        description: 'Commitment level',
        required: false,
        example: 'confirmed',
      },
    ],
    returns: {
      type: 'number',
      description: 'Current slot',
    },
  },
  {
    name: 'getVersion',
    description: 'Returns the current Solana version running on the node',
    category: 'network',
    params: [],
    returns: {
      type: 'object',
      description: 'Version information',
    },
  },
  {
    name: 'getHealth',
    description: 'Returns the health status of the node',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Health status: "ok" or error object',
    },
  },
  {
    name: 'getTokenAccountBalance',
    description: 'Returns the token balance of an SPL Token account',
    category: 'account',
    params: [
      {
        name: 'pubkey',
        type: 'string',
        description: 'Pubkey of Token account to query, as base-58 encoded string',
        required: true,
        example: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      },
      {
        name: 'commitment',
        type: 'string',
        description: 'Commitment level',
        required: false,
        example: 'confirmed',
      },
    ],
    returns: {
      type: 'object',
      description: 'Token account balance information',
    },
  },
];

/**
 * Get RPC method by name
 */
export function getSolanaRpcMethod(name: string): RpcMethod | null {
  return solanaRpcMethods.find((m) => m.name === name) || null;
}

/**
 * Get all methods by category
 */
export function getSolanaRpcMethodsByCategory(category: string): RpcMethod[] {
  return solanaRpcMethods.filter((m) => m.category === category);
}

