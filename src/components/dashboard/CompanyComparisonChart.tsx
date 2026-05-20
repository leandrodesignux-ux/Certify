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
      <div className="bg-[#111827] border border-[rgba(0,229,255,0.25)] rounded-sm p-3 backdrop-blur-[12px]">
        <p className="text-[#F0F4FF] font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#8892A4]">{entry.name}:</span>
            <span className="text-[#F0F4FF] font-mono">{entry.value}%</span>
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
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            domain={[60, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="corpa"
            name="Corpa Andina"
            stroke="#00E5FF"
            strokeWidth={2}
            dot={{ fill: '#00E5FF', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#00E5FF', stroke: '#0A0E1A', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="vial"
            name="Vial Norte"
            stroke="#AAFF00"
            strokeWidth={2}
            dot={{ fill: '#AAFF00', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#AAFF00', stroke: '#0A0E1A', strokeWidth: 2 }}
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
