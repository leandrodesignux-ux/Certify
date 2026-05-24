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

  const scoreColor = worker.complianceScore >= 80 ? '#729362'
    : worker.complianceScore >= 60 ? '#FFB800' : '#FF3D57';

  const cardBorderColor = worker.complianceScore >= 80
    ? 'rgba(114,147,98,0.35)'
    : worker.complianceScore >= 60
    ? 'rgba(255,184,0,0.35)'
    : 'rgba(255,61,87,0.45)';

  const criticalOverlay = worker.complianceScore < 60
    ? 'linear-gradient(to top, rgba(255,61,87,0.07) 0%, transparent 70%)'
    : 'none';

  const cardBorderLeft = worker.complianceScore >= 80
    ? '3px solid rgba(114,147,98,0.6)'
    : worker.complianceScore >= 60
    ? '3px solid rgba(255,184,0,0.5)'
    : '3px solid rgba(255,61,87,0.7)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16,1,0.3,1] }}
      className="hover-lift card-clickable"
      style={{ display: 'flex', flexDirection: 'column', gap: '0px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${cardBorderColor}`, borderLeft: cardBorderLeft }}
    >
      {/* Card flip container — perspective here, NO preserve-3d, NO transform on this level */}
      <div style={{ perspective: '1200px', transformStyle: 'flat', width: '100%' }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '300px',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={() => setFlipped(f => !f)}
        >
          {/* ===== FRONT ===== */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
            borderRadius: '0',
            overflow: 'hidden',
            backgroundColor: '#1a1040',
          }}>
            {/* Alert badge */}
            {expired && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 20,
                backgroundColor: 'rgba(255,61,87,0.9)',
                borderRadius: '20px',
                padding: '3px 8px 3px 5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 0 10px rgba(255,61,87,0.5)',
              }}>
                <AlertCircle style={{ width: '11px', height: '11px', color: 'white' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'white', letterSpacing: '0.3px' }}>VENCIDA</span>
              </div>
            )}

            {/* Full photo */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              {worker.foto
                ? <img src={worker.foto} alt={`${worker.nombre} ${worker.apellidos}, ${worker.cargo}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                : <div style={{
                    width: '100%', height: '100%',
                    backgroundColor: '#231455',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: '"Barlow Condensed"', fontSize: '64px', fontWeight: 700, color: '#9b6ab5' }}>{initials}</span>
                  </div>
              }
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,16,64,0.95) 0%, rgba(26,16,64,0.3) 50%, transparent 100%)',
              }} />
              {/* Critical overlay for low compliance */}
              {worker.complianceScore < 60 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: criticalOverlay,
                  pointerEvents: 'none',
                  zIndex: 1,
                  borderRadius: 'inherit',
                }} />
              )}
              {/* Area badge top-left */}
              <div style={{
                position: 'absolute', top: '10px', left: '10px',
                backgroundColor: 'rgba(91,34,119,0.2)',
                border: '1px solid rgba(91,34,119,0.4)',
                borderRadius: '20px', padding: '3px 10px',
                fontSize: '10px', fontWeight: 700, color: '#c49fe0',
              }}>{worker.area}</div>
              {/* Score badge bottom-right */}
              <div style={{
                position: 'absolute', bottom: '10px', right: '10px',
                backgroundColor: 'rgba(19,11,58,0.9)',
                border: `1px solid ${scoreColor}`,
                borderRadius: '20px', padding: '4px 12px',
                fontSize: '13px', fontWeight: 700, color: scoreColor,
              }}>{worker.complianceScore}%</div>
              {/* Name + cargo overlay bottom-left */}
              <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                <p style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: '17px', fontWeight: 700, color: '#F0F4FF',
                  lineHeight: 1.2, marginBottom: '2px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}>
                  {worker.nombre} {worker.apellidos}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
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
                <RotateCcw style={{ width: '12px', height: '12px', color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Ver info</span>
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
            backgroundColor: '#130b3a',
            border: '1px solid rgba(91,34,119,0.3)',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {/* Avatar + nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid rgba(91,34,119,0.2)' }}>
              {worker.foto
                ? <img src={worker.foto} alt={`Foto de perfil de ${worker.nombre} ${worker.apellidos}`} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(91,34,119,0.4)', flexShrink: 0 }} />
                : <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#231455', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9b6ab5', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>{initials}</div>
              }
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: '"Barlow Condensed"', fontSize: '16px', fontWeight: 700, color: '#F0F4FF', lineHeight: 1.2 }}>{worker.nombre} {worker.apellidos}</p>
                <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontFamily: '"JetBrains Mono"', marginTop: '2px' }}>{worker.rut}</p>
              </div>
            </div>

            {/* DATOS PERSONALES */}
            <div>
              <p style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>DATOS PERSONALES</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                {[
                  { label: 'RUT', value: worker.rut },
                  { label: 'Email', value: worker.email },
                  { label: 'Faena', value: worker.departamento },
                  { label: 'VP', value: worker.area },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>{item.label}</p>
                    <p style={{ fontSize: '11px', color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MALLAS EN CURSO */}
            {meshes.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>MALLAS EN CURSO</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {meshes.slice(0, 3).map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontSize: '10px', color: '#F0F4FF', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nombre}</p>
                      <span style={{ fontSize: '9px', backgroundColor: 'rgba(91,34,119,0.2)', color: '#c49fe0', borderRadius: '4px', padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>
                        {m.completionRate} de 15
                      </span>
                      <span style={{ fontSize: '10px', color: '#c49fe0', cursor: 'pointer', flexShrink: 0, fontWeight: 600 }}>Ver</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cert badges */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
              {vigentes > 0 && <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, backgroundColor: 'rgba(114,147,98,0.18)', color: '#8fb87a', border: '1px solid rgba(114,147,98,0.4)' }}>{vigentes} vigentes</span>}
              {vencidas > 0 && <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, backgroundColor: 'rgba(255,61,87,0.15)', color: '#FF3D57', border: '1px solid rgba(255,61,87,0.3)' }}>{vencidas} vencidas</span>}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '8px',
                backgroundColor: 'rgba(91,34,119,0.2)',
                border: '1px solid rgba(91,34,119,0.4)',
                borderRadius: '6px',
                color: '#c49fe0',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Eye style={{ width: '13px', height: '13px' }} />
              Ver perfil completo
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <RotateCcw style={{ width: '11px', height: '11px', color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>volver</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* VER PERFIL button — debajo de la card, como la imagen de referencia */}
      <button
        className="focus-ring"
        onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#5b2277',
          color: '#F0F4FF',
          border: 'none',
          borderRadius: '0',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.5px',
          fontFamily: '"Barlow Condensed", sans-serif',
          transition: 'background-color 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7c4dab')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5b2277')}
      >
        <Eye style={{ width: '14px', height: '14px' }} />
        VER MÁS DETALLES
      </button>
    </motion.div>
  );
}

export const FlipWorkerCard = memo(FlipWorkerCardFn);
