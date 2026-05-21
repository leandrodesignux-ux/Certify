import { motion } from 'framer-motion';
import { Edit3, Award, BookOpen } from 'lucide-react';
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
  const coursesInProgress = 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        background: 'linear-gradient(135deg, #0D1B2A 0%, #111827 100%)',
      }}
    >
      {/* Dot Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 229, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div style={{ position: 'relative', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left: Avatar + Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            {/* Avatar */}
            {worker.foto ? (
              <img
                src={worker.foto}
                alt={`${worker.nombre} ${worker.apellidos}`}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                  border: '2px solid #00E5FF',
                  boxShadow: '0 0 20px rgba(0,229,255,0.3)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '9999px',
                  backgroundColor: '#1C2333',
                  border: '2px solid #00E5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0,229,255,0.3)',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#00E5FF',
                  }}
                >
                  {initials}
                </span>
              </div>
            )}

            {/* Info */}
            <div>
              <h1
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: '30px',
                  fontWeight: 700,
                  color: '#F0F4FF',
                  lineHeight: 1.2,
                }}
              >
                {worker.nombre} {worker.apellidos}
              </h1>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', color: '#8892A4', marginTop: '4px' }}>
                {formatRut(worker.rut)}
              </p>

              {/* Cargo */}
              <p
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#00E5FF',
                  marginTop: '8px',
                }}
              >
                {worker.cargo}
              </p>

              {/* Area Badge */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: 'rgba(0,229,255,0.1)',
                    color: '#00E5FF',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,229,255,0.2)',
                  }}
                >
                  {worker.area}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: 'rgba(170,255,0,0.1)',
                    color: '#AAFF00',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid rgba(170,255,0,0.2)',
                  }}
                >
                  {worker.empresa}
                </span>
              </div>

              {/* Activity Badges */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                  <Award style={{ width: '16px', height: '16px', color: '#00E676' }} />
                  <span style={{ color: '#F0F4FF' }}>{activeCerts}</span>
                  <span style={{ color: '#8892A4' }}>certificaciones activas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                  <BookOpen style={{ width: '16px', height: '16px', color: '#00E5FF' }} />
                  <span style={{ color: '#F0F4FF' }}>{coursesInProgress}</span>
                  <span style={{ color: '#8892A4' }}>cursos en progreso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Score + Actions */}
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
            <Button variant="ghost" size="sm" icon={Edit3}>
              Editar Perfil
            </Button>

            {/* Score Section */}
            <div
              style={{
                backgroundColor: 'rgba(10,14,26,0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '4px',
                padding: '16px',
                border: '1px solid rgba(0,229,255,0.1)',
                minWidth: '200px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#8892A4' }}>Compliance</span>
                <span
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: compliance.color,
                  }}
                >
                  {worker.complianceScore}
                </span>
              </div>
              <ProgressBar value={worker.complianceScore} showLabel={false} />
              <p
                style={{
                  fontSize: '12px',
                  marginTop: '8px',
                  textAlign: 'right',
                  fontWeight: 500,
                  color: compliance.color,
                }}
              >
                {compliance.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
