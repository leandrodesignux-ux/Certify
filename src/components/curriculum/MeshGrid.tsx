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
  completado:  { icon: CheckCircle, color: '#297a3a', bg: 'rgba(41,122,58,0.08)',    border: 'rgba(41,122,58,0.2)',   label: 'Completado' },
  en_progreso: { icon: Play,        color: '#171717', bg: 'rgba(23,23,23,0.06)',     border: '#d4d4d4',               label: 'En progreso' },
  pendiente:   { icon: Clock,       color: '#a8a8a8', bg: 'rgba(168,168,168,0.08)',  border: 'rgba(168,168,168,0.3)', label: 'Pendiente' },
  bloqueado:   { icon: Lock,        color: '#a8a8a8', bg: 'rgba(168,168,168,0.06)',  border: 'rgba(168,168,168,0.2)', label: 'Bloqueado' },
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
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb', borderRadius: '6px', padding: '16px' }} className="hover:border-[#d4d4d4] transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f0f0f0', border: '1px solid #ebebeb', color: '#4d4d4d', fontSize: '12px', fontWeight: 500 }}>
              {index + 1}
            </span>
            <h4 className="text-sm font-semibold max-w-[200px] truncate" style={{ color: '#171717' }}>
              {course.nombre}
            </h4>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}>
            <StatusIcon className="w-3.5 h-3.5" style={{ color: status.color }} strokeWidth={1.5} />
            <span className="text-xs font-medium" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#a8a8a8' }}>{course.duracionHoras} horas</span>
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
        <div style={{ width: '1px', height: '16px', borderLeft: '1px dashed #d4d4d4' }} />
        <ArrowDown className="w-4 h-4" style={{ color: '#d4d4d4' }} strokeWidth={1.5} />
      </div>
    </div>
  );
}

export function MeshGrid({ mesh, onClose, isModal = false }: MeshGridProps) {
  const workersCount = mesh.trabajadoresAsignados.length;

  if (!isModal) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold" style={{ color: '#171717', letterSpacing: '-0.02em' }}>{mesh.nombre}</h2>
        <p className="text-sm" style={{ color: '#666666' }}>{mesh.descripcion}</p>
        
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
      style={{ backgroundColor: '#ffffff', borderRadius: '6px', maxWidth: '56rem', width: '100%', margin: '0 auto', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', height: '100%' }}
      className="max-w-4xl w-full mx-auto"
    >
      {/* Header with Close Button */}
      <div className="relative p-6 border-b" style={{ borderColor: '#ebebeb', flexShrink: 0 }}>
        {/* Close Button - Top Right */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-md transition-colors z-20"
            style={{ color: '#a8a8a8', backgroundColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="pr-12">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#171717', letterSpacing: '-0.02em' }}>{mesh.nombre}</h2>
          <p style={{ color: '#666666', fontSize: '14px', marginBottom: '16px' }}>{mesh.descripcion}</p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Completion Rate */}
            <div className="flex items-center gap-3">
              <span style={{ color: '#666666', fontSize: '14px' }}>Progreso Global</span>
              <div className="w-32">
                <ProgressBar value={mesh.completionRate} showLabel={false} />
              </div>
              <span className="text-lg font-semibold" style={{ color: '#171717' }}>
                {mesh.completionRate}%
              </span>
            </div>

            {/* Courses Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ backgroundColor: '#f5f5f5', border: '1px solid #ebebeb' }}>
              <span className="text-sm" style={{ color: '#171717' }}>{mesh.cursos.length}</span>
              <span style={{ color: '#a8a8a8', fontSize: '12px' }}>cursos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="p-6"
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
      >
        {/* Sequential Course Flow */}
        <div className="max-w-2xl mx-auto">
          <h3 style={{ color: '#a8a8a8', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
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
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ebebeb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <BookOpen style={{ width: '28px', height: '28px', color: '#a8a8a8' }} strokeWidth={1.5} />
              </div>
              <p className="font-medium mb-2" style={{ color: '#171717' }}>Esta malla no tiene cursos asignados</p>
              <p className="text-sm" style={{ color: '#666666' }}>Los cursos se agregarán próximamente</p>
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
        <div className="mt-8 pt-6 border-t" style={{ borderColor: '#ebebeb' }}>
          <h3 className="text-sm font-medium uppercase mb-4 flex items-center gap-2" style={{ color: '#a8a8a8', letterSpacing: '0.06em', fontSize: '11px' }}>
            <Users className="w-4 h-4" strokeWidth={1.5} />
            Trabajadores Asignados
          </h3>
          
          <div className="flex items-center gap-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#fafafa', border: '1px solid #ebebeb', borderRadius: '6px' }}>
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(workersCount, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: '#f0f0f0', border: '2px solid #ffffff', color: '#4d4d4d' }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {workersCount > 4 && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#e8e8e8', border: '2px solid #ffffff', color: '#a8a8a8' }}>
                    +{workersCount - 4}
                  </div>
                )}
              </div>
              <span className="text-sm ml-2" style={{ color: '#171717' }}>
                {workersCount} trabajador{workersCount !== 1 ? 'es' : ''} asignado{workersCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <button
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 500, color: '#4d4d4d', backgroundColor: '#f5f5f5', borderRadius: '6px', border: '1px solid #ebebeb', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ebebeb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
            >
              Ver todos
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
