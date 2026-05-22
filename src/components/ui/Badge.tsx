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
          backgroundColor: 'rgba(114,147,98,0.18)',
          color: '#8fb87a',
          borderColor: 'rgba(114,147,98,0.4)',
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
          backgroundColor: 'rgba(91,34,119,0.12)',
          color: '#a89fc4',
          borderColor: 'rgba(91,34,119,0.25)',
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
          backgroundColor: 'rgba(116,126,68,0.18)',
          color: '#9aaa58',
          borderColor: 'rgba(116,126,68,0.4)',
        };
      case 'legal':
        return {
          ...base,
          backgroundColor: 'rgba(91,34,119,0.15)',
          color: '#9b6ab5',
          borderColor: 'rgba(91,34,119,0.35)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'rgba(91,34,119,0.12)',
          color: '#a89fc4',
          borderColor: 'rgba(91,34,119,0.25)',
        };
    }
  };

  return (
    <span style={getStyles(status)}>
      {label || status}
    </span>
  );
}
