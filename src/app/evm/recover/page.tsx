'use client';

import EvmSignatureRecover from '@/components/features/evm/EvmSignatureRecover';


export default function Page() {
  return (
    <div className="flex flex-col items-center justify-items-center"
      style={{ fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, "Courier New", monospace' }}>
      <article className="w-full flex flex-col items-start">
        <EvmSignatureRecover />
      </article>
      <footer className="flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}

