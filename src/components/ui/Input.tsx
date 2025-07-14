import * as React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'py-2 px-4 w-full rounded-[12px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border border-[#D5D7DA] gap-2 font-normal text-[14px] leading-[28px] tracking-[-0.03em] text-[#0A0D12] resize-none outline-none focus:border-[#0093DD] transition-colors',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
