import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockChartData } from '../../data/mockData';

const AREA_COLOR = '#006bff';

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
    color: AREA_COLOR,
    rank: i + 1,
    trend: getMockTrend(i),
  }));

  return (
    <div style={{ overflowX: 'auto', marginLeft: '-4px', paddingLeft: '4px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: '12px' }}>
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
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
              minWidth: 0,
            }}
          >
            {/* Rank badge */}
            <span style={{
              position: 'absolute', top: '10px', right: '10px',
              fontSize: '10px', fontWeight: 500,
              color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)',
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
                    <Cell fill={AREA_COLOR} />
                    <Cell fill="#e7edf6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Percentage in center */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 'var(--text-micro)', fontWeight: 600, color: '#006bff', fontFamily: 'var(--font-mono)' }}>
                  {area.value}%
                </span>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--color-brand)', textAlign: 'center', lineHeight: 1.2 }}>
              {area.label}
            </p>

            {/* Trend indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              color: area.trend.direction === 'up' ? '#297a3a' : '#e5484d',
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
    </div>
  );
}
