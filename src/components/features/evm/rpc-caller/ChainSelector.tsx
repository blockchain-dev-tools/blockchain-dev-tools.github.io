'use client';

import { chainConfigs, type ChainConfig } from '@/config/evm/rpc-endpoints';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChainSelectorProps {
  selectedChain: ChainConfig | null;
  onChainChange: (chain: ChainConfig) => void;
}

export default function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="chain-select">Select Chain</Label>
      <Select
        value={selectedChain?.chainId.toString() || ''}
        onValueChange={(value) => {
          const chain = chainConfigs.find((c) => c.chainId === Number(value));
          if (chain) {
            onChainChange(chain);
          }
        }}
      >
        <SelectTrigger id="chain-select" className="w-full">
          <SelectValue placeholder="Select a chain" />
        </SelectTrigger>
        <SelectContent>
          {chainConfigs.map((chain) => (
            <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
              {chain.name} ({chain.shortName.toUpperCase()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

