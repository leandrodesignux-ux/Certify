import { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  const paddingStyles = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const baseStyles: React.CSSProperties = variant === 'glass' ? {
    backgroundColor: 'rgba(26,16,64,0.92)',
    border: '1px solid rgba(91,34,119,0.2)',
    borderRadius: '6px',
  } : {
    backgroundColor: '#1a1040',
    border: '1px solid rgba(91,34,119,0.2)',
    borderRadius: '6px',
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...baseStyles,
        ...style,
        position: 'relative',
        overflow: 'hidden',
        ...(hover && isHovered ? { willChange: 'transform' } : {}),
      }}
      className={`transition-all duration-200 ${paddingStyles[padding]} ${
        hover
          ? 'hover:border-[rgba(100,43,90,0.45)] hover:shadow-[0_0_20px_rgba(91,34,119,0.2)] hover:-translate-y-1'
          : ''
      } ${className}`}
    >
      {/* Shimmer overlay */}
      {hover && (
        <div
          className="animate-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -1,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      {children}
    </div>
  );
}
