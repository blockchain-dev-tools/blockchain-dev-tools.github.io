'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddCustomRpcFormProps {
  onSubmit: (url: string, name: string) => void;
  onCancel: () => void;
}

export default function AddCustomRpcForm({ onSubmit, onCancel }: AddCustomRpcFormProps) {
  const [customRpcUrl, setCustomRpcUrl] = useState('');
  const [customRpcName, setCustomRpcName] = useState('');

  const handleSubmit = () => {
    onSubmit(customRpcUrl, customRpcName);
    setCustomRpcUrl('');
    setCustomRpcName('');
  };

  const handleCancel = () => {
    setCustomRpcUrl('');
    setCustomRpcName('');
    onCancel();
  };

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Add Custom RPC</Label>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Input
          placeholder="RPC URL (e.g., https://...)"
          value={customRpcUrl}
          onChange={(e) => setCustomRpcUrl(e.target.value)}
        />
        <Input
          placeholder="RPC Name (optional)"
          value={customRpcName}
          onChange={(e) => setCustomRpcName(e.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSubmit}
          disabled={!customRpcUrl.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

