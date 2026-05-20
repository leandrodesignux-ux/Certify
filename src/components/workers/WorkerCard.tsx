import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { getComplianceColor } from '../../utils/colors';
import { Eye, AlertCircle } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  index?: number;
}

function WorkerCardComponent({ worker, index = 0 }: WorkerCardProps) {
  const navigate = useNavigate();

  const hasExpiredCerts = worker.certifications.some(
    (cert) => cert.estado === 'vencido'
  );

  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const scoreColor = getComplianceColor(worker.complianceScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <Card
        variant="glass"
        padding="md"
        className={`relative ${hasExpiredCerts ? 'border-l-[3px] border-l-[#FF3D57]' : ''}`}
      >
        {/* Alert Badge */}
        {hasExpiredCerts && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF3D57] rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Header: Avatar + Info */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          {worker.foto ? (
            <img
              src={worker.foto}
              alt={`${worker.nombre} ${worker.apellidos}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-[rgba(0,229,255,0.3)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#1C2333] border border-[rgba(0,229,255,0.2)] flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.15)]">
              <span className="font-display text-lg font-semibold text-[#00E5FF]">
                {initials}
              </span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-semibold text-[#F0F4FF] truncate">
              {worker.nombre} {worker.apellidos}
            </h3>
            <p className="text-sm text-[#8892A4] truncate">{worker.cargo}</p>
          </div>

          {/* Score */}
          <div className="text-right">
            <span className={`font-display text-2xl font-bold ${scoreColor}`}>
              {worker.complianceScore}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <ProgressBar
            value={worker.complianceScore}
            showLabel={false}
          />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-0.5 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] text-xs rounded-sm border border-[rgba(0,229,255,0.2)]">
            {worker.area}
          </span>
          {worker.activeMeshes.length > 0 && (
            <span className="px-2 py-0.5 bg-[rgba(170,255,0,0.1)] text-[#AAFF00] text-xs rounded-sm border border-[rgba(170,255,0,0.2)]">
              {worker.activeMeshes.length} malla{worker.activeMeshes.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant="ghost"
          size="sm"
          icon={Eye}
          onClick={() => navigate(`/workers/${worker.id}`)}
        >
          Ver Perfil
        </Button>
      </Card>
    </motion.div>
  );
}

export const WorkerCard = memo(WorkerCardComponent);
