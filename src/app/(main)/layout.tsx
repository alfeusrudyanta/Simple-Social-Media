import type React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';
import Loading from '@/app/(main)/loading';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-grow'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
      <Footer />
    </div>
  );
}
