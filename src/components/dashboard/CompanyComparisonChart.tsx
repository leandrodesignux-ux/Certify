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
        backgroundColor: '#ffffff',
        border: '1px solid #ebebeb',
        borderRadius: '6px',
        color: '#171717',
        fontSize: '12px',
        padding: '12px',
        boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px 0px',
      }}>
        <p style={{ fontWeight: 500, marginBottom: '8px', color: '#4d4d4d' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: entry.color }} />
            <span style={{ color: '#666666' }}>{entry.name}:</span>
            <span style={{ color: '#171717', fontFamily: 'var(--font-mono)' }}>{entry.value}%</span>
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
            stroke="#ebebeb"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#666666', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: '#ebebeb' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#666666', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={{ stroke: '#ebebeb' }}
            tickLine={false}
            domain={[60, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="corpa"
            name="Corpa Andina"
            stroke="#171717"
            strokeWidth={1.5}
            dot={{ fill: '#171717', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#171717', stroke: '#ffffff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="vial"
            name="Vial Norte"
            stroke="#4d4d4d"
            strokeWidth={1.5}
            dot={{ fill: '#4d4d4d', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#4d4d4d', stroke: '#ffffff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="agro"
            name="Agroindustrial"
            stroke="#a8a8a8"
            strokeWidth={1.5}
            dot={{ fill: '#a8a8a8', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#a8a8a8', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
