import { motion } from 'framer-motion';
import { Edit3, Plus, Download, Bell } from 'lucide-react';
import type { Worker } from '../../types';
import { Button } from '../ui/Button';
import { formatRut } from '../../utils/format';

interface ProfileHeaderProps {
  worker: Worker;
}

function getComplianceColorAndLabel(score: number): { color: string; label: string } {
  if (score >= 90) return { color: '#297a3a', label: 'Excelente' };
  if (score >= 70) return { color: '#297a3a', label: 'Bueno' };
  if (score >= 50) return { color: '#b25000', label: 'Regular' };
  return { color: '#e5484d', label: 'Crítico' };
}

// SVG Circle Progress Component
function ComplianceRing({ score, color }: { score: number; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#ebebeb"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            fontWeight: 600,
            color: '#171717',
            lineHeight: 1,
          }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}

export function ProfileHeader({ worker }: ProfileHeaderProps) {
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const compliance = getComplianceColorAndLabel(worker.complianceScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: '#ffffff',
        border: '1px solid #ebebeb',
      }}
    >
      {/* Engineering grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(23,23,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      {/* Hero Banner */}
      <div
        style={{
          height: '120px',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #ebebeb',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 10 }}>
          <Button variant="ghost" size="sm" icon={Edit3}>Editar</Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', padding: '0 24px 24px' }}>

        {/* Avatar with Compliance Ring - Overlapping banner */}
        <div style={{ marginTop: '-40px', flexShrink: 0, position: 'relative', zIndex: 10 }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #ebebeb',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {worker.foto ? (
              <img
                src={worker.foto}
                alt={`Foto de perfil de ${worker.nombre} ${worker.apellidos}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#4d4d4d',
                }}
              >
                {initials}
              </span>
            )}
          </div>
          {/* Compliance Ring around avatar */}
          <div style={{ position: 'absolute', inset: 0, margin: '-4px' }}>
            <ComplianceRing score={worker.complianceScore} color={compliance.color} />
          </div>
        </div>

        {/* INFO CENTRAL */}
        <div style={{ flex: 1, padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Badge "PERFIL DE TRABAJADOR" */}
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', color: '#a8a8a8', textTransform: 'uppercase' }}>
            PERFIL DE TRABAJADOR
          </p>
          {/* Nombre */}
          <h1 style={{
            fontSize: '28px', fontWeight: 600, color: '#171717',
            lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em',
          }}>
            {worker.nombre} {worker.apellidos}
          </h1>
          <p style={{ fontSize: '14px', color: '#4d4d4d', fontWeight: 500, margin: 0 }}>{worker.cargo}</p>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <Button variant="ghost" size="sm" icon={Plus}>Agregar Certificación</Button>
            <Button variant="ghost" size="sm" icon={Download}>Exportar Perfil</Button>
            <Button variant="ghost" size="sm" icon={Bell}>Enviar Alerta</Button>
          </div>

          {/* Data grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginTop: '16px' }}>
            {[
              { label: 'RUT', value: formatRut(worker.rut) },
              { label: 'Email', value: worker.email },
              { label: 'Faena / Depto.', value: worker.departamento },
              { label: 'VP / Área', value: worker.area },
              { label: 'Empresa', value: worker.empresa },
              { label: 'Ingreso', value: new Date(worker.fechaIngreso).toLocaleDateString('es-CL') },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '11px', color: '#a8a8a8', flexShrink: 0, minWidth: '70px' }}>{item.label}</span>
                <span style={{ fontSize: '12px', color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO — COMPLIANCE SCORE */}
        <div style={{
          width: '180px', flexShrink: 0,
          backgroundColor: '#fafafa',
          borderLeft: '1px solid #ebebeb',
          borderRadius: '0 0 var(--radius-lg) 0',
          padding: '20px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
          marginTop: '-24px',
        }}>
          {/* ComplianceRing */}
          <ComplianceRing score={worker.complianceScore} color={compliance.color} />

          {/* Rango badge */}
          <div style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #ebebeb',
            borderRadius: 'var(--radius-sm)', padding: '5px 12px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '9px', color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RANGO</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: compliance.color }}>
              {compliance.label.toUpperCase()}
            </p>
          </div>

          {/* Desglose de certificaciones */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { label: 'Total',    value: worker.certifications.length, color: '#171717' },
              { label: 'Vigentes', value: worker.certifications.filter(c => c.estado === 'vigente').length, color: '#297a3a' },
              { label: 'Vencidas', value: worker.certifications.filter(c => c.estado === 'vencido').length, color: '#e5484d' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
                <span style={{ fontSize: '11px', color: '#a8a8a8' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar — información de mayor valor */}
      <div style={{
        borderTop: '1px solid #ebebeb',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: '32px',
        flexWrap: 'wrap',
      }}>
        {/* Próximo vencimiento */}
        {(() => {
          const proxima = worker.certifications
            .filter(c => c.estado === 'proximo_vencer' || c.estado === 'vigente')
            .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime())[0];
          return proxima ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#a8a8a8', flexShrink: 0 }}>Próximo vencimiento:</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#b25000' }}>
                {proxima.nombre} — {new Date(proxima.fechaVencimiento).toLocaleDateString('es-CL')}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#a8a8a8' }}>Sin vencimientos próximos</span>
            </div>
          );
        })()}

        {/* Última actividad — mock por ahora */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#a8a8a8', flexShrink: 0 }}>Última actividad:</span>
          <span style={{ fontSize: '12px', color: '#666666' }}>hace 3 días</span>
        </div>
      </div>
    </motion.div>
  );
}
