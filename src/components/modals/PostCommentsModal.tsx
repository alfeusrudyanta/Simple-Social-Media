'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import type { Comment } from '@/interfaces/api';
import useApi from '@/lib/api-selector';
import Link from 'next/link';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface PostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

const PostCommentsModal = ({
  isOpen,
  onClose,
  postId,
}: PostCommentsModalProps) => {
  const api = useApi();
  const [modalComments, setModalComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllComments = async () => {
      try {
        const res = await api.getPostComments(postId);
        setModalComments(res);
      } catch (err) {
        console.error('Failed to fetch all comments:', err);
      }
    };

    const interval = setInterval(fetchAllComments, 1000);
    return () => clearInterval(interval);
  }, [isOpen, postId, api]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const createdComment = await api.createComment(postId, {
        content: newComment.trim(),
      });
      setModalComments((prev) => [createdComment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className='fixed inset-0 bg-[#0A0D1299] flex items-center justify-center z-50'>
      <div className='mx-6 py-6 px-4 md:px-6 gap-4 md:gap-5 bg-white rounded-[16px] w-full max-w-[613px] max-h-[80vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#0A0D12]'>
            Comments ({modalComments.length})
          </h2>
          <button
            onClick={onClose}
            className='p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
          >
            <X className='h-6 w-6 text-[#0A0D12]]' />
          </button>
        </div>

        <div className='flex flex-col'>
          <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12] mb-2'>
            Give your Comments
          </p>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Enter your comment'
            disabled={isSubmitting}
          />
          <div className='flex justify-end mt-3'>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !newComment.trim()}
              className='md:w-[204px]'
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className='flex flex-col overflow-y-auto'>
          <div>
            {modalComments.map((comment, index) => (
              <div
                key={comment.id}
                className='flex flex-col items-start gap-2 mb-3'
              >
                <div className='flex flex-row items-center gap-2 md:gap-3'>
                  <Link
                    href={`/profile/${comment.author.id}`}
                    onClick={onClose}
                  >
                    <Image
                      src={comment.author.avatarUrl ?? '/unknown-user.png'}
                      alt={comment.author.name}
                      height={48}
                      width={48}
                      className='h-[48px] w-[48px] rounded-full object-cover flex-shrink-0'
                    />
                  </Link>
                  <div className='flex flex-col'>
                    <Link
                      href={`/profile/${comment.author.id}`}
                      onClick={onClose}
                    >
                      <p className='-mb-2 font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] md:tracking-[-0.03em] text-[#181D27] hover:underline'>
                        {comment.author.name}
                      </p>
                    </Link>
                    <p className='font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#535862]'>
                      {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <p className='mx-2 font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#181D27]'>
                  {comment.content}
                </p>

                {index < modalComments.length - 1 && (
                  <div className='w-full border border-[#D5D7DA]' />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentsModal;
