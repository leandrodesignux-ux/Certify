import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { mockChartData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] border border-[rgba(0,229,255,0.25)] rounded-sm p-3 backdrop-blur-[12px]">
        <p className="text-[#F0F4FF] font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#8892A4]">{entry.name}:</span>
            <span className="text-[#F0F4FF] font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CertTrendChart() {
  const data = mockChartData.trendMonthly.labels.map((month, index) => ({
    month,
    vigentes: mockChartData.trendMonthly.datasets[1].data[index],
    vencidas: mockChartData.trendMonthly.datasets[0].data[index],
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVigentes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorVencidas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF3D57" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF3D57" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,229,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8892A4', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8892A4', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="vigentes"
            name="Renovadas"
            stroke="#00E5FF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVigentes)"
          />
          <Area
            type="monotone"
            dataKey="vencidas"
            name="Vencidas"
            stroke="#FF3D57"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVencidas)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
