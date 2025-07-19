'use client';

import useApi from '@/lib/api-selector';
import { useEffect, useState } from 'react';
import type { PostListResponse, Post } from '@/interfaces/api';
import PostCard from '@/components/PostCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import { cn } from '@/utils/cn';
import Loading from '@/app/loading';

const HomePage = () => {
  const api = useApi();
  const [recommendedPosts, setRecommendedPosts] = useState<PostListResponse>();
  const [page, setPage] = useState<number>(1);
  const [mostLikedPosts, setMostLikedPosts] = useState<Post[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getRecommendedPosts({ page });
        setRecommendedPosts(res);
        const likeRes = await api.getMostLikedPosts();
        setMostLikedPosts(likeRes.data);
      } catch (error) {
        console.error('Failed to get recommeded / most liked posts', error);
      } finally {
        if (initialLoad) setInitialLoad(false);
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [api, page, initialLoad]);

  if (initialLoad) return <Loading />;

  return (
    <div className='flex flex-col md:my-12 md:mx-[120px] md:flex-row md:gap-12'>
      <div className='py-6 md:py-0 px-4 md:px-0 w-full flex flex-col gap-4 md:gap-6 border-b-[6px] md:border-none border-[#D5D7DA]'>
        <p className='font-bold text-[20px] md:text-[24px] leading-[34px] md:leading-[36px] tracking-[-0.03em] text-[#181D27]'>
          Recommend For You
        </p>
        {recommendedPosts?.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {/* Pagination */}
        <div className='flex flex-row items-center justify-center md:gap-4'>
          {/* Left Arrow */}
          <div
            className={cn(
              'flex flex-row items-center gap-[6px]',
              page > 1 ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
            onClick={
              page > 1
                ? () => setPage((prev) => prev - 1)
                : () => setPage((prev) => prev)
            }
          >
            <ChevronLeft className='h-6 w-6' />
            <p className='font-normal text-[12px] md:text-[14px] leading-[24px] nd:leading-[28px] tracking-[-0.03em] text-[#181D27]'>
              Previous
            </p>
          </div>
          <Pagination
            currentPage={page}
            lastPage={recommendedPosts ? recommendedPosts.lastPage : 1}
            setPage={setPage}
          />
          {/* Right Arrow */}
          <div
            className={cn(
              'flex flex-row items-center gap-[6px]',
              recommendedPosts && page < recommendedPosts?.lastPage
                ? 'cursor-pointer'
                : 'cursor-not-allowed'
            )}
            onClick={
              recommendedPosts && page < recommendedPosts?.lastPage
                ? () => setPage((next) => next + 1)
                : () => setPage((next) => next)
            }
          >
            <p className='font-normal text-[12px] md:text-[14px] leading-[24px] nd:leading-[28px] tracking-[-0.03em] text-[#181D27]'>
              Next
            </p>
            <ChevronRight className='h-6 w-6' />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className='hidden md:flex border border-[#D5D7DA]' />

      {/* Most Liked */}
      <div className='py-6 md:py-0 px-4 md:px-0 flex flex-col gap-4 md:gap-5 md:max-w-[297px]'>
        <p className='font-bold text-[20px] md:text-[24px] leading-[34px] md:leading-[36px] tracking-[-0.03em] text-[#181D27]'>
          Most liked
        </p>
        {mostLikedPosts.slice(0, 3).map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            showImage={false}
            Divider={index < 2}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
