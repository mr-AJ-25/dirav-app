import { DiravColors } from '@/core/theme/colors';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h2 className="text-base sm:text-xl font-bold text-[#111827]">{title}</h2>
      {actionLabel && (
        <button
          onClick={onAction}
          className="text-xs sm:text-sm font-semibold hover:underline active:opacity-70 transition-opacity"
          style={{ color: DiravColors.primary }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
