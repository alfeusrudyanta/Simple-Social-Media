'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, UserRound, LogOut, PenLine } from 'lucide-react';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import MobileSearch from './MobileSearch';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import getAvatarImgSrc from '@/utils/avatar';

const Header = () => {
  const width = useWindowWidth();
  const isMobile = width && width < 768;
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const { currentUser, isLogin, logout, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isMobile) setIsOpen(false);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className='border-b border-[#D5D7DA] h-[64px] w-full px-4 md:px-[120px] flex flex-row items-center justify-between'>
        <div className='flex flex-row my-5 md:my-[22px] gap-[6px] md:gap-[10px] items-center'>
          <Link href='/'>
            <Image
              src='/icon-logo.svg'
              alt='icon-logo'
              height={33}
              width={30}
              objectFit='contain'
            />
          </Link>
          <Link href='/'>
            <p className='font-semibold text-[16px] md:text-[24px] leading-[24px] md:leading-[36px] text-[#0A0D12]'>
              Your&nbsp;Logo
            </p>
          </Link>
        </div>
        <div className='animate-pulse bg-gray-200 h-8 w-20 rounded'></div>
      </div>
    );
  }

  return (
    <div className='border-b border-[#D5D7DA] h-[64px] w-full px-4 md:px-[120px] flex flex-row items-center justify-between'>
      <div className='flex flex-row my-5 md:my-[22px] gap-[6px] md:gap-[10px] items-center'>
        <Link href='/'>
          <Image
            src='/icon-logo.svg'
            alt='icon-logo'
            height={33}
            width={30}
            objectFit='contain'
          />
        </Link>
        <Link href='/'>
          <p className='font-semibold text-[16px] md:text-[24px] leading-[24px] md:leading-[36px] text-[#0A0D12]'>
            Your&nbsp;Logo
          </p>
        </Link>
      </div>

      {/* Mobile View && !isLogin */}
      {isMobile &&
        !isLogin &&
        (isOpen ? (
          <>
            <X
              className='h-6 w-6 cursor-pointer'
              onClick={() => setIsOpen(!isOpen)}
            />
            <div className='absolute bottom-0 left-0 translate-x-0 min-h-[calc(100vh-64px)] w-full z-10 bg-white flex justify-center'>
              <div className='max-w-[214px] mt-[39px] flex flex-col items-center text-center gap-4'>
                <Link href='/login'>
                  <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0093DD] underline cursor-pointer'>
                    Login
                  </p>
                </Link>
                <Link href='/register'>
                  <Button type='button' className='w-[214px]'>
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-row items-center gap-6'>
            <MobileSearch />
            <Menu
              className='h-6 w-6 cursor-pointer'
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        ))}

      {/* isMobile && isLogin */}
      {isMobile && isLogin && (
        <div className='flex flex-row items-center gap-6'>
          <div onClick={() => setIsProfileOpen(false)}>
            <MobileSearch />
          </div>
          <Image
            src={getAvatarImgSrc(currentUser?.avatarUrl) || '/unknown-user.png'}
            alt={currentUser?.name || 'user-avatar'}
            height={40}
            width={40}
            className='h-[40px] w-[40px] object-cover rounded-full'
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          />
        </div>
      )}

      {/* Desktop View && !isLogin */}
      {!isMobile && !isLogin && (
        <>
          <SearchBar View='Desktop' />
          <div className='my-[18px] flex flex-row gap-6 items-center'>
            <Link href='/login'>
              <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] text-[#0093DD] underline cursor-pointer'>
                Login
              </p>
            </Link>
            <div className='my-[10.5px] h-full w-[23px] border border-[#D5D7DA] rotate-90' />
            <Link href='/register'>
              <Button type='button' className='w-[182px]'>
                Register
              </Button>
            </Link>
          </div>
        </>
      )}

      {/* Desktop View && isLogin */}
      {!isMobile && isLogin && (
        <>
          <SearchBar View='Desktop' />
          <div className='py-[6px] flex gap-6 items-center'>
            <Link href='/post/create'>
              <div className='flex gap-2 items-center text-[#0093DD] cursor-pointer'>
                <PenLine height={24} width={24} />
                <p className='font-semibold text-[14px] leading-[28px] tracking-[-0.03em] underline'>
                  Write Post
                </p>
              </div>
            </Link>
            <div className='h-[23px] border border-[#D5D7DA]' />
            <div
              className='flex gap-3 items-center cursor-pointer'
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <Image
                src={
                  getAvatarImgSrc(currentUser?.avatarUrl) || '/unknown-user.png'
                }
                alt={currentUser?.name || 'user-avatar'}
                height={40}
                width={40}
                className='h-[40px] w-[40px] object-cover rounded-full'
              />
              <p className='font-medium text-[14px] leading-[28px] tracking-[-0.03em] text-[#181D27]'>
                {currentUser?.name || 'User'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Profile Menu */}
      {isLogin && isProfileOpen && (
        <div className='absolute top-[60px] right-[12px] md:right-[75px] translate-x-0 z-10 bg-white rounded-[16px]'>
          <div className='flex flex-col py-2 px-4 border border-[#D5D7DA] rounded-[16px]'>
            <Link
              href='/profile'
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className='h-10 w-[182px] flex items-center gap-2 cursor-pointer text-[#0A0D12] hover:text-[#0093DD]'>
                <UserRound className='h-4 w-4' />
                <p className='font-regular text-[12px] leading-[24px] tracking-[-0.03em]'>
                  Profile
                </p>
              </div>
            </Link>
            <div
              className='h-10 w-[182px] flex items-center gap-2 cursor-pointer text-[#0A0D12] hover:text-[#0093DD]'
              onClick={handleLogout}
            >
              <LogOut className='h-4 w-4' />
              <p className='font-regular text-[12px] leading-[24px] tracking-[-0.03em]'>
                Logout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
