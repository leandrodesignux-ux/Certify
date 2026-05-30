import { motion } from 'framer-motion';
import { Users, X, ArrowDown, CheckCircle, Clock, Lock, Play, BookOpen } from 'lucide-react';
import type { Mesh, Course } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

interface MeshGridProps {
  mesh: Mesh;
  onClose?: () => void;
  isModal?: boolean;
}

const statusConfig = {
  completado: { icon: CheckCircle, color: '#729362', bg: 'bg-[rgba(114,147,98,0.15)]', label: 'Completado' },
  en_progreso: { icon: Play, color: '#7c4dab', bg: 'bg-[rgba(91,34,119,0.15)]', label: 'En progreso' },
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
      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--border-brand)', borderRadius: 'var(--radius-md)', padding: '16px' }} className="hover:border-[rgba(91,34,119,0.4)] transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-purple-mid)', fontSize: '12px', fontWeight: 700 }}>
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
        <div style={{ width: '1px', height: '16px', borderLeft: '2px dashed var(--border-brand-hover)' }} />
        <ArrowDown className="w-4 h-4 text-[rgba(91,34,119,0.5)]" />
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
      style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', maxWidth: '56rem', width: '100%', margin: '0 auto', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', maxHeight: '85vh' }}
      className="max-w-4xl w-full mx-auto overflow-hidden"
    >
      {/* Header with Close Button */}
      <div className="relative p-6 border-b border-[rgba(91,34,119,0.2)]">
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
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>{mesh.descripcion}</p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Completion Rate */}
            <div className="flex items-center gap-3">
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Progreso Global</span>
              <div className="w-32">
                <ProgressBar value={mesh.completionRate} showLabel={false} />
              </div>
              <span className="font-display text-lg font-bold text-[#9b6ab5]">
                {mesh.completionRate}%
              </span>
            </div>

            {/* Courses Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#231455] rounded-lg">
              <span className="text-sm text-[#F0F4FF]">{mesh.cursos.length}</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>cursos</span>
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
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Ruta de Aprendizaje
          </h3>

          {mesh.cursos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(91,34,119,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <BookOpen style={{ width: '28px', height: '28px', color: '#9b6ab5' }} />
              </div>
              <p className="text-[#F0F4FF] font-medium mb-2">Esta malla no tiene cursos asignados</p>
              <p className="text-sm text-[#8892A4]">Los cursos se agregarán próximamente</p>
            </motion.div>
          ) : (
            <div className="space-y-0">
              {mesh.cursos.map((course, index) => (
                <div key={course.id}>
                  <SequentialCourseCard course={course} index={index} />
                  {index < mesh.cursos.length - 1 && <ArrowConnector />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trabajadores Asignados Section */}
        <div className="mt-8 pt-6 border-t border-[rgba(91,34,119,0.2)]">
          <h3 className="text-sm font-medium text-[#8892A4] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Trabajadores Asignados
          </h3>
          
          <div className="flex items-center gap-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px' }}>
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(workersCount, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[rgba(91,34,119,0.2)] border-2 border-[#1a1040] flex items-center justify-center text-xs font-semibold text-[#c49fe0]"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {workersCount > 4 && (
                  <div className="w-8 h-8 rounded-full bg-[#231455] border-2 border-[#1a1040] flex items-center justify-center text-xs text-[#8892A4]">
                    +{workersCount - 4}
                  </div>
                )}
              </div>
              <span className="text-sm text-[#F0F4FF] ml-2">
                {workersCount} trabajador{workersCount !== 1 ? 'es' : ''} asignado{workersCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <button style={{ padding: '8px 16px', fontSize: '14px', color: 'var(--color-purple-mid)', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px', border: '1px solid rgba(91,34,119,0.25)' }} className="hover:bg-[rgba(91,34,119,0.2)] transition-colors">
              Ver todos
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
