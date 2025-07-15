'use client';

import useApi from '@/lib/api-selector';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import type { RegisterResponse } from '@/interfaces/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from '@/components/ui/sonner';

const Register = () => {
  const api = useApi();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setIsSubmitting(false);
      toast.error('Password must be match.');
    }

    if (password.length < 8) {
      setIsSubmitting(false);
      toast.error('Password must at least be 8 characters.');
    }

    try {
      const res: RegisterResponse = await api.postRegister({
        email,
        name,
        password,
      });

      if (res.id && res.email) {
        toast.success('Register successful. Redirecting...');
        router.push('/login');
      }
    } catch (error) {
      toast.error('Failed to register. Email already registered.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <form
        className='mx-6 p-6 max-w-[400px] w-full flex flex-col gap-5 border border-[#E9EAEB] rounded-[12px] shadow-[0_0_24px_0_rgba(205,204,204,0.16)]'
        onSubmit={onRegister}
      >
        <p className='font-bold text-[20px] leading-[34px] tracking-[-0.03em] text-[#181D27]'>
          Sign Up
        </p>

        <div className='flex flex-col gap-1 text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
          <p className='font-semibold'>Name</p>
          <Input
            type='text'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter your name'
            disabled={isSubmitting}
            required
          />
        </div>

        <div className='flex flex-col gap-1 text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
          <p className='font-semibold'>Email</p>
          <Input
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            disabled={isSubmitting}
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em]'>
            Password
          </p>
          <Input
            type='password'
            name='initPassword'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            disabled={isSubmitting}
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em]'>
            Confirm Password
          </p>
          <Input
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Enter your confirm password'
            disabled={isSubmitting}
            required
          />
        </div>

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>

        <div className='flex justify-center items-center text-center gap-[2px]'>
          <p className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
            Already have an account?
          </p>
          <Link href='/login'>
            <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0093DD]'>
              Log in
            </p>
          </Link>
        </div>
      </form>

      <Toaster />
    </div>
  );
};

export default Register;
