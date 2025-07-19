import type React from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-grow'>{children}</div>
      <Footer />
    </div>
  );
}
