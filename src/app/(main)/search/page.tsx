'use client';

import { useSearchParams } from 'next/navigation';
import useApi from '@/lib/api-selector';
import { useEffect, useState } from 'react';
import type { Post } from '@/interfaces/api';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import PostCard from '@/components/PostCard';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const api = useApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const width = useWindowWidth();
  const isMobile = width && width < 768;

  useEffect(() => {
    if (!query?.trim()) {
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await api.searchPosts({ query });
        setPosts(res.data);
      } catch (error) {
        console.error('Search error', error);
        setPosts([]);
      }
    };

    const interval = setInterval(fetchPosts, 1000);
    return () => clearInterval(interval);
  }, [query, api]);

  return (
    <>
      {posts.length < 1 ? (
        <div className='flex px-4 md:px-[120px] justify-center items-center'>
          <div className='mt-[200px] flex flex-col gap-6 justify-center items-center text-center'>
            <FileText height={135} width={180} color='#0093DD' />
            <div className='flex flex-col gap-1'>
              <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                No results found
              </p>
              <p className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                Try using different keywords
              </p>
            </div>
            <Link href='/'>
              <Button className='w-[200px]'>Back to Home</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='flex flex-col py-6 md:py-12 px-4  md:px-[120px] gap-6'>
          {isMobile ? (
            ''
          ) : (
            <p className='font-bold text-[28px] leading-[38px] tracking-[-0.03em] text-[#181D27]'>{`Result for "${query}"`}</p>
          )}
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              Divider={index < posts.length - 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchPage;
