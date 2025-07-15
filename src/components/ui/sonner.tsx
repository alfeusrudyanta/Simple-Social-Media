'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps, toast } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg cursor-pointer',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: '!bg-[#F0F9FF] !border-[#0093DD] !text-[#181D27]',
          error: '!bg-[#FEF0F0] !border-[#EE1D52] !text-[#181D27]',
        },
      }}
      {...props}
    />
  );
};

const showToast = {
  success: (message: string) => {
    const toastId = toast.success(message, {
      classNames: {
        title: 'font-semibold text-[14px]',
      },
      action: {
        label: 'X',
        onClick: () => toast.dismiss(toastId),
      },
    });
  },
  error: (message: string) => {
    const toastId = toast.error(message, {
      classNames: {
        title: 'font-semibold text-[14px]',
      },
      action: {
        label: 'X',
        onClick: () => toast.dismiss(toastId),
      },
    });
  },
};

export { Toaster, showToast as toast };
