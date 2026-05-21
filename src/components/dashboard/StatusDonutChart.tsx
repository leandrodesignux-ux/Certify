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
        backgroundColor: '#1C2333',
        border: '1px solid rgba(0,229,255,0.2)',
        borderRadius: '8px',
        color: '#F0F4FF',
        fontSize: '12px',
        padding: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: data.payload.color }}
          />
          <span style={{ color: '#8892A4' }}>{data.name}</span>
        </div>
        <p style={{ color: '#F0F4FF', fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', marginTop: '4px' }}>{data.value}</p>
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
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 0 6px ${entry.color}40)`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: '#1C2333', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '8px', color: '#F0F4FF', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-[#F0F4FF]">{total}</span>
          <span className="text-xs text-[#8892A4]">Certificaciones</span>
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
              <span className="text-[#F0F4FF] font-mono text-sm">{item.value}</span>
              <span className="text-[#8892A4] text-xs truncate">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
