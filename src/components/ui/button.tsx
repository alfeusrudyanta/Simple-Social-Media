import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'w-full h-[40px] md:h-[48px] rounded-full font-semibold text-[14px] leading-[28px] tracking-[-0.03em] cursor-pointer flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#0093DD] text-[#FDFDFD] hover:bg-[#007BB8]',
        destructive: 'bg-[#EE1D52] text-[#FDFDFD] hover:bg-red-600',
        outline: 'border border-[#0093DD] text-[#0093DD] hover:bg-[#0093DD]/10',
        none: 'text-[#181D27] hover:text-[#0093DD] bg-transparent',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'h-[36px] px-3',
        lg: 'h-[56px] px-6',
        icon: 'w-10 h-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
