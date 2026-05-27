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

  if (!cert) return null;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'vigente': return '#729362';
      case 'proximo_vencer': return '#FFB800';
      case 'vencido': return '#FF3D57';
      default: return '#7c4dab';
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
            className="fixed inset-0 bg-[rgba(13,9,32,0.6)] backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-label="Detalle de certificación"
            aria-modal="true"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="fixed right-0 top-0 bottom-0 z-50"
            style={{
              width: 'min(420px, 100vw)',
              background: 'rgba(26,16,64,0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid var(--border-brand)',
              boxShadow: '-20px 0 60px rgba(13,9,32,0.5)',
            }}
          >
            {/* Header */}
            <div 
              className="relative p-6 border-b"
              style={{ borderColor: 'var(--border-brand)' }}
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-1.5 rounded-md hover:bg-[rgba(91,34,119,0.15)] transition-colors"
                aria-label="Cerrar detalle"
              >
                <X className="w-5 h-5 text-[#8892A4]" />
              </button>

              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: `${statusColor}15` }}
                >
                  <Award 
                    className="w-6 h-6" 
                    style={{ color: statusColor }} 
                  />
                </div>
                
                <div className="flex-1">
                  <h2 
                    className="text-xl font-bold mb-2"
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      background: `linear-gradient(135deg, ${statusColor}, #F0F4FF)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {cert.nombre}
                  </h2>
                  <Badge status={cert.estado} />
                </div>
              </div>
            </div>

            {/* Worker Section */}
            <div 
              className="p-5 border-b"
              style={{ borderColor: 'var(--border-brand)' }}
            >
              <div className="flex items-center gap-3">
                {worker?.foto ? (
                  <img
                    src={worker.foto}
                    alt={`${worker.nombre} ${worker.apellidos}`}
                    className="w-12 h-12 rounded-full object-cover border border-[rgba(91,34,119,0.3)]"
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: 'rgba(91,34,119,0.15)',
                      color: '#9b6ab5'
                    }}
                  >
                    {worker ? getInitials(worker.nombre, worker.apellidos) : '?'}
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="text-base font-bold text-[#F0F4FF]">
                    {worker ? `${worker.nombre} ${worker.apellidos}` : 'Trabajador no encontrado'}
                  </p>
                  <p className="text-sm text-[#8892A4]">{worker?.cargo || 'Sin cargo'}</p>
                </div>

                {worker?.area && (
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(155,106,181,0.15)',
                      color: '#9b6ab5',
                      border: '1px solid rgba(155,106,181,0.3)',
                    }}
                  >
                    {worker.area}
                  </div>
                )}
              </div>
            </div>

            {/* Dates Section */}
            <div 
              className="p-5 border-b"
              style={{ borderColor: 'var(--border-brand)' }}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                    Fecha Obtención
                  </p>
                  <p className="text-sm text-[#F0F4FF]">
                    {new Date(cert.fechaObtension).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
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
                  <p className="text-xs text-[#6B7280]">Vida de la certificación</p>
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
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
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
              className="p-5 border-b"
              style={{ borderColor: 'var(--border-brand)' }}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                    Emisor
                  </p>
                  <p className="text-sm text-[#F0F4FF]">{cert.emisor}</p>
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                    Tipo
                  </p>
                  <Badge status={cert.tipo} />
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-1">
                    ID Interno
                  </p>
                  <p 
                    className="text-xs font-mono"
                    style={{ color: '#6B7280' }}
                  >
                    {cert.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div 
              className="p-4 border-t mt-auto"
              style={{ borderColor: 'var(--border-brand)' }}
            >
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-brand)',
                    color: '#8892A4',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
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
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'rgba(91,34,119,0.2)',
                    borderColor: 'rgba(91,34,119,0.4)',
                    color: '#c49fe0',
                    border: '1px solid',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.2)';
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
