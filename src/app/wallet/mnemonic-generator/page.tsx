'use client';

import { useState } from 'react';
import * as bip39 from 'bip39';
import { keccak256 } from 'viem';
import { Wallet } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, KeyRound, Sparkles, Shield } from 'lucide-react';

export default function WalletGenerator() {
  const [content, setContent] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // Small delay for animation effect
    setTimeout(() => {
      const charList = content.split("").filter(c => c.trim() !== "");
      const selectedWords: { value: string; index: string }[] = [];
      let entropy: string = "";

      for (let char of charList) {
        const index = bip39.wordlists.chinese_simplified.indexOf(char);
        if (index >= 0) {
          selectedWords.push({ value: char, index: index.toString(16) });
          if (entropy.length < 64) {
            entropy += index.toString(16);
          }
        }
      }

      console.log("selectedWords", selectedWords);
      entropy = entropy.slice(0, 64);
      console.log("entropy", entropy);
      entropy = keccak256(`0x${entropy}`);
      console.log("keccak256 entropy", entropy);
      entropy = entropy.replace(/^0x/, '');
      console.log("salt", salt);
      let saltHash = salt ? keccak256(new TextEncoder().encode(salt)).replace(/^0x/, '') : '';
      console.log("saltHash", saltHash);
      const finalEntropy = keccak256(`0x${entropy}${saltHash}`).replace(/^0x/, '');

      console.log("final entropy", finalEntropy);
      console.log("entropy length", finalEntropy.length);

      const mnemonic = bip39.entropyToMnemonic(finalEntropy);
      const wallet = Wallet.fromPhrase(mnemonic);
      setOutput(`${mnemonic}\n\nAddress: ${wallet.address}`);
      setIsGenerating(false);
    }, 300);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const outputLines = output.split('\n\n');
  const mnemonic = outputLines[0];
  const address = outputLines[1]?.replace('Address: ', '');

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full border border-purple-200/50 dark:border-purple-500/30">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Blockchain Dev Tools</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Wallet Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Generate secure Ethereum wallets from Chinese characters using BIP39 standard
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <KeyRound className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Input Parameters
              </CardTitle>
              <CardDescription className="text-base">
                Enter Chinese characters from the BIP39 wordlist to generate your wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="content" className="text-base font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Chinese Characters
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="输入中文字符..."
                  className="min-h-32 resize-none bg-white/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="salt" className="text-base font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Salt (Optional)
                </Label>
                <Input
                  id="salt"
                  type="password"
                  value={salt}
                  onChange={e => setSalt(e.target.value)}
                  placeholder="Enter optional salt for additional security..."
                  className="bg-white/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !content.trim()}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5 mr-2" />
                    Generate Wallet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Card */}
          {output && (
            <Card className="border-0 shadow-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Generated Wallet</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mnemonic Phrase
                  </Label>
                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="font-mono text-sm break-words text-gray-900 dark:text-gray-100">
                      {mnemonic}
                    </p>
                  </div>
                </div>

                {address && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Wallet Address
                    </Label>
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                        {address}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>⚠️ Security Warning:</strong> Never share your mnemonic phrase with anyone.
                    Store it securely offline. This phrase provides complete access to your wallet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}