import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { mockChartData } from '../../data/mockData';

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: { label: string; value: number } }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--color-surface-alt)',
        border: '1px solid var(--border-brand-hover)',
        borderRadius: 'var(--radius-md)',
        color: '#F0F4FF',
        fontSize: '12px',
        padding: '12px',
      }}>
        <p style={{ fontWeight: 500, marginBottom: '4px' }}>{data.label}</p>
        <p style={{ color: '#9b6ab5', fontFamily: '"JetBrains Mono", monospace', fontSize: '14px' }}>{data.value}%</p>
      </div>
    );
  }
  return null;
};

export function ComplianceBarChart() {
  const data = mockChartData.byArea.labels.map((label, index) => ({
    label,
    value: mockChartData.byArea.data[index],
    color: mockChartData.byArea.colors[index],
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} style={{ backgroundColor: 'transparent' }}>
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--chart-axis-text)', fontSize: 10 }}
            axisLine={{ stroke: 'var(--border-brand)' }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: 'var(--chart-axis-text)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border-brand)' }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(91,34,119,0.08)' }}
          />
          <Bar
            dataKey="value"
            radius={[2, 2, 0, 0]}
            maxBarSize={50}
            isAnimationActive={true}
            animationDuration={1000}
          >
            <LabelList
              dataKey="value"
              position="top"
              fill="var(--color-text-primary)"
              fontSize={11}
              fontFamily="JetBrains Mono"
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(91,34,119,0.3))',
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
