export type CertStatus = 'vigente' | 'proximo_vencer' | 'vencido' | 'pendiente';

export interface Worker {
  id: string;
  rut: string;
  nombre: string;
  apellidos: string;
  email: string;
  foto?: string;
  cargo: string;
  area: string;
  departamento: string;
  empresa: string;
  fechaIngreso: string;
  activeMeshes: string[];
  certifications: Certification[];
  complianceScore: number;
}

export interface Certification {
  id: string;
  nombre: string;
  emisor: string;
  tipo: 'obligatoria' | 'complementaria' | 'legal';
  fechaObtension: string;
  fechaVencimiento: string;
  estado: CertStatus;
  diasRestantes: number;
  workerId: string;
}

export interface Course {
  id: string;
  nombre: string;
  descripcion: string;
  duracionHoras: number;
  categoria: string;
  imagen?: string;
  evaluacion: number;
  progreso: number;
  fechaCertificado?: string;
  estado: 'completado' | 'en_progreso' | 'pendiente' | 'bloqueado';
}

export interface Mesh {
  id: string;
  nombre: string;
  descripcion: string;
  cursos: Course[];
  trabajadoresAsignados: string[];
  completionRate: number;
}

export interface Alert {
  id: string;
  tipo: 'vencimiento' | 'progreso' | 'sistema';
  workerId: string;
  workerName: string;
  certificationId?: string;
  message: string;
  diasRestantes?: number;
  createdAt: string;
}
