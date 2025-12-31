'use client';

import EvmTransactionDecoder from '@/components/features/evm/EvmTransactionDecoder';


export default function Page() {
  return (
    <div className="flex flex-col items-center justify-items-center"
      style={{ fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, "Courier New", monospace' }}>
      <article className="w-full flex flex-col items-start">
        <EvmTransactionDecoder />
      </article>
      <footer className="flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}