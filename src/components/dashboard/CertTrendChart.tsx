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
        backgroundColor: '#ffffff',
        border: '1px solid #d4e0ed',
        borderRadius: '6px',
        color: '#0a0a0a',
        fontSize: '12px',
        padding: '12px',
        boxShadow: 'rgba(71,103,136,0.06) 0px 4px 12px 0px',
      }}>
        <p style={{ fontWeight: 500, marginBottom: '8px', color: '#476788' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: entry.color }} />
            <span style={{ color: '#476788' }}>{entry.name}:</span>
            <span style={{ color: '#0b3558', fontFamily: 'var(--font-mono)' }}>{entry.value}</span>
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
              <stop offset="5%" stopColor="#297a3a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#297a3a" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorVencidas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e5484d" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#e5484d" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#d4e0ed"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#476788', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: '#d4e0ed' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#476788', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: '#d4e0ed' }}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#a6bbd1', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="vigentes"
            name="Renovadas"
            stroke="#297a3a"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorVigentes)"
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="vencidas"
            name="Vencidas"
            stroke="#e5484d"
            strokeWidth={1.5}
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
