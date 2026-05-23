import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockChartData } from '../../data/mockData';

const AREA_COLORS: Record<string, string> = {
  Operaciones: '#7c4dab',
  Mantención: '#8a9e52',
  Seguridad: '#729362',
  Logística: '#FFB800',
  RRHH: '#FF3D57',
};

// Generate mock trend data for each area
const getMockTrend = (index: number): { direction: 'up' | 'down'; value: number } => {
  const trends = [
    { direction: 'up' as const, value: 3 },
    { direction: 'down' as const, value: 2 },
    { direction: 'up' as const, value: 5 },
    { direction: 'up' as const, value: 2 },
    { direction: 'down' as const, value: 4 },
  ];
  return trends[index % trends.length];
};

export function AreaComplianceCards() {
  const areas = mockChartData.byArea.labels.map((label, i) => ({
    label,
    value: mockChartData.byArea.data[i],
    color: AREA_COLORS[label] || '#9b6ab5',
    rank: i + 1,
    trend: getMockTrend(i),
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
      {areas.map((area, index) => {
        const data = [
          { name: 'compliance', value: area.value },
          { name: 'rest', value: 100 - area.value },
        ];
        return (
          <motion.div
            key={area.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            style={{
              backgroundColor: '#1a1040',
              border: `1px solid ${area.color}30`,
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}
          >
            {/* Rank badge */}
            <span style={{
              position: 'absolute', top: '10px', right: '10px',
              fontSize: '10px', fontWeight: 700,
              color: '#4A5568', fontFamily: '"JetBrains Mono", monospace',
            }}>#{area.rank}</span>

            {/* Mini donut with animated fill */}
            <div style={{ width: '64px', height: '64px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationBegin={index * 200}
                  >
                    <Cell
                      fill={area.color}
                      opacity={0.9}
                      className="animate-fillBar"
                    />
                    <Cell fill="#231455" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Percentage in center */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: area.color, fontFamily: '"JetBrains Mono", monospace' }}>
                  {area.value}%
                </span>
              </div>
            </div>

            <p style={{ fontSize: '11px', fontWeight: 600, color: '#F0F4FF', textAlign: 'center', lineHeight: 1.2 }}>
              {area.label}
            </p>

            {/* Trend indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              color: area.trend.direction === 'up' ? '#729362' : '#FF3D57',
            }}>
              {area.trend.direction === 'up' ? (
                <TrendingUp style={{ width: '10px', height: '10px' }} />
              ) : (
                <TrendingDown style={{ width: '10px', height: '10px' }} />
              )}
              <span>{area.trend.direction === 'up' ? '+' : '-'}{area.trend.value}%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
