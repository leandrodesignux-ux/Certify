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
  en_progreso: { icon: Play,        color: '#476788', bg: 'rgba(23,23,23,0.06)',     border: '#d4e0ed',               label: 'En progreso' },
  pendiente:   { icon: Clock,       color: '#a8a8a8', bg: 'rgba(168,168,168,0.08)',  border: 'rgba(168,168,168,0.3)', label: 'Pendiente' },
  bloqueado:   { icon: Lock,        color: '#a8a8a8', bg: 'rgba(168,168,168,0.06)',  border: 'rgba(168,168,168,0.2)', label: 'Bloqueado' },
};

// Sequential Course Card Component
function SequentialCourseCard({ course, index }: { course: Course; index: number }) {
  const status = statusConfig[course.estado];
  const StatusIcon = status.icon;
  const isCompleted = course.estado === 'completado';

  const stepBg = isCompleted ? 'rgba(41,122,58,0.1)' : 'var(--surface-soft)';
  const stepColor = isCompleted ? '#297a3a' : '#476788';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.28 }}
    >
      <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: stepBg, color: stepColor, fontSize: '12px', fontWeight: 600,
            }}>
              {index + 1}
            </span>
            <h4 style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-brand)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {course.nombre}
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '4px', backgroundColor: status.bg, border: `1px solid ${status.border}`, flexShrink: 0 }}>
            <StatusIcon style={{ width: '12px', height: '12px', color: status.color, flexShrink: 0 }} strokeWidth={1.5} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: status.color }}>{status.label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', flexShrink: 0 }}>{course.duracionHoras}h</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={course.progreso} showLabel={false} />
          </div>
          <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', flexShrink: 0 }}>{course.progreso}%</span>
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
        <div style={{ width: '1px', height: '16px', borderLeft: '1px dashed var(--border-strong)' }} />
        <ArrowDown className="w-4 h-4" style={{ color: 'var(--border-strong)' }} strokeWidth={1.5} />
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
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-brand)', letterSpacing: '-0.02em' }}>{mesh.nombre}</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{mesh.descripcion}</p>
        
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
      style={{ outline: 'none', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', width: '100%', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* ── HEADER fijo ── */}
      <div style={{ padding: '24px', paddingRight: '56px', borderBottom: '1px solid var(--border-default)', flexShrink: 0, position: 'relative' }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: 'transparent', color: 'var(--color-text-faint)', cursor: 'pointer', transition: 'background-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            aria-label="Cerrar"
          >
            <X style={{ width: '18px', height: '18px' }} strokeWidth={1.5} />
          </button>
        )}
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-brand)', letterSpacing: '-0.02em', margin: '0 0 4px' }}>{mesh.nombre}</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-sm)', margin: '0 0 14px' }}>{mesh.descripcion}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Progreso global</span>
            <div style={{ width: '80px' }}>
              <ProgressBar value={mesh.completionRate} showLabel={false} />
            </div>
            <span style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-brand)' }}>{mesh.completionRate}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', borderRadius: '4px' }}>
            <span style={{ fontSize: 'var(--text-caption)', fontWeight: 500, color: 'var(--color-brand)' }}>{mesh.cursos.length}</span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-faint)' }}>cursos</span>
          </div>
        </div>
      </div>

      {/* ── CUERPO scrolleable ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px' }}>
        <p style={{ fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Ruta de Aprendizaje</p>

        {mesh.cursos.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <BookOpen style={{ width: '24px', height: '24px', color: 'var(--color-text-faint)' }} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 'var(--text-body)', fontWeight: 500, color: 'var(--color-brand)', margin: '0 0 4px' }}>Sin cursos asignados</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', margin: 0 }}>Los cursos se agregarán próximamente</p>
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
      <div style={{ flexShrink: 0, borderTop: '1px solid var(--border-default)', padding: '16px 24px' }}>
        <p style={{ fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users style={{ width: '13px', height: '13px' }} strokeWidth={1.5} />
          Trabajadores Asignados
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: Math.min(workersCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-micro)', fontWeight: 600, backgroundColor: 'var(--surface-soft)', border: '2px solid var(--surface-card)', color: '#476788', marginLeft: i > 0 ? '-6px' : '0' }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {workersCount > 5 && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-micro)', backgroundColor: 'var(--surface-soft)', border: '2px solid var(--surface-card)', color: 'var(--color-text-faint)', marginLeft: '-6px' }}>
                  +{workersCount - 5}
                </div>
              )}
            </div>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-brand)' }}>
              {workersCount} trabajador{workersCount !== 1 ? 'es' : ''} asignado{workersCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            style={{ height: '32px', padding: '0 14px', fontSize: 'var(--text-caption)', fontWeight: 500, color: 'var(--color-text-muted)', backgroundColor: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', cursor: 'pointer', transition: 'background-color 0.15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--border-default)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; }}
          >
            Ver todos
          </button>
        </div>
      </div>
    </motion.div>
  );
}
