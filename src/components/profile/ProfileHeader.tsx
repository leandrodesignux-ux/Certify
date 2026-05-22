import { motion } from 'framer-motion';
import { Edit3, Plus, Download, Bell } from 'lucide-react';
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

// Get banner gradient based on compliance score
function getBannerGradient(score: number): string {
  if (score > 80) {
    return 'linear-gradient(135deg, rgba(0,230,118,0.3) 0%, rgba(0,200,100,0.15) 50%, rgba(0,230,118,0.05) 100%)';
  }
  if (score > 60) {
    return 'linear-gradient(135deg, rgba(255,184,0,0.3) 0%, rgba(200,150,0,0.15) 50%, rgba(255,184,0,0.05) 100%)';
  }
  return 'linear-gradient(135deg, rgba(255,61,87,0.3) 0%, rgba(200,40,60,0.15) 50%, rgba(255,61,87,0.05) 100%)';
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
          stroke="rgba(0,229,255,0.1)"
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
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: color,
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
  const activeCerts = worker.certifications.filter((c) => c.estado === 'vigente').length;
  const bannerGradient = getBannerGradient(worker.complianceScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '6px',
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

      {/* Hero Banner */}
      <div
        style={{
          height: '120px',
          background: bannerGradient,
          borderBottom: `1px solid ${compliance.color}30`,
          position: 'relative',
        }}
      />

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
              border: `3px solid ${compliance.color}`,
              backgroundColor: '#1C2333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {worker.foto ? (
              <img
                src={worker.foto}
                alt={worker.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span
                style={{
                  fontFamily: '"Barlow Condensed"',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: compliance.color,
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
                <span style={{ fontSize: '11px', color: '#4A5568', flexShrink: 0, minWidth: '70px' }}>{item.label}</span>
                <span style={{ fontSize: '12px', color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO — CERTIFICADOS */}
        <div style={{
          width: '200px', flexShrink: 0,
          backgroundColor: 'rgba(0,229,255,0.05)',
          borderLeft: '1px solid rgba(0,229,255,0.12)',
          borderRadius: '0 0 16px 0',
          padding: '20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
          marginTop: '-24px',
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
          </div>
        </div>

        {/* Botón editar — top right */}
        <div style={{ position: 'absolute', top: '-104px', right: '16px' }}>
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
