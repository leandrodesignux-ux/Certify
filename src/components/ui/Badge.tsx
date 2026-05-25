import type { CertStatus } from '../../types';

interface BadgeProps {
  status: CertStatus | string;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ status, label, size = 'sm', dot = false }: BadgeProps) {
  const getStyles = (status: string, size: 'sm' | 'md'): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '2px 6px' : '4px 10px',
      fontSize: size === 'sm' ? '11px' : '13px',
      fontWeight: 500,
      border: '1px solid',
      borderRadius: '4px',
      gap: dot ? '6px' : '0',
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
          animation: 'glow-pulse 2s ease-in-out infinite',
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

  const getDotColor = (status: string): string => {
    switch (status) {
      case 'vigente':
        return '#8fb87a';
      case 'proximo_vencer':
        return '#FFB800';
      case 'vencido':
        return '#FF3D57';
      case 'pendiente':
        return '#a89fc4';
      case 'obligatoria':
        return '#FF3D57';
      case 'complementaria':
        return '#9aaa58';
      case 'legal':
        return '#9b6ab5';
      default:
        return '#a89fc4';
    }
  };

  return (
    <span style={getStyles(status, size)}>
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: getDotColor(status),
            flexShrink: 0,
          }}
        />
      )}
      {label || status}
    </span>
  );
}
