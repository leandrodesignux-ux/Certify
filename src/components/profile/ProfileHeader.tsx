import { motion } from 'framer-motion';
import { Edit3, Award, BookOpen } from 'lucide-react';
import type { Worker } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { getComplianceColor } from '../../utils/colors';
import { formatRut } from '../../utils/format';

interface ProfileHeaderProps {
  worker: Worker;
}

export function ProfileHeader({ worker }: ProfileHeaderProps) {
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const scoreColor = getComplianceColor(worker.complianceScore);
  const scoreLabel =
    worker.complianceScore >= 90
      ? 'Excelente'
      : worker.complianceScore >= 70
      ? 'Bueno'
      : worker.complianceScore >= 50
      ? 'Regular'
      : 'Crítico';

  const activeCerts = worker.certifications.filter((c) => c.estado === 'vigente').length;
  const coursesInProgress = 3; // Mock data

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative overflow-hidden rounded-sm"
      style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #111827 100%)',
      }}
    >
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 229, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5">
            {/* Avatar */}
            {worker.foto ? (
              <img
                src={worker.foto}
                alt={`${worker.nombre} ${worker.apellidos}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1C2333] border-2 border-[#00E5FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                <span className="font-display text-2xl font-bold text-[#00E5FF]">
                  {initials}
                </span>
              </div>
            )}

            {/* Info */}
            <div>
              <h1 className="font-display text-3xl font-bold text-[#F0F4FF]">
                {worker.nombre} {worker.apellidos}
              </h1>
              <p className="font-mono text-sm text-[#8892A4] mt-1">
                {formatRut(worker.rut)}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge status={worker.cargo} label={worker.cargo} />
                <span className="px-2 py-0.5 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] text-xs rounded-sm border border-[rgba(0,229,255,0.2)]">
                  {worker.area}
                </span>
                <span className="px-2 py-0.5 bg-[rgba(170,255,0,0.1)] text-[#AAFF00] text-xs rounded-sm border border-[rgba(170,255,0,0.2)]">
                  {worker.empresa}
                </span>
              </div>

              {/* Activity Badges */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Award className="w-4 h-4 text-[#00E676]" />
                  <span className="text-[#F0F4FF]">{activeCerts}</span>
                  <span className="text-[#8892A4]">certificaciones activas</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                  <span className="text-[#F0F4FF]">{coursesInProgress}</span>
                  <span className="text-[#8892A4]">cursos en progreso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Score + Actions */}
          <div className="lg:ml-auto flex flex-col items-start lg:items-end gap-4">
            <Button variant="ghost" size="sm" icon={Edit3}>
              Editar Perfil
            </Button>

            {/* Score Section */}
            <div className="bg-[#0A0E1A]/60 backdrop-blur-sm rounded-sm p-4 border border-[rgba(0,229,255,0.1)] min-w-[200px]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-[#8892A4]">Compliance</span>
                <span className={`font-display text-4xl font-bold ${scoreColor}`}>
                  {worker.complianceScore}
                </span>
              </div>
              <ProgressBar value={worker.complianceScore} showLabel={false} />
              <p className={`text-xs mt-2 text-right font-medium ${scoreColor}`}>
                {scoreLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
