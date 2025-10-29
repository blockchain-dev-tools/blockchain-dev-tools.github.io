'use client';

import { useState } from 'react';
import * as bip39 from 'bip39';
import { keccak256 } from 'viem';
import { Wallet } from 'ethers';


export default function WalletGenerator() {
  const [content, setContent] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const handleGenerate = () => {
    const charList = content.split("").filter(c => c.trim() !== "");
    // console.log("Generate wallet with content:", charList);
    const selectedWords: { value: string; index: string}[] = [];
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
    // console.log("mnemonic", mnemonic);
    setOutput(mnemonic);
    const wallet = Wallet.fromPhrase(mnemonic);
    setOutput(`${mnemonic}\n\nAddress: ${wallet.address}`);
    
    // console.log("wordlists", bip39.wordlists.chinese_simplified);
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{ fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, "Courier New", monospace' }}>
      <main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-center text-3xl font-bold">Wallet Generator</h1>
        <textarea value={content} onChange={e => setContent(e.target.value)} className="w-[80%] p-4 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded transition-colors">

        </textarea>
        <input type="password" value={salt} onChange={e => setSalt(e.target.value)} placeholder="Salt (optional)" className="w-[80%] p-4 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded transition-colors" />
        <button onClick={handleGenerate}> Generate</button>
        <p>{output}</p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}