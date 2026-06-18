import type { CertStatus } from '../../types';

interface StatusIndicatorProps {
  status: CertStatus;
  pulse?: boolean;
}

const statusStyles: Record<string, { bg: string }> = {
  vigente:       { bg: '#297a3a' },
  proximo_vencer:{ bg: '#b25000' },
  vencido:       { bg: '#e5484d' },
  pendiente:     { bg: '#4d4d4d' },
};

export function StatusIndicator({ status, pulse = true }: StatusIndicatorProps) {
  const shouldPulse = pulse && status === 'vencido';

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-2.5 h-2.5 rounded-full ${shouldPulse ? 'animate-pulse' : ''}`}
        style={{
          backgroundColor: statusStyles[status].bg,
        }}
      />
      {shouldPulse && (
        <div
          className="absolute w-4 h-4 rounded-full opacity-20 animate-ping"
          style={{ backgroundColor: statusStyles[status].bg }}
        />
      )}
    </div>
  );
}
