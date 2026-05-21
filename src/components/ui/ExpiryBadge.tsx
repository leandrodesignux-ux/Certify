interface ExpiryBadgeProps {
  diasRestantes: number;
}

export function ExpiryBadge({ diasRestantes }: ExpiryBadgeProps) {
  const getStyle = (): { text: string; style: React.CSSProperties } => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      fontSize: '12px',
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 500,
      border: '1px solid',
      borderRadius: '4px',
    };

    if (diasRestantes <= 0) {
      return {
        text: 'VENCIDO',
        style: {
          ...base,
          backgroundColor: 'rgba(255,61,87,0.15)',
          color: '#FF3D57',
          borderColor: 'rgba(255,61,87,0.3)',
        },
      };
    }
    if (diasRestantes <= 15) {
      return {
        text: `${diasRestantes}d`,
        style: {
          ...base,
          backgroundColor: 'rgba(255,61,87,0.1)',
          color: '#FF3D57',
          borderColor: 'rgba(255,61,87,0.3)',
        },
      };
    }
    if (diasRestantes <= 60) {
      return {
        text: `${diasRestantes}d`,
        style: {
          ...base,
          backgroundColor: 'rgba(255,184,0,0.1)',
          color: '#FFB800',
          borderColor: 'rgba(255,184,0,0.3)',
        },
      };
    }
    return {
      text: `${diasRestantes}d`,
      style: {
        ...base,
        backgroundColor: 'rgba(170,255,0,0.1)',
        color: '#AAFF00',
        borderColor: 'rgba(170,255,0,0.3)',
      },
    };
  };

  const result = getStyle();

  return (
    <span style={result.style}>
      {result.text}
    </span>
  );
}
