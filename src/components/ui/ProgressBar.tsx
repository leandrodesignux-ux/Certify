interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = false }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine color based on value
  const getColor = () => {
    if (clampedValue >= 80) return '#00E676'; // success
    if (clampedValue >= 60) return '#FFB800'; // warning
    return '#FF3D57'; // danger
  };

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ height: '6px', flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${clampedValue}%`,
            height: '100%',
            backgroundColor: getColor(),
            borderRadius: '9999px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: '12px', color: '#8892A4', flexShrink: 0 }}>{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}
