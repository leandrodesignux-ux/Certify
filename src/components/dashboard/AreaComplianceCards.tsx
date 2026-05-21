import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockChartData } from '../../data/mockData';

const AREA_COLORS: Record<string, string> = {
  Operaciones: '#00E5FF',
  Mantención: '#AAFF00',
  Seguridad: '#00E676',
  Logística: '#FFB800',
  RRHH: '#FF3D57',
};

export function AreaComplianceCards() {
  const areas = mockChartData.byArea.labels.map((label, i) => ({
    label,
    value: mockChartData.byArea.data[i],
    color: AREA_COLORS[label] || '#00E5FF',
    rank: i + 1,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
      {areas.map((area) => {
        const data = [
          { name: 'compliance', value: area.value },
          { name: 'rest', value: 100 - area.value },
        ];
        return (
          <div
            key={area.label}
            style={{
              backgroundColor: '#111827',
              border: `1px solid ${area.color}20`,
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}
          >
            {/* Rank badge — como #13, #79 de la imagen */}
            <span style={{
              position: 'absolute', top: '10px', right: '10px',
              fontSize: '10px', fontWeight: 700,
              color: '#4A5568', fontFamily: '"JetBrains Mono", monospace',
            }}>#{area.rank}</span>

            {/* Mini donut */}
            <div style={{ width: '64px', height: '64px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius="55%" outerRadius="85%"
                    startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    <Cell fill={area.color} opacity={0.9} />
                    <Cell fill="#1C2333" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Percentage in center */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: area.color, fontFamily: '"JetBrains Mono", monospace' }}>
                  {area.value}%
                </span>
              </div>
            </div>

            <p style={{ fontSize: '11px', fontWeight: 600, color: '#F0F4FF', textAlign: 'center', lineHeight: 1.2 }}>
              {area.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
