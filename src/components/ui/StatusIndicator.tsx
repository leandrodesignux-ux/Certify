import type { CertStatus } from '../../types';

interface StatusIndicatorProps {
  status: CertStatus;
  pulse?: boolean;
}

export function StatusIndicator({ status, pulse = true }: StatusIndicatorProps) {
  const statusColors: Record<string, string> = {
    vigente: 'bg-[#729362]',
    proximo_vencer: 'bg-[#FFB800]',
    vencido: 'bg-[#FF3D57]',
    pendiente: 'bg-[#9b6ab5]',
  };

  const statusGlows: Record<string, string> = {
    vigente: 'shadow-[0_0_6px_rgba(114,147,98,0.6)]',
    proximo_vencer: 'shadow-[0_0_6px_rgba(255,184,0,0.6)]',
    vencido: 'shadow-[0_0_6px_rgba(255,61,87,0.6)]',
    pendiente: 'shadow-[0_0_6px_rgba(91,34,119,0.6)]',
  };

  const shouldPulse = pulse && status === 'vencido';

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-2.5 h-2.5 rounded-full ${statusColors[status]} ${statusGlows[status]} ${
          shouldPulse ? 'animate-pulse' : ''
        }`}
      />
      {shouldPulse && (
        <div
          className={`absolute w-4 h-4 rounded-full ${statusColors[status]} opacity-30 animate-ping`}
        />
      )}
    </div>
  );
}
