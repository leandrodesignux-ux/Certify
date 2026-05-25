import { useMemo } from 'react';
import type { Certification } from '../types';

interface CertSummary {
  total: number;
  vigentes: number;
  porvencer: number;
  vencidas: number;
  pendientes: number;
  complianceRate: number;
}

export function useCertSummary(certifications: Certification[]): CertSummary {
  return useMemo(() => {
    const total = certifications.length;
    const vigentes = certifications.filter(cert => cert.estado === 'vigente').length;
    const porvencer = certifications.filter(cert => cert.estado === 'proximo_vencer').length;
    const vencidas = certifications.filter(cert => cert.estado === 'vencido').length;
    const pendientes = certifications.filter(cert => cert.estado === 'pendiente').length;
    const complianceRate = total > 0 ? Math.round((vigentes / total) * 100) : 0;

    return {
      total,
      vigentes,
      porvencer,
      vencidas,
      pendientes,
      complianceRate,
    };
  }, [certifications]);
}
