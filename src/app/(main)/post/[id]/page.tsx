'use client';

import useApi from '@/lib/api-selector';
import { useEffect, useState } from 'react';
import type { Post, Comment } from '@/interfaces/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Dot } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import PostCommentsModal from '@/components/modals/PostCommentsModal';
import LikeComment from '@/components/LikeComment';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import getAvatarImgSrc from '@/utils/avatar';
import Loading from '@/app/loading';

const PostDetail = () => {
  const api = useApi();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { id } = useParams();
  const [recommendedPosts, setRecommendedPosts] = useState<Post>();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await api.getPostById(Number.parseInt(id as string));
        setPost(postRes);

        const commentRes = await api.getComments(Number.parseInt(id as string));
        setComments(commentRes);

        const recommendedRes = await api.getMostLikedPosts();
        if (recommendedRes.data[0].id === postRes.id) {
          setRecommendedPosts(recommendedRes.data[1]);
        } else {
          setRecommendedPosts(recommendedRes.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch post details', error);
      } finally {
        if (initialLoad) setInitialLoad(false);
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [api, id, initialLoad]);

  if (initialLoad) return <Loading />;

  const handleSubmitComment = async (commentText: string) => {
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      toast.success('Comment successfully created.');
      await api.createComment(Number.parseInt(id as string), {
        content: commentText.trim(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Failed to submit comment: Please try again later.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleQuickComment = async () => {
    await handleSubmitComment(newComment);
  };

  return (
    <div className='flex flex-col p-4 mb-[40px] md:mt-[48px] md:mb-[233px] md:py-[48px] md:px-[320px] gap-3 md:gap-4'>
      <div className='flex flex-col gap-3 md:gap-4'>
        {/* Title */}
        <p className='font-bold text-[28px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.03em] text-[#181D27]'>
          {post?.title}
        </p>
        <div className='flex flex-row gap-2'>
          {/* Tag */}
          {post?.tags.slice(0, 3).map((tag) => (
            <Link key={tag} href={`/search?q=${tag}`}>
              <div className='rounded-[8px] border border-[#D5D7DA] py-[2px] px-2 gap-2'>
                <p className='font-normal text-[12px] leading-[24px] tracking-[-0.03em] text-[#181D27] hover:text-[#0093DD]'>
                  {tag}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Profile & Created at */}
      <div className='flex flex-row gap-2 md:gap-3 items-center'>
        {/* Profile Picture */}
        <div className='flex flex-row gap-2 items-center'>
          <Link href={`/profile/${post?.author.id}`}>
            <Image
              src={
                getAvatarImgSrc(post?.author.avatarUrl) || '/unknown-user.png'
              }
              alt={post?.author.name || 'author-profile-picture'}
              height={40}
              width={40}
              loading='lazy'
              className='h-[40px] w-[40px] object-cover rounded-full'
            />
          </Link>
          <Link href={`/profile/${post?.author.id}`}>
            <p className='font-medium text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#181D27] hover:text-[#0093DD]'>
              {post?.author.name}
            </p>
          </Link>
        </div>
        <Dot className='h-4 w-4 text-[#535862]' />
        <p className='font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#535862]'>
          {new Date(post?.createdAt ?? '').toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
      {/* Divider */}
      <div className='w-full border border-[#D5D7DA]' />
      {/* Like & Comment */}
      {post && (
        <LikeComment
          key={post?.id}
          Like={post?.likes}
          Comment={post?.comments}
          PostId={post?.id}
        />
      )}

      {/* Divider */}
      <div className='w-full border border-[#D5D7DA]' />
      <div className='flex relative w-full aspect-[359/203] items-center object-center'>
        <Image
          src={post ? post?.imageUrl : '/unknown-user.png'}
          alt={post ? post?.title : 'post-image'}
          fill
          loading='lazy'
          className='object-cover rounded-[6px]'
        />
      </div>
      {/* Content */}
      <p
        className='font-normal text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#0A0D12]'
        dangerouslySetInnerHTML={{ __html: post?.content || '' }}
      />

      {/* Comment Section */}
      <div className='flex flex-col gap-3'>
        <p className='font-bold text-[20px] md:text-[24px] leading-[34px] md:leading-[36px] tracking-[-0.03em] text-[#0A0D12]'>
          Comments({comments.length})
        </p>

        {/* Login prompt for logged in users */}
        {currentUser && (
          <>
            <div className='flex flex-row gap-2 items-center'>
              <Image
                src={
                  getAvatarImgSrc(currentUser.avatarUrl) || '/unknown-user.png'
                }
                alt={currentUser.name}
                height={40}
                width={40}
                loading='lazy'
                className='h-[40px] w-[40px] object-cover rounded-full'
              />
              <p className='font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#181D27]'>
                {currentUser.name}
              </p>
            </div>
            {/* Comment box */}
            <div className='flex flex-col gap-[2px] max-w-full'>
              <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                Give your Comments
              </p>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Enter your comment'
                disabled={isSubmittingComment}
              />
            </div>
            <Button
              type='submit'
              onClick={handleQuickComment}
              disabled={isSubmittingComment || !newComment.trim()}
              className='ml-auto md:w-[200px]'
            >
              {isSubmittingComment ? 'Sending...' : 'Send'}
            </Button>
          </>
        )}
      </div>

      {/* Divider */}
      <div className='w-full border border-[#D5D7DA]' />

      {/* Other People Comments */}
      {comments.length > 0 && (
        <div className='flex flex-col gap-3 md:gap-4'>
          <div className='flex flex-col gap-3'>
            {comments.slice(0, 3).map((comment, index) => (
              <div key={comment.id}>
                <div className='flex flex-col gap-2 md:gap-4'>
                  <div className='flex flex-row items-center'>
                    <Image
                      src={
                        getAvatarImgSrc(comment.author.avatarUrl) ??
                        '/unknown-user.png'
                      }
                      alt={comment.author.name}
                      height={48}
                      width={48}
                      loading='lazy'
                      className='h-[40px] w-[40px] md:h-[48px] md:w-[48px] rounded-full object-cover flex-shrink-0'
                    />
                    <div className='flex flex-col flex-1'>
                      <p className='-mb-[2px] font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] text-[#181D27]'>
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
                </div>

                {/* Divider */}
                {index < Math.min(comments.length, 3) - 1 && (
                  <div className='w-full border border-[#D5D7DA] mt-3' />
                )}
              </div>
            ))}
          </div>

          {/* Show All Comments - Only if more than 3 comments */}
          {comments.length > 3 && (
            <p
              onClick={() => setIsCommentsModalOpen(true)}
              className='font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] underline text-[#0093DD] cursor-pointer'
            >
              See All Comments
            </p>
          )}

          {/* Divider */}
          <div className='w-full border border-[#D5D7DA]' />
        </div>
      )}

      <p className='font-bold text-[20px] md:text-[24px] leading-[34px] md:leading-[36px] tracking-[-0.03em] text-[#181D27]'>
        Another Post
      </p>
      {recommendedPosts && (
        <PostCard
          post={recommendedPosts}
          key={recommendedPosts.id}
          Divider={false}
        />
      )}

      {/* Modals */}
      <PostCommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        postId={Number.parseInt(id as string)}
      />
    </div>
  );
};

export default PostDetail;
