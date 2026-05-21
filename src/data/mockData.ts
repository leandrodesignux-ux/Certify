import type { Worker, Certification, Mesh, Course, Alert } from '../types';
import { getDiasRestantes } from '../utils/dates';

// ==================== EMPRESAS ====================
const empresas = [
  'Corpa Andina Minera S.A.',
  'Constructora Vial Norte Ltda.',
  'Agroindustrial Los Andes SpA',
];

// ==================== WORKERS (20) ====================
export const mockWorkers: Worker[] = [
  {
    id: 'w1',
    rut: '12.345.678-9',
    nombre: 'Carlos',
    apellidos: 'Rodríguez Pérez',
    email: 'c.rodriguez@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    cargo: 'Operador Maquinaria Pesada',
    area: 'Operaciones',
    departamento: 'Extracción',
    empresa: empresas[0],
    fechaIngreso: '2019-03-15',
    activeMeshes: ['m1', 'm2'],
    certifications: [],
    complianceScore: 87,
  },
  {
    id: 'w2',
    rut: '13.456.789-0',
    nombre: 'María',
    apellidos: 'Soto Valenzuela',
    email: 'm.soto@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    cargo: 'Jefe de Turno',
    area: 'Operaciones',
    departamento: 'Supervisión',
    empresa: empresas[0],
    fechaIngreso: '2018-07-22',
    activeMeshes: ['m1', 'm3', 'm4'],
    certifications: [],
    complianceScore: 94,
  },
  {
    id: 'w3',
    rut: '14.567.890-1',
    nombre: 'Juan',
    apellidos: 'Fuentes Castillo',
    email: 'j.fuentes@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    cargo: 'Técnico Eléctrico',
    area: 'Mantención',
    departamento: 'Eléctrica',
    empresa: empresas[0],
    fechaIngreso: '2020-11-08',
    activeMeshes: ['m2', 'm5'],
    certifications: [],
    complianceScore: 76,
  },
  {
    id: 'w4',
    rut: '15.678.901-2',
    nombre: 'Patricia',
    apellidos: 'Mendoza Lagos',
    email: 'p.mendoza@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    cargo: 'Prevencionista de Riesgos',
    area: 'Seguridad',
    departamento: 'Prevención',
    empresa: empresas[0],
    fechaIngreso: '2018-01-12',
    activeMeshes: ['m1'],
    certifications: [],
    complianceScore: 98,
  },
  {
    id: 'w5',
    rut: '16.789.012-3',
    nombre: 'Diego',
    apellidos: 'Silva Herrera',
    email: 'd.silva@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    cargo: 'Operador Grúa',
    area: 'Operaciones',
    departamento: 'Logística Interna',
    empresa: empresas[0],
    fechaIngreso: '2021-05-20',
    activeMeshes: ['m2'],
    certifications: [],
    complianceScore: 62,
  },
  {
    id: 'w6',
    rut: '17.890.123-4',
    nombre: 'Francisca',
    apellidos: 'Torres Navarro',
    email: 'f.torres@vialnorte.cl',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
    cargo: 'Capataz de Obra',
    area: 'Operaciones',
    departamento: 'Construcción',
    empresa: empresas[1],
    fechaIngreso: '2020-02-14',
    activeMeshes: ['m1', 'm2', 'm4'],
    certifications: [],
    complianceScore: 81,
  },
  {
    id: 'w7',
    rut: '18.901.234-5',
    nombre: 'Alejandro',
    apellidos: 'Rojas Araya',
    email: 'a.rojas@vialnorte.cl',
    foto: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face',
    cargo: 'Operador Planta Asfáltica',
    area: 'Operaciones',
    departamento: 'Producción',
    empresa: empresas[1],
    fechaIngreso: '2022-08-03',
    activeMeshes: ['m2', 'm3'],
    certifications: [],
    complianceScore: 58,
  },
  {
    id: 'w8',
    rut: '19.012.345-6',
    nombre: 'Camila',
    apellidos: 'Contreras Vega',
    email: 'c.contreras@vialnorte.cl',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face',
    cargo: 'Administradora de Obra',
    area: 'Logística',
    departamento: 'Administración',
    empresa: empresas[1],
    fechaIngreso: '2019-11-28',
    activeMeshes: ['m3'],
    certifications: [],
    complianceScore: 89,
  },
  {
    id: 'w9',
    rut: '20.123.456-7',
    nombre: 'Mauricio',
    apellidos: 'Paredes Olivares',
    email: 'm.paredes@vialnorte.cl',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
    cargo: 'Encargado Bodega',
    area: 'Logística',
    departamento: 'Almacén',
    empresa: empresas[1],
    fechaIngreso: '2023-01-16',
    activeMeshes: ['m2'],
    certifications: [],
    complianceScore: 45,
  },
  {
    id: 'w10',
    rut: '21.234.567-8',
    nombre: 'Daniela',
    apellidos: 'Vásquez Morales',
    email: 'd.vasquez@vialnorte.cl',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    cargo: 'Supervisora de Seguridad',
    area: 'Seguridad',
    departamento: 'Prevención',
    empresa: empresas[1],
    fechaIngreso: '2018-06-05',
    activeMeshes: ['m1', 'm5'],
    certifications: [],
    complianceScore: 96,
  },
  {
    id: 'w11',
    rut: '22.345.678-9',
    nombre: 'Fernando',
    apellidos: 'Castro Espinoza',
    email: 'f.castro@agrolosandes.cl',
    foto: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&h=300&fit=crop&crop=face',
    cargo: 'Jefe de Plantación',
    area: 'Operaciones',
    departamento: 'Agrícola',
    empresa: empresas[2],
    fechaIngreso: '2020-04-10',
    activeMeshes: ['m2', 'm4'],
    certifications: [],
    complianceScore: 73,
  },
  {
    id: 'w12',
    rut: '23.456.789-0',
    nombre: 'Isabel',
    apellidos: 'Reyes Sandoval',
    email: 'i.reyes@agrolosandes.cl',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    cargo: 'Técnica en Alimentos',
    area: 'Operaciones',
    departamento: 'Procesamiento',
    empresa: empresas[2],
    fechaIngreso: '2021-09-14',
    activeMeshes: ['m3', 'm5'],
    certifications: [],
    complianceScore: 84,
  },
  {
    id: 'w13',
    rut: '24.567.890-1',
    nombre: 'Héctor',
    apellidos: 'Martínez Guzmán',
    email: 'h.martinez@agrolosandes.cl',
    foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&h=300&fit=crop&crop=face',
    cargo: 'Operador de Packing',
    area: 'Operaciones',
    departamento: 'Embalaje',
    empresa: empresas[2],
    fechaIngreso: '2022-12-01',
    activeMeshes: ['m2'],
    certifications: [],
    complianceScore: 55,
  },
  {
    id: 'w14',
    rut: '25.678.901-2',
    nombre: 'Valentina',
    apellidos: 'López Fernández',
    email: 'v.lopez@agrolosandes.cl',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
    cargo: 'Asistente de RRHH',
    area: 'RRHH',
    departamento: 'Gestión Humana',
    empresa: empresas[2],
    fechaIngreso: '2023-06-20',
    activeMeshes: ['m3'],
    certifications: [],
    complianceScore: 67,
  },
  {
    id: 'w15',
    rut: '26.789.012-3',
    nombre: 'Ricardo',
    apellidos: 'Díaz Bravo',
    email: 'r.diaz@agrolosandes.cl',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    cargo: 'Mecánico Industrial',
    area: 'Mantención',
    departamento: 'Mecánica',
    empresa: empresas[2],
    fechaIngreso: '2019-08-12',
    activeMeshes: ['m2', 'm5'],
    certifications: [],
    complianceScore: 91,
  },
  {
    id: 'w16',
    rut: '27.890.123-4',
    nombre: 'Andrea',
    apellidos: 'Gutiérrez Flores',
    email: 'a.gutierrez@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face',
    cargo: 'Analista de Control',
    area: 'Operaciones',
    departamento: 'Calidad',
    empresa: empresas[0],
    fechaIngreso: '2024-01-08',
    activeMeshes: ['m1', 'm3'],
    certifications: [],
    complianceScore: 52,
  },
  {
    id: 'w17',
    rut: '28.901.234-5',
    nombre: 'Sebastián',
    apellidos: 'Morales Henríquez',
    email: 's.morales@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    cargo: 'Soldador Certificado',
    area: 'Mantención',
    departamento: 'Soldadura',
    empresa: empresas[0],
    fechaIngreso: '2020-10-05',
    activeMeshes: ['m2', 'm4'],
    certifications: [],
    complianceScore: 78,
  },
  {
    id: 'w18',
    rut: '29.012.345-6',
    nombre: 'Natalia',
    apellidos: 'Ortega Sepúlveda',
    email: 'n.ortega@vialnorte.cl',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    cargo: 'Topógrafa de Obra',
    area: 'Operaciones',
    departamento: 'Ingeniería',
    empresa: empresas[1],
    fechaIngreso: '2023-03-22',
    activeMeshes: ['m1'],
    certifications: [],
    complianceScore: 69,
  },
  {
    id: 'w19',
    rut: '30.123.456-7',
    nombre: 'Luis',
    apellidos: 'Figueroa Carrasco',
    email: 'l.figueroa@agrolosandes.cl',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    cargo: 'Conductor Profesional',
    area: 'Logística',
    departamento: 'Transporte',
    empresa: empresas[2],
    fechaIngreso: '2018-12-15',
    activeMeshes: ['m2', 'm3'],
    certifications: [],
    complianceScore: 85,
  },
  {
    id: 'w20',
    rut: '31.234.567-8',
    nombre: 'Antonia',
    apellidos: 'González Ramírez',
    email: 'a.gonzalez@corpaandina.cl',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    cargo: 'Enfermera Ocupacional',
    area: 'Seguridad',
    departamento: 'Salud Ocupacional',
    empresa: empresas[0],
    fechaIngreso: '2021-04-18',
    activeMeshes: ['m1', 'm5'],
    certifications: [],
    complianceScore: 93,
  },
];

// ==================== CERTIFICATIONS (60) ====================
const certificacionesNombres = [
  'Operación de Grúa Horquilla',
  'Trabajo en Altura',
  'Manejo de HAZMAT',
  'Primeros Auxilios',
  'Soldadura ASME Sección IX',
  'Seguridad Vial para Conductores',
  'Operación de Camión Tolva',
  'Excavaciones y Zanjas',
  'Espacios Confinados',
  'Permiso de Trabajo en Caliente',
  'Bloqueo y Etiquetado (LOTO)',
  'Manipulación de Cargas',
  'Uso de EPP Completo',
  'Operación de Retroexcavadora',
  'Gestión de Residuos Peligrosos',
  'Monitoreo de Gases',
  'Protección contra Caídas',
  'Rescate Vertical',
  'Sistemas de Extinción',
  'Seguridad en Andamios',
];

const emisores = [
  'SENCE',
  'ACHS',
  'Mutual de Seguridad',
  'Instituto de Seguridad del Trabajo (IST)',
  'Cámara Chilena de la Construcción',
  'TÜV Rheinland Chile',
  'SGS Chile',
  'Bureau Veritas',
  'Centro de Capacitación Minera',
  'Instituto de Seguridad Industrial',
];

function generarCertificaciones(): Certification[] {
  const certs: Certification[] = [];
  let id = 1;
  
  mockWorkers.forEach((worker) => {
    const numCerts = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < numCerts; i++) {
      const nombreCert = certificacionesNombres[Math.floor(Math.random() * certificacionesNombres.length)];
      const emisor = emisores[Math.floor(Math.random() * emisores.length)];
      const tipo: Certification['tipo'] = ['obligatoria', 'complementaria', 'legal'][Math.floor(Math.random() * 3)] as Certification['tipo'];
      
      const fechaObtension = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const vigenciaMeses = [6, 12, 24, 36][Math.floor(Math.random() * 4)];
      const fechaVencimiento = new Date(fechaObtension);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + vigenciaMeses);
      
      const diasRestantes = getDiasRestantes(fechaVencimiento.toISOString().split('T')[0]);
      
      let estado: Certification['estado'];
      if (diasRestantes > 60) estado = 'vigente';
      else if (diasRestantes >= 15) estado = 'proximo_vencer';
      else if (diasRestantes >= 0) estado = 'pendiente';
      else estado = 'vencido';
      
      certs.push({
        id: `cert${id}`,
        nombre: nombreCert,
        emisor,
        tipo,
        fechaObtension: fechaObtension.toISOString().split('T')[0],
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        estado,
        diasRestantes,
        workerId: worker.id,
      });
      
      id++;
    }
  });
  
  return certs.slice(0, 60);
}

export const mockCertifications: Certification[] = generarCertificaciones();

// Asignar certificaciones a workers
mockWorkers.forEach((worker) => {
  worker.certifications = mockCertifications.filter((cert) => cert.workerId === worker.id);
});

// ==================== MESHES (5) ====================
const cursosBase: Omit<Course, 'id'>[] = [
  { nombre: 'Inducción General', descripcion: 'Políticas y procedimientos de la empresa', duracionHoras: 4, categoria: 'Inducción', evaluacion: 85, progreso: 100, estado: 'completado' },
  { nombre: 'Seguridad Básica', descripcion: 'Principios de seguridad industrial', duracionHoras: 8, categoria: 'Seguridad', evaluacion: 92, progreso: 100, estado: 'completado' },
  { nombre: 'Uso de EPP', descripcion: 'Equipos de protección personal', duracionHoras: 3, categoria: 'Seguridad', evaluacion: 88, progreso: 100, estado: 'completado' },
  { nombre: 'Identificación de Riesgos', descripcion: 'Matriz de riesgos y controles', duracionHoras: 6, categoria: 'Seguridad', evaluacion: 78, progreso: 85, estado: 'en_progreso' },
  { nombre: 'Comunicación Efectiva', descripcion: 'Habilidades de comunicación laboral', duracionHoras: 4, categoria: 'Habilidades', evaluacion: 0, progreso: 45, estado: 'en_progreso' },
  { nombre: 'Gestión de Conflictos', descripcion: 'Resolución de conflictos en equipo', duracionHoras: 6, categoria: 'Habilidades', evaluacion: 0, progreso: 0, estado: 'pendiente' },
  { nombre: 'Primera Respuesta', descripcion: 'Respuesta ante emergencias', duracionHoras: 12, categoria: 'Emergencias', evaluacion: 0, progreso: 0, estado: 'bloqueado' },
  { nombre: 'Liderazgo en Terreno', descripcion: 'Comandos y dirección de equipos', duracionHoras: 16, categoria: 'Liderazgo', evaluacion: 0, progreso: 0, estado: 'pendiente' },
];

function generarCursos(meshId: string, indices: number[]): Course[] {
  return indices.map((idx, i) => ({
    ...cursosBase[idx],
    id: `${meshId}-c${i + 1}`,
  }));
}

export const mockMeshes: Mesh[] = [
  {
    id: 'm1',
    nombre: 'Inducción Seguridad Industrial',
    descripcion: 'Programa obligatorio para todo nuevo ingreso. Cubre fundamentos de seguridad, uso de EPP y cultura preventiva.',
    cursos: generarCursos('m1', [0, 1, 2, 5]),
    trabajadoresAsignados: ['w1', 'w2', 'w4', 'w6', 'w8', 'w10', 'w16', 'w18', 'w20'],
    completionRate: 78,
  },
  {
    id: 'm2',
    nombre: 'Operación Equipos Pesados',
    descripcion: 'Formación especializada en manejo seguro de maquinaria industrial y minera.',
    cursos: generarCursos('m2', [0, 1, 3, 6, 7]),
    trabajadoresAsignados: ['w1', 'w3', 'w5', 'w6', 'w7', 'w9', 'w11', 'w13', 'w15', 'w17', 'w19'],
    completionRate: 64,
  },
  {
    id: 'm3',
    nombre: 'Liderazgo y Supervisión',
    descripcion: 'Desarrollo de competencias directivas para jefes, capataces y coordinadores.',
    cursos: generarCursos('m3', [4, 5, 7]),
    trabajadoresAsignados: ['w2', 'w7', 'w8', 'w12', 'w14', 'w16', 'w19'],
    completionRate: 52,
  },
  {
    id: 'm4',
    nombre: 'Gestión de Emergencias',
    descripcion: 'Preparación para respuesta ante emergencias, evacuación y primeros auxilios.',
    cursos: generarCursos('m4', [1, 2, 6]),
    trabajadoresAsignados: ['w2', 'w4', 'w6', 'w10', 'w11', 'w17'],
    completionRate: 43,
  },
  {
    id: 'm5',
    nombre: 'Excelencia Operacional',
    descripcion: 'Metodologías de mejora continua y optimización de procesos productivos.',
    cursos: generarCursos('m5', [3, 4, 5, 7]),
    trabajadoresAsignados: ['w3', 'w10', 'w12', 'w15', 'w20'],
    completionRate: 71,
  },
];

// ==================== ALERTS (10) ====================
export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    tipo: 'vencimiento',
    workerId: 'w5',
    workerName: 'Diego Silva Herrera',
    certificationId: mockCertifications.find(c => c.workerId === 'w5' && c.estado === 'proximo_vencer')?.id || 'cert5',
    message: 'Operación de Grúa Horquilla vence en 18 días',
    diasRestantes: 18,
    createdAt: '2024-05-20T08:00:00Z',
  },
  {
    id: 'a2',
    tipo: 'vencimiento',
    workerId: 'w7',
    workerName: 'Alejandro Rojas Araya',
    certificationId: mockCertifications.find(c => c.workerId === 'w7' && c.estado === 'vencido')?.id || 'cert15',
    message: 'Trabajo en Altura venció hace 5 días',
    diasRestantes: -5,
    createdAt: '2024-05-15T10:30:00Z',
  },
  {
    id: 'a3',
    tipo: 'vencimiento',
    workerId: 'w9',
    workerName: 'Mauricio Paredes Olivares',
    certificationId: mockCertifications.find(c => c.workerId === 'w9')?.id || 'cert21',
    message: 'Manejo de HAZMAT vence en 8 días',
    diasRestantes: 8,
    createdAt: '2024-05-19T14:15:00Z',
  },
  {
    id: 'a4',
    tipo: 'progreso',
    workerId: 'w13',
    workerName: 'Héctor Martínez Guzmán',
    message: 'Estancado al 45% en malla Operación Equipos Pesados',
    createdAt: '2024-05-18T09:00:00Z',
  },
  {
    id: 'a5',
    tipo: 'vencimiento',
    workerId: 'w16',
    workerName: 'Andrea Gutiérrez Flores',
    certificationId: mockCertifications.find(c => c.workerId === 'w16')?.id || 'cert45',
    message: 'Primeros Auxilios vence en 3 días',
    diasRestantes: 3,
    createdAt: '2024-05-20T07:00:00Z',
  },
  {
    id: 'a6',
    tipo: 'vencimiento',
    workerId: 'w3',
    workerName: 'Juan Fuentes Castillo',
    certificationId: mockCertifications.find(c => c.workerId === 'w3' && c.estado === 'proximo_vencer')?.id || 'cert9',
    message: 'Seguridad Vial vence en 22 días',
    diasRestantes: 22,
    createdAt: '2024-05-19T16:45:00Z',
  },
  {
    id: 'a7',
    tipo: 'progreso',
    workerId: 'w2',
    workerName: 'María Soto Valenzuela',
    message: 'Completó 90% de malla Liderazgo y Supervisión',
    createdAt: '2024-05-20T11:20:00Z',
  },
  {
    id: 'a8',
    tipo: 'vencimiento',
    workerId: 'w19',
    workerName: 'Luis Figueroa Carrasco',
    certificationId: mockCertifications.find(c => c.workerId === 'w19')?.id || 'cert58',
    message: 'Seguridad Vial para Conductores vence en 12 días',
    diasRestantes: 12,
    createdAt: '2024-05-18T13:00:00Z',
  },
  {
    id: 'a9',
    tipo: 'sistema',
    workerId: 'w1',
    workerName: 'Carlos Rodríguez Pérez',
    message: 'Nueva certificación agregada: Operación de Camión Tolva',
    createdAt: '2024-05-20T15:00:00Z',
  },
  {
    id: 'a10',
    tipo: 'vencimiento',
    workerId: 'w11',
    workerName: 'Fernando Castro Espinoza',
    certificationId: mockCertifications.find(c => c.workerId === 'w11')?.id || 'cert33',
    message: 'Espacios Confinados vence en 45 días (programar renovación)',
    diasRestantes: 45,
    createdAt: '2024-05-17T10:00:00Z',
  },
];

// ==================== STATS ====================
export const mockStats = {
  totalWorkers: mockWorkers.length,
  certVigentes: mockCertifications.filter(c => c.estado === 'vigente').length,
  certProximas: mockCertifications.filter(c => c.estado === 'proximo_vencer').length,
  cursosEnProgreso: mockMeshes.reduce((acc, mesh) => acc + mesh.cursos.filter(c => c.estado === 'en_progreso').length, 0),
  complianceGeneral: Math.round(mockWorkers.reduce((acc, w) => acc + w.complianceScore, 0) / mockWorkers.length),
};

// ==================== CHART DATA ====================
export const mockChartData = {
  // Gráfica de tendencia mensual (12 meses)
  trendMonthly: {
    labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [
      {
        label: 'Certificaciones Vencidas',
        data: [2, 1, 3, 2, 4, 1, 2, 3, 2, 1, 2, 3],
        color: '#FF3D57',
      },
      {
        label: 'Certificaciones Renovadas',
        data: [5, 3, 6, 4, 7, 2, 4, 5, 6, 3, 4, 5],
        color: '#00E676',
      },
      {
        label: 'Próximas a Vencer',
        data: [8, 6, 9, 7, 10, 5, 7, 8, 9, 6, 7, 8],
        color: '#FFB800',
      },
    ],
  },
  
  // Gráfica por área
  byArea: {
    labels: ['Operaciones', 'Mantención', 'Seguridad', 'Logística', 'RRHH'],
    data: [45, 78, 92, 68, 85],
    colors: ['#00E5FF', '#AAFF00', '#00E676', '#FFB800', '#FF3D57'],
  },
  
  // Gráfica donut de estados
  statusDonut: {
    labels: ['Vigentes', 'Próximas', 'Vencidas', 'Pendientes'],
    data: [
      mockCertifications.filter(c => c.estado === 'vigente').length,
      mockCertifications.filter(c => c.estado === 'proximo_vencer').length,
      mockCertifications.filter(c => c.estado === 'vencido').length,
      mockCertifications.filter(c => c.estado === 'pendiente').length,
    ],
    colors: ['#00E676', '#FFB800', '#FF3D57', '#00E5FF'],
  },
  
  // Gráfica de compliance por empresa
  complianceByCompany: {
    labels: empresas,
    data: [
      Math.round(mockWorkers.filter(w => w.empresa === empresas[0]).reduce((a, w) => a + w.complianceScore, 0) / mockWorkers.filter(w => w.empresa === empresas[0]).length),
      Math.round(mockWorkers.filter(w => w.empresa === empresas[1]).reduce((a, w) => a + w.complianceScore, 0) / mockWorkers.filter(w => w.empresa === empresas[1]).length),
      Math.round(mockWorkers.filter(w => w.empresa === empresas[2]).reduce((a, w) => a + w.complianceScore, 0) / mockWorkers.filter(w => w.empresa === empresas[2]).length),
    ],
    colors: ['#00E5FF', '#AAFF00', '#FFB800'],
  },
};
