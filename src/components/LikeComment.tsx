'use client';

import React, { useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import PostCommentsModal from './modals/PostCommentsModal';
import { toast } from '@/components/ui/sonner';

interface LikeComment {
  Like: number;
  Comment: number;
  PostId: number;
}

const LikeComment = ({ Like, Comment, PostId }: LikeComment) => {
  const { isLogin } = useAuth();
  const router = useRouter();
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const handleLike = async () => {
    if (!isLogin) {
      router.push('/login');
    }

    try {
      await api.likePost(PostId);
    } catch (error) {
      console.error(error);
      toast.error('Like/unlike error. Please try again.');
    }
  };

  const handleComment = () => {
    if (!isLogin) {
      router.push('/login');
    }

    setIsCommentsModalOpen(!isCommentsModalOpen);
  };

  return (
    <div className='flex flex-row gap-3 items-center'>
      <div
        className='flex flex-row gap-[6px] items-center group cursor-pointer'
        onClick={handleLike}
      >
        <div className='text-[#535862] group-hover:text-[#0093DD]'>
          <ThumbsUp height={20} width={20} />
        </div>
        <p className='font-normal text-[12px] leading-[28px] tracking-[-0.03em] text-[#535862] group-hover:text-[#0093DD]'>
          {Like}
        </p>
      </div>
      <div
        className='flex flex-row gap-[6px] items-center group cursor-pointer'
        onClick={handleComment}
      >
        <div className='text-[#535862] group-hover:text-[#0093DD]'>
          <MessageSquare height={20} width={20} />
        </div>
        <p className='font-normal text-[12px] leading-[28px] tracking-[-0.03em] text-[#535862] group-hover:text-[#0093DD]'>
          {Comment}
        </p>
      </div>

      <PostCommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        postId={PostId}
      />
    </div>
  );
};

export default LikeComment;
