'use client';

import SolanaTransactionDecoder from '@/components/SolanaTransactionDecoder';


export default function Page() {
  return (
    <div className="flex flex-col items-center justify-items-center"
      style={{ fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, "Courier New", monospace' }}>
      <article className="w-full flex flex-col items-start">
        <SolanaTransactionDecoder />
      </article>
    </div>
  );
}