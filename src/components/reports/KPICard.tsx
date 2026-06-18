import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  delay?: number;
}

export function KPICard({ title, value, subtitle, icon: Icon, color: _color, trend = 'neutral', trendLabel, delay = 0 }: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up'
    ? 'var(--kpi-trend-up)'
    : trend === 'down'
      ? 'var(--kpi-trend-down)'
      : 'var(--kpi-trend-neutral)';

  return (
    <motion.div custom={delay} variants={sectionVariants} initial="hidden" animate="visible" className="h-full">
      <Card variant="glass" padding="lg" hover={false} className="h-full flex flex-col justify-between" style={{ borderTop: '3px solid #ebebeb', minHeight: '148px' }}>
        <div className="flex items-start justify-between">
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)', lineHeight: 1.3 }}>
            {title}
          </p>
          <div className="p-2.5 flex-shrink-0" style={{ backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
            <Icon className="w-4 h-4" style={{ color: '#4d4d4d' }} strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <p
            className="font-display"
            style={{ fontSize: 'clamp(22px, 5vw, 32px)', color: '#171717', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '4px' }}
          >
            {value}
          </p>
          <div className="flex items-center gap-1.5">
            {trendLabel && (
              <>
                <TrendIcon style={{ width: '12px', height: '12px', color: trendColor, flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-micro)', color: trendColor }}>{trendLabel}</span>
                <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)' }}>·</span>
              </>
            )}
            {subtitle && (
              <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)' }}>{subtitle}</span>
            )}
          </div>
          {typeof value === 'string' && value.endsWith('%') && (
            <div style={{ height: '2px', backgroundColor: '#ebebeb', borderRadius: '1px', marginTop: '10px' }}>
              <div style={{ height: '2px', width: value, backgroundColor: '#171717', borderRadius: '1px', maxWidth: '100%' }} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
