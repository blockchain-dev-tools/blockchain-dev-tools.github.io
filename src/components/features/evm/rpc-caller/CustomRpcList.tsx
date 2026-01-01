'use client';

import { type RpcEndpoint } from '@/config/evm/rpc-endpoints';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CustomRpcListProps {
  endpoints: RpcEndpoint[];
  latencyResults: Map<string, number>;
  onDelete: (url: string) => void;
}

export default function CustomRpcList({
  endpoints,
  latencyResults,
  onDelete,
}: CustomRpcListProps) {
  if (endpoints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Custom RPCs</Label>
      <div className="space-y-1">
        {endpoints.map((endpoint) => {
          const latency = latencyResults.get(endpoint.url);
          const latencyText = latency !== undefined
            ? latency === Infinity
              ? ' (Failed)'
              : ` (${latency}ms)`
            : '';
          return (
            <div
              key={endpoint.url}
              className="flex items-center justify-between rounded-md border p-2 text-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{endpoint.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {endpoint.url}{latencyText}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 ml-2 flex-shrink-0"
                onClick={() => onDelete(endpoint.url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

