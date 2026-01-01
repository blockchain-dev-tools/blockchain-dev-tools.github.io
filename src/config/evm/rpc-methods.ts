/**
 * RPC Methods Configuration
 * Contains all supported RPC methods and their detailed parameter descriptions
 * Reference: https://ethereum.org/en/developers/docs/apis/json-rpc/
 */

export type ParamType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'object' 
  | 'array' 
  | 'hex' 
  | 'address' 
  | 'blockNumber' 
  | 'blockTag'
  | 'quantity';

export interface ParamField {
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
  default?: unknown;
  example?: unknown;
  fields?: ParamField[]; // Nested fields for object type parameters
}

export interface RpcMethod {
  name: string;
  description: string;
  category: 'account' | 'block' | 'transaction' | 'contract' | 'network' | 'debug' | 'other';
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

export const rpcMethods: RpcMethod[] = [
  // ========== Account Related ==========
  {
    name: 'eth_getBalance',
    description: 'Returns the account balance of the specified address in Wei',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'address',
        description: 'The account address to query the balance',
        required: true,
        example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag (latest, earliest, pending)',
        required: false,
        default: 'latest',
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Account balance (hex string, in Wei)',
    },
    example: {
      request: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'latest'],
      response: '0x1bc16d674ec80000',
    },
  },
  {
    name: 'eth_getTransactionCount',
    description: 'Returns the number of transactions sent from the specified address (nonce)',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'address',
        description: 'The account address to query',
        required: true,
        example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: false,
        default: 'latest',
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Transaction count (hex string)',
    },
  },
  {
    name: 'eth_getCode',
    description: 'Returns the contract code at the specified address',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'address',
        description: 'Contract address',
        required: true,
        example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: false,
        default: 'latest',
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Contract code (hex string)',
    },
  },
  {
    name: 'eth_getStorageAt',
    description: 'Returns the value at a storage position at the specified address',
    category: 'account',
    params: [
      {
        name: 'address',
        type: 'address',
        description: 'Contract address',
        required: true,
        example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      },
      {
        name: 'position',
        type: 'hex',
        description: 'Storage position index (hex)',
        required: true,
        example: '0x0',
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: false,
        default: 'latest',
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Storage value (hex string)',
    },
  },

  // ========== Block Related ==========
  {
    name: 'eth_blockNumber',
    description: 'Returns the block number of the latest block',
    category: 'block',
    params: [],
    returns: {
      type: 'string',
      description: 'Latest block number (hex string)',
    },
    example: {
      request: [],
      response: '0x1234567',
    },
  },
  {
    name: 'eth_getBlockByNumber',
    description: 'Returns block information by block number',
    category: 'block',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
      {
        name: 'fullTransactionObjects',
        type: 'boolean',
        description: 'Whether to return full transaction objects (true) or only transaction hashes (false)',
        required: false,
        default: false,
        example: false,
      },
    ],
    returns: {
      type: 'object',
      description: 'Block object containing all block information',
    },
  },
  {
    name: 'eth_getBlockByHash',
    description: 'Returns block information by block hash',
    category: 'block',
    params: [
      {
        name: 'blockHash',
        type: 'hex',
        description: 'Block hash (32 bytes, hex)',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
      {
        name: 'fullTransactionObjects',
        type: 'boolean',
        description: 'Whether to return full transaction objects',
        required: false,
        default: false,
        example: false,
      },
    ],
    returns: {
      type: 'object',
      description: 'Block object',
    },
  },
  {
    name: 'eth_getBlockTransactionCountByNumber',
    description: 'Returns the number of transactions in the specified block',
    category: 'block',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Transaction count (hex string)',
    },
  },
  {
    name: 'eth_getBlockTransactionCountByHash',
    description: 'Returns the number of transactions in the specified block',
    category: 'block',
    params: [
      {
        name: 'blockHash',
        type: 'hex',
        description: 'Block hash',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    ],
    returns: {
      type: 'string',
      description: 'Transaction count (hex string)',
    },
  },

  // ========== Transaction Related ==========
  {
    name: 'eth_getTransactionByHash',
    description: 'Returns transaction information by transaction hash',
    category: 'transaction',
    params: [
      {
        name: 'transactionHash',
        type: 'hex',
        description: 'Transaction hash (32 bytes, hex)',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction object, or null if transaction does not exist',
    },
  },
  {
    name: 'eth_getTransactionReceipt',
    description: 'Returns the receipt of a transaction',
    category: 'transaction',
    params: [
      {
        name: 'transactionHash',
        type: 'hex',
        description: 'Transaction hash',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction receipt object, or null if transaction does not exist',
    },
  },
  {
    name: 'eth_getTransactionByBlockHashAndIndex',
    description: 'Returns transaction information by block hash and transaction index',
    category: 'transaction',
    params: [
      {
        name: 'blockHash',
        type: 'hex',
        description: 'Block hash',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
      {
        name: 'transactionIndex',
        type: 'hex',
        description: 'Transaction index in the block (hex)',
        required: true,
        example: '0x0',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction object',
    },
  },
  {
    name: 'eth_getTransactionByBlockNumberAndIndex',
    description: 'Returns transaction information by block number and transaction index',
    category: 'transaction',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
      {
        name: 'transactionIndex',
        type: 'hex',
        description: 'Transaction index in the block (hex)',
        required: true,
        example: '0x0',
      },
    ],
    returns: {
      type: 'object',
      description: 'Transaction object',
    },
  },
  {
    name: 'eth_sendRawTransaction',
    description: 'Sends a signed raw transaction to the network',
    category: 'transaction',
    params: [
      {
        name: 'signedTransactionData',
        type: 'hex',
        description: 'Signed transaction data (RLP-encoded hex string)',
        required: true,
        example: '0xf86c808502540be400825208943535353535353535353535353535353535353535880de0b6b3a76400008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83',
      },
    ],
    returns: {
      type: 'string',
      description: 'Transaction hash (32 bytes, hex)',
    },
  },

  // ========== Contract Related ==========
  {
    name: 'eth_call',
    description: 'Executes a message call immediately without creating a transaction on the block chain',
    category: 'contract',
    params: [
      {
        name: 'callObject',
        type: 'object',
        description: 'Call object',
        required: true,
        fields: [
          {
            name: 'to',
            type: 'address',
            description: 'Target contract address',
            required: true,
            example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          },
          {
            name: 'data',
            type: 'hex',
            description: 'Data to send (function selector and encoded parameters)',
            required: false,
            example: '0x...',
          },
          {
            name: 'from',
            type: 'address',
            description: 'Sender address',
            required: false,
            example: '0x...',
          },
          {
            name: 'gas',
            type: 'hex',
            description: 'Gas limit (hex)',
            required: false,
            example: '0x5208',
          },
          {
            name: 'gasPrice',
            type: 'hex',
            description: 'Gas price (hex, in Wei)',
            required: false,
            example: '0x4a817c800',
          },
          {
            name: 'maxFeePerGas',
            type: 'hex',
            description: 'Maximum fee per gas (hex, in Wei) - EIP-1559',
            required: false,
            example: '0x4a817c800',
          },
          {
            name: 'maxPriorityFeePerGas',
            type: 'hex',
            description: 'Maximum priority fee per gas (hex, in Wei) - EIP-1559',
            required: false,
            example: '0x3b9aca00',
          },
          {
            name: 'value',
            type: 'hex',
            description: 'Amount of ETH to send (hex, in Wei)',
            required: false,
            example: '0x0',
          },
        ],
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: false,
        default: 'latest',
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Return data (hex string)',
    },
  },
  {
    name: 'eth_estimateGas',
    description: 'Estimates the gas required to execute a transaction',
    category: 'contract',
    params: [
      {
        name: 'callObject',
        type: 'object',
        description: 'Call object (same as eth_call). All fields are optional, but providing appropriate parameters helps estimate gas more accurately.',
        required: true,
        fields: [
          {
            name: 'from',
            type: 'address',
            description: 'Address the transaction is sent from',
            required: false,
            example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          },
          {
            name: 'to',
            type: 'address',
            description: 'Address the transaction is directed to',
            required: false,
            example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          },
          {
            name: 'gas',
            type: 'hex',
            description: 'Gas provided for the transaction execution',
            required: false,
            example: '0x5208',
          },
          {
            name: 'gasPrice',
            type: 'hex',
            description: 'Gas price willing to pay per gas unit (in Wei)',
            required: false,
            example: '0x4a817c800',
          },
          {
            name: 'maxFeePerGas',
            type: 'hex',
            description: 'Maximum fee per gas willing to pay (in Wei) - EIP-1559',
            required: false,
            example: '0x4a817c800',
          },
          {
            name: 'maxPriorityFeePerGas',
            type: 'hex',
            description: 'Maximum priority fee per gas willing to pay (in Wei) - EIP-1559',
            required: false,
            example: '0x3b9aca00',
          },
          {
            name: 'value',
            type: 'hex',
            description: 'Amount of Ether sent with the transaction (in Wei)',
            required: false,
            example: '0x0',
          },
          {
            name: 'data',
            type: 'hex',
            description: 'Hash of the method signature and encoded parameters',
            required: false,
            example: '0x...',
          },
        ],
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: false,
        default: 'latest',
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'Estimated gas amount (hex string)',
    },
  },

  // ========== Network Related ==========
  {
    name: 'net_version',
    description: 'Returns the current network ID',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Network ID (string format number)',
    },
    example: {
      request: [],
      response: '1',
    },
  },
  {
    name: 'net_listening',
    description: 'Returns whether the client is actively listening for network connections',
    category: 'network',
    params: [],
    returns: {
      type: 'boolean',
      description: 'Returns true if listening, false otherwise',
    },
  },
  {
    name: 'eth_chainId',
    description: 'Returns the chain ID of the current chain',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Chain ID (hex string)',
    },
  },
  {
    name: 'eth_protocolVersion',
    description: 'Returns the current Ethereum protocol version',
    category: 'network',
    params: [],
    returns: {
      type: 'string',
      description: 'Protocol version (string)',
    },
  },

  // ========== Debug Related ==========
  {
    name: 'debug_traceCall',
    description: 'Traces a call to eth_call producing a detailed execution trace',
    category: 'debug',
    params: [
      {
        name: 'callObject',
        type: 'object',
        description: 'Call object (same as eth_call)',
        required: true,
        fields: [
          {
            name: 'from',
            type: 'address',
            description: 'Sender address',
            required: false,
            example: '0x...',
          },
          {
            name: 'to',
            type: 'address',
            description: 'Target address',
            required: false,
            example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          },
          {
            name: 'gas',
            type: 'hex',
            description: 'Gas limit',
            required: false,
            example: '0x5208',
          },
          {
            name: 'gasPrice',
            type: 'hex',
            description: 'Gas price',
            required: false,
            example: '0x4a817c800',
          },
          {
            name: 'value',
            type: 'hex',
            description: 'Value to send',
            required: false,
            example: '0x0',
          },
          {
            name: 'data',
            type: 'hex',
            description: 'Call data',
            required: false,
            example: '0x...',
          },
        ],
      },
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: false,
        default: 'latest',
        example: 'latest',
      },
      {
        name: 'traceOptions',
        type: 'object',
        description: 'Trace options',
        required: false,
        fields: [
          {
            name: 'tracer',
            type: 'string',
            description: 'Tracer type (e.g., "callTracer", "prestateTracer")',
            required: false,
            example: 'callTracer',
          },
          {
            name: 'timeout',
            type: 'string',
            description: 'Timeout for the trace',
            required: false,
            example: '10s',
          },
          {
            name: 'reexec',
            type: 'number',
            description: 'Number of blocks to re-execute',
            required: false,
            example: 64,
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Execution trace',
    },
  },
  {
    name: 'debug_traceTransaction',
    description: 'Traces a transaction producing a detailed execution trace',
    category: 'debug',
    params: [
      {
        name: 'transactionHash',
        type: 'hex',
        description: 'Transaction hash',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
      {
        name: 'traceOptions',
        type: 'object',
        description: 'Trace options',
        required: false,
        fields: [
          {
            name: 'tracer',
            type: 'string',
            description: 'Tracer type',
            required: false,
            example: 'callTracer',
          },
          {
            name: 'timeout',
            type: 'string',
            description: 'Timeout for the trace',
            required: false,
            example: '10s',
          },
          {
            name: 'reexec',
            type: 'number',
            description: 'Number of blocks to re-execute',
            required: false,
            example: 64,
          },
        ],
      },
    ],
    returns: {
      type: 'object',
      description: 'Execution trace',
    },
  },
  {
    name: 'debug_traceBlockByNumber',
    description: 'Traces all transactions in a block by block number',
    category: 'debug',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
      {
        name: 'traceOptions',
        type: 'object',
        description: 'Trace options',
        required: false,
        fields: [
          {
            name: 'tracer',
            type: 'string',
            description: 'Tracer type',
            required: false,
            example: 'callTracer',
          },
        ],
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of execution traces',
    },
  },
  {
    name: 'debug_traceBlockByHash',
    description: 'Traces all transactions in a block by block hash',
    category: 'debug',
    params: [
      {
        name: 'blockHash',
        type: 'hex',
        description: 'Block hash',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
      {
        name: 'traceOptions',
        type: 'object',
        description: 'Trace options',
        required: false,
        fields: [
          {
            name: 'tracer',
            type: 'string',
            description: 'Tracer type',
            required: false,
            example: 'callTracer',
          },
        ],
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of execution traces',
    },
  },
  {
    name: 'debug_getRawHeader',
    description: 'Returns the RLP-encoded block header',
    category: 'debug',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'RLP-encoded block header (hex string)',
    },
  },
  {
    name: 'debug_getRawBlock',
    description: 'Returns the RLP-encoded block',
    category: 'debug',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
    ],
    returns: {
      type: 'string',
      description: 'RLP-encoded block (hex string)',
    },
  },
  {
    name: 'debug_getRawTransaction',
    description: 'Returns the EIP-2718 binary-encoded transaction',
    category: 'debug',
    params: [
      {
        name: 'transactionHash',
        type: 'hex',
        description: 'Transaction hash',
        required: true,
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    ],
    returns: {
      type: 'string',
      description: 'EIP-2718 binary-encoded transaction (hex string)',
    },
  },
  {
    name: 'debug_getRawReceipts',
    description: 'Returns the EIP-2718 binary-encoded receipts',
    category: 'debug',
    params: [
      {
        name: 'blockNumber',
        type: 'blockTag',
        description: 'Block number or block tag',
        required: true,
        example: 'latest',
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of EIP-2718 binary-encoded receipts (hex strings)',
    },
  },

  // ========== Other ==========
  {
    name: 'eth_gasPrice',
    description: 'Returns the current gas price in Wei',
    category: 'other',
    params: [],
    returns: {
      type: 'string',
      description: 'Gas price (hex string, in Wei)',
    },
  },
  {
    name: 'eth_getLogs',
    description: 'Returns logs matching the filter criteria',
    category: 'other',
    params: [
      {
        name: 'filterObject',
        type: 'object',
        description: 'Filter object',
        required: true,
        fields: [
          {
            name: 'fromBlock',
            type: 'blockTag',
            description: 'Starting block number or block tag',
            required: false,
            example: 'latest',
          },
          {
            name: 'toBlock',
            type: 'blockTag',
            description: 'Ending block number or block tag',
            required: false,
            example: 'latest',
          },
          {
            name: 'address',
            type: 'address',
            description: 'Contract address (can be an array)',
            required: false,
            example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          },
          {
            name: 'topics',
            type: 'array',
            description: 'Topics array (for filtering events)',
            required: false,
            example: ['0x...'],
          },
        ],
      },
    ],
    returns: {
      type: 'array',
      description: 'Array of matching log objects',
    },
  },
  {
    name: 'eth_syncing',
    description: 'Returns synchronization status information',
    category: 'other',
    params: [],
    returns: {
      type: 'object|boolean',
      description: 'Returns sync object if syncing, false otherwise',
    },
  },
];

/**
 * Get RPC method configuration by method name
 */
export function getRpcMethod(methodName: string): RpcMethod | undefined {
  return rpcMethods.find((method) => method.name === methodName);
}

/**
 * Get methods by category
 */
export function getMethodsByCategory(category: RpcMethod['category']): RpcMethod[] {
  return rpcMethods.filter((method) => method.category === category);
}

/**
 * Search methods by method name or description
 */
export function searchMethods(query: string): RpcMethod[] {
  const lowerQuery = query.toLowerCase();
  return rpcMethods.filter(
    (method) =>
      method.name.toLowerCase().includes(lowerQuery) ||
      method.description.toLowerCase().includes(lowerQuery)
  );
}
