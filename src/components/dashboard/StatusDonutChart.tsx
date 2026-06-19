import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockChartData } from '../../data/mockData';

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: data.payload.color }} />
          <span style={{ color: '#476788' }}>{data.name}</span>
        </div>
        <p style={{ color: '#0b3558', fontFamily: 'var(--font-mono)', fontSize: '14px', marginTop: '4px' }}>{data.value}</p>
      </div>
    );
  }
  return null;
};

export function StatusDonutChart() {
  const data = mockChartData.statusDonut.labels.map((label, index) => ({
    name: label,
    value: mockChartData.statusDonut.data[index],
    color: mockChartData.statusDonut.colors[index],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center">
      <div style={{ height: '280px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ backgroundColor: 'transparent' }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl" style={{ color: '#0b3558', fontWeight: 600, letterSpacing: '-0.04em' }}>{total}</span>
          <span className="text-xs" style={{ color: '#476788' }}>Certificaciones</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-[280px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
              <span className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
