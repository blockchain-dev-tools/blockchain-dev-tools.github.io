'use client';

import { useState } from 'react';
import dynamic from "next/dynamic";
import { parseTransaction, serializeTransaction, recoverAddress, keccak256, type ParseTransactionReturnType, type TransactionSerializable } from 'viem';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

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

  const res = {
    hash: transactionHash,
    type: transaction.type?.toString(),
    to: transaction.to,
    from: fromAddress,
    value: transaction.value?.toString(),
    data: transaction.data,
    gas: transaction.gas?.toString(),
    gasPrice: transaction.gasPrice?.toString(),
    maxFeePerGas: transaction.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
    nonce: transaction.nonce?.toString(),
    chainId: transaction.chainId?.toString(),
    accessList: accessList,
    r: transaction.r,
    s: transaction.s,
    v: transaction.v,
    yParity: transaction.yParity,
  };
  const jsonString = JSON.stringify(res, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  return JSON.parse(jsonString);
}

export default function EvmTransactionDecoder() {
  const { resolvedTheme } = useTheme();
  const [rawTransaction, setRawTransaction] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedTransaction, setParsedTransaction] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = async () => {
    try {
      setError(null);
      setParsedTransaction(null);

      if (!rawTransaction.trim()) {
        return;
      }

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
      console.log(jsonData)
      setParsedTransaction(jsonData);
    } catch (err) {
      console.error(err);
      setError('Failed to decode transaction. Please check if the input is a valid signed EVM transaction.');
    }
  };

  return (
    <div className="w-full p-6 ">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">EVM Transaction Decoder</h1>
        <p className="text-muted-foreground">
          Decode raw signed EVM transactions to view their details.
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction Input</CardTitle>
          <CardDescription>
            Paste your hex encoded signed transaction string below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="raw-tx">Raw Transaction Hex</Label>
            <Textarea
              id="raw-tx"
              placeholder="0x02f873018305..."
              className="font-mono text-sm min-h-[120px]"
              value={rawTransaction}
              onChange={(e) => setRawTransaction(e.target.value.trim())}
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleDecode} disabled={!rawTransaction}>Decode Transaction</Button>
        </CardFooter>
      </Card>

      {parsedTransaction && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Decoded Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 bg-muted/50 overflow-auto max-h-[600px]">
              <ReactJson
                src={parsedTransaction}
                theme={resolvedTheme === 'dark' ? "monokai" : "rjv-default"}
                enableClipboard={true}
                displayDataTypes={false}
                collapseStringsAfterLength={60}
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}