import { motion } from 'framer-motion';
import { Users, X, ChevronRight } from 'lucide-react';
import type { Mesh } from '../../types';
import { CourseCard } from './CourseCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

interface MeshGridProps {
  mesh: Mesh;
  onClose?: () => void;
  isModal?: boolean;
}

export function MeshGrid({ mesh, onClose, isModal = false }: MeshGridProps) {
  const workersCount = mesh.trabajadoresAsignados.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${isModal ? 'bg-[#111827] rounded-sm max-w-4xl w-full mx-4' : ''}`}
    >
      {/* Header */}
      <div className={`p-6 border-b border-[rgba(0,229,255,0.1)] ${isModal ? 'flex items-center justify-between' : ''}`}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-2xl font-bold text-[#F0F4FF]">{mesh.nombre}</h2>
            {isModal && onClose && (
              <Button variant="ghost" size="sm" icon={X} onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>
          <p className="text-sm text-[#8892A4] mb-4">{mesh.descripcion}</p>

          {/* Stats Row */}
          <div className="flex items-center gap-6">
            {/* Completion Gauge */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#8892A4]">Progreso Global</span>
              <div className="w-32">
                <ProgressBar value={mesh.completionRate} showLabel={false} />
              </div>
              <span className="font-display text-lg font-bold text-[#00E5FF]">
                {mesh.completionRate}%
              </span>
            </div>

            {/* Workers Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2333] rounded-sm">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-sm text-[#F0F4FF]">{workersCount}</span>
              <span className="text-xs text-[#8892A4]">
                trabajador{workersCount !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid with Connectors */}
      <div className="p-6 relative">
        {/* SVG Connector Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Horizontal connectors between courses in same row */}
          {[0, 1].map((row) => (
            <line
              key={`row-${row}`}
              x1="220"
              y1={80 + row * 140}
              x2="420"
              y2={80 + row * 140}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          {/* Vertical connectors between rows */}
          {[0, 1, 2].map((col) => (
            <line
              key={`col-${col}`}
              x1={120 + col * 200}
              y1="150"
              x2={120 + col * 200}
              y2="220"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {mesh.cursos.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* View Path CTA */}
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" size="sm" icon={ChevronRight}>
            Ver ruta de aprendizaje completa
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
