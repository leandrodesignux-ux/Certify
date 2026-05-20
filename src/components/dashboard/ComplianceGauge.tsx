import { motion } from 'framer-motion';

interface ComplianceGaugeProps {
  score: number;
}

export function ComplianceGauge({ score }: ComplianceGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = () => {
    if (clampedScore >= 90) return { stroke: '#00E5FF', glow: 'drop-shadow(0 0 6px rgba(0,229,255,0.5))' };
    if (clampedScore >= 70) return { stroke: '#AAFF00', glow: 'drop-shadow(0 0 6px rgba(170,255,0,0.5))' };
    if (clampedScore >= 50) return { stroke: '#FFB800', glow: 'drop-shadow(0 0 6px rgba(255,184,0,0.5))' };
    return { stroke: '#FF3D57', glow: 'drop-shadow(0 0 6px rgba(255,61,87,0.5))' };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] h-[120px]">
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r={normalizedRadius}
            fill="none"
            stroke="#1C2333"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference / 2}
          />
          {/* Progress arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={normalizedRadius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset + circumference / 2 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: color.glow }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="font-display text-4xl font-bold"
            style={{ color: color.stroke }}
          >
            {Math.round(clampedScore)}%
          </motion.span>
          <span className="text-xs text-[#8892A4] mt-1">Cumplimiento</span>
        </div>
      </div>
    </div>
  );
}
