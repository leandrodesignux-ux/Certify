const tooltipStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #ebebeb',
  borderRadius: '6px',
  padding: '12px',
  boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px 0px',
  minWidth: '160px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#4d4d4d',
  marginBottom: '4px',
  fontWeight: 500,
};

const valueStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  color: '#171717',
  fontFamily: 'var(--font-display)',
  letterSpacing: '-0.04em',
  lineHeight: 1,
};

const captionStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#666666',
  marginTop: '4px',
};

export function CustomBarTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{payload[0].value}%</p>
      <p style={captionStyle}>Cumplimiento promedio</p>
    </div>
  );
}

export function CustomPieTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div style={tooltipStyle}>
      <p style={labelStyle}>{data.name}</p>
      <p style={valueStyle}>{data.value}</p>
      <p style={captionStyle}>certificaciones</p>
    </div>
  );
}
