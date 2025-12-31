'use client';

import { useState } from 'react';
import { recoverAddress, isHex, type Hex } from 'viem';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

const parseSignature = (signature: string): { r: Hex; s: Hex; v: bigint } | null => {
  const normalized = normalizeHex(signature);
  
  // Remove 0x prefix for length check
  const hexWithoutPrefix = normalized.slice(2);
  
  // Check if it's a complete signature (130 hex chars = 65 bytes: 32 bytes r + 32 bytes s + 1 byte v)
  if (hexWithoutPrefix.length === 130) {
    const r = `0x${hexWithoutPrefix.slice(0, 64)}` as Hex;
    const s = `0x${hexWithoutPrefix.slice(64, 128)}` as Hex;
    const v = BigInt(parseInt(hexWithoutPrefix.slice(128, 130), 16));
    return { r, s, v };
  }
  
  // Check if it's a signature without 0x prefix (128 hex chars)
  if (hexWithoutPrefix.length === 128) {
    const r = `0x${hexWithoutPrefix.slice(0, 64)}` as Hex;
    const s = `0x${hexWithoutPrefix.slice(64, 128)}` as Hex;
    // Default v to 27 or 28, we'll try both
    return { r, s, v: BigInt(27) };
  }
  
  return null;
};

export default function EvmSignatureRecover() {
  const [hash, setHash] = useState('');
  const [signature, setSignature] = useState('');
  const [r, setR] = useState('');
  const [s, setS] = useState('');
  const [v, setV] = useState('');
  const [useSeparateFields, setUseSeparateFields] = useState(false);
  const [recoveredAddress, setRecoveredAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecover = async () => {
    try {
      setError(null);
      setRecoveredAddress(null);

      // Validate hash
      const normalizedHash = normalizeHex(hash);
      if (!isHex(normalizedHash)) {
        setError('Invalid hash format. Please provide a valid hex string.');
        return;
      }

      if (normalizedHash.length !== 66) { // 0x + 64 hex chars = 32 bytes
        setError('Hash must be 32 bytes (64 hex characters).');
        return;
      }

      if (useSeparateFields) {
        // Use separate r, s, v fields
        if (!r.trim() || !s.trim()) {
          setError('Please provide both r and s values.');
          return;
        }

        const normalizedR = normalizeHex(r);
        const normalizedS = normalizeHex(s);

        if (!isHex(normalizedR) || normalizedR.length !== 66) {
          setError('Invalid r format. Must be 32 bytes (64 hex characters).');
          return;
        }

        if (!isHex(normalizedS) || normalizedS.length !== 66) {
          setError('Invalid s format. Must be 32 bytes (64 hex characters).');
          return;
        }

        const baseSignature = {
          r: normalizedR as Hex,
          s: normalizedS as Hex,
        };

        // If v is provided, use it; otherwise try both 27 and 28
        if (v.trim()) {
          const vValue = parseInt(v.trim(), 10);
          if (vValue === 27 || vValue === 28) {
            const address = await recoverAddress({
              hash: normalizedHash as Hex,
              signature: { ...baseSignature, v: BigInt(vValue) },
            });
            setRecoveredAddress(address);
            return;
          } else {
            setError('v must be 27 or 28.');
            return;
          }
        } else {
          // Try with v=27 first, if fails try v=28
          try {
            const address = await recoverAddress({
              hash: normalizedHash as Hex,
              signature: { ...baseSignature, v: BigInt(27) },
            });
            setRecoveredAddress(address);
            return;
          } catch {
            try {
              const address = await recoverAddress({
                hash: normalizedHash as Hex,
                signature: { ...baseSignature, v: BigInt(28) },
              });
              setRecoveredAddress(address);
              return;
            } catch (err) {
              setError('Failed to recover address. Please check your inputs.');
              return;
            }
          }
        }
      } else {
        // Use combined signature string
        if (!signature.trim()) {
          setError('Please provide a signature.');
          return;
        }

        const parsed = parseSignature(signature);
        if (!parsed) {
          setError('Invalid signature format. Expected 65 bytes (130 hex characters) or 64 bytes (128 hex characters).');
          return;
        }

        const baseSignature = {
          r: parsed.r,
          s: parsed.s,
        };

        // If signature was 128 chars (no v), try both 27 and 28
        if (normalizeHex(signature).slice(2).length === 128) {
          try {
            const address = await recoverAddress({
              hash: normalizedHash as Hex,
              signature: { ...baseSignature, v: BigInt(27) },
            });
            setRecoveredAddress(address);
            return;
          } catch {
            try {
              const address = await recoverAddress({
                hash: normalizedHash as Hex,
                signature: { ...baseSignature, v: BigInt(28) },
              });
              setRecoveredAddress(address);
              return;
            } catch (err) {
              setError('Failed to recover address. Please check your inputs.');
              return;
            }
          }
        } else {
          // Use the parsed v value
          const address = await recoverAddress({
            hash: normalizedHash as Hex,
            signature: { ...baseSignature, v: parsed.v },
          });
          setRecoveredAddress(address);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to recover address. Please check your inputs.');
    }
  };

  return (
    <div className="w-full p-6">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">EVM Signature Recover</h1>
        <p className="text-muted-foreground">
          Recover the signer address from a message hash and signature.
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            Enter the message hash and signature to recover the signer address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="hash">Message Hash (32 bytes)</Label>
            <Input
              id="hash"
              placeholder="0x1234..."
              className="font-mono text-sm"
              value={hash}
              onChange={(e) => setHash(e.target.value.trim())}
            />
            <p className="text-xs text-muted-foreground">
              The keccak256 hash of the message (64 hex characters)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use-separate"
              checked={useSeparateFields}
              onChange={(e) => setUseSeparateFields(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="use-separate" className="cursor-pointer">
              Use separate r, s, v fields
            </Label>
          </div>

          {useSeparateFields ? (
            <div className="space-y-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="r">r (32 bytes)</Label>
                <Input
                  id="r"
                  placeholder="0x1234..."
                  className="font-mono text-sm"
                  value={r}
                  onChange={(e) => setR(e.target.value.trim())}
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="s">s (32 bytes)</Label>
                <Input
                  id="s"
                  placeholder="0x1234..."
                  className="font-mono text-sm"
                  value={s}
                  onChange={(e) => setS(e.target.value.trim())}
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="v">v (27 or 28, optional)</Label>
                <Input
                  id="v"
                  placeholder="27 or 28"
                  className="font-mono text-sm"
                  value={v}
                  onChange={(e) => setV(e.target.value.trim())}
                />
                <p className="text-xs text-muted-foreground">
                  If not provided, both 27 and 28 will be tried
                </p>
              </div>
            </div>
          ) : (
            <div className="grid w-full gap-2">
              <Label htmlFor="signature">Signature (65 bytes or 64 bytes)</Label>
              <Textarea
                id="signature"
                placeholder="0x1234... (130 or 128 hex characters)"
                className="font-mono text-sm min-h-[100px]"
                value={signature}
                onChange={(e) => setSignature(e.target.value.trim())}
              />
              <p className="text-xs text-muted-foreground">
                Complete signature: 65 bytes (130 hex chars) with r, s, v. Or 64 bytes (128 hex chars) with r, s only.
              </p>
            </div>
          )}

          {error && (
            <div className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleRecover} 
            disabled={!hash || (!useSeparateFields && !signature) || (useSeparateFields && (!r || !s))}
          >
            Recover Address
          </Button>
        </CardFooter>
      </Card>

      {recoveredAddress && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recovered Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 bg-muted/50">
              <p className="font-mono text-lg break-all">{recoveredAddress}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

