'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import SearchBar from '@/components/SearchBar';

const MobileSearch = () => {
  const width = useWindowWidth();
  const isMobile = width && width < 768;
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isMobile) setIsSearching(false);
  }, [isMobile]);

  return isSearching ? (
    <div className='absolute top-0 left-0 translate-x-0 translate-y-0 h-[64px] w-full bg-white flex flex-row items-center gap-2'>
      <ArrowLeft
        className='ml-4 h-6 w-6 cursor-pointer'
        onClick={() => setIsSearching(!isSearching)}
      />
      <SearchBar View='Mobile' />
    </div>
  ) : (
    <Search
      className='h-6 w-6 cursor-pointer'
      onClick={() => setIsSearching(!isSearching)}
    />
  );
};

export default MobileSearch;
