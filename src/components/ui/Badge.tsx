import type { CertStatus } from '../../types';

interface BadgeProps {
  status: CertStatus | string;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

// Status badges: with dot, with background
// Type badges: outline only, no dot, no background
const STATUS_TYPES = ['vigente', 'proximo_vencer', 'vencido', 'pendiente'];

export function Badge({ status, label, size = 'sm', dot }: BadgeProps) {
  const isStatusBadge = STATUS_TYPES.includes(status);
  
  // Status badges always show dot internally, type badges never do
  const showDot = isStatusBadge || dot;

  const getStyles = (status: string, size: 'sm' | 'md'): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '3px 10px' : '5px 14px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 500,
      border: '1px solid',
      borderRadius: 'var(--radius-full)',
      gap: showDot ? '6px' : '0',
    };

    // STATUS BADGES - with background and dot
    switch (status) {
      case 'vigente':
        return {
          ...base,
          backgroundColor: 'rgba(114,147,98,0.12)',
          color: '#729362',
          borderColor: 'rgba(114,147,98,0.3)',
        };
      case 'proximo_vencer':
        return {
          ...base,
          backgroundColor: 'rgba(255,184,0,0.10)',
          color: '#FFB800',
          borderColor: 'rgba(255,184,0,0.25)',
        };
      case 'vencido':
        return {
          ...base,
          backgroundColor: 'rgba(255,61,87,0.10)',
          color: '#FF3D57',
          borderColor: 'rgba(255,61,87,0.25)',
        };
      case 'pendiente':
        return {
          ...base,
          backgroundColor: 'rgba(91,34,119,0.08)',
          color: '#9b6ab5',
          borderColor: 'rgba(91,34,119,0.2)',
        };
      // TYPE BADGES - outline only, no background
      case 'obligatoria':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: '#FF5C71',
          borderColor: 'rgba(255,61,87,0.35)',
        };
      case 'complementaria':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: '#9aaa58',
          borderColor: 'rgba(138,158,82,0.35)',
        };
      case 'legal':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: '#9b6ab5',
          borderColor: 'rgba(155,106,181,0.35)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'rgba(91,34,119,0.08)',
          color: '#9b6ab5',
          borderColor: 'rgba(91,34,119,0.2)',
        };
    }
  };

  const getDotColor = (status: string): string => {
    switch (status) {
      case 'vigente':
        return '#729362';
      case 'proximo_vencer':
        return '#FFB800';
      case 'vencido':
        return '#FF3D57';
      case 'pendiente':
        return '#9b6ab5';
      default:
        return '#9b6ab5';
    }
  };

  const getSemanticLabel = (status: string): string => {
    switch (status) {
      case 'vigente':
        return 'Vigente';
      case 'proximo_vencer':
        return 'Por vencer';
      case 'vencido':
        return 'Vencido';
      case 'pendiente':
        return 'Pendiente';
      case 'obligatoria':
        return label || 'Obligatoria';
      case 'complementaria':
        return label || 'Complementaria';
      case 'legal':
        return label || 'Legal';
      default:
        return label || status;
    }
  };

  return (
    <span style={getStyles(status, size)}>
      {showDot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: getDotColor(status),
            flexShrink: 0,
          }}
        />
      )}
      {getSemanticLabel(status)}
    </span>
  );
}
