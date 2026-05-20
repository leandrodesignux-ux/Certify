import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = true,
}: CardProps) {
  const variantStyles = {
    default: 'bg-[#111827] border border-[rgba(0,229,255,0.1)]',
    glass:
      'bg-[#111827]/80 border border-[rgba(0,229,255,0.1)] backdrop-blur-[12px]',
  };

  const paddingStyles = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`rounded-sm transition-all duration-200 ${
        variantStyles[variant]
      } ${paddingStyles[padding]} ${
        hover
          ? 'hover:border-[rgba(0,229,255,0.25)] hover:shadow-[0_0_16px_rgba(0,229,255,0.08)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
