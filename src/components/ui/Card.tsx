import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = true,
  onClick,
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
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: '0 0 20px rgba(0,229,255,0.15)' } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.2 }}
      className={`rounded-sm ${
        variantStyles[variant]
      } ${paddingStyles[padding]} ${
        hover
          ? 'hover:border-[rgba(0,229,255,0.25)]'
          : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
