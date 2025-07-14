import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'h-[40px] md:-h-[48px] w-full rounded-full text-[#FDFDFD] font-semibold text-[14px] leading-[28px] tracking-[-0.03em] cursor-pointer flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-[#0093DD] hover:bg-[#007BB8]',
        destructive: ' bg-[#EE1D52] hover:bg-red-600',
        none: 'text-[#181D27] hover:text-[#0093DD]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    const Comp = 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
