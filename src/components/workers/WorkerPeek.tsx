import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { useWorkerStore } from '../../store/useWorkerStore';
import { useCertStore } from '../../store/useCertStore';

interface WorkerPeekTriggerProps {
  workerId: string;
  children: React.ReactNode;
  delay?: number;
}

export function WorkerPeekTrigger({ workerId, children, delay = 400 }: WorkerPeekTriggerProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!triggerRef.current) return;
    timerRef.current = window.setTimeout(() => {
      const rect = triggerRef.current!.getBoundingClientRect();
      setCoords({
        x: rect.right + 8,
        y: rect.top + rect.height / 2,
      });
      setOpen(true);
    }, delay);
  };

  const handleLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ display: 'inline-block', position: 'relative' }}
      >
        {children}
      </div>
      <AnimatePresence>
        {open && coords && <WorkerPeekCard workerId={workerId} coords={coords} />}
      </AnimatePresence>
    </>
  );
}

interface PeekCardProps {
  workerId: string;
  coords: { x: number; y: number };
}

function WorkerPeekCard({ workerId, coords }: PeekCardProps) {
  const reduceMotion = useReducedMotion();
  const { workers } = useWorkerStore();
  const { certifications } = useCertStore();

  const worker = workers.find((w) => w.id === workerId);
  if (!worker) return null;

  const certs = certifications.filter((c) => c.workerId === workerId);
  const vigentes = certs.filter((c) => c.estado === 'vigente').length;
  const vencidas = certs.filter((c) => c.estado === 'vencido').length;
  const proximas = certs.filter((c) => c.estado === 'proximo_vencer').length;

  const scoreColor = worker.complianceScore >= 80
    ? 'var(--status-success)'
    : worker.complianceScore >= 60
      ? 'var(--status-warning)'
      : 'var(--status-danger)';

  const cardWidth = 280;
  const willOverflowRight = coords.x + cardWidth > window.innerWidth - 16;
  const finalX = willOverflowRight ? coords.x - cardWidth - 24 : coords.x;
  const cardHeight = 180;
  const finalY = Math.max(16, Math.min(coords.y - cardHeight / 2, window.innerHeight - cardHeight - 16));

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: willOverflowRight ? 6 : -6 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: willOverflowRight ? 6 : -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left: finalX,
        top: finalY,
        width: cardWidth,
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 100,
        padding: '14px',
        pointerEvents: 'none',
      }}
    >
      {/* Header: avatar + name + role */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        {worker.foto ? (
          <img
            src={worker.foto}
            alt=""
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--border-default)',
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-soft)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          >
            {worker.nombre[0]}{worker.apellidos[0]}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-brand)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {worker.nombre} {worker.apellidos}
          </p>
          <p
            style={{
              fontSize: 'var(--text-micro)',
              color: 'var(--color-text-muted)',
              margin: '2px 0 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {worker.cargo}
          </p>
        </div>
      </div>

      {/* Meta line: area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: 'var(--text-micro)',
          color: 'var(--color-text-muted)',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <MapPin style={{ width: '12px', height: '12px' }} strokeWidth={1.75} />
        <span>{worker.area}</span>
      </div>

      {/* Compliance + cert counts */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        {/* Compliance score */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-faint)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            Compliance
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 'var(--weight-semibold)',
              color: scoreColor,
              margin: 0,
              fontFamily: 'var(--font-display)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {worker.complianceScore}%
          </p>
        </div>

        {/* Certs counts */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-faint)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            Certificaciones
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--status-success)', fontWeight: 'var(--weight-semibold)' }}>
              {vigentes}
            </span>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-faint)' }}>/</span>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--status-warning)', fontWeight: 'var(--weight-semibold)' }}>
              {proximas}
            </span>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-faint)' }}>/</span>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--status-danger)', fontWeight: 'var(--weight-semibold)' }}>
              {vencidas}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: hint to click */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: 'var(--text-micro)',
          color: 'var(--color-text-muted)',
        }}
      >
        <span>Click para ver perfil</span>
        <ArrowUpRight style={{ width: '11px', height: '11px' }} strokeWidth={2} />
      </div>
    </motion.div>
  );
}
