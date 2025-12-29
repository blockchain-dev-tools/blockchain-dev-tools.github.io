'use client';

import { useState } from 'react';
import dynamic from "next/dynamic";
import { decodeAbiParameters, parseAbiParameters, decodeFunctionData, parseAbi } from 'viem';
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
import { formatJsonResult } from "@/lib/common"
import { useTheme } from "next-themes";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

const isHex = (input: string): boolean => {
  const hexRegex = /^0x[a-fA-F0-9]+$/;
  return hexRegex.test(input);
};

export default function EvmAbiDecoder() {
  const { resolvedTheme } = useTheme();
  const [abiInput, setAbiInput] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [decodedData, setDecodedData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decodeMode, setDecodeMode] = useState<'function' | 'parameters'>('function');

  const handleDecode = async () => {
    try {
      setError(null);
      setDecodedData(null);

      if (!encodedData.trim()) {
        setError('Please provide encoded data');
        return;
      }

      let dataHex: `0x${string}`;
      if (isHex(encodedData.trim())) {
        dataHex = encodedData.trim() as `0x${string}`;
      } else {
        dataHex = `0x${encodedData.trim()}` as `0x${string}`;
      }

      if (decodeMode === 'function') {
        // Decode function data - requires full ABI
        if (!abiInput.trim()) {
          setError('Please provide ABI for function decoding');
          return;
        }

        let abi: any;
        try {
          abi = JSON.parse(abiInput);
        } catch {
          // Try parsing as human-readable ABI
          abi = parseAbi([abiInput.trim()]);
        }

        const result = decodeFunctionData({
          abi: Array.isArray(abi) ? abi : [abi],
          data: dataHex,
        });

        // Convert bigints to strings for JSON display
        const jsonResult = formatJsonResult(result);

        setDecodedData(jsonResult);
      } else {
        // Decode parameters only
        if (!abiInput.trim()) {
          setError('Please provide parameter types (e.g., "uint256, address, string")');
          return;
        }

        const params = parseAbiParameters(abiInput.trim());
        const result = decodeAbiParameters(params, dataHex);

        // Convert bigints to strings for JSON display
        const jsonResult = formatJsonResult(result);

        setDecodedData(jsonResult);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to decode: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">EVM ABI Decoder</h1>
        <p className="text-muted-foreground">
          Decode ABI-encoded data from smart contract function calls or parameters.
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Decode Mode</CardTitle>
          <CardDescription>
            Choose how you want to decode the data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={decodeMode === 'function' ? 'default' : 'outline'}
              onClick={() => setDecodeMode('function')}
            >
              Function Data
            </Button>
            <Button
              variant={decodeMode === 'parameters' ? 'default' : 'outline'}
              onClick={() => setDecodeMode('parameters')}
            >
              Parameters Only
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {decodeMode === 'function' ? 'Function ABI' : 'Parameter Types'}
          </CardTitle>
          <CardDescription>
            {decodeMode === 'function' 
              ? 'Provide the function ABI as JSON or human-readable format.'
              : 'Provide parameter types (e.g., "uint256, address, string")'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="abi-input">
              {decodeMode === 'function' ? 'ABI' : 'Parameter Types'}
            </Label>
            <Textarea
              id="abi-input"
              placeholder={
                decodeMode === 'function'
                  ? `JSON: {"inputs":[{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"}
or
Human-readable: function transfer(address to, uint256 amount)`
                  : 'uint256, address, string'
              }
              className="font-mono text-sm min-h-[120px]"
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="encoded-data">Encoded Data</Label>
            <Textarea
              id="encoded-data"
              placeholder="0xa9059cbb000000000000000000000000..."
              className="font-mono text-sm min-h-[120px]"
              value={encodedData}
              onChange={(e) => setEncodedData(e.target.value.trim())}
            />
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleDecode} disabled={!encodedData}>
            Decode Data
          </Button>
        </CardFooter>
      </Card>

      {decodedData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Decoded Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 bg-muted/50 overflow-auto max-h-[600px]">
              <ReactJson
                src={decodedData}
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Function Data Example:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">ABI (human-readable):</p>
                <code className="block p-2 bg-muted rounded text-xs">
                  function transfer(address to, uint256 amount)
                </code>
              </div>
              <div>
                <p className="text-muted-foreground">Encoded Data:</p>
                <code className="block p-2 bg-muted rounded text-xs break-all">
                  0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e0000000000000000000000000000000000000000000000000de0b6b3a7640000
                </code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Parameters Only Example:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Parameter Types:</p>
                <code className="block p-2 bg-muted rounded text-xs">
                  address, uint256
                </code>
              </div>
              <div>
                <p className="text-muted-foreground">Encoded Data:</p>
                <code className="block p-2 bg-muted rounded text-xs break-all">
                  0x000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e0000000000000000000000000000000000000000000000000de0b6b3a7640000
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

