export function DaysSparkline({ 
  diasRestantes, 
  barWidth = 60, 
  barHeight = 6, 
  textSize = '12px' 
}: { 
  diasRestantes: number;
  barWidth?: number;
  barHeight?: number;
  textSize?: string;
}) {
  const maxDays = 365;
  const percentage = Math.min(Math.max((diasRestantes / maxDays) * 100, 0), 100);
  const color = diasRestantes <= 0 ? '#FF3D57' : diasRestantes <= 60 ? '#FFB800' : '#729362';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: `${barWidth}px`, 
        height: `${barHeight}px`, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: `${barHeight / 2}px`,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: `${barHeight / 2}px`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontSize: textSize, color, fontWeight: 600 }}>
        {diasRestantes}d
      </span>
    </div>
  );
}
