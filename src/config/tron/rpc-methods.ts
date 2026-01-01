/**
 * Tron RPC 方法配置
 * 参考: https://developers.tron.network/reference/json-rpc-api-overview
 */

import { type RpcMethod } from '@/components/features/common/rpc-caller/types';

export const tronRpcMethods: RpcMethod[] = [
  {
    name: 'eth_getBalance',
    description: 'Returns the balance of the account of given address',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'string',
        description: 'Address to check for balance (hex string with 0x prefix)',
        required: true,
        example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
      },
      {
        name: 'blockNumber',
        type: 'string',
        description: 'Block number, or "latest", "earliest", "pending"',
        required: false,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'The account balance in hex format',
    },
  },
  {
    name: 'eth_getTransactionCount',
    description: 'Returns the number of transactions sent from an address',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'string',
        description: 'Address to check for transaction count (hex string with 0x prefix)',
        required: true,
        example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
      },
      {
        name: 'blockNumber',
        type: 'string',
        description: 'Block number, or "latest", "earliest", "pending"',
        required: false,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'The transaction count in hex format',
    },
  },
  {
    name: 'eth_getCode',
    description: 'Returns code at a given address',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'string',
        description: 'Address to get code from (hex string with 0x prefix)',
        required: true,
        example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
      },
      {
        name: 'blockNumber',
        type: 'string',
        description: 'Block number, or "latest", "earliest", "pending"',
        required: false,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'The code at the given address',
    },
  },
  {
    name: 'eth_getBlockByNumber',
    description: 'Returns information about a block by block number',
    category: 'block',
    params: [
      {
        name: 'blockNumber',
        type: 'string',
        description: 'Block number in hex format, or "latest", "earliest", "pending"',
        required: true,
        example: 'latest',
      },
      {
        name: 'fullTransactionObjects',
        type: 'boolean',
        description: 'If true, returns the full transaction objects, if false only the hashes',
        required: false,
        example: true,
      },
    ],
    returns: {
      type: 'object',
      description: 'Block information',
    },
  },
  {
    name: 'eth_getBlockByHash',
    description: 'Returns information about a block by block hash',
    category: 'block',
    params: [
      {
        name: 'blockHash',
        type: 'string',
        description: 'Block hash (hex string with 0x prefix)',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        name: 'fullTransactionObjects',
        type: 'boolean',
        description: 'If true, returns the full transaction objects, if false only the hashes',
        required: false,
        example: true,
      },
    ],
    returns: {
      type: 'object',
      description: 'Block information',
    },
  },
  {
    name: 'eth_getBlockTransactionCountByNumber',
    description: 'Returns the number of transactions in a block by block number',
    category: 'block',
    params: [
      {
        name: 'blockNumber',
        type: 'string',
        description: 'Block number in hex format, or "latest", "earliest", "pending"',
        required: true,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Number of transactions in hex format',
    },
  },
  {
    name: 'eth_getTransactionByHash',
    description: 'Returns the information about a transaction requested by transaction hash',
    category: 'transaction',
    params: [
      {
        name: 'transactionHash',
        type: 'string',
        description: 'Transaction hash (hex string with 0x prefix)',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction information',
    },
  },
  {
    name: 'eth_getTransactionReceipt',
    description: 'Returns the receipt of a transaction by transaction hash',
    category: 'transaction',
    params: [
      {
        name: 'transactionHash',
        type: 'string',
        description: 'Transaction hash (hex string with 0x prefix)',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction receipt',
    },
  },
  {
    name: 'eth_sendRawTransaction',
    description: 'Creates new message call transaction or a contract creation for signed transactions',
    category: 'transaction',
    params: [
      {
        name: 'signedTransactionData',
        type: 'string',
        description: 'The signed transaction data (hex string with 0x prefix)',
        required: true,
        example: '0x...',
      },
    ],
    returns: {
      type: 'string',
      description: 'The transaction hash',
    },
  },
  {
    name: 'eth_call',
    description: 'Executes a new message call immediately without creating a transaction on the block chain',
    category: 'transaction',
    params: [
      {
        name: 'callObject',
        type: 'object',
        description: 'Transaction call object',
        required: true,
        example: {
          to: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          data: '0x...',
        },
        fields: [
          {
            name: 'to',
            type: 'string',
            description: 'The address the transaction is directed to',
            required: true,
            example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          },
          {
            name: 'data',
            type: 'string',
            description: 'Hash of the method signature and encoded parameters',
            required: false,
            example: '0x...',
          },
          {
            name: 'from',
            type: 'string',
            description: 'The address the transaction is sent from',
            required: false,
            example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          },
          {
            name: 'gas',
            type: 'string',
            description: 'Gas provided for the transaction execution',
            required: false,
            example: '0x5208',
          },
          {
            name: 'gasPrice',
            type: 'string',
            description: 'Gas price used for each paid gas',
            required: false,
            example: '0x3b9aca00',
          },
          {
            name: 'value',
            type: 'string',
            description: 'Value sent with this transaction',
            required: false,
            example: '0x0',
          },
        ],
      },
      {
        name: 'blockNumber',
        type: 'string',
        description: 'Block number, or "latest", "earliest", "pending"',
        required: false,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'The return value of executed contract',
    },
  },
  {
    name: 'eth_estimateGas',
    description: 'Estimates the gas necessary to complete a transaction',
    category: 'transaction',
    params: [
      {
        name: 'callObject',
        type: 'object',
        description: 'Transaction call object',
        required: true,
        example: {
          to: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          data: '0x...',
        },
        fields: [
          {
            name: 'to',
            type: 'string',
            description: 'The address the transaction is directed to',
            required: true,
            example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          },
          {
            name: 'data',
            type: 'string',
            description: 'Hash of the method signature and encoded parameters',
            required: false,
            example: '0x...',
          },
          {
            name: 'from',
            type: 'string',
            description: 'The address the transaction is sent from',
            required: false,
            example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          },
          {
            name: 'gas',
            type: 'string',
            description: 'Gas provided for the transaction execution',
            required: false,
            example: '0x5208',
          },
          {
            name: 'gasPrice',
            type: 'string',
            description: 'Gas price used for each paid gas',
            required: false,
            example: '0x3b9aca00',
          },
          {
            name: 'value',
            type: 'string',
            description: 'Value sent with this transaction',
            required: false,
            example: '0x0',
          },
        ],
      },
    ],
    returns: {
      type: 'string',
      description: 'The amount of gas used in hex format',
    },
  },
  {
    name: 'eth_gasPrice',
    description: 'Returns the current price per gas in wei',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Current gas price in hex format',
    },
  },
  {
    name: 'eth_blockNumber',
    description: 'Returns the number of the most recent block',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Current block number in hex format',
    },
  },
  {
    name: 'eth_getLogs',
    description: 'Returns an array of all logs matching a given filter object',
    category: 'event',
    params: [
      {
        name: 'filter',
        type: 'object',
        description: 'Filter options',
        required: true,
        example: {
          fromBlock: 'latest',
          toBlock: 'latest',
          address: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
        },
        fields: [
          {
            name: 'fromBlock',
            type: 'string',
            description: 'Starting block number, or "latest", "earliest", "pending"',
            required: false,
            example: 'latest',
          },
          {
            name: 'toBlock',
            type: 'string',
            description: 'Ending block number, or "latest", "earliest", "pending"',
            required: false,
            example: 'latest',
          },
          {
            name: 'address',
            type: 'string',
            description: 'Contract address or array of addresses',
            required: false,
            example: '0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
          },
          {
            name: 'topics',
            type: 'array',
            description: 'Array of 32 Bytes DATA topics',
            required: false,
            example: ['0x...'],
          },
        ],
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of log objects',
    },
  },
];

/**
 * Get RPC method by name
 */
export function getTronRpcMethod(methodName: string): RpcMethod | null {
  return tronRpcMethods.find((method) => method.name === methodName) || null;
}

