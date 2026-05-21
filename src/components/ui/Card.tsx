import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = true,
  onClick,
  style,
}: CardProps) {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const baseStyles: React.CSSProperties = variant === 'glass' ? {
    backgroundColor: 'rgba(17,24,39,0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,229,255,0.1)',
    borderRadius: '12px',
  } : {
    backgroundColor: '#111827',
    border: '1px solid rgba(0,229,255,0.1)',
    borderRadius: '12px',
  };

  return (
    <div
      onClick={onClick}
      style={{ ...baseStyles, ...style }}
      className={`transition-all duration-200 ${paddingStyles[padding]} ${
        hover
          ? 'hover:border-[rgba(0,229,255,0.25)] hover:shadow-[0_0_16px_rgba(0,229,255,0.08)] hover:-translate-y-1'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
