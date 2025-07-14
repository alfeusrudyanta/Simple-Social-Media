'use client';

import type React from 'react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({ currentPage, lastPage, setPage }: PaginationProps) => {
  const startPage = 1;
  const endPage = lastPage ?? 1;
  const totalPages: number[] = [];
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);

  for (let i = startPage; i <= endPage; i++) {
    totalPages.push(i);
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && inputValue >= startPage && inputValue <= endPage) {
      setPage(inputValue);
      setIsOpen(false);
      setInputValue(undefined);
    }
  };

  const renderPageNumbers = () => {
    let pagesToRender: number[] = [];
    if (totalPages.length <= 3) {
      pagesToRender = totalPages;
    } else if (currentPage <= 2) {
      pagesToRender = [1, 2, 3];
    } else if (currentPage >= endPage - 1) {
      pagesToRender = [endPage - 2, endPage - 1, endPage];
    } else {
      pagesToRender = [currentPage - 1, currentPage, currentPage + 1];
    }

    return pagesToRender.map((item) => (
      <div
        key={item}
        className='h-12 w-12 p-2 gap-2 flex items-center text-center justify-center'
        onClick={() => setPage(item)}
      >
        <p
          className={cn(
            'h-full w-full flex items-center justify-center font-normal text-[10.5px] md:text-[14px] leading-[21px] md:leading-[28px] tracking-[-0.03em] rounded-full cursor-pointer',
            currentPage === item
              ? 'bg-[#0093DD] text-[#FDFDFD]'
              : 'text-[#181D27] hover:bg-[#0093DD99] hover:text-[#FDFDFD]'
          )}
        >
          {item}
        </p>
      </div>
    ));
  };

  return (
    <div className='flex flex-row'>
      {renderPageNumbers()}
      {isOpen && (
        <form onSubmit={handleInputSubmit} className='relative'>
          <input
            type='number'
            min={startPage}
            max={endPage}
            value={inputValue ?? ''}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className='absolute h-12 w-12 p-2 appearance-none -top-[48px] border border-[#181D27] bg-white font-normal text-[12px] md:text-[14px] leading-[24px] nd:leading-[28px] tracking-[-0.03em] text-[#181D27] rounded-[16px]'
          />
        </form>
      )}
      <p
        className='h-12 w-12 flex items-center justify-center cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        ...
      </p>
    </div>
  );
};

export default Pagination;
