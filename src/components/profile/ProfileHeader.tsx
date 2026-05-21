import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import type { Worker } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatRut } from '../../utils/format';

interface ProfileHeaderProps {
  worker: Worker;
}

function getComplianceColorAndLabel(score: number): { color: string; label: string } {
  if (score >= 90) return { color: '#00E5FF', label: 'Excelente' };
  if (score >= 70) return { color: '#AAFF00', label: 'Bueno' };
  if (score >= 50) return { color: '#FFB800', label: 'Regular' };
  return { color: '#FF3D57', label: 'Crítico' };
}

export function ProfileHeader({ worker }: ProfileHeaderProps) {
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const compliance = getComplianceColorAndLabel(worker.complianceScore);
  const activeCerts = worker.certifications.filter((c) => c.estado === 'vigente').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #0D1B2A 0%, #111827 100%)',
        border: '1px solid rgba(0,229,255,0.15)',
      }}
    >
      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.2,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,229,255,0.2) 1px, transparent 0)',
        backgroundSize: '20px 20px', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'stretch', minHeight: '180px' }}>

        {/* FOTO — panel izquierdo, ocupa todo el alto */}
        <div style={{ width: '200px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {worker.foto
            ? <img src={worker.foto} alt={worker.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', backgroundColor: '#1C2333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Barlow Condensed"', fontSize: '56px', fontWeight: 700, color: '#00E5FF' }}>{initials}</span>
              </div>
          }
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, transparent 70%, rgba(13,27,42,0.8) 100%)',
          }} />
        </div>

        {/* INFO CENTRAL */}
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
          {/* Badge "PERFIL DE TRABAJADOR" */}
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#00E5FF', textTransform: 'uppercase' }}>
            PERFIL DE TRABAJADOR
          </p>
          {/* Nombre */}
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '32px', fontWeight: 700, color: '#F0F4FF',
            lineHeight: 1.1, margin: 0,
          }}>
            {worker.nombre} {worker.apellidos}
          </h1>
          <p style={{ fontSize: '14px', color: '#00E5FF', fontWeight: 500, margin: 0 }}>{worker.cargo}</p>

          {/* Data grid — como "Datos Personales" de la imagen */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginTop: '8px' }}>
            {[
              { label: 'RUT', value: formatRut(worker.rut) },
              { label: 'Email', value: worker.email },
              { label: 'Faena / Depto.', value: worker.departamento },
              { label: 'VP / Área', value: worker.area },
              { label: 'Empresa', value: worker.empresa },
              { label: 'Ingreso', value: new Date(worker.fechaIngreso).toLocaleDateString('es-CL') },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '11px', color: '#4A5568', flexShrink: 0, minWidth: '70px' }}>{item.label}</span>
                <span style={{ fontSize: '12px', color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO — CERTIFICADOS (como la imagen) */}
        <div style={{
          width: '200px', flexShrink: 0,
          backgroundColor: 'rgba(0,229,255,0.05)',
          borderLeft: '1px solid rgba(0,229,255,0.12)',
          padding: '20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#8892A4', letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center' }}>CERTIFICADOS</p>
          <p style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '64px', fontWeight: 700, color: '#F0F4FF', lineHeight: 1, textAlign: 'center',
          }}>
            {activeCerts}
          </p>
          {/* Rango / compliance badge */}
          <div style={{
            backgroundColor: `${compliance.color}20`,
            border: `1px solid ${compliance.color}40`,
            borderRadius: '8px', padding: '6px 14px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '9px', color: '#8892A4', textTransform: 'uppercase', letterSpacing: '1px' }}>RANGO</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: compliance.color, fontFamily: '"Barlow Condensed"' }}>
              {compliance.label.toUpperCase()}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: compliance.color, fontFamily: '"Barlow Condensed"', lineHeight: 1 }}>
              {worker.complianceScore}%
            </p>
          </div>
        </div>

        {/* Botón editar — top right */}
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <Button variant="ghost" size="sm" icon={Edit3}>Editar</Button>
        </div>
      </div>

      {/* Bottom bar — avance general con barra */}
      <div style={{
        borderTop: '1px solid rgba(0,229,255,0.1)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <span style={{ fontSize: '12px', color: '#8892A4', flexShrink: 0 }}>Avance general</span>
        <div style={{ flex: 1 }}>
          <ProgressBar value={worker.complianceScore} showLabel={false} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: compliance.color, flexShrink: 0 }}>
          {worker.complianceScore}%
        </span>
      </div>
    </motion.div>
  );
}
