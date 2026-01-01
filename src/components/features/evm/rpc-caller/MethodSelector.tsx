'use client';

import { useState } from 'react';
import { getRpcMethod, rpcMethods, type RpcMethod } from '@/config/evm/rpc-methods';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MethodSelectorProps {
  selectedMethod: RpcMethod | null;
  customMethodName: string;
  onMethodChange: (method: RpcMethod | null, customName: string, defaultParams: string) => void;
}

export default function MethodSelector({
  selectedMethod,
  customMethodName,
  onMethodChange,
}: MethodSelectorProps) {
  const [methodTab, setMethodTab] = useState<'select' | 'manual'>('select');

  const handleMethodSelect = (methodName: string) => {
    const method = getRpcMethod(methodName);
    if (method) {
      // 生成默认参数
      const defaultParams = method.params.map((param) => {
        if (param.default !== undefined) {
          return param.default;
        }
        if (param.example !== undefined) {
          return param.example;
        }
        return null;
      });
      onMethodChange(method, '', JSON.stringify(defaultParams, null, 2));
      setMethodTab('select');
    } else {
      onMethodChange(null, methodName, '[]');
    }
  };

  const handleCustomMethodChange = (value: string) => {
    if (value) {
      const method = getRpcMethod(value);
      if (method) {
        const defaultParams = method.params.map((param) => {
          if (param.default !== undefined) {
            return param.default;
          }
          if (param.example !== undefined) {
            return param.example;
          }
          return null;
        });
        onMethodChange(method, '', JSON.stringify(defaultParams, null, 2));
        setMethodTab('select');
      } else {
        onMethodChange(null, value, '[]');
      }
    } else {
      onMethodChange(null, '', '[]');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Method Selection</CardTitle>
        <CardDescription>Select or enter RPC method name</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={methodTab} onValueChange={(value) => setMethodTab(value as 'select' | 'manual')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Method</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="space-y-2">
            <Label htmlFor="method-select">Select Method</Label>
            <Select
              value={selectedMethod?.name || ''}
              onValueChange={(value) => {
                if (value) {
                  handleMethodSelect(value);
                }
              }}
            >
              <SelectTrigger id="method-select" className="w-full">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {(['account', 'block', 'transaction', 'contract', 'network', 'debug', 'other'] as const).map((category) => {
                  const methods = rpcMethods.filter(
                    (m) => m.category === category
                  );
                  if (methods.length === 0) return null;
                  return (
                    <SelectGroup key={category}>
                      <SelectLabel>{category.toUpperCase()}</SelectLabel>
                      {methods.map((method) => (
                        <SelectItem key={method.name} value={method.name}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-2">
            <Label htmlFor="custom-method">Enter Method Name</Label>
            <input
              id="custom-method"
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g., eth_getBalance"
              value={customMethodName}
              onChange={(e) => handleCustomMethodChange(e.target.value)}
            />
          </TabsContent>
        </Tabs>

        {/* Method Description */}
        {selectedMethod && (
          <div className="rounded-md border p-3 bg-muted/50">
            <p className="text-sm font-medium mb-2">{selectedMethod.name}</p>
            <p className="text-xs text-muted-foreground">{selectedMethod.description}</p>
            {selectedMethod.params.length > 0 && (
              <div className="mt-2 text-xs">
                <p className="font-medium mb-1">Parameters:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {selectedMethod.params.map((param) => (
                    <li key={param.name}>
                      <span className="font-mono">{param.name}</span>
                      {param.required && <span className="text-destructive">*</span>}
                      {' '}({param.type}): {param.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

