import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ComplianceGaugeProps {
  score: number;
}

export function ComplianceGauge({ score }: ComplianceGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // Calculate color based on score with gradient logic
  const getColor = () => {
    if (clampedScore >= 80) return '#297a3a'; // Green
    if (clampedScore >= 60) return '#b25000'; // Warning
    return '#e5484d'; // Danger
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
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />
            {/* Background track */}
            <RadialBar
              background={{ fill: '#f5f5f5' }}
              dataKey="value"
              cornerRadius={6}
              fill={getColor()}
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
            className="font-display"
            style={{ color: '#171717', fontWeight: 600, fontSize: '2.25rem', letterSpacing: '-0.04em' }}
          >
            {Math.round(clampedScore)}%
          </motion.span>
          <span className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Cumplimiento</span>
        </div>
      </div>
    </div>
  );
}
