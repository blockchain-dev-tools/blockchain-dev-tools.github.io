'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ParameterInputProps {
  methodParams: string;
  isSendingRequest: boolean;
  canSend: boolean;
  onParamsChange: (params: string) => void;
  onSend: () => void;
  onClear: () => void;
}

export default function ParameterInput({
  methodParams,
  isSendingRequest,
  canSend,
  onParamsChange,
  onSend,
  onClear,
}: ParameterInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameters</CardTitle>
        <CardDescription>Enter method parameters (JSON array format)</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          className="font-mono text-sm min-h-[200px]"
          placeholder='["0x...", "latest"]'
          value={methodParams}
          onChange={(e) => onParamsChange(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={onSend}
          disabled={!canSend || isSendingRequest}
        >
          {isSendingRequest ? 'Sending...' : 'Send Request'}
        </Button>
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}

