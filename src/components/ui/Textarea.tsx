import * as React from 'react';
import { cn } from '@/utils/cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'min-h-[140px] border border-[#D5D7DA] rounded-[12px] py-2 px-4 gap-2 outline-none focus:border-[#0093DD] transition-colors placeholder:text-gray-400 focus-visible:outline-none',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
