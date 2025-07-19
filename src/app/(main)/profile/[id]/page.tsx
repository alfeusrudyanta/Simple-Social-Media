'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useApi from '@/lib/api-selector';
import type { Post, User } from '@/interfaces/api';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

const OtherUserProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const api = useApi();
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const userId = Number.parseInt(id as string);

    const fetchUserData = async () => {
      try {
        const userData = await api.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser(null);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const postsData = await api.getUserPosts({ userId });
        setUserPosts(postsData.data);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
        setUserPosts([]);
      }
    };

    if (userId) {
      fetchUserData();
      const interval = setInterval(fetchUserPosts, 1000);
      return () => clearInterval(interval);
    }
  }, [api, id]);

  useEffect(() => {
    if (user && currentUser) {
      if (user.id === currentUser.id) {
        router.push('/profile');
      }
    }
  }, [currentUser, user, router]);

  return (
    <div className='flex flex-col py-6 md:py-0 px-4 md:px-0 md:mt-12 md:mb-[144px] mx-0 md:mx-[320px] gap-4 md:gap-6'>
      <div className='flex flex-row gap-2 items-center'>
        <Link href={`/profile/${id}`}>
          <Image
            src={user?.avatarUrl || '/unknown-user.png'}
            alt={user?.name || 'User Avatar'}
            height={80}
            width={80}
            loading='lazy'
            className='h-[40px] md:h-[80px] w-[40px] md:w-[80px] rounded-full object-cover'
          />
        </Link>
        <div className='flex flex-col'>
          <Link href={`/profile/${id}`}>
            <p className='-mb-[2px] font-bold text-[14px] md:text-[18px] leading-[28px] md:leading-[32px] tracking-[-0.03em] text-[#181D27]'>
              {user?.name}
            </p>
          </Link>

          <p className='font-normal text-[12px] md:text-[16px] leading-[24px] md:leading-[30px] tracking-[-0.03em] text-[#181D27]'>
            {user?.headline || 'No headline provided.'}
          </p>
        </div>
      </div>

      <div className='w-full border-b border-[#D5D7DA]' />

      {userPosts.length === 0 ? (
        <div className='mt-[152px] flex flex-col items-center justify-center pt-[152px ] text-center'>
          <FileText height={135} width={180} color='#0093DD' />
          <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12] mt-6'>
            No posts from this user yet
          </p>
          <p className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
            Stay tuned for future posts
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-4 md:gap-6'>
          <p className='font-bold text-[18px] md:text-[24px] leading-[32px] md:leading-[36px] tracking-[-0.03em] text-[#181D27]'>
            {userPosts.length} Post
          </p>

          {userPosts.map((post, index) => {
            return (
              <PostCard
                key={post.id}
                post={post}
                Divider={index < userPosts.length - 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OtherUserProfilePage;
