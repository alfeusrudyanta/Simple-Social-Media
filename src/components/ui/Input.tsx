import * as React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  'aria-describedby'?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base styles
          'py-2 px-4 w-full rounded-[12px] focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'border font-normal text-[14px] leading-[28px] tracking-[-0.03em]',
          'resize-none outline-none transition-colors',
          'bg-white border-[#D5D7DA] text-[#0A0D12]',
          'focus:border-[#0093DD]',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
