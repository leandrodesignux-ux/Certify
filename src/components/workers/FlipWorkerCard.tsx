import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { mockMeshes } from '../../data/mockData';
import { getComplianceColor } from '../../utils/colors';
import { ProgressBar } from '../ui/ProgressBar';
import { Eye, RotateCcw, AlertCircle } from 'lucide-react';

interface Props { worker: Worker; index?: number; }

function FlipWorkerCardFn({ worker, index = 0 }: Props) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const scoreColor = getComplianceColor(worker.complianceScore);
  const expired = worker.certifications.some(c => c.estado === 'vencido');
  const meshes = mockMeshes.filter(m => worker.activeMeshes.includes(m.id));
  const vigentes = worker.certifications.filter(c => c.estado === 'vigente').length;
  const vencidas = worker.certifications.filter(c => c.estado === 'vencido').length;
  const proximas = worker.certifications.filter(c => c.estado === 'proximo_vencer').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16,1,0.3,1] }}
      className="flex flex-col gap-2"
    >
      <div style={{ perspective: '1200px' }} className="w-full relative">
        <div style={{ height: '340px' }}>
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
            onClick={() => setFlipped(f => !f)}
            whileHover={{ scale: 1.02 }}
          >
          {/* FRONT */}
          <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
            className="rounded-2xl overflow-hidden border border-[rgba(0,229,255,0.15)] bg-[#111827] shadow-lg">
            {expired && (
              <div className="absolute top-3 right-3 z-20 w-7 h-7 bg-[#FF3D57] rounded-full flex items-center justify-center shadow-[0_0_14px_rgba(255,61,87,0.7)] animate-pulse">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="relative h-52 overflow-hidden">
              {worker.foto
                ? <img src={worker.foto} alt={worker.nombre} className="w-full h-full object-cover object-top" />
                : <div className="w-full h-full bg-[#1C2333] flex items-center justify-center"><span className="text-5xl font-bold text-[#00E5FF]">{initials}</span></div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
              <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border bg-[#111827]/80 ${scoreColor} border-current`}>
                {worker.complianceScore}%
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(0,229,255,0.2)] text-[#00E5FF] border border-[rgba(0,229,255,0.4)]">
                {worker.area}
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="font-bold text-[#F0F4FF] text-sm leading-tight">{worker.nombre} {worker.apellidos}</p>
              <p className="text-[11px] text-[#8892A4] mt-0.5 truncate">{worker.cargo}</p>
              <div className="mt-2.5">
                <ProgressBar value={worker.complianceScore} showLabel={false} />
              </div>
            </div>
            <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[#4A5568]">
              <RotateCcw className="w-3 h-3" /><span className="text-[10px]">girar</span>
            </div>
          </div>

          {/* BACK */}
          <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}
            className="rounded-2xl border border-[rgba(0,229,255,0.2)] bg-[#0D1117] p-4 overflow-y-auto">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[rgba(255,255,255,0.07)]">
              {worker.foto
                ? <img src={worker.foto} alt={worker.nombre} className="w-10 h-10 rounded-full object-cover border-2 border-[rgba(0,229,255,0.3)]" />
                : <div className="w-10 h-10 rounded-full bg-[#1C2333] flex items-center justify-center text-[#00E5FF] font-bold text-sm">{initials}</div>
              }
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#F0F4FF] truncate">{worker.nombre} {worker.apellidos}</p>
                <p className="text-[10px] text-[#8892A4]">{worker.rut}</p>
              </div>
            </div>
            <div className="space-y-1.5 mb-3 text-[11px]">
              <div className="flex justify-between gap-2"><span className="text-[#8892A4] shrink-0">Email</span><span className="text-[#F0F4FF] truncate text-right">{worker.email}</span></div>
              <div className="flex justify-between gap-2"><span className="text-[#8892A4] shrink-0">Empresa</span><span className="text-[#F0F4FF] truncate text-right">{worker.empresa}</span></div>
              <div className="flex justify-between gap-2"><span className="text-[#8892A4] shrink-0">Depto.</span><span className="text-[#F0F4FF] text-right">{worker.departamento}</span></div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {vigentes > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(0,230,118,0.15)] text-[#00E676] border border-[rgba(0,230,118,0.3)]">{vigentes} vigentes</span>}
              {vencidas > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(255,61,87,0.15)] text-[#FF3D57] border border-[rgba(255,61,87,0.3)]">{vencidas} vencidas</span>}
              {proximas > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(255,184,0,0.15)] text-[#FFB800] border border-[rgba(255,184,0,0.3)]">{proximas} próx.</span>}
            </div>
            {meshes.length > 0 && (
              <div>
                <p className="text-[10px] text-[#8892A4] uppercase tracking-wider mb-2">Mallas</p>
                <div className="space-y-2">
                  {meshes.map(m => (
                    <div key={m.id}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#F0F4FF] truncate max-w-[75%]">{m.nombre}</span>
                        <span className="text-[#00E5FF] font-mono">{m.completionRate}%</span>
                      </div>
                      <ProgressBar value={m.completionRate} showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[#4A5568]">
              <RotateCcw className="w-3 h-3" /><span className="text-[10px]">volver</span>
            </div>
          </div>
          </motion.div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/workers/${worker.id}`)}
        className="w-full py-2 text-[13px] font-semibold text-[#00E5FF] border border-[rgba(0,229,255,0.25)] rounded-xl bg-transparent hover:bg-[rgba(0,229,255,0.08)] hover:border-[rgba(0,229,255,0.5)] transition-all duration-150 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Ver Detalles
      </button>
    </motion.div>
  );
}

export const FlipWorkerCard = memo(FlipWorkerCardFn);
