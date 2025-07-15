'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import * as Dialog from '@radix-ui/react-dialog';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  setPage: (page: number) => void;
}

const Pagination = ({ currentPage, lastPage, setPage }: PaginationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputValue);
    if (!isNaN(page) && page >= 1 && page <= lastPage) {
      handlePageChange(page);
      setIsOpen(false);
      setInputValue('');
    }
  };

  const renderPageNumbers = () => {
    let pagesToRender: number[] = [];

    if (lastPage <= 3) {
      pagesToRender = Array.from({ length: lastPage }, (_, i) => i + 1);
    } else if (currentPage <= 2) {
      pagesToRender = [1, 2, 3];
    } else if (currentPage >= lastPage - 1) {
      pagesToRender = [lastPage - 2, lastPage - 1, lastPage];
    } else {
      pagesToRender = [currentPage - 1, currentPage, currentPage + 1];
    }

    return pagesToRender.map((page) => (
      <button
        key={page}
        type='button'
        onClick={() => handlePageChange(page)}
        className={cn(
          'h-12 w-12 flex items-center justify-center',
          'font-normal text-[14px] leading-[28px] tracking-[-0.03em]',
          'rounded-full cursor-pointer transition-colors',
          currentPage === page
            ? 'bg-[#0093DD] text-[#FDFDFD]'
            : 'text-[#181D27] hover:bg-[#0093DD99] hover:text-[#FDFDFD]'
        )}
        aria-current={currentPage === page ? 'page' : undefined}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className='flex items-center gap-1'>
      {renderPageNumbers()}

      {lastPage > 3 && (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <button
              type='button'
              className='h-12 w-12 flex items-center justify-center cursor-pointer'
              aria-label='Jump to page'
            >
              ...
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black/50' />
            <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg'>
              <Dialog.Title className='text-lg font-medium mb-4'>
                Jump to Page
              </Dialog.Title>

              <form onSubmit={handleJumpToPage}>
                <input
                  type='number'
                  min={1}
                  max={lastPage}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className='w-full p-2 border border-[#181D27] rounded-[16px]'
                  aria-label='Page number'
                />

                <div className='mt-4 flex justify-center gap-2'>
                  <Dialog.Close asChild>
                    <button
                      type='button'
                      className='px-4 py-2 cursor-pointer rounded-full text-[#181D27] hover:bg-gray-100'
                    >
                      Cancel
                    </button>
                  </Dialog.Close>

                  <button
                    type='submit'
                    className='px-4 py-2 cursor-pointer rounded-full bg-[#0093DD] text-[#FDFDFD] hover:bg-[#007BB8]'
                  >
                    Go
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};

export default Pagination;
