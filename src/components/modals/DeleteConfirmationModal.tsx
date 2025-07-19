'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-[#0A0D1299] z-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full mx-6 py-6 px-4 md:p-[32px] gap-4 md:gap-6 max-w-[613px] bg-[#FDFDFD] rounded-[24px] flex flex-col z-50 focus:outline-none'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <Dialog.Title className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#0A0D12]'>
              Delete
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                type='button'
                variant='none'
                className='max-w-[48px] hover:bg-gray-100'
                aria-label='Close'
              >
                <X className='h-6 w-6 text-[#0A0D12]' />
              </Button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <Dialog.Description className='font-normal text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#535862]'>
            Are you sure to delete?
          </Dialog.Description>

          {/* Buttons */}
          <div className='flex justify-end gap-2'>
            <Dialog.Close asChild>
              <Button
                type='button'
                variant='none'
                className='md:max-w-[120px] text-[#0A0D12] hover:text-[#0093DD]'
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type='button'
              variant='destructive'
              onClick={onConfirm}
              className='md:max-w-[120px]'
            >
              Delete
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteConfirmationModal;
