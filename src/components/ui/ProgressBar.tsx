interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = false }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine color based on value
  const getColor = () => {
    if (clampedValue >= 80) return '#297a3a'; // success
    if (clampedValue >= 60) return '#b25000'; // warning
    return '#e5484d'; // danger
  };

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ height: '4px', flex: 1, backgroundColor: '#ebebeb', borderRadius: '9999px', overflow: 'hidden' }}>
        <div
          className="animate-fill-bar"
          style={{
            '--target-width': `${clampedValue}%`,
            width: `${clampedValue}%`,
            height: '100%',
            backgroundColor: getColor(),
            borderRadius: '9999px',
          } as React.CSSProperties}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: '12px', color: '#666666', flexShrink: 0 }}>{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}
