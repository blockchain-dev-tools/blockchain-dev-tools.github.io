"use client";

import { useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import dynamic from "next/dynamic";
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

const isBase58 = (str: string): boolean => {
  try {
    bs58.decode(str);
    return true;
  } catch (e) {
    return false;
  }
};

const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

interface DisplayTransaction {
  signatures: string[];
  message: {
    header: {
      numRequiredSignatures: number;
      numReadonlySignedAccounts: number;
      numReadonlyUnsignedAccounts: number;
    };
    accountKeys: string[];
    recentBlockhash: string;
    instructions: {
      programIdIndex: number;
      accountKeyIndexes: number[];
      data: string;
    }[];
    addressLookupTableAccounts: {
      accountKey: string;
      writableIndexes: number[];
      readonlyIndexes: number[];
    }[];
  };
  version: number | string;
}

function versionedTransactionToJson(
  transaction: VersionedTransaction
): DisplayTransaction {
  const { signatures, message } = transaction;
  const version = transaction.version;
  const accountKeys = message.staticAccountKeys.map((key) => key.toBase58());
  const recentBlockhash = message.recentBlockhash.toString();
  const instructions = message.compiledInstructions.map((instruction) => ({
    programIdIndex: instruction.programIdIndex,
    accountKeyIndexes: instruction.accountKeyIndexes,
    data: bytesToHex(instruction.data),
  }));
  const addressLookupTableAccounts = message.addressTableLookups.map(
    (table) => ({
      accountKey: table.accountKey.toBase58(),
      writableIndexes: table.writableIndexes,
      readonlyIndexes: table.readonlyIndexes,
    })
  );

  return {
    signatures: signatures.map((signature) => bs58.encode(signature)),
    message: {
      header: {
        numRequiredSignatures: message.header.numRequiredSignatures,
        numReadonlySignedAccounts: message.header.numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts: message.header.numReadonlyUnsignedAccounts,
      },
      accountKeys,
      recentBlockhash,
      instructions,
      addressLookupTableAccounts,
    },
    version,
  };
}

export default function SolanaTransactionDecoder() {
  const { resolvedTheme } = useTheme();
  const [rawTransaction, setRawTransaction] = useState<string>("");
  const [decodedTransaction, setDecodedTransaction] =
    useState<DisplayTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = () => {
    try {
      setError(null);
      setDecodedTransaction(null);

      if (!rawTransaction.trim()) {
        return;
      }

      let transactionBuffer: Buffer;
      if (isBase58(rawTransaction)) {
        transactionBuffer = Buffer.from(bs58.decode(rawTransaction));
      } else {
        transactionBuffer = Buffer.from(rawTransaction, "base64");
      }
      if (transactionBuffer.length === 0) {
        throw new Error("Transaction buffer is empty");
      }

      const versionedTransaction =
        VersionedTransaction.deserialize(transactionBuffer);
      const json = versionedTransactionToJson(versionedTransaction);
      setDecodedTransaction(json);
    } catch (e: any) {
      setError(e.message);
      setDecodedTransaction(null);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">Solana Transaction Decoder</h1>
        <p className="text-muted-foreground">
          Decode raw Solana transactions (Base58 or Base64) to view their details.
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction Input</CardTitle>
          <CardDescription>
            Paste your Base58 or Base64 encoded transaction string below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="raw-tx">Signed Raw Transaction</Label>
            <Textarea
              id="raw-tx"
              placeholder="Paste your transaction here..."
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

      {decodedTransaction && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Decoded Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 bg-muted/50 overflow-auto max-h-[600px]">
              <ReactJson
                src={decodedTransaction}
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
