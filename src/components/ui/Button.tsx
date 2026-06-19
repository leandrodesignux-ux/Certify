import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const rippleColor: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'rgba(255,255,255,0.25)',
  secondary: 'rgba(0,107,255,0.10)',
  ghost:     'rgba(0,107,255,0.10)',
  danger:    'rgba(229,72,77,0.10)',
  link:      'rgba(0,107,255,0.10)',
};


export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hovered, setHovered] = useState(false);

  const isDisabled = disabled || loading;

  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--radius-sm)',
      transition: 'all var(--transition-fast)',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
      position: 'relative',
      overflow: 'hidden',
    };

    if (isDisabled) {
      if (variant === 'primary') {
        return {
          ...base,
          backgroundColor: 'var(--border-default)',
          color: '#ffffff',
          border: '1px solid var(--border-default)',
        };
      }
      return {
        ...base,
        backgroundColor: 'transparent',
        color: 'var(--color-text-faint)',
        border: variant === 'link' || variant === 'ghost' ? '1px solid transparent' : '1px solid var(--border-default)',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: hovered ? 'var(--color-primary-hover)' : 'var(--color-primary)',
          color: '#ffffff',
          border: '1px solid var(--color-primary)',
          boxShadow: hovered ? 'none' : 'var(--shadow-sm)',
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: hovered ? 'var(--color-brand-soft)' : 'transparent',
          color: 'var(--color-brand)',
          border: '1px solid var(--color-brand)',
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: hovered ? 'var(--surface-soft)' : 'transparent',
          color: 'var(--color-text)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: hovered ? 'var(--status-danger-bg)' : 'transparent',
          color: 'var(--status-danger)',
          border: '1px solid var(--status-danger)',
        };
      case 'link':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: 'none',
          padding: '0',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
        };
      default:
        return base;
    }
  };

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
    sm: { padding: '6px 12px',  fontSize: '13px', minHeight: '32px' },
    md: { padding: '8px 16px',  fontSize: '14px', minHeight: '40px' },
    lg: { padding: '12px 24px', fontSize: '16px', minHeight: '48px' },
  };

  const style: React.CSSProperties = {
    ...getVariantStyles(),
    ...(variant === 'link' ? {} : sizeStyles[size]),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: getVariantStyles().border,
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const newRipple: Ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      style={style}
      className={`focus-ring ${className}`}
      onMouseEnter={() => { if (!isDisabled) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: '8px',
              height: '8px',
              marginLeft: '-4px',
              marginTop: '-4px',
              borderRadius: '50%',
              backgroundColor: rippleColor[variant],
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      {loading && (
        <div style={{
          width: '15px', height: '15px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          position: 'relative', zIndex: 1,
        }} />
      )}
      {!loading && Icon && (
        <Icon style={{ width: '15px', height: '15px', position: 'relative', zIndex: 1, flexShrink: 0 }} strokeWidth={1.5} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
}
