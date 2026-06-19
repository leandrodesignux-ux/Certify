import { useState } from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  variant: _variant = 'default',
  padding = 'md',
  className = '',
  hover = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}: CardProps) {
  const [_isHovered, setIsHovered] = useState(false);

  const paddingMap: Record<'sm' | 'md' | 'lg', string> = {
    sm: '16px',
    md: '20px',
    lg: '24px',
  };

  const baseStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #ebebeb',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'rgba(0,0,0,0.06) 0px 1px 2px 0px, rgba(0,0,0,0.08) 0px 1px 3px 0px, rgba(0,0,0,0.04) 0px 0px 0px 1px',
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { setIsHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setIsHovered(false); onMouseLeave?.(); }}
      style={{
        ...baseStyles,
        ...style,
        padding: paddingMap[padding],
        position: 'relative',
        overflow: 'hidden',
      }}
      className={`transition-all duration-200 ${
        hover
          ? 'hover:border-[#d4d4d4] hover:shadow-[rgba(0,0,0,0.08)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_2px_0]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
