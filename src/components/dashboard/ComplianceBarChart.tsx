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
        backgroundColor: '#ffffff',
        border: '1px solid #d4e0ed',
        borderRadius: '6px',
        color: '#0a0a0a',
        fontSize: '12px',
        padding: '12px',
        boxShadow: 'rgba(71,103,136,0.06) 0px 4px 12px 0px',
      }}>
        <p style={{ fontWeight: 500, marginBottom: '4px', color: '#476788' }}>{data.label}</p>
        <p style={{ color: '#0b3558', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>{data.value}%</p>
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
            tick={{ fill: '#476788', fontSize: 10, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: '#d4e0ed' }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#476788', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: '#d4e0ed' }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(71,103,136,0.04)' }}
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
              fill="#476788"
              fontSize={11}
              fontFamily="var(--font-mono)"
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
