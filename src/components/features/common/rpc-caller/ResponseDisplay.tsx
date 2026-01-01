'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateCurlCommand } from './utils';
import { type JsonRpcResponse } from './types';

interface ResponseDisplayProps {
  response: JsonRpcResponse | null;
  error: string | null;
  lastRequest: {
    endpoint: string;
    method: string;
    params: unknown[];
  } | null;
}

export default function ResponseDisplay({
  response,
  error,
  lastRequest,
}: ResponseDisplayProps) {
  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    }
  };

  const handleCopyCurl = () => {
    if (lastRequest) {
      const curlCommand = generateCurlCommand(
        lastRequest.endpoint,
        lastRequest.method,
        lastRequest.params
      );
      navigator.clipboard.writeText(curlCommand);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response</CardTitle>
        <CardDescription>RPC call response</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4 mb-4">
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="text-xs text-destructive mt-1">{error}</p>
          </div>
        )}
        {response && (
          <div className="space-y-2">
            <div className="rounded-md border p-4 bg-muted/50">
              <pre className="text-xs font-mono overflow-auto max-h-[400px]">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyResponse}
              >
                Copy Response
              </Button>
              {lastRequest && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCurl}
                >
                  Copy as cURL
                </Button>
              )}
            </div>
          </div>
        )}
        {error && lastRequest && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCurl}
            >
              Copy Request as cURL
            </Button>
          </div>
        )}
        {!response && !error && (
          <p className="text-sm text-muted-foreground">No response yet</p>
        )}
      </CardContent>
    </Card>
  );
}

