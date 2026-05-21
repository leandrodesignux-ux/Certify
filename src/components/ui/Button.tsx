import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: '8px',
      transition: 'all 0.15s ease',
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: '#00E5FF',
          color: '#0A0E1A',
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          border: '1px solid rgba(0,229,255,0.25)',
          color: '#00E5FF',
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: 'rgba(255,61,87,0.15)',
          border: '1px solid rgba(255,61,87,0.3)',
          color: '#FF3D57',
        };
      default:
        return base;
    }
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  };

  const style: React.CSSProperties = {
    ...getVariantStyles(),
    ...sizeStyles[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
      style={style}
      className={className}
    >
      {Icon && <Icon style={{ width: '16px', height: '16px' }} />}
      {children}
    </motion.button>
  );
}
