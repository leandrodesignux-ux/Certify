import { motion } from 'framer-motion';

export interface Segment {
  label: string;
  value: number;
  color: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
}

interface SegmentedBarProps {
  segments: Segment[];
  height?: number;
}

function resolveColor(segment: Segment): string {
  if (!segment.status) return segment.color;
  switch (segment.status) {
    case 'success': return 'var(--status-success)';
    case 'warning': return 'var(--status-warning)';
    case 'danger':  return 'var(--status-danger)';
    case 'neutral': return 'var(--color-primary)';
  }
}

export function SegmentedBar({ segments, height = 8 }: SegmentedBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: '9999px',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-soft)',
        display: 'flex',
        gap: '2px',
      }}
    >
      {segments.map((seg, i) => {
        const pct = total > 0 ? (seg.value / total) * 100 : 0;
        const color = resolveColor(seg);

        return (
          <motion.div
            key={seg.label}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              height: '100%',
              backgroundColor: color,
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

interface SegmentedBarLegendProps {
  segments: Segment[];
  orientation?: 'horizontal' | 'vertical';
}

export function SegmentedBarLegend({
  segments,
  orientation = 'horizontal',
}: SegmentedBarLegendProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: orientation === 'vertical' ? '8px' : '16px',
      }}
    >
      {segments.map((seg) => {
        const color = resolveColor(seg);
        return (
          <div
            key={seg.label}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'var(--text-micro)',
                color: 'var(--color-text-muted)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Total {seg.value} : {seg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
