'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import useApi from '@/lib/api-selector';
import type { Post } from '@/interfaces/api';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText, PenLine } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const MyProfilePage = () => {
  const { currentUser, refreshUser, isLogin } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'change-password'>(
    'posts'
  );
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
    }

    const fetchMyPosts = async () => {
      try {
        const res = await api.getMyPosts();
        setMyPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch my posts:', error);
      }
    };

    const interval = setInterval(fetchMyPosts, 1000);
    return () => clearInterval(interval);
  }, [api, isLogin, router]);

  const handleUpdateProfile = async (data: {
    name?: string;
    headline?: string;
    avatar?: File;
  }) => {
    try {
      await api.updateProfile(data);
      await refreshUser();
      toast.success('Profile updated successfully.');
      setIsEditProfileModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile: Please try again later.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Password must match.');
    }

    if (currentPassword === newPassword) {
      toast.error('Current password must not be the same as the new password.');
    }

    setIsSubmitting(true);

    try {
      await api.updatePassword({
        confirmPassword,
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password successfully changed.');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(
        'Failed to change password: Please input the correct password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col py-6 md:py-0 px-4 md:px-0 md:mt-12 md:mb-[144px] mx-0 md:mx-[320px] gap-4 md:gap-6'>
      {/* Current User Profile */}
      <div className='flex justify-between border border-[#D5D7DA] py-3 md:py-4 px-4 md:px-6 rounded-[13px] items-center'>
        <div className='flex flex-row gap-2 items-center '>
          <Link href={`/profile/${currentUser?.id}`}>
            <Image
              src={currentUser?.avatarUrl || '/unknown-user.png'}
              alt={currentUser?.name || 'User Avatar'}
              height={80}
              width={80}
              className='h-[40px] md:h-[80px] w-[40px] md:w-[80px] rounded-full object-cover'
            />
          </Link>
          <div className='flex flex-col'>
            <Link href={`/profile/${currentUser?.id}`}>
              <p className='-mb-[2px] font-bold text-[14px] md:text-[18px] leading-[28px] md:leading-[32px] tracking-[-0.03em] text-[#181D27]'>
                {currentUser?.name}
              </p>
            </Link>

            <p className='font-normal text-[12px] md:text-[16px] leading-[24px] md:leading-[30px] tracking-[-0.03em] text-[#181D27]'>
              {currentUser?.headline || 'No headline provided.'}
            </p>
          </div>
        </div>
        <p
          className='font-semibold text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] underline text-[#0093DD] cursor-pointer'
          onClick={() => setIsEditProfileModalOpen(!isEditProfileModalOpen)}
        >
          Edit Profile
        </p>
      </div>

      {/* Tabs */}
      <div className='flex'>
        <Button
          variant='none'
          className={cn(
            'md:w-[177px] rounded-none',
            activeTab === 'posts'
              ? 'text-[#0093DD] border-b-[3px] border-[#0093DD]'
              : 'text-[#535862] border-b border-[#D5D7DA] hover:text-[#0093DD]'
          )}
          onClick={() => setActiveTab('posts')}
        >
          Your Post
        </Button>
        <Button
          variant='none'
          className={cn(
            'md:w-[177px] rounded-none',
            activeTab === 'change-password'
              ? 'text-[#0093DD] border-b-[3px] border-[#0093DD]'
              : 'text-[#535862] border-b border-[#D5D7DA] hover:text-[#0093DD]'
          )}
          onClick={() => setActiveTab('change-password')}
        >
          Change Password
        </Button>
      </div>

      {/* Post Content */}
      {activeTab === 'posts' && (
        <>
          {myPosts.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-gray-600 text-center'>
              <FileText height={135} width={180} color='#0093DD' />
              <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12] mt-6'>
                Your writing journey starts here
              </p>
              <p className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                No posts yet, but every great writer starts with the first one.
              </p>
              <Button
                className='w-[200px] mt-6'
                onClick={() => router.push('/post/create')}
              >
                Write Post
              </Button>
            </div>
          ) : (
            <div className='flex flex-col gap-4 md:gap-5'>
              {/* Post */}
              <div className='flex flex-col gap-4 md:hidden'>
                <Button onClick={() => router.push('/post/create')}>
                  <PenLine height={24} width={24} />
                  <p>Write Post</p>
                </Button>

                {/* Divider */}
                <div className='w-auto border border-[#D5D7DA]' />
              </div>

              <div className='flex justify-between items-center'>
                <p className='font-bold text-[18px] md:text-[24px] leading-[36px] md:leading-[32px] tracking-[-0.03em] text-[#181D27]'>
                  {myPosts.length} Post
                </p>
                <Button
                  className='hidden md:flex w-[182px]'
                  onClick={() => router.push('/post/create')}
                >
                  <PenLine height={24} width={24} />
                  <p>Write Post</p>
                </Button>
              </div>

              {/* Divider */}
              <div className='hidden md:block w-auto border border-[#D5D7DA]' />

              {/* Post Content */}
              {myPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  Divider={index < myPosts.length - 1}
                  PersonalView={true}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Password Content */}
      {activeTab === 'change-password' && (
        <>
          <form
            onSubmit={handleChangePassword}
            className='flex flex-col gap-5 max-w-[538px]'
          >
            <div className='flex flex-col gap-1'>
              <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                Current Password
              </p>
              <Input
                type='password'
                name='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder='Enter current password'
                disabled={isSubmitting}
                required
              />
              <div>
                <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                  New Password
                </p>
                <Input
                  type='password'
                  name='newPassword'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
                  Confirm New Password
                </p>
                <Input
                  type='password'
                  name='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Changing...' : 'Update Password'}
            </Button>
          </form>
        </>
      )}

      {isEditProfileModalOpen && currentUser && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
