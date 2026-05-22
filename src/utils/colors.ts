import type { CertStatus } from '../types';

export function getStatusColor(status: CertStatus): string {
  const colorMap: Record<CertStatus, string> = {
    vigente: 'text-[#8fb87a] bg-[rgba(114,147,98,0.12)] border-[rgba(114,147,98,0.35)]',
    proximo_vencer: 'text-[#FFB800] bg-[rgba(255,184,0,0.1)] border-[rgba(255,184,0,0.3)]',
    vencido: 'text-[#FF3D57] bg-[rgba(255,61,87,0.1)] border-[rgba(255,61,87,0.3)]',
    pendiente: 'text-[#9b6ab5] bg-[rgba(91,34,119,0.12)] border-[rgba(91,34,119,0.3)]',
  };
  return colorMap[status];
}

export function getStatusGlow(status: CertStatus): string {
  const glowMap: Record<CertStatus, string> = {
    vigente: 'shadow-[0_0_12px_rgba(114,147,98,0.35)]',
    proximo_vencer: 'shadow-[0_0_12px_rgba(255,184,0,0.3)]',
    vencido: 'shadow-[0_0_12px_rgba(255,61,87,0.4)]',
    pendiente: 'shadow-[0_0_12px_rgba(91,34,119,0.35)]',
  };
  return glowMap[status];
}

export function getComplianceColor(score: number): string {
  if (score >= 90) return 'text-[#9b6ab5]';
  if (score >= 70) return 'text-[#8a9e52]';
  if (score >= 50) return 'text-[#FFB800]';
  return 'text-[#FF3D57]';
}
