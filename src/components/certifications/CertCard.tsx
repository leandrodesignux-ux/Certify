import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, FileText, Bell } from 'lucide-react';
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
  const [showActions, setShowActions] = useState(false);

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
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        style={{ position: 'relative' }}
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

          {/* Acciones contextuales — visibles en hover */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              opacity: showActions ? 1 : 0,
              transition: 'opacity 0.15s ease',
              flexShrink: 0,
            }}
          >
            <button
              title="Renovar certificación"
              onClick={(e) => { e.stopPropagation(); /* TODO: conectar lógica */ }}
              style={{
                width: '30px', height: '30px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(114,147,98,0.3)',
                backgroundColor: 'rgba(114,147,98,0.1)',
                color: '#8fb87a',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(114,147,98,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(114,147,98,0.1)'; }}
            >
              <RotateCw size={13} />
            </button>
            <button
              title="Ver documento"
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                width: '30px', height: '30px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(91,34,119,0.3)',
                backgroundColor: 'rgba(91,34,119,0.1)',
                color: '#c49fe0',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)'; }}
            >
              <FileText size={13} />
            </button>
            <button
              title="Enviar alerta"
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                width: '30px', height: '30px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255,184,0,0.3)',
                backgroundColor: 'rgba(255,184,0,0.1)',
                color: '#FFB800',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,184,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,184,0,0.1)'; }}
            >
              <Bell size={13} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
