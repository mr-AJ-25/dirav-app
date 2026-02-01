import { cn } from '@/utils/cn';

interface DiravBadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  className?: string;
}

export function DiravBadge({
  label,
  color = '#7C3AED',
  textColor = '#FFFFFF',
  className,
}: DiravBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold',
        className
      )}
      style={{ backgroundColor: color, color: textColor }}
    >
      {label}
    </span>
  );
}
