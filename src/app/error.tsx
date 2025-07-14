'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error from error.tsx:', error);
  }, [error]);

  return (
    <div className='mt-60 flex flex-col items-center justify-center text-center gap-4'>
      <p className='font-bold text-[20px] text-[#181D27]'>
        Something went wrong!
      </p>
      <p className='text-[14px] text-[#181D27]'>{error.message}</p>
      <button
        onClick={() => reset()}
        className='min-w-[200px] mt-4 px-4 py-2 text-[#fdfdfd] rounded-full bg-[#0093DD] hover:bg-[#0093DD99] cursor-pointer'
      >
        Try Again
      </button>
    </div>
  );
}
