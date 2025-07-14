'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-[#0A0D1299] flex items-center justify-center z-50'>
      <div className='w-full mx-6 py-6 px-4 md:p-[32px] gap-4 md:gap-6 max-w-[613px] bg-[#FDFDFD] rounded-[24px] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <p className='font-bold text-[16px] md:text-[20px] leading-[30px] md:leading-[34px] tracking-[-0.03em] text-[#0A0D12]'>
            Delete
          </p>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
          >
            <X className='h-6 w-6 text-[#0A0D12]' />
          </button>
        </div>

        {/* Content */}
        <p className='font-normal text-[14px] md:text-[16px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-[#535862]'>
          Are you sure to delete?
        </p>

        {/* Button */}
        <div className='flex justify-end'>
          <Button
            type='button'
            variant='none'
            onClick={onClose}
            className='md:max-w-[120px] text-[#0A0D12] hover:text-[#0093DD]'
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={onConfirm}
            className='md:max-w-[120px]'
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
