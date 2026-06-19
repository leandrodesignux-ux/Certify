import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import type { Certification, Worker } from '../../types';

interface CertDetailDrawerProps {
  cert: Certification | null;
  worker: Worker | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function CertDetailDrawer({ cert, worker, isOpen, onClose }: CertDetailDrawerProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => panelRef.current?.focus(), 50);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  if (!cert) return null;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'vigente': return '#297a3a';
      case 'proximo_vencer': return '#b25000';
      case 'vencido': return '#e5484d';
      default: return '#a8a8a8';
    }
  };

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre[0]}${apellidos[0]}`.toUpperCase();
  };

  // Calculate certification progress
  const calculateProgress = () => {
    const obtDate = new Date(cert.fechaObtension);
    const venDate = new Date(cert.fechaVencimiento);
    const now = new Date();
    const totalDays = Math.ceil((venDate.getTime() - obtDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - obtDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  };

  const progress = calculateProgress();
  const statusColor = getStatusColor(cert.estado);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Detalle de certificación"
            aria-modal="true"
            tabIndex={-1}
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="fixed right-0 top-0 bottom-0 z-50"
            style={{ outline: 'none',
              width: 'min(420px, 100vw)',
              backgroundColor: '#ffffff',
              borderLeft: '1px solid #ebebeb',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            }}
          >
            {/* Header */}
            <div 
              className="relative border-b"
              style={{ borderColor: '#ebebeb', flexShrink: 0, padding: '20px 20px 20px 20px', paddingRight: '56px' }}
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-md transition-colors"
                aria-label="Cerrar detalle"
                style={{ color: '#a8a8a8' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="p-2.5"
                  style={{ backgroundColor: '#f5f5f5', borderRadius: '6px' }}
                >
                  <Award 
                    className="w-6 h-6" 
                    style={{ color: statusColor }} 
                    strokeWidth={1.5}
                  />
                </div>
                
                <div className="flex-1">
                  <h2 
                    className="text-xl font-semibold mb-2"
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      color: '#171717',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {cert.nombre}
                  </h2>
                  <Badge status={cert.estado} />
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

            {/* Worker Section */}
            <div 
              style={{ padding: '20px', borderBottom: '1px solid #ebebeb' }}
            >
              <div className="flex items-center gap-3">
                {worker?.foto ? (
                  <img
                    src={worker.foto}
                    alt={`${worker.nombre} ${worker.apellidos}`}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: '1px solid #ebebeb' }}
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ 
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ebebeb',
                      color: '#4d4d4d'
                    }}
                  >
                    {worker ? getInitials(worker.nombre, worker.apellidos) : '?'}
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="text-base font-semibold" style={{ color: '#171717' }}>
                    {worker ? `${worker.nombre} ${worker.apellidos}` : 'Trabajador no encontrado'}
                  </p>
                  <p className="text-sm" style={{ color: '#666666' }}>{worker?.cargo || 'Sin cargo'}</p>
                </div>

                {worker?.area && (
                  <div
                    className="px-3 py-1.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#4d4d4d',
                      border: '1px solid #ebebeb',
                    }}
                  >
                    {worker.area}
                  </div>
                )}
              </div>
            </div>

            {/* Dates Section */}
            <div 
              style={{ padding: '20px', borderBottom: '1px solid #ebebeb' }}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#a8a8a8', letterSpacing: '0.04em' }}>
                    Fecha Obtención
                  </p>
                  <p className="text-sm" style={{ color: '#171717' }}>
                    {new Date(cert.fechaObtension).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#a8a8a8', letterSpacing: '0.04em' }}>
                    Fecha Vencimiento
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: statusColor }}
                  >
                    {new Date(cert.fechaVencimiento).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs" style={{ color: '#a8a8a8' }}>Vida de la certificación</p>
                  <p 
                    className="text-xs font-medium"
                    style={{ color: statusColor }}
                  >
                    {cert.diasRestantes > 0 
                      ? `${cert.diasRestantes} días restantes`
                      : `Vencida hace ${Math.abs(cert.diasRestantes)} días`
                    }
                  </p>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#ebebeb' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                </div>
              </div>
            </div>

            {/* Emisor and Type Section */}
            <div 
              style={{ padding: '20px' }}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#a8a8a8', letterSpacing: '0.04em' }}>
                    Emisor
                  </p>
                  <p className="text-sm" style={{ color: '#171717' }}>{cert.emisor}</p>
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#a8a8a8', letterSpacing: '0.04em' }}>
                    Tipo
                  </p>
                  <Badge status={cert.tipo} />
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#a8a8a8', letterSpacing: '0.04em' }}>
                    ID Interno
                  </p>
                  <p 
                    className="text-xs font-mono"
                    style={{ color: '#a8a8a8' }}
                  >
                    {cert.id}
                  </p>
                </div>
              </div>
            </div>

            </div>{/* end scrollable body */}

            {/* Footer */}
            <div 
              style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb', flexShrink: 0 }}
            >
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-md border transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#ebebeb',
                    color: '#4d4d4d',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cerrar
                </button>
                
                <button
                  onClick={() => {
                    navigate(`/workers/${cert.workerId}`);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: '#171717',
                    color: '#ffffff',
                    border: '1px solid #171717',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2e2e2e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#171717';
                  }}
                >
                  Ir al trabajador
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CertDetailDrawer;
