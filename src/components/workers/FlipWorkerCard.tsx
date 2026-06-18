import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { mockMeshes } from '../../data/mockData';
import { ProgressBar } from '../ui/ProgressBar';
import { RotateCcw, AlertCircle, Eye } from 'lucide-react';

interface Props { worker: Worker; index?: number; }

function FlipWorkerCardFn({ worker, index = 0 }: Props) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const expired = worker.certifications.some(c => c.estado === 'vencido');
  const meshes = mockMeshes.filter(m => worker.activeMeshes.includes(m.id));
  const vigentes = worker.certifications.filter(c => c.estado === 'vigente').length;
  const vencidas = worker.certifications.filter(c => c.estado === 'vencido').length;

  const scoreColor = worker.complianceScore >= 80 ? '#297a3a'
    : worker.complianceScore >= 60 ? '#b25000' : '#e5484d';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16,1,0.3,1] }}
      className="hover-lift card-clickable"
      style={{ display: 'flex', flexDirection: 'column', gap: '0px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ebebeb', borderLeft: `3px solid ${scoreColor}` }}
    >
      {/* Card flip container — perspective and preserve-3d for proper 3D rendering */}
      <div style={{ perspective: '1200px', transformStyle: 'preserve-3d', width: '100%', height: 'clamp(260px, 40vw, 300px)', overflow: 'visible' }}>
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`Voltear card de ${worker.nombre} ${worker.apellidos}`}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            transformStyle: 'preserve-3d',
            width: '100%',
            height: 'clamp(260px, 40vw, 300px)',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={() => setFlipped(f => !f)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}
        >
          {/* ===== FRONT ===== */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
            borderRadius: '0',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}>
            {/* Alert badge */}
            {expired && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 20,
                backgroundColor: 'rgba(229,72,77,0.08)',
                border: '1px solid rgba(229,72,77,0.3)',
                borderRadius: '20px',
                padding: '3px 8px 3px 5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <AlertCircle style={{ width: '11px', height: '11px', color: '#e5484d' }} strokeWidth={1.5} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#e5484d', letterSpacing: '0.3px' }}>VENCIDA</span>
              </div>
            )}

            {/* Full photo */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              {worker.foto
                ? <img src={worker.foto} alt={`${worker.nombre} ${worker.apellidos}, ${worker.cargo}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                : <div style={{
                    width: '100%', height: '100%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '64px', fontWeight: 500, color: '#4d4d4d' }}>{initials}</span>
                  </div>
              }
              {/* Gradient overlay — subtle for light mode */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
              }} />
              {/* Area badge top-left */}
              <div style={{
                position: 'absolute', top: '10px', left: '10px',
                backgroundColor: 'rgba(0,0,0,0.45)',
                borderRadius: '9999px', padding: '3px 10px',
                fontSize: '10px', fontWeight: 500, color: '#ffffff',
              }}>{worker.area}</div>
              {/* Score badge bottom-right */}
              <div style={{
                position: 'absolute', bottom: '10px', right: '10px',
                backgroundColor: 'rgba(255,255,255,0.92)',
                border: `1px solid #ebebeb`,
                borderRadius: '9999px', padding: '4px 12px',
                fontSize: '13px', fontWeight: 600, color: scoreColor,
              }}>{worker.complianceScore}%</div>
              {/* Name + cargo overlay bottom-left */}
              <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                <p style={{
                  fontSize: '17px', fontWeight: 600, color: '#ffffff',
                  lineHeight: 1.2, marginBottom: '2px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}>
                  {worker.nombre} {worker.apellidos}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {worker.cargo}
                </p>
              </div>
            </div>

            {/* Bottom info strip */}
            <div style={{
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <ProgressBar value={worker.complianceScore} showLabel={false} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px', flexShrink: 0 }}>
                <RotateCcw style={{ width: '12px', height: '12px', color: '#a8a8a8' }} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', color: '#a8a8a8', fontWeight: 500 }}>Ver info</span>
              </div>
            </div>
          </div>

          {/* ===== BACK ===== */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
            transform: 'rotateY(180deg)',
            borderRadius: '0',
            backgroundColor: '#ffffff',
            border: '1px solid #ebebeb',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {/* Avatar + nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #ebebeb' }}>
              {worker.foto
                ? <img src={worker.foto} alt={`Foto de perfil de ${worker.nombre} ${worker.apellidos}`} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ebebeb', flexShrink: 0 }} />
                : <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0f0f0', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4d4d4d', fontWeight: 500, fontSize: '15px', flexShrink: 0 }}>{initials}</div>
              }
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#171717', lineHeight: 1.2 }}>{worker.nombre} {worker.apellidos}</p>
                <p style={{ fontSize: '10px', color: '#a8a8a8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{worker.rut}</p>
              </div>
            </div>

            {/* DATOS PERSONALES */}
            <div>
              <p style={{ fontSize: '9px', fontWeight: 600, color: '#a8a8a8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>DATOS PERSONALES</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                {[
                  { label: 'RUT', value: worker.rut },
                  { label: 'Email', value: worker.email },
                  { label: 'Faena', value: worker.departamento },
                  { label: 'VP', value: worker.area },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: '9px', color: '#a8a8a8' }}>{item.label}</p>
                    <p style={{ fontSize: '11px', color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MALLAS EN CURSO */}
            {meshes.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 600, color: '#a8a8a8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>MALLAS EN CURSO</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {meshes.slice(0, 3).map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontSize: '10px', color: '#171717', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nombre}</p>
                      <span style={{ fontSize: '9px', backgroundColor: '#f5f5f5', color: '#666666', borderRadius: '4px', padding: '1px 5px', fontWeight: 500, flexShrink: 0 }}>
                        {m.completionRate} de 15
                      </span>
                      <span style={{ fontSize: '10px', color: '#4d4d4d', cursor: 'pointer', flexShrink: 0, fontWeight: 500 }}>Ver</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cert badges */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
              {vigentes > 0 && <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 500, backgroundColor: 'rgba(41,122,58,0.08)', color: '#297a3a', border: '1px solid rgba(41,122,58,0.2)' }}>{vigentes} vigentes</span>}
              {vencidas > 0 && <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 500, backgroundColor: 'rgba(229,72,77,0.08)', color: '#e5484d', border: '1px solid rgba(229,72,77,0.2)' }}>{vencidas} vencidas</span>}
            </div>

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
              <Eye style={{ width: '13px', height: '13px' }} strokeWidth={1.5} />
              Ver perfil completo
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <RotateCcw style={{ width: '11px', height: '11px', color: '#a8a8a8' }} strokeWidth={1.5} />
              <span style={{ fontSize: '10px', color: '#a8a8a8' }}>volver</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* VER PERFIL button — debajo de la card, como la imagen de referencia */}
      <button
        className="focus-ring"
        aria-label={`Ver perfil completo de ${worker.nombre} ${worker.apellidos}`}
        onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#171717',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2e2e2e')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#171717')}
      >
        <Eye style={{ width: '14px', height: '14px' }} strokeWidth={1.5} />
        VER MÁS DETALLES
      </button>
    </motion.div>
  );
}

export const FlipWorkerCard = memo(FlipWorkerCardFn);
