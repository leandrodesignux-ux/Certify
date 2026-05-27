const tooltipStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--border-brand-hover)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-md)',
  boxShadow: 'var(--shadow-brand)',
  minWidth: '160px',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--text-small)',
  color: 'var(--color-text-muted)',
  marginBottom: 'var(--space-xs)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle: React.CSSProperties = {
  fontSize: 'var(--text-h2)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-purple-mid)',
  fontFamily: 'var(--font-display)',
  lineHeight: 1,
};

const captionStyle: React.CSSProperties = {
  fontSize: 'var(--text-micro)',
  color: 'var(--color-text-muted)',
  marginTop: 'var(--space-xs)',
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
      <p style={{ ...valueStyle, color: data.payload.color }}>{data.value}</p>
      <p style={captionStyle}>certificaciones</p>
    </div>
  );
}
