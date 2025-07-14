'use client';

import useApi from '@/lib/api-selector';
import Link from 'next/link';
import type { LoginResponse } from '@/interfaces/api';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const Login = () => {
  const api = useApi();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password.length < 8) {
      setIsSubmitting(false);
      return setError('Password must at least be 8 characters.');
    }

    try {
      const res: LoginResponse = await api.postLogin({ email, password });

      if (res.token) {
        login(res.token, email);
        router.push('/');
      } else {
        setError('Login failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Please enter a valid email and/or password.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (error) setError('');

    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <form
        className='mx-6 p-6 max-w-[400px] w-full flex flex-col gap-5 border border-[#E9EAEB] rounded-[12px] shadow-[0_0_24px_0_rgba(205,204,204,0.16)]'
        onSubmit={onLogin}
        noValidate
      >
        <p className='font-bold text-[20px] leading-[34px] tracking-[-0.03em] text-[#181D27]'>
          Sign In
        </p>

        <div className='flex flex-col gap-1 text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
          <p className='font-semibold'>Email</p>
          <Input
            type='email'
            name='email'
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder='Enter your email'
            disabled={isSubmitting}
            autoComplete='email'
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em]'>
            Password
          </p>
          <Input
            type='password'
            name='password'
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder='Enter your password'
            className='border border-[#D5D7DA] gap-2 font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'
            disabled={isSubmitting}
            autoComplete='current-password'
            required
          />
        </div>

        {error && (
          <p className='font-normal text-[16px] leading-[30px] tracking-[-0.03em] text-[#EE1D52]'>
            {error}
          </p>
        )}

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

        <div className='flex justify-center items-center text-center gap-[2px]'>
          <p className='font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12]'>
            Don&apos;t have an account?
          </p>
          <Link href='/register'>
            <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0093DD] hover:underline'>
              Register
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
