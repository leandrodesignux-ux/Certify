import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { mockMeshes } from '../../data/mockData';
import { AlertCircle, Eye, GraduationCap } from 'lucide-react';

interface Props { worker: Worker; index?: number; }

function FlipWorkerCardFn({ worker, index = 0 }: Props) {
  const navigate = useNavigate();
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const expired = worker.certifications.some(c => c.estado === 'vencido');
  const meshes = mockMeshes.filter(m => worker.activeMeshes.includes(m.id));
  const vigentes = worker.certifications.filter(c => c.estado === 'vigente').length;
  const vencidas = worker.certifications.filter(c => c.estado === 'vencido').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16,1,0.3,1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '6px',
        overflow: 'hidden',
        borderTop: `2px solid ${expired ? '#e5484d' : vencidas > 0 ? '#b25000' : '#297a3a'}`,
        boxShadow: 'rgba(0,0,0,0.06) 0px 1px 2px 0px, rgba(0,0,0,0.06) 0px 0px 0px 1px',
        backgroundColor: 'var(--surface-card)',
      }}
    >
      {/* ── HEADER ── */}
      {/* Banda neutra igual para todas las cards */}
      <div style={{ position: 'relative', height: '64px', backgroundColor: 'var(--surface-soft)', flexShrink: 0 }}>
        {/* Badge VENCIDA — esquina superior derecha sobre la banda */}
        {expired && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px', zIndex: 10,
            backgroundColor: 'rgba(229,72,77,0.10)',
            border: '1px solid rgba(229,72,77,0.30)',
            borderRadius: '9999px', padding: '3px 8px 3px 5px',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <AlertCircle style={{ width: '11px', height: '11px', color: '#e5484d' }} strokeWidth={1.5} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#e5484d', letterSpacing: '0.3px' }}>VENCIDA</span>
          </div>
        )}

        {/* Avatar circular — montado a caballo: bottom = -(72px/2) = -36px */}
        <div style={{
          position: 'absolute',
          bottom: '-36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--surface-card)',
            backgroundColor: 'var(--surface-soft)',
            boxShadow: '0 0 0 1px var(--border-default)',
          }}>
            {worker.foto
              ? <img src={worker.foto} alt={`${worker.nombre} ${worker.apellidos}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-soft)' }}>
                  <span style={{ fontSize: '26px', fontWeight: 500, color: 'var(--color-text-muted)' }}>{initials}</span>
                </div>
            }
          </div>
        </div>
      </div>

      {/* Nombre + cargo — padding-top deja espacio para la mitad inferior del avatar (36px) + gap */}
      <div style={{ textAlign: 'center', paddingTop: '44px', paddingLeft: '14px', paddingRight: '14px', paddingBottom: '12px' }}>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-brand)', lineHeight: 1.2, letterSpacing: 'var(--tracking-tight)', margin: 0 }}>
          {worker.nombre} {worker.apellidos}
        </p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', marginTop: '3px', marginBottom: 0 }}>{worker.cargo}</p>
        {(vigentes > 0 || vencidas > 0) && (
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
            {vigentes > 0 && <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 500, backgroundColor: 'rgba(41,122,58,0.08)', color: '#297a3a', border: '1px solid rgba(41,122,58,0.2)' }}>{vigentes} vigentes</span>}
            {vencidas > 0 && <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 500, backgroundColor: 'rgba(229,72,77,0.08)', color: '#e5484d', border: '1px solid rgba(229,72,77,0.2)' }}>{vencidas} vencidas</span>}
          </div>
        )}
      </div>

      {/* ── DATOS PERSONALES ── */}
      {/* Label de sección con banda de fondo sutil */}
      <div style={{ backgroundColor: 'var(--surface-soft)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)', padding: '4px 14px' }}>
        <p style={{ fontSize: 'var(--text-micro)', fontWeight: 600, color: 'var(--color-text-faint)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0 }}>DATOS PERSONALES</p>
      </div>
      {/* Grid 2 col — min-width:0 en cada celda es crítico para que ellipsis funcione */}
      <div className="worker-data-grid" style={{ gap: '0', padding: '10px 14px 12px' }}>
        {[
          { label: 'RUT',   value: worker.rut },
          { label: 'Email', value: worker.email },
          { label: 'Faena', value: worker.departamento },
          { label: 'VP',    value: worker.area },
        ].map(item => (
          <div key={item.label} style={{ minWidth: 0, paddingRight: '8px', marginBottom: '6px' }}>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', margin: 0, marginBottom: '1px', letterSpacing: '0.03em' }}>{item.label}</p>
            <p style={{ fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--color-brand)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── MALLAS EN CURSO ── */}
      <div style={{ backgroundColor: 'var(--surface-soft)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)', padding: '4px 14px' }}>
        <p style={{ fontSize: 'var(--text-micro)', fontWeight: 600, color: 'var(--color-text-faint)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0 }}>MALLAS EN CURSO</p>
      </div>
      <div style={{ padding: '10px 14px 12px' }}>
        {meshes.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {meshes.slice(0, 3).map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                  <GraduationCap style={{ width: '13px', height: '13px', color: 'var(--color-text-faint)', flexShrink: 0 }} strokeWidth={1.5} />
                  <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-brand)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{m.nombre}</p>
                  <span style={{ fontSize: 'var(--text-micro)', backgroundColor: 'var(--surface-soft)', color: 'var(--color-text-muted)', borderRadius: 'var(--radius-full)', padding: '1px 7px', fontWeight: 500, flexShrink: 0, border: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>
                    {m.completionRate} de 15
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
                    style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', cursor: 'pointer', flexShrink: 0, fontWeight: 500, background: 'none', border: 'none', padding: 0 }}
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
            {meshes.length > 3 && (
              <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', margin: '6px 0 0', paddingLeft: '20px' }}>
                +{meshes.length - 3} más
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', margin: 0 }}>Sin mallas asignadas</p>
        )}
      </div>

      {/* Espaciador — empuja el botón al pie sin estirar las secciones */}
      <div style={{ flex: 1 }} />

      {/* ── BOTÓN VER MÁS DETALLES ── */}
      <button
        className="focus-ring"
        aria-label={`Ver perfil completo de ${worker.nombre} ${worker.apellidos}`}
        onClick={(e) => { e.stopPropagation(); navigate(`/workers/${worker.id}`); }}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0',
          fontSize: 'var(--text-body-sm)',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
      >
        <Eye style={{ width: '14px', height: '14px' }} strokeWidth={1.5} />
        VER MÁS DETALLES
      </button>
    </motion.div>
  );
}

export const FlipWorkerCard = memo(FlipWorkerCardFn);
