import type { CertStatus } from '../types';

export function getStatusColor(status: CertStatus): string {
  const colorMap: Record<CertStatus, string> = {
    vigente: 'text-[#00E676] bg-[rgba(0,230,118,0.1)] border-[rgba(0,230,118,0.3)]',
    proximo_vencer: 'text-[#FFB800] bg-[rgba(255,184,0,0.1)] border-[rgba(255,184,0,0.3)]',
    vencido: 'text-[#FF3D57] bg-[rgba(255,61,87,0.1)] border-[rgba(255,61,87,0.3)]',
    pendiente: 'text-[#00E5FF] bg-[rgba(0,229,255,0.1)] border-[rgba(0,229,255,0.3)]',
  };

  return colorMap[status];
}

export function getStatusGlow(status: CertStatus): string {
  const glowMap: Record<CertStatus, string> = {
    vigente: 'shadow-[0_0_12px_rgba(0,230,118,0.3)]',
    proximo_vencer: 'shadow-[0_0_12px_rgba(255,184,0,0.3)]',
    vencido: 'shadow-[0_0_12px_rgba(255,61,87,0.4)]',
    pendiente: 'shadow-[0_0_12px_rgba(0,229,255,0.3)]',
  };
  
  return glowMap[status];
}

export function getComplianceColor(score: number): string {
  if (score >= 90) {
    return 'text-[#00E5FF]';
  } else if (score >= 70) {
    return 'text-[#AAFF00]';
  } else if (score >= 50) {
    return 'text-[#FFB800]';
  } else {
    return 'text-[#FF3D57]';
  }
}
