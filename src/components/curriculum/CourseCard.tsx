import { motion } from 'framer-motion';
import { CheckCircle, Clock, Lock, Play } from 'lucide-react';
import type { Course } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDate } from '../../utils/dates';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const categoryColors: Record<string, { accent: string }> = {
  'Inducción':  { accent: '#476788' },
  'Seguridad':  { accent: '#297a3a' },
  'Habilidades':{ accent: '#b25000' },
  'Liderazgo':  { accent: '#297a3a' },
  'Emergencias':{ accent: '#e5484d' },
};

const statusConfig = {
  completado:  { icon: CheckCircle, color: '#297a3a', bg: 'rgba(41,122,58,0.08)',   border: 'rgba(41,122,58,0.2)',  label: 'Completado' },
  en_progreso: { icon: Play,        color: '#476788', bg: 'rgba(23,23,23,0.06)',    border: '#d4e0ed',              label: 'En progreso' },
  pendiente:   { icon: Clock,       color: '#a8a8a8', bg: 'rgba(168,168,168,0.08)', border: 'rgba(168,168,168,0.3)',label: 'Pendiente' },
  bloqueado:   { icon: Lock,        color: '#a8a8a8', bg: 'rgba(168,168,168,0.06)', border: 'rgba(168,168,168,0.2)',label: 'Bloqueado' },
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const colors = categoryColors[course.categoria] || { accent: '#476788' };
  const status = statusConfig[course.estado];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="w-[200px]"
    >
      <div className="rounded-sm overflow-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
        {/* Header with accent */}
        <div
          className="h-1.5"
          style={{ backgroundColor: colors.accent }}
        />

        <div className="p-4">
          {/* Category + Duration */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] uppercase tracking-wider font-medium"
              style={{ color: colors.accent }}
            >
              {course.categoria}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{course.duracionHoras}h</span>
          </div>

          {/* Course Name */}
          <h4 className="text-base font-semibold leading-tight min-h-[40px]" style={{ color: 'var(--color-brand)' }}>
            {course.nombre}
          </h4>

          {/* Progress */}
          <div className="mt-3">
            <ProgressBar
              value={course.progreso}
              showLabel={true}
            />
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm" style={{ backgroundColor: status.bg, border: `1px solid ${status.border}` }}>
              <StatusIcon className="w-3.5 h-3.5" style={{ color: status.color }} strokeWidth={1.5} />
              <span className="text-xs font-medium" style={{ color: status.color }}>
                {status.label}
              </span>
            </div>

            {/* Completion Date */}
            {course.estado === 'completado' && course.fechaCertificado && (
              <span className="text-[10px]" style={{ color: 'var(--color-text-faint)' }}>
                {formatDate(course.fechaCertificado)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
