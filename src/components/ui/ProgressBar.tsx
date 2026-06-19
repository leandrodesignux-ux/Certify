interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  status?: 'vigente' | 'proximo' | 'vencido';
}

export function ProgressBar({ value, showLabel = false, status }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const getFillColor = () => {
    if (status === 'vigente')  return 'var(--status-success)';
    if (status === 'proximo')  return 'var(--status-warning)';
    if (status === 'vencido')  return 'var(--status-danger)';
    return 'var(--color-primary)';
  };

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ height: '4px', flex: 1, backgroundColor: 'var(--surface-soft)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div
          className="animate-fill-bar"
          style={{
            '--target-width': `${clampedValue}%`,
            width: `${clampedValue}%`,
            height: '100%',
            backgroundColor: getFillColor(),
            borderRadius: 'var(--radius-full)',
          } as React.CSSProperties}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', flexShrink: 0 }}>{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}
