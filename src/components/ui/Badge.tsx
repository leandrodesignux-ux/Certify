import type { CertStatus } from '../../types';

interface BadgeProps {
  status: CertStatus | string;
  label?: string;
}

export function Badge({ status, label }: BadgeProps) {
  const getStyles = (status: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: 500,
      border: '1px solid',
      borderRadius: '4px',
    };

    switch (status) {
      case 'vigente':
        return {
          ...base,
          backgroundColor: 'rgba(0,230,118,0.15)',
          color: '#00E676',
          borderColor: 'rgba(0,230,118,0.3)',
        };
      case 'proximo_vencer':
        return {
          ...base,
          backgroundColor: 'rgba(255,184,0,0.15)',
          color: '#FFB800',
          borderColor: 'rgba(255,184,0,0.3)',
        };
      case 'vencido':
        return {
          ...base,
          backgroundColor: 'rgba(255,61,87,0.15)',
          color: '#FF3D57',
          borderColor: 'rgba(255,61,87,0.3)',
        };
      case 'pendiente':
        return {
          ...base,
          backgroundColor: 'rgba(107,114,128,0.2)',
          color: '#8892A4',
          borderColor: 'rgba(107,114,128,0.3)',
        };
      case 'obligatoria':
        return {
          ...base,
          backgroundColor: 'rgba(255,61,87,0.12)',
          color: '#FF3D57',
          borderColor: 'rgba(255,61,87,0.3)',
        };
      case 'complementaria':
        return {
          ...base,
          backgroundColor: 'rgba(170,255,0,0.12)',
          color: '#AAFF00',
          borderColor: 'rgba(170,255,0,0.3)',
        };
      case 'legal':
        return {
          ...base,
          backgroundColor: 'rgba(0,229,255,0.12)',
          color: '#00E5FF',
          borderColor: 'rgba(0,229,255,0.3)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'rgba(107,114,128,0.2)',
          color: '#8892A4',
          borderColor: 'rgba(107,114,128,0.3)',
        };
    }
  };

  return (
    <span style={getStyles(status)}>
      {label || status}
    </span>
  );
}
