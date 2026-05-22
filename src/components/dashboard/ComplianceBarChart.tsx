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
        backgroundColor: '#1C2333',
        border: '1px solid rgba(0,229,255,0.2)',
        borderRadius: '8px',
        color: '#F0F4FF',
        fontSize: '12px',
        padding: '12px',
      }}>
        <p style={{ fontWeight: 500, marginBottom: '4px' }}>{data.label}</p>
        <p style={{ color: '#00E5FF', fontFamily: '"JetBrains Mono", monospace', fontSize: '14px' }}>{data.value}%</p>
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
            tick={{ fill: '#8892A4', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(0,229,255,0.1)' }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#8892A4', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(0,229,255,0.1)' }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0,229,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1C2333', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '6px', color: '#F0F4FF' }}
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
              fill="#F0F4FF"
              fontSize={11}
              fontFamily="JetBrains Mono"
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.2))',
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
