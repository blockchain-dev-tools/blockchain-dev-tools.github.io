'use client';

import { useState } from 'react';
import dynamic from "next/dynamic";
import { parseTransaction, serializeTransaction, recoverAddress, keccak256, type ParseTransactionReturnType, type TransactionSerializable } from 'viem';
import TextareaAutosize from 'react-textarea-autosize';

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

const isHex = (input: string): boolean => {
  const hexRegex = /^0x[a-fA-F0-9]+$/;
  return hexRegex.test(input);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function transactionToJson(transaction: ParseTransactionReturnType): Promise<any> {
  // Create a mutable copy to fix type issues
  const txCopy = { ...transaction } as any;

  // Fix sidecars for EIP4844 transactions - viem parseTransaction can return false, but serializeTransaction expects undefined
  if (txCopy.type === 'eip4844' && txCopy.sidecars === false) {
    txCopy.sidecars = undefined;
  }

  const serializedTransaction = serializeTransaction(txCopy as TransactionSerializable);
  const transactionHash = keccak256(serializedTransaction);

  let fromAddress = "";
  try {
    fromAddress = await recoverAddress({
      hash: transactionHash,
      signature: {
        r: transaction.r!,
        s: transaction.s!,
        v: transaction.v!,
        yParity: transaction.yParity,
      },
    });
  } catch (error) {
    console.warn('Could not recover from address:', error);
  }

  // Format accessList - only exists for EIP-2930 and EIP-1559 transactions
  let accessList: any[] = [];
  if ('accessList' in transaction && transaction.accessList) {
    accessList = transaction.accessList.map((item) => ({
      address: item.address,
      storageKeys: item.storageKeys,
    }));
  }

  return {
    hash: transactionHash,
    type: transaction.type,
    to: transaction.to,
    from: fromAddress,
    value: transaction.value?.toString(),
    data: transaction.data,
    gas: transaction.gas?.toString(),
    gasPrice: transaction.gasPrice?.toString(),
    maxFeePerGas: transaction.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
    nonce: transaction.nonce,
    chainId: transaction.chainId,
    accessList: accessList,
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
    yParity: transaction.yParity,
  };
}

export default function EvmTransactionDecoder() {
  const [rawTransaction, setRawTransaction] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedTransaction, setParsedTransaction] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = async () => {
    try {
      setError(null);

      let transactionHex: `0x${string}`;

      if (isHex(rawTransaction)) {
        transactionHex = rawTransaction as `0x${string}`;
      } else {
        // Assume it's hex without 0x prefix
        transactionHex = `0x${rawTransaction}` as `0x${string}`;
      }

      const transaction = parseTransaction(transactionHex);
      // Fix sidecars for EIP4844 transactions
      const fixedTransaction = { ...transaction };
      if (fixedTransaction.type === 'eip4844' && (fixedTransaction as any).sidecars === false) {
        (fixedTransaction as any).sidecars = undefined;
      }
      console.log('Transaction Data:', fixedTransaction);
      const jsonData = await transactionToJson(fixedTransaction as ParseTransactionReturnType);

      setParsedTransaction(jsonData);
    } catch (err) {
      console.error(err);
      setError('Failed to decode transaction. Please check if the input is a valid EVM transaction.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#b5e853]">EVM Transaction Decoder</h1>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-200">Signed Raw Transaction (hex)</span>
          <TextareaAutosize
            minRows={6}
            value={rawTransaction}
            onChange={(e) => setRawTransaction(e.target.value)}
            className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-700 h-32"
            placeholder="Paste your hex encoded signed transaction here (with or without 0x prefix)"
          />

        </label>

        <button
          onClick={handleDecode}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Decode Transaction
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      {parsedTransaction && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Decoded Transaction</h2>
          <div className="rounded-md overflow-auto max-h-96">
            <ReactJson
              src={parsedTransaction}
              theme="monokai"
              enableClipboard={true}
              collapseStringsAfterLength={200}
              style={{
                padding: '16px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}