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

export function formatRelativeDate(date: string): string {
  const target = new Date(date);
  const now = new Date();
  
  // Reset time to compare dates only
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  
  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'mañana';
  if (diffDays === -1) return 'ayer';
  if (diffDays > 0 && diffDays <= 7) return rtf.format(diffDays, 'day');
  if (diffDays < 0 && diffDays >= -7) return rtf.format(diffDays, 'day');
  
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, 'month');
  }
  
  const diffYears = Math.round(diffDays / 365);
  return rtf.format(diffYears, 'year');
}

export function getCertStatusColor(diasRestantes: number): string {
  if (diasRestantes <= 0) return '#FF3D57';  // Rojo para vencido
  if (diasRestantes <= 60) return '#FFB800'; // Amarillo para próximo a vencer
  return '#729362'; // Verde para vigente
}
