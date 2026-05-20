import type { CertStatus } from '../types';

export function getCertStatus(diasRestantes: number): CertStatus {
  if (diasRestantes > 60) {
    return 'vigente';
  } else if (diasRestantes >= 15 && diasRestantes <= 60) {
    return 'proximo_vencer';
  } else if (diasRestantes < 15 && diasRestantes >= 0) {
    return 'pendiente';
  } else {
    return 'vencido';
  }
}

export function getDiasRestantes(fechaVencimiento: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);
  
  const diferenciaMs = vencimiento.getTime() - hoy.getTime();
  const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  
  return diferenciaDias;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0');
  const anio = d.getFullYear();
  
  return `${dia}/${mes}/${anio}`;
}
