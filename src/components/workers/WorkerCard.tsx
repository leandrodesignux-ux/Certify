import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { mockMeshes } from '../../data/mockData';
import { getComplianceColor } from '../../utils/colors';
import { ProgressBar } from '../ui/ProgressBar';
import { Eye, AlertCircle, RotateCcw } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  index?: number;
}

function WorkerCardComponent({ worker, index = 0 }: WorkerCardProps) {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const hasExpiredCerts = worker.certifications.some(c => c.estado === 'vencido');
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const scoreColor = getComplianceColor(worker.complianceScore);
  const workerMeshes = mockMeshes.filter(m => worker.activeMeshes.includes(m.id));
  const vigentes = worker.certifications.filter(c => c.estado === 'vigente').length;
  const vencidas = worker.certifications.filter(c => c.estado === 'vencido').length;
  const proximas = worker.certifications.filter(c => c.estado === 'proximo_vencer').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col gap-2 hover-lift card-clickable"
    >
      {/* Flip container — perspective here, NO preserve-3d, NO transform on this level */}
      <div
        className="relative cursor-pointer"
        style={{ height: '340px', perspective: '1200px', transformStyle: 'flat' }}
        onClick={() => setIsFlipped(f => !f)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
        >
          {/* FRONT */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: '6px' }}
            className="absolute inset-0 overflow-hidden border border-[#ebebeb] bg-white"
          >
            {hasExpiredCerts && (
              <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.3)' }}>
                <AlertCircle className="w-4 h-4" style={{ color: '#e5484d' }} strokeWidth={1.5} />
              </div>
            )}
            {/* Photo */}
            <div className="relative h-[200px] w-full overflow-hidden">
              {worker.foto ? (
                <img src={worker.foto} alt={worker.nombre} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
                  <span className="text-5xl font-semibold" style={{ color: '#4d4d4d' }}>{initials}</span>
                </div>
              )}
              {/* Score badge */}
              <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-sm font-semibold bg-white/90 border ${scoreColor}`} style={{ borderColor: '#ebebeb' }}>
                {worker.complianceScore}%
              </div>
              {/* Area badge */}
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#ffffff' }}>
                {worker.area}
              </div>
            </div>
            {/* Info */}
            <div className="px-4 pt-3 pb-2">
              <h3 className="font-display text-lg font-semibold leading-tight truncate" style={{ color: '#171717' }}>
                {worker.nombre} {worker.apellidos}
              </h3>
              <p className="text-xs truncate mt-0.5" style={{ color: '#666666' }}>{worker.cargo}</p>
              <div className="mt-3">
                <ProgressBar value={worker.complianceScore} showLabel={false} />
              </div>
            </div>
            {/* Flip hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1" style={{ color: '#a8a8a8' }}>
              <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[10px]">ver datos</span>
            </div>
          </div>

          {/* BACK */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflowY: 'auto', backgroundColor: '#ffffff', border: '1px solid #ebebeb', borderRadius: '6px' }}
            className="absolute inset-0 p-4"
          >
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #ebebeb' }}>
              {worker.foto ? (
                <img src={worker.foto} alt={worker.nombre} className="w-10 h-10 rounded-full object-cover" style={{ border: '1px solid #ebebeb' }} />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium" style={{ backgroundColor: '#f0f0f0', border: '1px solid #ebebeb', color: '#4d4d4d' }}>{initials}</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#171717' }}>{worker.nombre} {worker.apellidos}</p>
                <p className="text-[10px] font-mono" style={{ color: '#a8a8a8' }}>{worker.rut}</p>
              </div>
            </div>
            <div className="space-y-1 mb-4 text-xs">
              <div className="flex justify-between"><span style={{ color: '#666666' }}>Email</span><span className="truncate max-w-[60%] text-right" style={{ color: '#171717' }}>{worker.email}</span></div>
              <div className="flex justify-between"><span style={{ color: '#666666' }}>Empresa</span><span className="truncate max-w-[60%] text-right" style={{ color: '#171717' }}>{worker.empresa}</span></div>
              <div className="flex justify-between"><span style={{ color: '#666666' }}>Departamento</span><span style={{ color: '#171717' }}>{worker.departamento}</span></div>
            </div>
            <div className="flex gap-2 mb-4">
              {vigentes > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(41,122,58,0.08)', color: '#297a3a', border: '1px solid rgba(41,122,58,0.2)' }}>{vigentes} vigentes</span>}
              {vencidas > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(229,72,77,0.08)', color: '#e5484d', border: '1px solid rgba(229,72,77,0.2)' }}>{vencidas} vencidas</span>}
              {proximas > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(178,80,0,0.08)', color: '#b25000', border: '1px solid rgba(178,80,0,0.2)' }}>{proximas} próx.</span>}
            </div>
            {workerMeshes.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#a8a8a8', letterSpacing: '0.04em' }}>Mallas en curso</p>
                <div className="space-y-2">
                  {workerMeshes.map(mesh => (
                    <div key={mesh.id}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="truncate max-w-[70%]" style={{ color: '#171717' }}>{mesh.nombre}</span>
                        <span style={{ color: '#666666' }}>{mesh.completionRate}%</span>
                      </div>
                      <ProgressBar value={mesh.completionRate} showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '8px',
                backgroundColor: '#171717',
                border: '1px solid #171717',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Eye className="w-3 h-3" strokeWidth={1.5} />
              Ver perfil completo
            </button>
            <div className="absolute bottom-2 right-3 flex items-center gap-1" style={{ color: '#a8a8a8' }}>
              <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[10px]">volver</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ver Detalles button — always visible below card */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
        className="w-full py-2 text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
        style={{ color: '#4d4d4d', border: '1px solid #ebebeb', backgroundColor: 'transparent', borderRadius: '6px' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Eye className="w-4 h-4" strokeWidth={1.5} />
        Ver Detalles
      </button>
    </motion.div>
  );
}

export const WorkerCard = memo(WorkerCardComponent);
