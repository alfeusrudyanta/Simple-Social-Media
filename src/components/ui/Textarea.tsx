import * as React from 'react';
import { cn } from '@/utils/cn';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'w-full min-h-[140px] border border-[#D5D7DA] rounded-[12px] py-2 px-4 gap-2 resize-none outline-none focus:border-[#0093DD] transition-colors',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
