import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockChartData } from '../../data/mockData';

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#111827] border border-[rgba(0,229,255,0.25)] rounded-sm p-3 backdrop-blur-[12px]">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-[#8892A4] text-sm">{data.name}</span>
        </div>
        <p className="text-[#F0F4FF] font-mono text-lg mt-1">{data.value}</p>
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
      <div className="h-[200px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
            <Tooltip content={<CustomTooltip />} />
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
