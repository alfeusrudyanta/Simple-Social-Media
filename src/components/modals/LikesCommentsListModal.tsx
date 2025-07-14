'use client';

import { useEffect, useState } from 'react';
import { X, ThumbsUp, MessagesSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Comment, UserLike } from '@/interfaces/api';
import useApi from '@/lib/api-selector';
import { cn } from '@/utils/cn';

interface LikesCommentsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

const LikesCommentsListModal = ({
  isOpen,
  onClose,
  postId,
}: LikesCommentsListModalProps) => {
  const api = useApi();
  const [likes, setLikes] = useState<UserLike[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'likes' | 'comments'>('likes');

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const likesRes = await api.getPostLikes(postId);
        const commentsRes = await api.getComments(postId);
        setLikes(likesRes);
        setComments(commentsRes);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    };

    fetchData();
  }, [isOpen, postId, api]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-[#0A0D1299] flex items-center justify-center px-6 z-50'>
      <div className='bg-white rounded-[16px] w-full max-w-[613px] max-h-[80vh] flex flex-col py-6 px-4 md:p-6 gap-3 md:gap-5'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <p className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#0A0D12]'>
            Statistic
          </p>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
          >
            <X className='h-6 w-6 text-[#0A0D12]' />
          </button>
        </div>

        {/* Tabs for Like/Comment */}
        <div className='flex border-b border-[#D5D7DA]'>
          <button
            className={cn(
              'h-[44px] w-full justify-center flex items-center gap-2 font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] cursor-pointer',
              activeTab === 'likes'
                ? 'text-[#0093DD] border-b-[3px] border-[#0093DD]'
                : 'text-[#0A0D12] hover:text-[#0093DD]'
            )}
            onClick={() => setActiveTab('likes')}
          >
            <ThumbsUp height={20} width={20} />
            <p>Like</p>
          </button>
          <button
            className={cn(
              'h-[44px] w-full justify-center flex items-center gap-2 font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] cursor-pointer',
              activeTab === 'comments'
                ? 'text-[#0093DD] border-b-[3px] border-[#0093DD]'
                : 'text-[#0A0D12] hover:text-[#0093DD]'
            )}
            onClick={() => setActiveTab('comments')}
          >
            <MessagesSquare />
            <p>Comment</p>
          </button>
        </div>

        <div className='flex overflow-y-auto'>
          {/* Likes List Content */}
          {activeTab === 'likes' && likes.length === 0 && (
            <p className='font-normal text-[14px] md:text-[16px] leading-[28px] md:leading-[32px] tracking-[-0.03em] text-[#535862]'>
              No Likes yet.
            </p>
          )}
          {activeTab === 'likes' && likes.length > 0 && (
            <div className='flex flex-col gap-3 md:gap-5 w-full'>
              <p className='font-bold text-[14px] md:text-[18px] leading-[28px] md:leading-[32px] tracking-[-0.03em] text-[#0A0D12]'>
                Like ({likes.length})
              </p>
              {likes.map((user, index) => (
                <div className='flex flex-col gap-3' key={user.id}>
                  <Link href={`/profile/${user.id}`} onClick={onClose}>
                    <div className='flex items-center gap-3 cursor-pointer group'>
                      <Image
                        src={user.avatarUrl || '/unknown-user.png'}
                        alt={user.name}
                        height={48}
                        width={48}
                        className='h-[40px] w-[40px] md:h-[48px] md:w-[48px] rounded-full object-cover'
                      />
                      <div className='flex flex-col'>
                        <p className='-mb-1 font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] text-[#181D27] group-hover:text-[#0093DD]'>
                          {user.name}
                        </p>
                        <p className='font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#535862]'>
                          {user.headline || 'No headline provided.'}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {index < likes.length - 1 && (
                    <div className='w-full border border-[#D5D7DA]' />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Comments List Content */}
          {activeTab === 'comments' && comments.length === 0 && (
            <p className='font-normal text-[14px] md:text-[16px] leading-[28px] md:leading-[32px] tracking-[-0.03em] text-[#535862]'>
              No Comments yet.
            </p>
          )}

          {activeTab === 'comments' && comments.length > 0 && (
            <div className='flex flex-col gap-3 md:gap-5 w-full'>
              <p className='font-bold text-[14px] md:text-[18px] leading-[28px] md:leading-[32px] tracking-[-0.03em] text-[#0A0D12]'>
                Comments ({comments.length})
              </p>
              {comments.map((comment, index) => (
                <div key={comment.id} className='flex flex-col gap-2 md:gap-3'>
                  <Link href={`/profile/${comment.author.id}`}>
                    <div onClick={onClose} className='flex items-center '>
                      <Image
                        src={comment.author.avatarUrl ?? '/unknown-user.png'}
                        alt={comment.author.name}
                        height={48}
                        width={48}
                        className='h-[40px] w-[40px] md:h-[48px] md:w-[48px] rounded-full object-cover'
                      />
                      <div className='flex flex-col'>
                        <p className='-mb-1 font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] text-[#181D27] group-hover:text-[#0093DD]'>
                          {comment.author.name}
                        </p>
                        <p className='font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#535862]'>
                          {new Date(comment.createdAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <p className='font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#181D27]'>
                      {comment.content}
                    </p>
                  </Link>

                  {index < comments.length - 1 && (
                    <div className='w-full border border-[#D5D7DA]' />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesCommentsListModal;
