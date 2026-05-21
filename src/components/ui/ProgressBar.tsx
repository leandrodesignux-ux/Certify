import { motion } from 'framer-motion';

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
      <div className="h-1.5 flex-1 bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
          className={`h-full rounded-full ${getGradient()}`}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[#8892A4] shrink-0">{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}
