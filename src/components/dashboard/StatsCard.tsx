import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '../certifications/CertStatCard';

type StatsCardRole = 'primary' | 'neutral' | 'warning' | 'critical';

interface StatsCardProps {
  value: string | number;
  subtitle: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon: LucideIcon;
  role?: StatsCardRole;
  /** @deprecated use role instead */
  color?: string;
  delay?: number;
}


const accentColor: Record<StatsCardRole, string> = {
  primary:  'var(--color-primary)',
  neutral:  'transparent',
  warning:  'var(--status-warning)',
  critical: 'var(--status-danger)',
};

export function StatsCard({
  value,
  subtitle,
  trend,
  icon: Icon,
  role = 'neutral',
  delay = 0,
}: StatsCardProps) {
  const [hovered, setHovered] = useState(false);

  // Always call hook unconditionally; parse numeric target
  const numericValue = typeof value === 'number'
    ? value
    : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const isNumeric = typeof value === 'number' || !isNaN(numericValue);
  const countedValue = useCountUp(isNumeric ? numericValue : 0, 1200);

  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';
  const displayValue = isNumeric ? `${countedValue}${suffix}` : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--surface-card)',
        border: `1px solid ${hovered ? 'var(--border-strong)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        paddingTop: 'var(--space-lg)',
        paddingBottom: 'var(--space-lg)',
        paddingLeft: 'calc(var(--space-lg) + 3px)',
        paddingRight: 'var(--space-lg)',
      }}
    >
      {/* Acento lateral izquierdo */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: '3px',
        backgroundColor: accentColor[role],
        borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
      }} />

      {/* Top row: eyebrow + icono */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: 'var(--space-sm)' }}>
        <p style={{
          fontSize: 'var(--text-eyebrow)',
          fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          lineHeight: 'var(--leading-eyebrow)',
          margin: 0,
        }}>
          {subtitle}
        </p>
        <div style={{
          width: '36px', height: '36px', flexShrink: 0,
          backgroundColor: 'var(--surface-soft)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
        </div>
      </div>

      {/* Número grande */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-display)',
        fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
        lineHeight: 'var(--leading-display)',
        color: 'var(--color-brand)',
        letterSpacing: 'var(--tracking-tight)',
        fontFeatureSettings: '"tnum"',
        margin: 0,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      }}>
        {displayValue}
      </p>

      {/* Trend pill */}
      {trend && (
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            fontSize: 'var(--text-micro)',
            fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
            color: trend.direction === 'up' ? 'var(--status-success)' : 'var(--status-danger)',
            backgroundColor: trend.direction === 'up' ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
          }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        </div>
      )}
    </motion.div>
  );
}
