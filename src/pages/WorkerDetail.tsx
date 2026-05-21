import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Layers, Tag } from 'lucide-react';
import { useWorkerStore } from '../store/useWorkerStore';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { CertCard } from '../components/certifications/CertCard';
import { CertTimeline } from '../components/certifications/CertTimeline';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockMeshes } from '../data/mockData';
import { formatDate } from '../utils/dates';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// Mock courses for the worker
const mockCourses = [
  { id: 'c1', nombre: 'Seguridad Industrial Básica', progreso: 100, estado: 'completado' },
  { id: 'c2', nombre: 'Operación de Equipos Pesados', progreso: 75, estado: 'en_progreso' },
  { id: 'c3', nombre: 'Liderazgo en Terreno', progreso: 45, estado: 'en_progreso' },
  { id: 'c4', nombre: 'Primeros Auxilios', progreso: 0, estado: 'pendiente' },
];

export function WorkerDetail() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { workers } = useWorkerStore();

  const worker = workers.find((w) => w.id === workerId);

  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-[#F0F4FF] text-lg">Trabajador no encontrado</p>
        <Button variant="ghost" onClick={() => navigate('/workers')} className="mt-4">
          ← Volver a trabajadores
        </Button>
      </div>
    );
  }

  const workerMeshes = mockMeshes.filter((m) => worker.activeMeshes.includes(m.id));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/workers')}>
          Volver
        </Button>
      </motion.div>

      {/* Profile Header */}
      <ProfileHeader worker={worker} />

      <style>{`
        @media (min-width: 1024px) {
          .worker-detail-grid > div:nth-child(1) { grid-column: span 3; }
          .worker-detail-grid > div:nth-child(2) { grid-column: span 5; }
          .worker-detail-grid > div:nth-child(3) { grid-column: span 4; }
        }
        @media (max-width: 1023px) {
          .worker-detail-grid > div { grid-column: span 12; }
        }
      `}</style>
      {/* 3 Column Layout */}
      <div className="worker-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Column - Personal Info (30%) */}
        <motion.div
          custom={0.2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <Card variant="glass" padding="lg">
            <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
              Información Personal
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#00E5FF]" />
                <div>
                  <p className="text-xs text-[#8892A4]">Fecha de Ingreso</p>
                  <p className="text-sm text-[#F0F4FF]">{formatDate(worker.fechaIngreso)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#AAFF00]" />
                <div>
                  <p className="text-xs text-[#8892A4]">Departamento</p>
                  <p className="text-sm text-[#F0F4FF]">{worker.departamento}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-[#FFB800]" />
                <div>
                  <p className="text-xs text-[#8892A4]">Email</p>
                  <p className="text-sm text-[#F0F4FF] truncate">{worker.email}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Mallas Asignadas */}
          <Card variant="glass" padding="lg">
            <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
              Mallas Asignadas
            </h3>
            <div className="space-y-3">
              {workerMeshes.length > 0 ? (
                workerMeshes.map((mesh) => (
                  <div
                    key={mesh.id}
                    className="p-3 bg-[#1C2333]/50 rounded-sm border border-[rgba(0,229,255,0.1)]"
                  >
                    <p className="text-sm font-medium text-[#F0F4FF]">{mesh.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ProgressBar value={mesh.completionRate} showLabel={false} />
                      <span className="text-xs text-[#8892A4] font-mono">{mesh.completionRate}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#8892A4]">Sin mallas asignadas</p>
              )}
            </div>
          </Card>

          {/* Competencias */}
          <Card variant="glass" padding="lg">
            <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
              Competencias
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Operación Maquinaria', 'Seguridad Industrial', 'Trabajo en Equipo', 'Liderazgo'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] text-xs rounded-sm border border-[rgba(0,229,255,0.2)]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </Card>
        </motion.div>

        {/* Center Column - Certifications (40%) */}
        <motion.div
          custom={0.3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Timeline */}
          <Card variant="glass" padding="lg">
            <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-2">
              Línea de Tiempo
            </h3>
            <CertTimeline certs={worker.certifications} />
          </Card>

          {/* Certifications List */}
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-[#F0F4FF]">
                Certificaciones
              </h3>
              <span className="text-sm text-[#8892A4]">
                {worker.certifications.length} total
              </span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {worker.certifications.map((cert, index) => (
                <CertCard key={cert.id} cert={cert} index={index} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Courses (30%) */}
        <motion.div
          custom={0.4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variant="glass" padding="lg" className="h-full">
            <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
              Cursos Activos
            </h3>
            <div className="space-y-4">
              {mockCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  className="p-4 bg-[#1C2333]/50 rounded-sm border border-[rgba(0,229,255,0.1)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-[#F0F4FF]">{course.nombre}</h4>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-sm ${
                        course.estado === 'completado'
                          ? 'bg-[#00E676]/10 text-[#00E676]'
                          : course.estado === 'en_progreso'
                          ? 'bg-[#00E5FF]/10 text-[#00E5FF]'
                          : 'bg-[#8892A4]/10 text-[#8892A4]'
                      }`}
                    >
                      {course.estado === 'completado'
                        ? 'Completado'
                        : course.estado === 'en_progreso'
                        ? 'En progreso'
                        : 'Pendiente'}
                    </span>
                  </div>
                  <ProgressBar value={course.progreso} showLabel={true} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

