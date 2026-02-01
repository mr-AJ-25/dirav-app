import React from 'react';
import { cn } from '@/utils/cn';

interface DiravCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function DiravCard({ children, className, padding = 'md', hover = false }: DiravCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
        paddingMap[padding],
        hover && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
}
