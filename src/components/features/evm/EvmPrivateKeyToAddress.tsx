'use client';

import { useState } from 'react';
import { privateKeyToAccount } from 'viem/accounts';
import { isHex, type Hex } from 'viem';
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

const normalizeHex = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    return trimmed.toLowerCase();
  }
  return `0x${trimmed.toLowerCase()}`;
};

export default function EvmPrivateKeyToAddress() {
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    try {
      setError(null);
      setAddress(null);

      if (!privateKey.trim()) {
        setError('Please provide a private key.');
        return;
      }

      const normalized = normalizeHex(privateKey);
      
      // Validate hex format
      if (!isHex(normalized)) {
        setError('Invalid private key format. Please provide a valid hex string.');
        return;
      }

      // Remove 0x prefix for length check
      const hexWithoutPrefix = normalized.slice(2);
      
      // Private key should be 32 bytes (64 hex characters) or 66 characters with 0x prefix
      if (hexWithoutPrefix.length !== 64) {
        setError('Private key must be 32 bytes (64 hex characters).');
        return;
      }

      // Convert private key to account and extract address
      const account = privateKeyToAccount(normalized as Hex);
      setAddress(account.address);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to convert private key to address. Please check your input.');
    }
  };

  const handleClear = () => {
    setPrivateKey('');
    setAddress(null);
    setError(null);
  };

  return (
    <div className="w-full p-6">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">EVM Private Key to Address</h1>
        <p className="text-muted-foreground">
          Convert an Ethereum private key to its corresponding address.
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            Enter a private key (32 bytes, 64 hex characters) to derive the Ethereum address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="privateKey">Private Key (32 bytes)</Label>
            <Textarea
              id="privateKey"
              placeholder="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
              className="font-mono text-sm min-h-[100px]"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value.trim())}
            />
            <p className="text-xs text-muted-foreground">
              Private key must be 32 bytes (64 hex characters). Can include or omit 0x prefix.
            </p>
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            onClick={handleConvert} 
            disabled={!privateKey}
          >
            Convert to Address
          </Button>
          <Button 
            onClick={handleClear}
            variant="outline"
          >
            Clear
          </Button>
        </CardFooter>
      </Card>

      {address && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Derived Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 bg-muted/50">
              <p className="font-mono text-lg break-all">{address}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
              >
                Copy Address
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

