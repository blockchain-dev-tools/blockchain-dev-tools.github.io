'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trash2, X } from 'lucide-react';
import { type CallHistoryItem } from './types';

interface CallHistoryProps {
  callHistory: CallHistoryItem[];
  onItemClick: (method: string, params: unknown[]) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export default function CallHistory({
  callHistory,
  onItemClick,
  onDeleteItem,
  onClearAll,
}: CallHistoryProps) {
  const handleItemClick = (item: CallHistoryItem) => {
    onItemClick(item.method, item.params);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Call History</CardTitle>
            <CardDescription>Recent call records</CardDescription>
          </div>
          {callHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {callHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history yet</p>
        ) : (
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {callHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-md border px-3 py-2 text-xs group hover:bg-muted/50"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono font-medium">{item.method}</span>
                    <span className="text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {item.error ? (
                        <span className="text-destructive">✗ Failed</span>
                      ) : (
                        <span className="text-green-600">✓ Success</span>
                      )}
                      {item.duration && (
                        <span className="text-muted-foreground">
                          {item.duration}ms
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

