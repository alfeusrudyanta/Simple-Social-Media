'use client';

import type React from 'react';

import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  View: 'Mobile' | 'Desktop';
}

const SearchBar = ({ View }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div
        className={cn(
          'items-center gap-2 rounded-[12px] border border-[#D5D7DA] h-[48px] flex',
          View === 'Mobile'
            ? 'my-4 ml-2 mr-4 py-4 px-4 w-full flex-row-reverse'
            : 'my-4 py-3 px-4 w-[373px] flex-row'
        )}
      >
        <Search className='h-6 w-6 cursor-pointer' onClick={handleSearch} />
        <Input
          type='text'
          placeholder='Search'
          name='query'
          value={query}
          className='px-0 border-none'
          onKeyDown={handleKeyDown}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </>
  );
};

export default SearchBar;
