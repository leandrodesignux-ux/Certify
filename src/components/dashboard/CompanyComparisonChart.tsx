import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#231455',
        border: '1px solid rgba(91,34,119,0.4)',
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
            <span style={{ color: '#F0F4FF', fontFamily: '"JetBrains Mono", monospace' }}>{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CompanyComparisonChart() {
  const months = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];
  
  const data = months.map((month, index) => ({
    month,
    corpa: [82, 83, 85, 84, 86, 87][index],
    vial: [71, 72, 74, 75, 77, 78][index],
    agro: [65, 67, 68, 70, 72, 73][index],
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ backgroundColor: 'transparent' }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#8892A4', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(91,34,119,0.2)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8892A4', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(91,34,119,0.2)' }}
            tickLine={false}
            domain={[60, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: '#231455', border: '1px solid rgba(91,34,119,0.4)', borderRadius: '8px', color: '#F0F4FF', fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="corpa"
            name="Corpa Andina"
            stroke="#7c4dab"
            strokeWidth={2}
            dot={{ fill: '#7c4dab', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#7c4dab', stroke: '#0d0920', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="vial"
            name="Vial Norte"
            stroke="#8a9e52"
            strokeWidth={2}
            dot={{ fill: '#8a9e52', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#8a9e52', stroke: '#0d0920', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="agro"
            name="Agroindustrial"
            stroke="#FFB800"
            strokeWidth={2}
            dot={{ fill: '#FFB800', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#FFB800', stroke: '#0A0E1A', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
