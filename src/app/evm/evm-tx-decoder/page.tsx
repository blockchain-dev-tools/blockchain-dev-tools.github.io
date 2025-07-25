'use client';

import SolanaTransactionDecoder from '@/components/EvmTransactionDecoder';


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{ fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, "Courier New", monospace' }}>
      <main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SolanaTransactionDecoder />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}