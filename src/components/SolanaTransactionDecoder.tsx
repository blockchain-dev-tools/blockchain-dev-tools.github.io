"use client";

import { useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import dynamic from "next/dynamic";
import TextareaAutosize from "react-textarea-autosize";

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
  const [rawTransaction, setRawTransaction] = useState<string>("");
  const [decodedTransaction, setDecodedTransaction] =
    useState<DisplayTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 不再检测暗色模式，全部用Tailwind dark:前缀控制

  const handleDecode = () => {
    try {
      setError(null);

      let transactionBuffer: Buffer;
      if (isBase58(rawTransaction)) {
        transactionBuffer = Buffer.from(bs58.decode(rawTransaction));
      } else {
        transactionBuffer = Buffer.from(rawTransaction, "base64");
      }
      if (transactionBuffer.length === 0) {
        setError("Transaction buffer is empty");
      }

      const versionedTransaction =
        VersionedTransaction.deserialize(transactionBuffer);
      const json = versionedTransactionToJson(versionedTransaction);
      setDecodedTransaction(json);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setDecodedTransaction(null);
    }
  };

  return (
    <div className="w-full mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-[#7cae2f] dark:text-[#b5e853] dark:[text-shadow:0_0_2px_#b5e853,0_0_10px_#b5e853]">
        Solana Transaction Decoder
      </h1>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Signed Raw Transaction (Base58 or Base64)
          <TextareaAutosize
            className="w-full mt-4 p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded transition-colors"
            placeholder="Enter Base58 or Base64 encoded transaction"
            value={rawTransaction}
            onChange={(e) => setRawTransaction(e.target.value)}
            minRows={6}
          />
        </label>
        <button
          className="mt-4 bg-blue-700 dark:bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 dark:hover:bg-blue-950"
          onClick={handleDecode}
        >
          Decode Transaction
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {decodedTransaction && (
        <div className="mt-6 max-w-full">
          <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Decoded Transaction</h2>
          {/* 亮色模式下显示 rjv-default 主题 */}
          <div className="block dark:hidden max-w-full">
            <ReactJson
              src={decodedTransaction}
              theme="rjv-default"
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                color: "#222",
              }}
            />
          </div>
          {/* 暗色模式下显示 monokai 主题 */}
          <div className="hidden dark:block max-w-full">
            <ReactJson
              src={decodedTransaction}
              theme="monokai"
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#eee",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
