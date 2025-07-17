'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Camera, X } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import type { User } from '@/interfaces/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '../ui/sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile: (data: {
    name?: string;
    headline?: string;
    avatar?: File;
  }) => Promise<void>;
}

const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
}: EditProfileModalProps) => {
  const [name, setName] = useState(currentUser.name || '');
  const [headline, setHeadline] = useState(currentUser.headline || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentUser.avatarUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToUpdate: { name?: string; headline?: string; avatar?: File } =
        {};
      if (name !== currentUser.name) dataToUpdate.name = name;
      if (headline !== currentUser.headline) dataToUpdate.headline = headline;
      if (avatarFile) dataToUpdate.avatar = avatarFile;

      if (Object.keys(dataToUpdate).length === 0) {
        onClose();
        return;
      }

      await onUpdateProfile(dataToUpdate);
      toast.success('Profile successfully updated.');
      onClose();
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Update profile error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-[#0A0D1299] z-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-[451px] bg-white rounded-[16px] flex flex-col gap-5 py-6 px-4 md:p-6 z-50 focus:outline-none'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <Dialog.Title className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#0A0D12]'>
              Edit Profile
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className='p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
                aria-label='Close'
              >
                <X className='h-6 w-6 text-[#0A0D12]' />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <div className='flex flex-col items-center gap-5'>
              {/* Avatar */}
              <div className='relative group'>
                <Image
                  src={avatarPreview || '/unknown-user.png'}
                  alt='Profile picture'
                  width={100}
                  height={100}
                  className='rounded-full object-cover h-[100px] w-[100px]'
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute bottom-0 right-0 h-6 w-6 flex justify-center items-center bg-[#0093DD] text-white rounded-full hover:bg-[#007BB8] transition-colors'
                  aria-label='Change profile picture'
                >
                  <Camera className='h-4 w-4' />
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Name */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='name'
                className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
              >
                Name
              </label>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your Name'
                disabled={isSubmitting}
                className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
              />
            </div>

            {/* Headline */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='headline'
                className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
              >
                Headline
              </label>
              <Input
                id='headline'
                type='text'
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder='Your Headline'
                disabled={isSubmitting}
                className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
              />
            </div>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditProfileModal;
