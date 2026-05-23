import { motion } from 'framer-motion';
import type { Certification } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExpiryBadge } from '../ui/ExpiryBadge';
import { formatDate } from '../../utils/dates';

interface CertCardProps {
  cert: Certification;
  index?: number;
}

const statusBorderColors: Record<string, string> = {
  vigente: 'border-l-[3px] border-l-[#729362]',
  proximo_vencer: 'border-l-[3px] border-l-[#FFB800]',
  vencido: 'border-l-[3px] border-l-[#FF3D57]',
  pendiente: 'border-l-[3px] border-l-[#7c4dab]',
};

const statusGlows: Record<string, string> = {
  vigente: 'hover:shadow-[0_0_12px_rgba(114,147,98,0.25)]',
  proximo_vencer: 'hover:shadow-[0_0_12px_rgba(255,184,0,0.2)]',
  vencido: 'hover:shadow-[0_0_12px_rgba(255,61,87,0.2)]',
  pendiente: 'hover:shadow-[0_0_12px_rgba(91,34,119,0.35)]',
};

export function CertCard({ cert, index = 0 }: CertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card
        variant="glass"
        padding="md"
        className={`${statusBorderColors[cert.estado]} ${statusGlows[cert.estado]} transition-shadow duration-200`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[#F0F4FF] truncate">{cert.nombre}</h4>
            <p className="text-sm text-[#8892A4] mt-0.5">{cert.emisor}</p>
          </div>

          {/* Type Badge */}
          <Badge
            status={cert.tipo}
            label={
              cert.tipo === 'obligatoria'
                ? 'Obligatoria'
                : cert.tipo === 'complementaria'
                ? 'Complementaria'
                : 'Legal'
            }
          />

          {/* Dates */}
          <div className="text-sm">
            <p className="text-[#8892A4]">
              Obtención:{' '}
              <span className="text-[#F0F4FF]">{formatDate(cert.fechaObtension)}</span>
            </p>
            <p className="text-[#8892A4]">
              Vencimiento:{' '}
              <span className="text-[#F0F4FF]">{formatDate(cert.fechaVencimiento)}</span>
            </p>
          </div>

          {/* Expiry Badge */}
          <ExpiryBadge diasRestantes={cert.diasRestantes} />

          {/* Status */}
          <Badge status={cert.estado} />
        </div>
      </Card>
    </motion.div>
  );
}
