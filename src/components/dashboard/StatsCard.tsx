import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  value: string | number;
  subtitle: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon: LucideIcon;
  color: 'electric' | 'volt' | 'warning' | 'danger' | 'success';
  delay?: number;
}

const colorMap = {
  electric: {
    bg: 'bg-[rgba(0,229,255,0.1)]',
    text: 'text-[#00E5FF]',
    color: '#00E5FF',
    glow: 'shadow-[0_0_12px_rgba(0,229,255,0.3)]',
  },
  volt: {
    bg: 'bg-[rgba(170,255,0,0.1)]',
    text: 'text-[#AAFF00]',
    color: '#AAFF00',
    glow: 'shadow-[0_0_12px_rgba(170,255,0,0.3)]',
  },
  warning: {
    bg: 'bg-[rgba(255,184,0,0.1)]',
    text: 'text-[#FFB800]',
    color: '#FFB800',
    glow: 'shadow-[0_0_12px_rgba(255,184,0,0.3)]',
  },
  danger: {
    bg: 'bg-[rgba(255,61,87,0.1)]',
    text: 'text-[#FF3D57]',
    color: '#FF3D57',
    glow: 'shadow-[0_0_12px_rgba(255,61,87,0.3)]',
  },
  success: {
    bg: 'bg-[rgba(0,230,118,0.1)]',
    text: 'text-[#00E676]',
    color: '#00E676',
    glow: 'shadow-[0_0_12px_rgba(0,230,118,0.3)]',
  },
};

export function StatsCard({
  value,
  subtitle,
  trend,
  icon: Icon,
  color,
  delay = 0,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className="bg-[#111827]/80 backdrop-blur-[12px] border border-[rgba(0,229,255,0.1)] rounded-sm p-5 h-[140px] flex flex-col justify-between hover:border-[rgba(0,229,255,0.2)] hover:shadow-[0_0_16px_rgba(0,229,255,0.08)] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-sm ${colors.bg} ${colors.glow}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs ${
              trend.direction === 'up' ? 'text-[#00E676]' : 'text-[#FF3D57]'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {trend.value}
          </div>
        )}
      </div>

      <div>
        <p style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '36px', fontWeight: 700, lineHeight: 1, marginTop: '8px', color: colors.color }}>
          {value}
        </p>
        <p className="text-[#8892A4] text-sm mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}
