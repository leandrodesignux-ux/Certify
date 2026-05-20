import type { CertStatus } from '../types';

export function getStatusColor(status: CertStatus): string {
  const colorMap: Record<CertStatus, string> = {
    vigente: 'text-success bg-success/10 border-success/30',
    proximo_vencer: 'text-warning bg-warning/10 border-warning/30',
    vencido: 'text-danger bg-danger/10 border-danger/30',
    pendiente: 'text-electric bg-electric/10 border-electric/30',
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
    return 'text-electric';
  } else if (score >= 70) {
    return 'text-volt';
  } else if (score >= 50) {
    return 'text-warning';
  } else {
    return 'text-danger';
  }
}
