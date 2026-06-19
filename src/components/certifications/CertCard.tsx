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
  vigente:       'border-l-[3px] border-l-[#297a3a]',
  proximo_vencer:'border-l-[3px] border-l-[#b25000]',
  vencido:       'border-l-[3px] border-l-[#e5484d]',
  pendiente:     'border-l-[3px] border-l-[#a8a8a8]',
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
        className={`${statusBorderColors[cert.estado]} transition-colors duration-200`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        style={{ position: 'relative' }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate" style={{ color: 'var(--color-brand)' }}>{cert.nombre}</h4>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{cert.emisor}</p>
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
            <p style={{ color: 'var(--color-text-muted)' }}>
              Obtención:{' '}
              <span style={{ color: 'var(--color-brand)' }}>{formatDate(cert.fechaObtension)}</span>
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Vencimiento:{' '}
              <span style={{ color: 'var(--color-brand)' }}>{formatDate(cert.fechaVencimiento)}</span>
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
            {[{icon: RotateCw, title: 'Renovar certificación'}, {icon: FileText, title: 'Ver documento'}, {icon: Bell, title: 'Enviar alerta'}].map(({ icon: BtnIcon, title }) => (
              <button
                key={title}
                title={title}
                onClick={(e) => { e.stopPropagation(); }}
                style={{
                  width: '30px', height: '30px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--surface-soft)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--border-default)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; }}
              >
                <BtnIcon size={13} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
