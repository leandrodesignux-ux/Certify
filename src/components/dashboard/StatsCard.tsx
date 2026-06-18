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
  electric: { color: '#171717' },
  volt:     { color: '#297a3a' },
  warning:  { color: '#b25000' },
  danger:   { color: '#e5484d' },
  success:  { color: '#297a3a' },
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
        backgroundColor: '#ffffff',
        border: '1px solid #ebebeb',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
        height: '150px',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: '#d4d4d4' }}
    >
      {/* Top row: icon + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ backgroundColor: '#f5f5f5', borderRadius: '6px', padding: '8px' }}>
          <Icon style={{ width: '18px', height: '18px', color: colors.color }} strokeWidth={1.5} />
        </div>
        {trend && (
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: trend.direction === 'up' ? 'var(--kpi-trend-up)' : 'var(--kpi-trend-down)',
            backgroundColor: trend.direction === 'up' ? 'var(--status-ok-bg)' : 'var(--status-danger-bg)',
            borderRadius: '9999px', padding: '3px 8px',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {/* Bottom: number + label */}
      <div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '42px', fontWeight: 600, lineHeight: 1,
          color: '#171717', marginBottom: '4px',
          letterSpacing: '-0.04em',
          maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {typeof value === 'string' && value.includes('%') ? `${displayValue}%` : displayValue}
        </p>
        <p style={{ fontSize: '12px', color: '#666666', fontWeight: 500 }}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
