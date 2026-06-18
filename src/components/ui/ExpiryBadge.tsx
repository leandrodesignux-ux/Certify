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
          backgroundColor: 'rgba(229,72,77,0.08)',
          color: '#e5484d',
          borderColor: 'rgba(229,72,77,0.2)',
        },
        tooltipColor: '#e5484d',
      };
    }
    if (diasRestantes <= 15) {
      return {
        text: `${diasRestantes}d`,
        style: {
          ...base,
          backgroundColor: 'rgba(229,72,77,0.08)',
          color: '#e5484d',
          borderColor: 'rgba(229,72,77,0.2)',
        },
        tooltipColor: '#e5484d',
      };
    }
    if (diasRestantes <= 60) {
      return {
        text: `${diasRestantes}d`,
        style: {
          ...base,
          backgroundColor: 'rgba(178,80,0,0.08)',
          color: '#b25000',
          borderColor: 'rgba(178,80,0,0.2)',
        },
        tooltipColor: '#b25000',
      };
    }
    return {
      text: `${diasRestantes}d`,
      style: {
        ...base,
        backgroundColor: 'rgba(41,122,58,0.08)',
        color: '#297a3a',
        borderColor: 'rgba(41,122,58,0.2)',
      },
        tooltipColor: '#297a3a',
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
          backgroundColor: '#ffffff',
          color: '#171717',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'var(--font-body)',
          whiteSpace: 'nowrap',
          border: '1px solid #ebebeb',
          boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px 0px',
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
        <span style={{ color: '#666666', display: 'block', marginTop: '2px', fontSize: '11px' }}>
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
