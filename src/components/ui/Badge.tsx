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
      fontSize: 'var(--text-micro)',
      fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
      border: '1px solid',
      borderRadius: 'var(--radius-full)',
      gap: showDot ? '6px' : '0',
      letterSpacing: '0.01em',
    };

    // STATUS BADGES - with background and dot
    switch (status) {
      case 'vigente':
        return {
          ...base,
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          borderColor: 'var(--status-success-border)',
        };
      case 'proximo_vencer':
        return {
          ...base,
          backgroundColor: 'var(--status-warning-bg)',
          color: 'var(--status-warning)',
          borderColor: 'var(--status-warning-border)',
        };
      case 'vencido':
        return {
          ...base,
          backgroundColor: 'var(--status-danger-bg)',
          color: 'var(--status-danger)',
          borderColor: 'var(--status-danger-border)',
        };
      case 'pendiente':
        return {
          ...base,
          backgroundColor: 'var(--status-neutral-bg)',
          color: 'var(--status-neutral-text)',
          borderColor: 'var(--status-neutral-border)',
        };
      // TYPE BADGES - outline only, no background
      case 'obligatoria':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: 'var(--status-danger)',
          borderColor: 'var(--border-default)',
        };
      case 'complementaria':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          borderColor: 'var(--border-default)',
        };
      case 'legal':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          borderColor: 'var(--border-default)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--status-neutral-bg)',
          color: 'var(--status-neutral-text)',
          borderColor: 'var(--status-neutral-border)',
        };
    }
  };

  const getDotColor = (status: string): string => {
    switch (status) {
      case 'vigente':        return 'var(--status-success)';
      case 'proximo_vencer': return 'var(--status-warning)';
      case 'vencido':        return 'var(--status-danger)';
      case 'pendiente':      return 'var(--status-neutral-text)';
      default:               return 'var(--status-neutral-text)';
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
