import type { CertStatus } from '../types';

export function getStatusColor(status: CertStatus): string {
  const colorMap: Record<CertStatus, string> = {
    vigente: 'text-[#297a3a] bg-[rgba(41,122,58,0.08)] border-[rgba(41,122,58,0.2)]',
    proximo_vencer: 'text-[#b25000] bg-[rgba(178,80,0,0.08)] border-[rgba(178,80,0,0.2)]',
    vencido: 'text-[#e5484d] bg-[rgba(229,72,77,0.08)] border-[rgba(229,72,77,0.2)]',
    pendiente: 'text-[#4d4d4d] bg-[rgba(23,23,23,0.05)] border-[#ebebeb]',
  };
  return colorMap[status];
}

export function getStatusGlow(status: CertStatus): string {
  const glowMap: Record<CertStatus, string> = {
    vigente: '',
    proximo_vencer: '',
    vencido: '',
    pendiente: '',
  };
  return glowMap[status];
}

export function getComplianceColor(score: number): string {
  if (score >= 90) return 'text-[#171717]';
  if (score >= 70) return 'text-[#297a3a]';
  if (score >= 50) return 'text-[#b25000]';
  return 'text-[#e5484d]';
}
