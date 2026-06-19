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
  const [isHovered, setIsHovered] = useState(false);

  const paddingMap: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'var(--space-md)',
    md: 'var(--space-lg)',
    lg: 'var(--space-xl)',
  };

  const baseStyles: React.CSSProperties = {
    backgroundColor: 'var(--surface-card)',
    border: `1px solid ${hover && isHovered ? 'var(--border-strong)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: hover && isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
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
      className={className}
    >
      {children}
    </div>
  );
}
