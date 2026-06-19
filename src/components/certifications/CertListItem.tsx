import { motion } from 'framer-motion';
import { Eye, AlertCircle } from 'lucide-react';
import type { Certification, Worker } from '../../types';
import { Badge } from '../ui/Badge';
import { DaysSparkline } from './DaysSparkline';
import { formatDate } from '../../utils/dates';
import { WorkerPeekTrigger } from '../workers/WorkerPeek';

interface CertListItemProps {
  cert: Certification;
  worker?: Worker;
  index?: number;
  onSelectDetail: (certId: string) => void;
  recentlyClosed?: string | null;
}

const statusBorderColor: Record<string, string> = {
  vigente:        '#297a3a',
  proximo_vencer: '#b25000',
  vencido:        '#e5484d',
  pendiente:      '#a6bbd1',
};

export function CertListItem({ cert, worker, index = 0, onSelectDetail, recentlyClosed }: CertListItemProps) {
  const initials = worker
    ? `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase()
    : '?';
  const borderColor = statusBorderColor[cert.estado] ?? 'var(--border-default)';

  const isHighlighted = recentlyClosed === cert.id;

  return (
    <motion.article
      data-cert-id={cert.id}
      initial={{ opacity: 0, y: 10 }}
      animate={
        isHighlighted
          ? {
              opacity: 1,
              y: 0,
              backgroundColor: ['var(--surface-card)', 'var(--color-primary-soft)', 'var(--surface-card)'],
            }
          : { opacity: 1, y: 0 }
      }
      exit={{ opacity: 0, y: -10 }}
      transition={
        isHighlighted
          ? { backgroundColor: { duration: 1.5, times: [0, 0.3, 1], ease: 'easeOut' } }
          : { delay: Math.min(index * 0.025, 0.3), duration: 0.25 }
      }
      role="button"
      tabIndex={0}
      onClick={() => onSelectDetail(cert.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectDetail(cert.id);
        }
      }}
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        cursor: 'pointer',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.borderLeftColor = borderColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.borderLeftColor = borderColor;
      }}
    >
      {/* TOP ROW: worker + status badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        {/* Worker info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <WorkerPeekTrigger workerId={cert.workerId}>
            {worker?.foto ? (
              <img
                src={worker.foto}
                alt={`${worker.nombre} ${worker.apellidos}`}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%', objectFit: 'cover',
                  border: '1px solid var(--border-default)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-soft)',
                border: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-body-sm)', fontWeight: 600,
                color: 'var(--color-text-muted)',
                flexShrink: 0,
              }}>
                {initials}
              </div>
            )}
          </WorkerPeekTrigger>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: 'var(--text-body-sm)', fontWeight: 600,
              color: 'var(--color-brand)',
              margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {worker?.nombre} {worker?.apellidos}
            </p>
            {worker?.cargo && (
              <p style={{
                fontSize: 'var(--text-micro)',
                color: 'var(--color-text-muted)',
                margin: '2px 0 0',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {worker.cargo}
              </p>
            )}
          </div>
        </div>

        {/* Status badge (right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {cert.estado === 'vencido' && (
            <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--status-danger)' }} strokeWidth={1.5} />
          )}
          <Badge status={cert.estado} size="sm" />
        </div>
      </div>

      {/* MIDDLE: cert name + emisor + tipo */}
      <div style={{
        paddingTop: '10px',
        borderTop: '1px solid var(--border-default)',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: 'var(--text-body-sm)', fontWeight: 500,
              color: 'var(--color-brand)',
              margin: 0, lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {cert.nombre}
            </p>
            <p style={{
              fontSize: 'var(--text-micro)',
              color: 'var(--color-text-muted)',
              margin: '2px 0 0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {cert.emisor}
            </p>
          </div>
          <Badge status={cert.tipo} size="sm" />
        </div>
      </div>

      {/* BOTTOM: dates row + detail button */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-default)',
      }}>
        {/* Dates */}
        <div style={{ display: 'flex', gap: '16px', minWidth: 0, flex: 1 }}>
          <div style={{ minWidth: 0 }}>
            <span style={{
              fontSize: '10px', fontWeight: 600,
              color: 'var(--color-text-faint)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'block', marginBottom: '2px',
            }}>
              Obtención
            </span>
            <span style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              {formatDate(cert.fechaObtension)}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{
              fontSize: '10px', fontWeight: 600,
              color: 'var(--color-text-faint)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'block', marginBottom: '2px',
            }}>
              Vencimiento
            </span>
            <span style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
              display: 'block',
            }}>
              {formatDate(cert.fechaVencimiento)}
            </span>
          </div>
        </div>

        {/* Sparkline (compact) — solo visible si >= 480px */}
        <div className="hidden sm:block" style={{ flexShrink: 0 }}>
          <DaysSparkline diasRestantes={cert.diasRestantes} barWidth={48} barHeight={4} textSize="10px" />
        </div>

        {/* Detail button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectDetail(cert.id);
          }}
          aria-label={`Ver detalle de ${cert.nombre}`}
          style={{
            width: '32px', height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-default)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-soft)';
            e.currentTarget.style.borderColor = 'var(--color-primary-border)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          <Eye style={{ width: '15px', height: '15px' }} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}
