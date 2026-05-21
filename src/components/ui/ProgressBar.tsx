interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = false }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine gradient based on value
  const getGradient = () => {
    if (clampedValue >= 80) return 'bg-gradient-to-r from-[#00E5FF] to-[#AAFF00]';
    if (clampedValue >= 50) return 'bg-gradient-to-r from-[#00E5FF] to-[#00E5FF]';
    return 'bg-gradient-to-r from-[#FFB800] to-[#FF3D57]';
  };

  return (
    <div className="w-full flex items-center gap-2">
      <div className="h-1.5 flex-1 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getGradient()}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[#8892A4] shrink-0">{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}
