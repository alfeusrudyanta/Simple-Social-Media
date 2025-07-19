'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useApi from '@/lib/api-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ArrowUpToLine, CloudUpload, Trash, XCircle } from 'lucide-react';
import TextEditor from '@/components/TextEditor';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/components/ui/sonner';

const EditPostPage = () => {
  const api = useApi();
  const { isLogin } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const postId = Number.parseInt(id as string);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await api.getPostById(postId);
        setTitle(postData.title);
        setContent(postData.content);
        setTags(postData.tags || []);
        setImagePreview(postData.imageUrl || null);
      } catch (error) {
        console.error('Failed to fetch post for editing:', error);
      }
    };
    fetchPost();
  }, [postId, api, isLogin, router]);

  const handleImageChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: FileList | null } }
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagsInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagsInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content.');
      setIsSubmitting(false);
      return;
    }

    if (tags.length === 0) {
      toast.error('Please fill in related tags.');
      setIsSubmitting(false);
      return;
    }

    try {
      const currentPostData = await api.getPostById(postId);
      const dataToUpdate: {
        title?: string;
        content?: string;
        tags?: string[];
        image?: File;
      } = {};

      if (title !== currentPostData.title) dataToUpdate.title = title;
      if (content !== currentPostData.content) dataToUpdate.content = content;
      if (
        JSON.stringify(tags.sort()) !==
        JSON.stringify(currentPostData.tags.sort())
      )
        dataToUpdate.tags = tags;
      if (imageFile) dataToUpdate.image = imageFile;

      if (Object.keys(dataToUpdate).length === 0) {
        toast.error('No changes to save.');
        setIsSubmitting(false);
        return;
      }

      await api.updatePost(postId, dataToUpdate);
      toast.success('Post successfully updated.');
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post: Please try again later.');
    }
  };

  return (
    <div className='flex flex-col m-4 md:my-12 md:mx-[353px]'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <label
            htmlFor='title'
            className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
          >
            Title
          </label>
          <Input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter your title'
            disabled={isSubmitting}
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='content'
            className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
          >
            Content
          </label>
          <div className='w-full border border-[#D5D7DA] rounded-[12px] focus-within:border-[#0093DD] transition-colors overflow-hidden'>
            <TextEditor value={content} onChange={setContent} />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='image'
            className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
          >
            Post Image
          </label>
          {!imagePreview && (
            <div
              className='flex items-center flex-col gap-4 relative h-[140px] border-dotted border border-[#A4A7AE] rounded-[12px]'
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleImageChange({ target: { files: e.dataTransfer.files } });
              }}
            >
              <Input
                id='image'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={isSubmitting}
                required
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
              />
              <div className='absolute inset-0 flex flex-col gap-1 items-center justify-center font-semibold text-[14px] leading-[28px] text-[#414651]'>
                <div className='flex items-center justify-center rounded-[8px] p-2 border border-[#D5D7DA]'>
                  <CloudUpload />
                </div>
                <p>
                  <span className='text-[#0093DD]'>Click or drag</span> to
                  upload an image
                </p>
                <p>PNG or JPG (max. 5mb)</p>
              </div>
            </div>
          )}

          {imagePreview && (
            <div className='flex items-center flex-col gap-4 relative h-[400px] border-dotted border border-[#A4A7AE] rounded-[12px] pt-4 px-[100px]'>
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                className='hidden'
                onChange={handleImageChange}
              />

              <div className='absolute flex flex-col gap-3'>
                <Image
                  src={imagePreview}
                  alt='Image Preview'
                  height={280}
                  width={530}
                  loading='lazy'
                  className='object-cover'
                />
                <div className='flex flex-row justify-center gap-3'>
                  <Button
                    variant='none'
                    onClick={handleTriggerFileInput}
                    className='text-[#0A0D12] rounded-[10px] p-1 max-w-[133px]'
                  >
                    <ArrowUpToLine height={20} width={20} />
                    Change Image
                  </Button>

                  <Button
                    variant='none'
                    onClick={handleRemoveImage}
                    className='text-[#EE1D52] hover:text-red-600 rounded-[10px] p-1 max-w-[133px]'
                  >
                    <Trash height={20} width={20} />
                    Delete Image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='tags'
            className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
          >
            Tags
          </label>
          <Input
            id='tags'
            type='text'
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder='Enter tags and press Enter'
            disabled={isSubmitting}
          />
          <div className='flex flex-wrap gap-1 mt-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='flex items-center gap-2 bg-[#0093DD] text-white px-4 py-1 rounded-full text-[16px]'
              >
                {tag}
                <XCircle
                  className='h-4 w-4 cursor-pointer'
                  onClick={() => handleRemoveTag(tag)}
                />
              </span>
            ))}
          </div>
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='md:max-w-[264px] ml-auto'
        >
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};

export default EditPostPage;
