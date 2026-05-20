import type { CertStatus } from '../../types';

interface BadgeProps {
  status: CertStatus | string;
  label?: string;
}

export function Badge({ status, label }: BadgeProps) {
  const statusStyles: Record<string, string> = {
    vigente: 'bg-[rgba(170,255,0,0.5)] text-[#AAFF00] border-[rgba(170,255,0,0.3)]',
    proximo_vencer: 'bg-[rgba(255,184,0,0.1)] text-[#FFB800] border-[rgba(255,184,0,0.3)]',
    vencido: 'bg-[rgba(255,61,87,0.1)] text-[#FF3D57] border-[rgba(255,61,87,0.3)] animate-glow-pulse',
    pendiente: 'bg-[rgba(107,114,128,0.2)] text-[#8892A4] border-[rgba(107,114,128,0.3)]',
  };

  const defaultStyle = 'bg-[rgba(107,114,128,0.2)] text-[#8892A4] border-[rgba(107,114,128,0.3)]';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-sm ${
        statusStyles[status] || defaultStyle
      }`}
    >
      {label || status}
    </span>
  );
}
