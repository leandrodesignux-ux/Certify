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
      whileHover={{ y: -4, scale: 1.01 }}
      className="w-full flex flex-col gap-2"
      style={{ perspective: '1000px' }}
    >
      {/* Flip container */}
      <div
        className="relative cursor-pointer"
        style={{ height: '340px' }}
        onClick={() => setIsFlipped(f => !f)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
        >
          {/* FRONT */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-[rgba(0,229,255,0.15)] bg-[#111827]"
          >
            {hasExpiredCerts && (
              <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-[#FF3D57] rounded-full flex items-center justify-center animate-pulse shadow-[0_0_12px_rgba(255,61,87,0.6)]">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            )}
            {/* Photo */}
            <div className="relative h-[200px] w-full overflow-hidden">
              {worker.foto ? (
                <img src={worker.foto} alt={worker.nombre} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full bg-[#1C2333] flex items-center justify-center">
                  <span className="text-5xl font-bold text-[#00E5FF]">{initials}</span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />
              {/* Score badge */}
              <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-sm font-bold bg-[#111827]/80 border border-current ${scoreColor}`}>
                {worker.complianceScore}%
              </div>
              {/* Area badge */}
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(0,229,255,0.15)] text-[#00E5FF] border border-[rgba(0,229,255,0.3)]">
                {worker.area}
              </div>
            </div>
            {/* Info */}
            <div className="px-4 pt-3 pb-2">
              <h3 className="font-display text-lg font-bold text-[#F0F4FF] leading-tight truncate">
                {worker.nombre} {worker.apellidos}
              </h3>
              <p className="text-xs text-[#8892A4] truncate mt-0.5">{worker.cargo}</p>
              <div className="mt-3">
                <ProgressBar value={worker.complianceScore} showLabel={false} />
              </div>
            </div>
            {/* Flip hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[#4A5568]">
              <RotateCcw className="w-3 h-3" />
              <span className="text-[10px]">ver datos</span>
            </div>
          </div>

          {/* BACK */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute inset-0 rounded-xl border border-[rgba(0,229,255,0.2)] bg-[#0D1117] p-4 overflow-y-auto"
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[rgba(0,229,255,0.1)]">
              {worker.foto ? (
                <img src={worker.foto} alt={worker.nombre} className="w-10 h-10 rounded-full object-cover border-2 border-[rgba(0,229,255,0.3)]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1C2333] flex items-center justify-center text-[#00E5FF] font-bold">{initials}</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#F0F4FF] truncate">{worker.nombre} {worker.apellidos}</p>
                <p className="text-[10px] text-[#8892A4]">{worker.rut}</p>
              </div>
            </div>
            <div className="space-y-1 mb-4 text-xs">
              <div className="flex justify-between"><span className="text-[#8892A4]">Email</span><span className="text-[#F0F4FF] truncate max-w-[60%] text-right">{worker.email}</span></div>
              <div className="flex justify-between"><span className="text-[#8892A4]">Empresa</span><span className="text-[#F0F4FF] truncate max-w-[60%] text-right">{worker.empresa}</span></div>
              <div className="flex justify-between"><span className="text-[#8892A4]">Departamento</span><span className="text-[#F0F4FF]">{worker.departamento}</span></div>
            </div>
            <div className="flex gap-2 mb-4">
              {vigentes > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[rgba(0,230,118,0.15)] text-[#00E676] border border-[rgba(0,230,118,0.3)]">{vigentes} vigentes</span>}
              {vencidas > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[rgba(255,61,87,0.15)] text-[#FF3D57] border border-[rgba(255,61,87,0.3)]">{vencidas} vencidas</span>}
              {proximas > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[rgba(255,184,0,0.15)] text-[#FFB800] border border-[rgba(255,184,0,0.3)]">{proximas} próx.</span>}
            </div>
            {workerMeshes.length > 0 && (
              <div>
                <p className="text-[10px] text-[#8892A4] uppercase tracking-wider mb-2">Mallas en curso</p>
                <div className="space-y-2">
                  {workerMeshes.map(mesh => (
                    <div key={mesh.id}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#F0F4FF] truncate max-w-[70%]">{mesh.nombre}</span>
                        <span className="text-[#00E5FF]">{mesh.completionRate}%</span>
                      </div>
                      <ProgressBar value={mesh.completionRate} showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[#4A5568]">
              <RotateCcw className="w-3 h-3" />
              <span className="text-[10px]">volver</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ver Detalles button — always visible below card */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
        className="w-full py-2 text-sm font-semibold text-[#00E5FF] border border-[rgba(0,229,255,0.25)] rounded-xl bg-transparent hover:bg-[rgba(0,229,255,0.08)] hover:border-[rgba(0,229,255,0.5)] transition-all duration-150 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Ver Detalles
      </button>
    </motion.div>
  );
}

export const WorkerCard = memo(WorkerCardComponent);
