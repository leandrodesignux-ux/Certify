import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ComplianceGaugeProps {
  score: number;
}

export function ComplianceGauge({ score }: ComplianceGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Calculate color based on score with gradient logic
  const getColor = () => {
    if (clampedScore >= 80) return '#00E676'; // Green
    if (clampedScore >= 60) return '#FFB800'; // Yellow
    return '#FF3D57'; // Red
  };

  const data = [{ name: 'Compliance', value: clampedScore, fill: getColor() }];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF3D57" />
                <stop offset="60%" stopColor="#FFB800" />
                <stop offset="100%" stopColor="#00E676" />
              </linearGradient>
            </defs>
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />
            {/* Background track */}
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              fill="#1C2333"
            />
            {/* Progress bar with gradient */}
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill="url(#gaugeGradient)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="font-display text-4xl font-bold"
            style={{ color: getColor() }}
          >
            {Math.round(clampedScore)}%
          </motion.span>
          <span className="text-xs text-[#8892A4] mt-1">Cumplimiento</span>
        </div>
      </div>
    </div>
  );
}
