import { motion } from 'framer-motion';
import { CheckCircle, Clock, Lock, Play } from 'lucide-react';
import type { Course } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDate } from '../../utils/dates';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const categoryColors: Record<string, { bg: string; accent: string }> = {
  'Inducción': { bg: 'bg-[#1C2333]', accent: '#00E5FF' },
  'Seguridad': { bg: 'bg-[#1C2333]', accent: '#AAFF00' },
  'Habilidades': { bg: 'bg-[#1C2333]', accent: '#FFB800' },
  'Liderazgo': { bg: 'bg-[#1C2333]', accent: '#00E676' },
  'Emergencias': { bg: 'bg-[#1C2333]', accent: '#FF3D57' },
};

const statusConfig = {
  completado: { icon: CheckCircle, color: '#AAFF00', bg: 'bg-[rgba(170,255,0,0.15)]', label: 'Completado' },
  en_progreso: { icon: Play, color: '#00E5FF', bg: 'bg-[rgba(0,229,255,0.15)]', label: 'En progreso' },
  pendiente: { icon: Clock, color: '#8892A4', bg: 'bg-[rgba(136,146,164,0.15)]', label: 'Pendiente' },
  bloqueado: { icon: Lock, color: '#4A5568', bg: 'bg-[rgba(74,85,104,0.15)]', label: 'Bloqueado' },
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const colors = categoryColors[course.categoria] || { bg: 'bg-[#1C2333]', accent: '#00E5FF' };
  const status = statusConfig[course.estado];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="w-[200px]"
    >
      <div className={`${colors.bg} rounded-sm overflow-hidden border border-[rgba(0,229,255,0.1)] hover:border-[rgba(0,229,255,0.25)] transition-colors duration-200`}>
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
            <span className="text-xs text-[#8892A4]">{course.duracionHoras}h</span>
          </div>

          {/* Course Name */}
          <h4 className="font-display text-base font-semibold text-[#F0F4FF] leading-tight min-h-[40px]">
            {course.nombre}
          </h4>

          {/* Progress */}
          <div className="mt-3">
            <ProgressBar
              value={course.progreso}
              status={
                course.estado === 'completado'
                  ? 'vigente'
                  : course.estado === 'en_progreso'
                  ? 'pendiente'
                  : course.estado === 'bloqueado'
                  ? 'vencido'
                  : 'proximo_vencer'
              }
              showLabel={true}
            />
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between mt-3">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm ${status.bg}`}>
              <StatusIcon className="w-3.5 h-3.5" style={{ color: status.color }} />
              <span className="text-xs font-medium" style={{ color: status.color }}>
                {status.label}
              </span>
            </div>

            {/* Completion Date */}
            {course.estado === 'completado' && course.fechaCertificado && (
              <span className="text-[10px] text-[#8892A4]">
                {formatDate(course.fechaCertificado)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
