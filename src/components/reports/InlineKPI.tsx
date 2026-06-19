import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '../certifications/CertStatCard';

interface InlineKPIProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  animated?: boolean;
}

export function InlineKPI({
  icon: Icon,
  label,
  value,
  suffix,
  trendLabel,
  trendDirection = 'neutral',
  animated = true,
}: InlineKPIProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const isNumeric = typeof value === 'number' || !isNaN(numericValue);
  const animatedValue = useCountUp(isNumeric && animated ? numericValue : 0, 1.0);
  const displayValue = isNumeric && animated ? animatedValue : value;

  const trendColor =
    trendDirection === 'up'
      ? 'var(--status-success)'
      : trendDirection === 'down'
      ? 'var(--status-danger)'
      : 'var(--color-text-muted)';

  const trendPrefix =
    trendDirection === 'up' ? '↑ ' : trendDirection === 'down' ? '↓ ' : '· ';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-soft)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon
          style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)' }}
          strokeWidth={1.5}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text-muted)',
          fontWeight: 'var(--weight-regular)',
          marginTop: '8px',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>

      {/* Value + Suffix */}
      <span
        style={{
          fontSize: '26px',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--color-brand)',
          fontFamily: 'var(--font-display)',
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 1.1,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {displayValue}
        {suffix && <span>{suffix}</span>}
      </span>

      {/* Trend label */}
      {trendLabel && (
        <span
          style={{
            fontSize: 'var(--text-micro)',
            fontWeight: 'var(--weight-medium)',
            color: trendColor,
          }}
        >
          {trendPrefix}{trendLabel}
        </span>
      )}
    </div>
  );
}
