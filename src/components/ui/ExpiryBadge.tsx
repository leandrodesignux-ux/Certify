import { useState } from 'react';

interface ExpiryBadgeProps {
  diasRestantes: number;
  fechaVencimiento?: string;
}

export function ExpiryBadge({ diasRestantes, fechaVencimiento }: ExpiryBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStyle = (): { text: string; style: React.CSSProperties; tooltipColor: string } => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      border: '1px solid',
      borderRadius: '4px',
      position: 'relative',
      cursor: 'help',
    };

    if (diasRestantes <= 0) {
      return {
        text: 'VENCIDO',
        style: {
          ...base,
          backgroundColor: 'var(--status-danger-bg)',
          color: 'var(--status-danger)',
          borderColor: 'var(--status-danger-border)',
        },
        tooltipColor: 'var(--status-danger)',
      };
    }
    if (diasRestantes <= 15) {
      return {
        text: `${diasRestantes}d`,
        style: {
          ...base,
          backgroundColor: 'var(--status-danger-bg)',
          color: 'var(--status-danger)',
          borderColor: 'var(--status-danger-border)',
        },
        tooltipColor: 'var(--status-danger)',
      };
    }
    if (diasRestantes <= 60) {
      return {
        text: `${diasRestantes}d`,
        style: {
          ...base,
          backgroundColor: 'var(--status-warning-bg)',
          color: 'var(--status-warning)',
          borderColor: 'var(--status-warning-border)',
        },
        tooltipColor: 'var(--status-warning)',
      };
    }
    return {
      text: `${diasRestantes}d`,
      style: {
        ...base,
        backgroundColor: 'var(--status-success-bg)',
        color: 'var(--status-success)',
        borderColor: 'var(--status-success-border)',
      },
      tooltipColor: 'var(--status-success)',
    };
  };

  const result = getStyle();

  // Calculate expiry date from diasRestantes if not provided
  const getExpiryDate = (): string => {
    if (fechaVencimiento) {
      return new Date(fechaVencimiento).toLocaleDateString('es-CL');
    }
    const date = new Date();
    date.setDate(date.getDate() + diasRestantes);
    return date.toLocaleDateString('es-CL');
  };

  const getDaysText = (): string => {
    if (diasRestantes <= 0) return 'Vencido';
    if (diasRestantes === 1) return '1 día restante';
    return `${diasRestantes} días restantes`;
  };

  return (
    <span
      style={result.style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {result.text}
      {/* Tooltip */}
      <span
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--surface-elevated)',
          color: 'var(--color-text)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-caption)',
          fontFamily: 'var(--font-body)',
          whiteSpace: 'nowrap',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 100,
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? 'visible' : 'hidden',
          transition: 'opacity 0.2s, visibility 0.2s',
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: result.tooltipColor, fontWeight: 600 }}>
          {getDaysText()}
        </span>
        <span style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '2px', fontSize: 'var(--text-micro)' }}>
          Vence el {getExpiryDate()}
        </span>
        {/* Tooltip arrow */}
        <span
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '6px 6px 0',
            borderStyle: 'solid',
            borderColor: `${result.tooltipColor}40 transparent transparent`,
          }}
        />
      </span>
    </span>
  );
}
