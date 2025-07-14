'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='mt-80 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-10 w-10 animate-spin text-[#0093DD]' />
        <p className='text-[14px] text-[#181D27]'>Loading, please wait...</p>
      </div>
    </div>
  );
}
