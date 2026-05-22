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
      <div style={{
        backgroundColor: '#1C2333',
        border: '1px solid rgba(0,229,255,0.2)',
        borderRadius: '8px',
        color: '#F0F4FF',
        fontSize: '12px',
        padding: '12px',
      }}>
        <p style={{ fontWeight: 500, marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <div
              style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: entry.color }}
            />
            <span style={{ color: '#8892A4' }}>{entry.name}:</span>
            <span style={{ color: '#F0F4FF', fontFamily: '"JetBrains Mono", monospace' }}>{entry.value}</span>
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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ backgroundColor: 'transparent' }}>
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
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#8892A4', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(0,229,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8892A4', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(0,229,255,0.1)' }}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={{ backgroundColor: '#1C2333', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '6px', color: '#F0F4FF' }}
            cursor={{ stroke: 'rgba(0,229,255,0.2)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="vigentes"
            name="Renovadas"
            stroke="#00E5FF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVigentes)"
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="vencidas"
            name="Vencidas"
            stroke="#FF3D57"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVencidas)"
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
