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
  const color = diasRestantes <= 0 ? '#e5484d' : diasRestantes <= 60 ? '#b25000' : '#297a3a';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: `${barWidth}px`, 
        height: `${barHeight}px`, 
        backgroundColor: '#ebebeb', 
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
