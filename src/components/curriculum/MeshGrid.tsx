import { motion } from 'framer-motion';
import { Users, X, ArrowDown, CheckCircle, Clock, Lock, Play } from 'lucide-react';
import type { Mesh, Course } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

interface MeshGridProps {
  mesh: Mesh;
  onClose?: () => void;
  isModal?: boolean;
}

const statusConfig = {
  completado: { icon: CheckCircle, color: '#AAFF00', bg: 'bg-[rgba(170,255,0,0.15)]', label: 'Completado' },
  en_progreso: { icon: Play, color: '#00E5FF', bg: 'bg-[rgba(0,229,255,0.15)]', label: 'En progreso' },
  pendiente: { icon: Clock, color: '#8892A4', bg: 'bg-[rgba(136,146,164,0.15)]', label: 'Pendiente' },
  bloqueado: { icon: Lock, color: '#4A5568', bg: 'bg-[rgba(74,85,104,0.15)]', label: 'Bloqueado' },
};

// Sequential Course Card Component
function SequentialCourseCard({ course, index }: { course: Course; index: number }) {
  const status = statusConfig[course.estado];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative"
    >
      <div className="bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-lg p-4 hover:border-[rgba(0,229,255,0.2)] transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(0,229,255,0.1)] text-[#00E5FF] text-xs font-bold">
              {index + 1}
            </span>
            <h4 className="font-display text-sm font-semibold text-[#F0F4FF] max-w-[200px] truncate">
              {course.nombre}
            </h4>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${status.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" style={{ color: status.color }} />
            <span className="text-xs font-medium" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8892A4]">{course.duracionHoras} horas</span>
          <div className="w-32">
            <ProgressBar value={course.progreso} showLabel={false} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Arrow Connector Component
function ArrowConnector() {
  return (
    <div className="flex justify-center py-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-px h-4 border-l-2 border-dashed border-[rgba(0,229,255,0.3)]" />
        <ArrowDown className="w-4 h-4 text-[rgba(0,229,255,0.4)]" />
      </div>
    </div>
  );
}

export function MeshGrid({ mesh, onClose, isModal = false }: MeshGridProps) {
  const workersCount = mesh.trabajadoresAsignados.length;

  if (!isModal) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#F0F4FF]">{mesh.nombre}</h2>
        <p className="text-sm text-[#8892A4]">{mesh.descripcion}</p>
        
        <div className="space-y-4">
          {mesh.cursos.map((course, index) => (
            <div key={course.id}>
              <SequentialCourseCard course={course} index={index} />
              {index < mesh.cursos.length - 1 && <ArrowConnector />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-[#111827] rounded-lg max-w-4xl w-full mx-auto overflow-hidden shadow-2xl"
      style={{ maxHeight: '85vh' }}
    >
      {/* Header with Close Button */}
      <div className="relative p-6 border-b border-[rgba(0,229,255,0.1)]">
        {/* Close Button - Top Right */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-[rgba(255,61,87,0.1)] hover:bg-[rgba(255,61,87,0.2)] text-[#FF3D57] transition-colors z-20"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="pr-12">
          <h2 className="font-display text-2xl font-bold text-[#F0F4FF] mb-2">{mesh.nombre}</h2>
          <p className="text-sm text-[#8892A4] mb-4">{mesh.descripcion}</p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Completion Rate */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#8892A4]">Progreso Global</span>
              <div className="w-32">
                <ProgressBar value={mesh.completionRate} showLabel={false} />
              </div>
              <span className="font-display text-lg font-bold text-[#00E5FF]">
                {mesh.completionRate}%
              </span>
            </div>

            {/* Courses Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2333] rounded-lg">
              <span className="text-sm text-[#F0F4FF]">{mesh.cursos.length}</span>
              <span className="text-xs text-[#8892A4]">cursos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="overflow-y-auto p-6"
        style={{ maxHeight: 'calc(85vh - 180px)' }}
      >
        {/* Sequential Course Flow */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-sm font-medium text-[#8892A4] uppercase tracking-wider mb-4">
            Ruta de Aprendizaje
          </h3>
          
          <div className="space-y-0">
            {mesh.cursos.map((course, index) => (
              <div key={course.id}>
                <SequentialCourseCard course={course} index={index} />
                {index < mesh.cursos.length - 1 && <ArrowConnector />}
              </div>
            ))}
          </div>
        </div>

        {/* Trabajadores Asignados Section */}
        <div className="mt-8 pt-6 border-t border-[rgba(0,229,255,0.1)]">
          <h3 className="text-sm font-medium text-[#8892A4] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Trabajadores Asignados
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1C2333] rounded-lg">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(workersCount, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[rgba(0,229,255,0.15)] border-2 border-[#111827] flex items-center justify-center text-xs font-semibold text-[#00E5FF]"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {workersCount > 4 && (
                  <div className="w-8 h-8 rounded-full bg-[#1C2333] border-2 border-[#111827] flex items-center justify-center text-xs text-[#8892A4]">
                    +{workersCount - 4}
                  </div>
                )}
              </div>
              <span className="text-sm text-[#F0F4FF] ml-2">
                {workersCount} trabajador{workersCount !== 1 ? 'es' : ''} asignado{workersCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <button className="px-4 py-2 text-sm text-[#00E5FF] bg-[rgba(0,229,255,0.1)] hover:bg-[rgba(0,229,255,0.15)] rounded-lg transition-colors border border-[rgba(0,229,255,0.2)]">
              Ver todos
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
