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
      fontFamily: '"JetBrains Mono", monospace',
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
          backgroundColor: 'rgba(255,61,87,0.15)',
          color: '#FF3D57',
          borderColor: 'rgba(255,61,87,0.3)',
        },
        tooltipColor: '#FF3D57',
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
        tooltipColor: '#FF3D57',
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
        tooltipColor: '#FFB800',
      };
    }
    return {
      text: `${diasRestantes}d`,
      style: {
        ...base,
        backgroundColor: 'rgba(114,147,98,0.12)',
        color: '#729362',
        borderColor: 'rgba(114,147,98,0.3)',
      },
        tooltipColor: '#729362',
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
          backgroundColor: '#231455',
          color: '#F0F4FF',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'DM Sans, sans-serif',
          whiteSpace: 'nowrap',
          border: `1px solid ${result.tooltipColor}40`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
        <span style={{ color: '#8892A4', display: 'block', marginTop: '2px', fontSize: '11px' }}>
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
