import type { ReactNode } from 'react';
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
  const variantStyles = {
    primary:
      'bg-[#00E5FF] text-[#0A0E1A] font-semibold hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:bg-[#33EBFF]',
    ghost:
      'border border-[rgba(0,229,255,0.25)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.1)]',
    danger:
      'border border-[#FF3D57] text-[#FF3D57] hover:bg-[rgba(255,61,87,0.1)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
