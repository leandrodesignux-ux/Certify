import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getComplianceColor } from '../../utils/colors';
import { Eye, Mail, Building, Calendar, Award, Layers } from 'lucide-react';

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
              {/* Photo Area - Top 60% */}
              <div className="h-[60%] w-full relative overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
              </div>

              {/* Info Area - Bottom 40% */}
              <div className="h-[40%] p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#F0F4FF] truncate">
                    {worker.nombre} {worker.apellidos}
                  </h3>
                  <p className="text-sm text-[#8892A4] truncate">{worker.cargo}</p>
                </div>

                {/* Compliance Score Badge */}
                <div className="flex justify-end">
                  <div className={`font-display text-3xl font-bold ${scoreColor}`}>
                    {worker.complianceScore}
                  </div>
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
              {/* Header */}
              <div className="mb-4">
                <h3 className="font-display text-base font-semibold text-[#F0F4FF] truncate">
                  {worker.nombre} {worker.apellidos}
                </h3>
              </div>

              {/* Info Grid */}
              <div className="flex-1 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#8892A4]">
                  <span className="text-[#00E5FF] font-mono">RUT:</span>
                  <span className="text-[#F0F4FF]">{worker.rut}</span>
                </div>

                <div className="flex items-center gap-2 text-[#8892A4]">
                  <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span className="text-[#F0F4FF] truncate">{worker.email}</span>
                </div>

                <div className="flex items-center gap-2 text-[#8892A4]">
                  <Building className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span className="text-[#F0F4FF]">{worker.area}</span>
                </div>

                <div className="flex items-center gap-2 text-[#8892A4]">
                  <span className="text-[#00E5FF] font-mono">Emp:</span>
                  <span className="text-[#F0F4FF]">{worker.empresa}</span>
                </div>

                <div className="flex items-center gap-2 text-[#8892A4]">
                  <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span className="text-[#F0F4FF]">{new Date(worker.fechaIngreso).toLocaleDateString('es-CL')}</span>
                </div>

                {/* Mallas Active */}
                <div className="flex items-center gap-2 text-[#8892A4]">
                  <Layers className="w-3.5 h-3.5 text-[#AAFF00]" />
                  <span className="text-[#F0F4FF]">{worker.activeMeshes.length} malla{worker.activeMeshes.length !== 1 ? 's' : ''} activa{worker.activeMeshes.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[rgba(0,229,255,0.1)] my-3" />

                {/* Certifications Stats */}
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span className="text-[#8892A4]">Certs:</span>
                  <span className="text-[#00E676]">{vigentesCount} vigentes</span>
                  {vencidasCount > 0 && (
                    <span className="text-[#FF3D57]">/ {vencidasCount} vencidas</span>
                  )}
                </div>
              </div>

              {/* Compliance Score */}
              <div className="mt-auto pt-3 flex justify-between items-center">
                <span className="text-sm text-[#8892A4]">Compliance</span>
                <span className={`font-display text-2xl font-bold ${scoreColor}`}>
                  {worker.complianceScore}
                </span>
              </div>
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
