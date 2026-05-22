import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  value: string | number;
  subtitle: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon: LucideIcon;
  color: 'electric' | 'volt' | 'warning' | 'danger' | 'success';
  delay?: number;
}

// Custom hook for count-up animation
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const colorMap = {
  electric: {
    bg: 'bg-[rgba(124,77,171,0.1)]',
    text: 'text-[#7c4dab]',
    color: '#7c4dab',
    glow: 'shadow-[0_0_12px_rgba(124,77,171,0.3)]',
  },
  volt: {
    bg: 'bg-[rgba(138,158,82,0.1)]',
    text: 'text-[#8a9e52]',
    color: '#8a9e52',
    glow: 'shadow-[0_0_12px_rgba(138,158,82,0.3)]',
  },
  warning: {
    bg: 'bg-[rgba(255,184,0,0.1)]',
    text: 'text-[#FFB800]',
    color: '#FFB800',
    glow: 'shadow-[0_0_12px_rgba(255,184,0,0.3)]',
  },
  danger: {
    bg: 'bg-[rgba(255,61,87,0.1)]',
    text: 'text-[#FF3D57]',
    color: '#FF3D57',
    glow: 'shadow-[0_0_12px_rgba(255,61,87,0.3)]',
  },
  success: {
    bg: 'bg-[rgba(114,147,98,0.1)]',
    text: 'text-[#729362]',
    color: '#729362',
    glow: 'shadow-[0_0_12px_rgba(114,147,98,0.3)]',
  },
};

export function StatsCard({
  value,
  subtitle,
  trend,
  icon: Icon,
  color,
  delay = 0,
}: StatsCardProps) {
  const colors = colorMap[color];

  // Parse numeric value for count-up animation
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const displayValue = typeof value === 'number' || !isNaN(numericValue)
    ? useCountUp(numericValue, 1200)
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        backgroundColor: '#1a1040',
        border: `1px solid ${colors.color}22`,
        borderRadius: '6px',
        padding: '20px',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow accent top-right */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle at top right, ${colors.color}18, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top row: icon + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ backgroundColor: `${colors.color}18`, borderRadius: '10px', padding: '8px' }}>
          <Icon style={{ width: '18px', height: '18px', color: colors.color }} />
        </div>
        {trend && (
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: trend.direction === 'up' ? '#8fb87a' : '#FF3D57',
            backgroundColor: trend.direction === 'up' ? 'rgba(114,147,98,0.12)' : 'rgba(255,61,87,0.1)',
            borderRadius: '12px', padding: '3px 8px',
          }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {/* Bottom: number + label */}
      <div>
        <p style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: '42px', fontWeight: 700, lineHeight: 1,
          color: '#F0F4FF', marginBottom: '4px',
        }}>
          {typeof value === 'string' && value.includes('%') ? `${displayValue}%` : displayValue}
        </p>
        <p style={{ fontSize: '12px', color: '#8892A4', fontWeight: 500 }}>{subtitle}</p>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '2px',
        background: `linear-gradient(to right, ${colors.color}60, transparent)`,
      }} />
    </motion.div>
  );
}
