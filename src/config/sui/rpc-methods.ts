/**
 * Sui RPC 方法配置
 * 参考: https://docs.sui.io/references/json-rpc
 */

import { type RpcMethod } from '@/components/features/common/rpc-caller/types';

export const suiRpcMethods: RpcMethod[] = [
  {
    name: 'sui_getBalance',
    description: 'Return the total coin balance for an address',
    category: 'account',
    params: [
      {
        name: 'owner',
        type: 'string',
        description: 'The owner address',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        name: 'coinType',
        type: 'string',
        description: 'Optional coin type, e.g., "0x2::sui::SUI". If not specified, default to SUI',
        required: false,
        example: '0x2::sui::SUI',
      },
    ],
    returns: {
      type: 'object',
      description: 'Balance information',
    },
  },
  {
    name: 'sui_getAllBalances',
    description: 'Return all coin balances for an address',
    category: 'account',
    params: [
      {
        name: 'owner',
        type: 'string',
        description: 'The owner address',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of balance objects',
    },
  },
  {
    name: 'sui_getOwnedObjects',
    description: 'Return the list of objects owned by an address',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'string',
        description: 'The owner address',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        name: 'options',
        type: 'object',
        description: 'Query options',
        required: false,
        example: {
          filter: {},
          options: {
            showType: true,
            showOwner: true,
            showPreviousTransaction: true,
            showDisplay: false,
            showContent: false,
            showBcs: false,
            showStorageRebate: false,
          },
        },
        fields: [
          {
            name: 'filter',
            type: 'object',
            description: 'Filter options',
            required: false,
            example: {},
          },
          {
            name: 'options',
            type: 'object',
            description: 'Object display options',
            required: false,
            example: {
              showType: true,
              showOwner: true,
            },
          },
        ],
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of owned objects',
    },
  },
  {
    name: 'sui_getObject',
    description: 'Return the object information for a specified object',
    category: 'object',
    params: [
      {
        name: 'objectId',
        type: 'string',
        description: 'The ID of the object',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        name: 'options',
        type: 'object',
        description: 'Object display options',
        required: false,
        example: {
          showType: true,
          showOwner: true,
          showPreviousTransaction: true,
          showDisplay: false,
          showContent: false,
          showBcs: false,
          showStorageRebate: false,
        },
        fields: [
          {
            name: 'showType',
            type: 'boolean',
            description: 'Whether to show the object type',
            required: false,
            example: true,
          },
          {
            name: 'showOwner',
            type: 'boolean',
            description: 'Whether to show the object owner',
            required: false,
            example: true,
          },
          {
            name: 'showPreviousTransaction',
            type: 'boolean',
            description: 'Whether to show the previous transaction',
            required: false,
            example: true,
          },
          {
            name: 'showDisplay',
            type: 'boolean',
            description: 'Whether to show the display metadata',
            required: false,
            example: false,
          },
          {
            name: 'showContent',
            type: 'boolean',
            description: 'Whether to show the object content',
            required: false,
            example: false,
          },
          {
            name: 'showBcs',
            type: 'boolean',
            description: 'Whether to show the BCS serialized data',
            required: false,
            example: false,
          },
          {
            name: 'showStorageRebate',
            type: 'boolean',
            description: 'Whether to show the storage rebate',
            required: false,
            example: false,
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Object information',
    },
  },
  {
    name: 'sui_getTransactionBlock',
    description: 'Return the transaction response object',
    category: 'transaction',
    params: [
      {
        name: 'digest',
        type: 'string',
        description: 'The transaction digest',
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        name: 'options',
        type: 'object',
        description: 'Transaction display options',
        required: false,
        example: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: false,
          showBalanceChanges: false,
        },
        fields: [
          {
            name: 'showInput',
            type: 'boolean',
            description: 'Whether to show the transaction input',
            required: false,
            example: true,
          },
          {
            name: 'showEffects',
            type: 'boolean',
            description: 'Whether to show the transaction effects',
            required: false,
            example: true,
          },
          {
            name: 'showEvents',
            type: 'boolean',
            description: 'Whether to show the transaction events',
            required: false,
            example: true,
          },
          {
            name: 'showObjectChanges',
            type: 'boolean',
            description: 'Whether to show the object changes',
            required: false,
            example: false,
          },
          {
            name: 'showBalanceChanges',
            type: 'boolean',
            description: 'Whether to show the balance changes',
            required: false,
            example: false,
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction block information',
    },
  },
  {
    name: 'sui_executeTransactionBlock',
    description: 'Execute the transaction and wait for results if desired',
    category: 'transaction',
    params: [
      {
        name: 'txBytes',
        type: 'string',
        description: 'BCS serialized transaction data bytes (base64 encoded)',
        required: true,
        example: 'AAACAAgQJwAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAEAAgECAwQ=',
      },
      {
        name: 'signature',
        type: 'array',
        description: 'Array of signatures',
        required: true,
        example: ['0x...'],
      },
      {
        name: 'options',
        type: 'object',
        description: 'Transaction display options',
        required: false,
        example: {
          showInput: true,
          showEffects: true,
          showEvents: true,
        },
        fields: [
          {
            name: 'showInput',
            type: 'boolean',
            description: 'Whether to show the transaction input',
            required: false,
            example: true,
          },
          {
            name: 'showEffects',
            type: 'boolean',
            description: 'Whether to show the transaction effects',
            required: false,
            example: true,
          },
          {
            name: 'showEvents',
            type: 'boolean',
            description: 'Whether to show the transaction events',
            required: false,
            example: true,
          },
        ],
      },
      {
        name: 'requestType',
        type: 'string',
        description: 'Request type: "WaitForEffectsCert" or "WaitForLocalExecution"',
        required: false,
        example: 'WaitForEffectsCert',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction execution result',
    },
  },
  {
    name: 'sui_getLatestCheckpointSequenceNumber',
    description: 'Return the sequence number of the latest checkpoint that has been executed',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Latest checkpoint sequence number',
    },
  },
  {
    name: 'sui_getTotalTransactionBlocks',
    description: 'Return the total number of transaction blocks',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Total number of transaction blocks',
    },
  },
  {
    name: 'sui_getChainIdentifier',
    description: 'Return the chain identifier',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Chain identifier',
    },
  },
  {
    name: 'sui_getReferenceGasPrice',
    description: 'Return the reference gas price for the network',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Reference gas price',
    },
  },
  {
    name: 'sui_getValidatorsApy',
    description: 'Return the validator APY information',
    category: 'network',
    params: [],
    returns: {
      type: 'object',
      description: 'Validator APY information',
    },
  },
];

/**
 * Get RPC method by name
 */
export function getSuiRpcMethod(methodName: string): RpcMethod | null {
  return suiRpcMethods.find((method) => method.name === methodName) || null;
}

