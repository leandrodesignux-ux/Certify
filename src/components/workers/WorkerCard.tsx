import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getComplianceColor } from '../../utils/colors';
import { mockMeshes } from '../../data/mockData';
import { ProgressBar } from '../ui/ProgressBar';
import { Eye } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  index?: number;
}

function WorkerCardComponent({ worker, index = 0 }: WorkerCardProps) {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const scoreColor = getComplianceColor(worker.complianceScore);

  const vigentesCount = worker.certifications.filter(c => c.estado === 'vigente').length;
  const vencidasCount = worker.certifications.filter(c => c.estado === 'vencido').length;
  const proximoCount = worker.certifications.filter(c => c.estado === 'proximo_vencer').length;

  const workerMeshes = mockMeshes.filter(m => worker.activeMeshes.includes(m.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full flex flex-col gap-3"
    >
      {/* 3D Flip Card Container */}
      <div
        className="relative w-full aspect-[3/4] min-h-[320px] cursor-pointer"
        style={{ perspective: '1000px' }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Card
              variant="glass"
              padding="sm"
              className="relative w-full h-full bg-[#0D1117] border-[rgba(0,229,255,0.1)] overflow-hidden !p-0"
            >
              {/* Photo Area - Top 55% */}
              <div className="h-[55%] w-full relative overflow-hidden rounded-t-xl">
                {worker.foto ? (
                  <img
                    src={worker.foto}
                    alt={`${worker.nombre} ${worker.apellidos}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1C2333] flex items-center justify-center">
                    <span className="font-display text-5xl font-bold text-[#00E5FF]">
                      {initials}
                    </span>
                  </div>
                )}
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/90 via-[#0D1117]/20 to-transparent" />

                {/* Compliance Score Pill - Bottom Right */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#0D1117]/80 backdrop-blur-sm rounded-full border border-[rgba(0,229,255,0.2)]">
                  <span className={`font-display text-lg font-bold ${scoreColor}`}>
                    {worker.complianceScore}
                  </span>
                </div>
              </div>

              {/* Info Area - Bottom 45% */}
              <div className="h-[45%] p-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#F0F4FF] truncate">
                    {worker.nombre} {worker.apellidos}
                  </h3>
                  <p className="text-xs text-[#8892A4] truncate">{worker.cargo}</p>
                </div>

                {/* Area Badge - Bottom Left */}
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] text-[10px] rounded-sm border border-[rgba(0,229,255,0.2)] truncate max-w-full">
                    {worker.area}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <Card
              variant="glass"
              padding="md"
              className="relative w-full h-full bg-[#0D1117] border-[rgba(0,229,255,0.1)] overflow-hidden flex flex-col"
            >
              {/* RUT + Email Header */}
              <div className="mb-3 space-y-1">
                <p className="text-xs text-[#8892A4] truncate">
                  <span className="font-mono">{worker.rut}</span> · {worker.email}
                </p>
              </div>

              {/* Mallas en Curso */}
              {workerMeshes.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#8892A4] mb-2 font-medium">
                    Mallas en curso
                  </h4>
                  <div className="space-y-2">
                    {workerMeshes.map((mesh) => (
                      <div key={mesh.id} className="space-y-1">
                        <p className="text-xs text-[#F0F4FF] truncate">{mesh.nombre}</p>
                        <ProgressBar value={mesh.completionRate} showLabel={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cert Stats Row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {vigentesCount > 0 && (
                  <span className="px-2 py-0.5 bg-[rgba(0,230,118,0.15)] text-[#00E676] text-[10px] rounded-sm border border-[rgba(0,230,118,0.3)]">
                    {vigentesCount} vigente{vigentesCount !== 1 ? 's' : ''}
                  </span>
                )}
                {proximoCount > 0 && (
                  <span className="px-2 py-0.5 bg-[rgba(255,184,0,0.15)] text-[#FFB800] text-[10px] rounded-sm border border-[rgba(255,184,0,0.3)]">
                    {proximoCount} por vencer
                  </span>
                )}
                {vencidasCount > 0 && (
                  <span className="px-2 py-0.5 bg-[rgba(255,61,87,0.15)] text-[#FF3D57] text-[10px] rounded-sm border border-[rgba(255,61,87,0.3)]">
                    {vencidasCount} vencida{vencidasCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Compliance Score */}
              <div className="mt-auto pt-2 flex justify-between items-center border-t border-[rgba(0,229,255,0.1)]">
                <span className="text-xs text-[#8892A4]">Compliance</span>
                <span className={`font-display text-xl font-bold ${scoreColor}`}>
                  {worker.complianceScore}
                </span>
              </div>

              {/* Hover hint */}
              <p className="text-[10px] text-[#4A5568] text-center mt-2">
                ← hover para volver
              </p>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Ver Detalles Button - Outside flip container */}
      <Button
        variant="ghost"
        size="sm"
        icon={Eye}
        onClick={() => navigate(`/workers/${worker.id}`)}
        className="w-full"
      >
        Ver Detalles
      </Button>
    </motion.div>
  );
}

export const WorkerCard = memo(WorkerCardComponent);
