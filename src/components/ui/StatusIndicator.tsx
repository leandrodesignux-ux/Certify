import type { CertStatus } from '../../types';

interface StatusIndicatorProps {
  status: CertStatus;
  pulse?: boolean;
}

const statusStyles: Record<string, { bg: string; glow: string }> = {
  vigente:       { bg: 'var(--color-success)',    glow: '0 0 6px rgba(114,147,98,0.6)' },
  proximo_vencer:{ bg: 'var(--color-warning)',    glow: '0 0 6px rgba(255,184,0,0.6)' },
  vencido:       { bg: 'var(--color-danger)',     glow: '0 0 6px rgba(255,61,87,0.6)' },
  pendiente:     { bg: 'var(--color-purple-mid)', glow: '0 0 6px rgba(91,34,119,0.6)' },
};

export function StatusIndicator({ status, pulse = true }: StatusIndicatorProps) {
  const shouldPulse = pulse && status === 'vencido';

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-2.5 h-2.5 rounded-full ${shouldPulse ? 'animate-pulse' : ''}`}
        style={{
          backgroundColor: statusStyles[status].bg,
          boxShadow: statusStyles[status].glow,
        }}
      />
      {shouldPulse && (
        <div
          className="absolute w-4 h-4 rounded-full opacity-30 animate-ping"
          style={{ backgroundColor: statusStyles[status].bg }}
        />
      )}
    </div>
  );
}
