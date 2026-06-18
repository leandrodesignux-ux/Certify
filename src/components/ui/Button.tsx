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
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
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
  loading = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--radius-sm)',
      transition: 'all 0.15s ease',
      position: 'relative',
      overflow: 'hidden',
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: '#171717',
          color: '#ffffff',
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          border: '1px solid #171717',
          color: '#171717',
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: 'transparent',
          border: '1px solid #e5484d',
          color: '#e5484d',
        };
      default:
        return base;
    }
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px', minHeight: '36px' },
    md: { padding: '8px 16px', fontSize: '14px', minHeight: '44px' },
    lg: { padding: '12px 24px', fontSize: '16px', minHeight: '52px' },
  };

  const isDisabled = disabled || loading;
  
  const style: React.CSSProperties = {
    ...getVariantStyles(),
    ...sizeStyles[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.01 }}
      whileTap={isDisabled ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.1 }}
      style={style}
      className={`focus-ring ${className}`}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
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
              backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.2)' : 'rgba(23,23,23,0.08)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            position: 'relative',
            zIndex: 1,
          }}
        />
      )}
      {!loading && Icon && <Icon style={{ width: '16px', height: '16px', position: 'relative', zIndex: 1 }} />}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
}
