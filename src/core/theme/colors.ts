// Dirav Design System - Colors
// SINGLE SOURCE OF TRUTH - No hardcoded colors allowed elsewhere

export const DiravColors = {
  primary: '#7C3AED',
  primaryLight: '#8B5CF6',
  accentGradientStart: '#7C3AED',
  accentGradientEnd: '#C026D3',
  background: '#F8F9FC',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

// Tailwind class mappings for consistent usage
export const DiravTailwind = {
  primary: 'text-[#7C3AED]',
  primaryBg: 'bg-[#7C3AED]',
  primaryLight: 'text-[#8B5CF6]',
  primaryLightBg: 'bg-[#8B5CF6]',
  background: 'bg-[#F8F9FC]',
  surface: 'bg-white',
  textPrimary: 'text-[#111827]',
  textSecondary: 'text-[#6B7280]',
  success: 'text-[#10B981]',
  successBg: 'bg-[#10B981]',
  error: 'text-[#EF4444]',
  errorBg: 'bg-[#EF4444]',
  warning: 'text-[#F59E0B]',
  warningBg: 'bg-[#F59E0B]',
  info: 'text-[#3B82F6]',
  infoBg: 'bg-[#3B82F6]',
} as const;
