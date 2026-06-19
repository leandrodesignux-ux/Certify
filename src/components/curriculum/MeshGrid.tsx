import { useEffect, useRef } from 'react';
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
  const isCompleted = course.estado === 'completado';

  const stepBg = isCompleted ? 'rgba(41,122,58,0.1)' : '#f0f0f0';
  const stepColor = isCompleted ? '#297a3a' : '#4d4d4d';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.28 }}
    >
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb', borderRadius: '6px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: stepBg, color: stepColor, fontSize: '12px', fontWeight: 600,
            }}>
              {index + 1}
            </span>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#171717', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {course.nombre}
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '4px', backgroundColor: status.bg, border: `1px solid ${status.border}`, flexShrink: 0 }}>
            <StatusIcon style={{ width: '12px', height: '12px', color: status.color, flexShrink: 0 }} strokeWidth={1.5} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: status.color }}>{status.label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#a8a8a8', flexShrink: 0 }}>{course.duracionHoras}h</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={course.progreso} showLabel={false} />
          </div>
          <span style={{ fontSize: '11px', color: '#a8a8a8', flexShrink: 0 }}>{course.progreso}%</span>
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
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isModal) return;
    triggerRef.current = document.activeElement as HTMLElement;
    setTimeout(() => modalRef.current?.focus(), 50);
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      triggerRef.current?.focus();
    };
  }, [isModal, onClose]);

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
      ref={modalRef}
      role="dialog"
      aria-label={`Malla curricular: ${mesh.nombre}`}
      aria-modal="true"
      tabIndex={-1}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      style={{ outline: 'none', backgroundColor: '#ffffff', borderRadius: '6px', width: '100%', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* ── HEADER fijo ── */}
      <div style={{ padding: '24px', paddingRight: '56px', borderBottom: '1px solid #ebebeb', flexShrink: 0, position: 'relative' }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: '#a8a8a8', cursor: 'pointer', transition: 'background-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            aria-label="Cerrar"
          >
            <X style={{ width: '18px', height: '18px' }} strokeWidth={1.5} />
          </button>
        )}
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', letterSpacing: '-0.02em', margin: '0 0 4px' }}>{mesh.nombre}</h2>
        <p style={{ color: '#666666', fontSize: '13px', margin: '0 0 14px' }}>{mesh.descripcion}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#666666' }}>Progreso global</span>
            <div style={{ width: '80px' }}>
              <ProgressBar value={mesh.completionRate} showLabel={false} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>{mesh.completionRate}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#f5f5f5', border: '1px solid #ebebeb', borderRadius: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#171717' }}>{mesh.cursos.length}</span>
            <span style={{ fontSize: '12px', color: '#a8a8a8' }}>cursos</span>
          </div>
        </div>
      </div>

      {/* ── CUERPO scrolleable ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Ruta de Aprendizaje</p>

        {mesh.cursos.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f5f5f5', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <BookOpen style={{ width: '24px', height: '24px', color: '#a8a8a8' }} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#171717', margin: '0 0 4px' }}>Sin cursos asignados</p>
            <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>Los cursos se agregarán próximamente</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {mesh.cursos.map((course, index) => (
              <div key={course.id}>
                <SequentialCourseCard course={course} index={index} />
                {index < mesh.cursos.length - 1 && <ArrowConnector />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER fijo: Trabajadores Asignados ── */}
      <div style={{ flexShrink: 0, borderTop: '1px solid #ebebeb', padding: '16px 24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users style={{ width: '13px', height: '13px' }} strokeWidth={1.5} />
          Trabajadores Asignados
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: Math.min(workersCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, backgroundColor: '#f0f0f0', border: '2px solid #ffffff', color: '#4d4d4d', marginLeft: i > 0 ? '-6px' : '0' }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {workersCount > 5 && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', backgroundColor: '#e8e8e8', border: '2px solid #ffffff', color: '#a8a8a8', marginLeft: '-6px' }}>
                  +{workersCount - 5}
                </div>
              )}
            </div>
            <span style={{ fontSize: '13px', color: '#171717' }}>
              {workersCount} trabajador{workersCount !== 1 ? 'es' : ''} asignado{workersCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            style={{ height: '32px', padding: '0 14px', fontSize: '12px', fontWeight: 500, color: '#4d4d4d', backgroundColor: '#f5f5f5', borderRadius: '6px', border: '1px solid #ebebeb', cursor: 'pointer', transition: 'background-color 0.15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ebebeb'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
          >
            Ver todos
          </button>
        </div>
      </div>
    </motion.div>
  );
}
