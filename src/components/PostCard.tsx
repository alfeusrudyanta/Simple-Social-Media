'use client';

import { Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type CardProps from '@/interfaces/post-card';
import useApi from '@/lib/api-selector';
import type { User } from '@/interfaces/api';
import LikeComment from '@/components/LikeComment';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import LikesCommentsListModal from './modals/LikesCommentsListModal';
import { toast } from './ui/sonner';

export default function PostCard({
  post,
  showImage = true,
  variant = 'default',
  Divider = true,
  PersonalView = false,
}: CardProps) {
  const api = useApi();
  const [authorData, setAuthorData] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLikesCommentsModalOpen, setIsLikesCommentsModalOpen] =
    useState(false);

  const handleDeletePost = async () => {
    try {
      await api.deletePost(post.id);
      setIsDeleteModalOpen(false);
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!post.author.email) {
        return;
      }

      try {
        const userData = await api.getUserByEmail(post.author.email);
        setAuthorData(userData);
      } catch (error) {
        console.error('Failed to fetch author data:', error);
        setAuthorData(null);
      }
    };

    fetchAuthorData();
  }, [post.author.email, api]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col md:flex-row md:gap-6 w-full'>
        {/* Image */}
        {showImage && variant === 'default' && (
          <div className='hidden md:flex relative w-full max-w-[340px] aspect-[340/258]'>
            <Link href={`/post/${post.id}`}>
              <Image
                src={post.imageUrl || '/unknown-user.png'}
                alt={post.title}
                loading='lazy'
                fill
                className='object-cover rounded-[6px]'
              />
            </Link>
          </div>
        )}
        <div className='flex flex-col gap-3 md:gap-4 flex-1'>
          <div className='flex flex-col gap-2 md:gap-3'>
            <Link href={`/post/${post.id}`}>
              {/* Title */}
              <h3 className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#181D27] line-clamp-2 hover:text-[#0093DD]'>
                {post.title}
              </h3>
            </Link>
            {/* Tags */}
            {post.tags?.length > 0 && variant === 'default' && (
              <div className='flex flex-row flex-wrap gap-2 line-clamp-1'>
                {post.tags.map((tag, index) => (
                  <Link key={index} href={`/search?q=${tag}`}>
                    <div className='border border-[#D5D7DA] rounded-[8px] py-[2px] px-2'>
                      <p className='font-normal text-[12px] leading-[24px] tracking-[-0.03em] text-[#181D27] hover:text-[#0093DD]'>
                        {tag}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* Description */}
            <Link href={`/post/${post.id}`}>
              <p
                className='font-normal text-[12px] md:text-[18px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#181D27] line-clamp-2'
                dangerouslySetInnerHTML={{ __html: post?.content || '' }}
              />
            </Link>
          </div>
          {/* Post By */}
          {variant === 'default' && (
            <div className='flex flex-row gap-3 items-center'>
              <div className='flex flex-row gap-2 items-center'>
                <Link href={`/profile/${post.author.id}`}>
                  <div className='relative'>
                    <Image
                      src={authorData?.avatarUrl || '/unknown-user.png'}
                      alt={authorData?.name || 'Author Image'}
                      height={40}
                      width={40}
                      loading='lazy'
                      className='h-[30px] w-[30px] md:h-[40px] md:w-[40px] object-cover rounded-full'
                    />
                  </div>
                </Link>
                <Link href={`/profile/${post.author.id}`}>
                  <p className='font-normal md:font-medium text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#181D27] cursor-pointer hover:text-[#0093DD]'>
                    {authorData?.name}
                  </p>
                </Link>
              </div>
              <Dot className='h-4 w-4 text-[#535862]' />
              <p className='font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#535862]'>
                {new Date(post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}

          {PersonalView ? (
            <div className='flex flex-row items-center gap-3'>
              <p
                className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0093DD] underline cursor-pointer'
                onClick={() =>
                  setIsLikesCommentsModalOpen(!isLikesCommentsModalOpen)
                }
              >
                Statistic
              </p>
              <div className='h-full border border-[#D5D7DA]' />
              <Link href={`/post/edit/${post.id}`}>
                <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0093DD] underline'>
                  Edit
                </p>
              </Link>
              <div className='h-full border border-[#D5D7DA]' />
              <p
                className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#EE1D52] underline cursor-pointer'
                onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
              >
                Delete
              </p>
            </div>
          ) : (
            /* Like & Comment */
            <LikeComment
              key={post.id}
              Comment={post.comments}
              Like={post.likes}
              PostId={post.id}
            />
          )}
        </div>
      </div>
      {Divider && variant === 'default' && (
        <div className='h-[1px] w-full bg-[#D5D7DA]' />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
          }}
          onConfirm={handleDeletePost}
        />
      )}

      {isLikesCommentsModalOpen && (
        <LikesCommentsListModal
          isOpen={isLikesCommentsModalOpen}
          onClose={() => setIsLikesCommentsModalOpen(false)}
          postId={post.id}
        />
      )}
    </div>
  );
}
