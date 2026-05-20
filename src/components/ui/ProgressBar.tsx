import type { CertStatus } from '../../types';

interface ProgressBarProps {
  value: number;
  status?: CertStatus;
  showLabel?: boolean;
}

export function ProgressBar({ value, status, showLabel = true }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const statusColors: Record<string, string> = {
    vigente: 'bg-[#AAFF00]',
    proximo_vencer: 'bg-[#FFB800]',
    vencido: 'bg-[#FF3D57]',
    pendiente: 'bg-[#00E5FF]',
  };

  const statusGlows: Record<string, string> = {
    vigente: 'shadow-[0_0_8px_rgba(170,255,0,0.4)]',
    proximo_vencer: 'shadow-[0_0_8px_rgba(255,184,0,0.4)]',
    vencido: 'shadow-[0_0_8px_rgba(255,61,87,0.4)]',
    pendiente: 'shadow-[0_0_8px_rgba(0,229,255,0.4)]',
  };

  const colorClass = status ? statusColors[status] : 'bg-[#00E5FF]';
  const glowClass = status ? statusGlows[status] : 'shadow-[0_0_8px_rgba(0,229,255,0.4)]';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-[#8892A4]">Progreso</span>
          <span className="text-xs font-mono text-[#F0F4FF]">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="h-2 bg-[#1C2333] rounded-sm overflow-hidden">
        <div
          className={`h-full rounded-sm ${colorClass} ${glowClass} animate-fill-bar`}
          style={{ '--target-width': `${clampedValue}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
