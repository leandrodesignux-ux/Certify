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
          backgroundColor: 'rgba(41,122,58,0.08)',
          color: '#297a3a',
          borderColor: 'rgba(41,122,58,0.2)',
        };
      case 'proximo_vencer':
        return {
          ...base,
          backgroundColor: 'rgba(178,80,0,0.08)',
          color: '#b25000',
          borderColor: 'rgba(178,80,0,0.2)',
        };
      case 'vencido':
        return {
          ...base,
          backgroundColor: 'rgba(229,72,77,0.08)',
          color: '#e5484d',
          borderColor: 'rgba(229,72,77,0.2)',
        };
      case 'pendiente':
        return {
          ...base,
          backgroundColor: 'rgba(23,23,23,0.05)',
          color: '#4d4d4d',
          borderColor: '#ebebeb',
        };
      // TYPE BADGES - outline only, no background
      case 'obligatoria':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: '#e5484d',
          borderColor: '#ebebeb',
        };
      case 'complementaria':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: '#4d4d4d',
          borderColor: '#ebebeb',
        };
      case 'legal':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: '#4d4d4d',
          borderColor: '#ebebeb',
        };
      default:
        return {
          ...base,
          backgroundColor: 'rgba(23,23,23,0.05)',
          color: '#4d4d4d',
          borderColor: '#ebebeb',
        };
    }
  };

  const getDotColor = (status: string): string => {
    switch (status) {
      case 'vigente':
        return '#297a3a';
      case 'proximo_vencer':
        return '#b25000';
      case 'vencido':
        return '#e5484d';
      case 'pendiente':
        return '#4d4d4d';
      default:
        return '#4d4d4d';
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
