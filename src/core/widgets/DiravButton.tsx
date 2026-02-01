import React from 'react';
import { cn } from '@/utils/cn';
import { DiravColors } from '@/core/theme/colors';

interface DiravButtonProps {
  label: string;
  onClick?: () => void;
  isOutlined?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export function DiravButton({
  label,
  onClick,
  isOutlined = false,
  fullWidth = false,
  size = 'md',
  disabled = false,
  icon,
  type = 'button',
}: DiravButtonProps) {
  const sizeClasses = {
    sm: 'h-10 sm:h-11 px-4 text-sm',
    md: 'h-12 sm:h-[52px] px-5 sm:px-6 text-sm sm:text-base',
    lg: 'h-14 px-8 text-base sm:text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl sm:rounded-[14px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]',
        sizeClasses[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        isOutlined
          ? 'bg-white border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5'
          : 'bg-[#7C3AED] text-white hover:bg-[#8B5CF6] shadow-lg shadow-[#7C3AED]/25'
      )}
      style={
        isOutlined
          ? { borderColor: DiravColors.primary, color: DiravColors.primary }
          : { backgroundColor: disabled ? '#9CA3AF' : DiravColors.primary }
      }
    >
      {icon}
      {label}
    </button>
  );
}
