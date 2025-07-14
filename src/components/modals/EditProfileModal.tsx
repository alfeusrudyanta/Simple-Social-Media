'use client';

import type React from 'react';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import type { User } from '@/interfaces/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        setIsSubmitting(false);
        return;
      }

      await onUpdateProfile(dataToUpdate);
      onClose();
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Update profile error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-[#0A0D1299] flex items-center justify-center z-50 px-6'>
      <div className='bg-white rounded-[16px] w-full max-w-[451px] flex flex-col gap-5 py-6 px-4 md:p-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <p className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#0A0D12]'>
            Edit Profile
          </p>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
          >
            <X className='h-6 w-6 text-[#0A0D12]' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className='flex flex-col items-center gap-5'>
            {/* Avatar */}
            <label className='relative cursor-pointer' htmlFor='avatar-upload'>
              <Image
                src={avatarPreview || '/unknown-user.png'}
                alt='Avatar Preview'
                height={100}
                width={100}
                className='rounded-full object-cover'
              />
              <div className='h-6 w-6 flex justify-center items-center absolute bottom-0 right-0 bg-[#0093DD] text-white rounded-full hover:bg-[#007BB8]'>
                <Camera className='h-4 w-4' />
              </div>
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </label>
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

          {error && (
            <p className='text-red-500 text-[16px] leading-[32px]'>{error}</p>
          )}

          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
