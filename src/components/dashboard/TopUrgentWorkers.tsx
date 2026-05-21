import { useNavigate } from 'react-router-dom';
import { useWorkerStore } from '../../store/useWorkerStore';
import { ProgressBar } from '../ui/ProgressBar';
import { ArrowRight } from 'lucide-react';

export function TopUrgentWorkers() {
  const navigate = useNavigate();
  const { workers } = useWorkerStore();

  // Trabajadores con certifs vencidas o baja compliance, ordenados por urgencia
  const urgent = [...workers]
    .filter(w => w.certifications.some(c => c.estado === 'vencido') || w.complianceScore < 70)
    .sort((a, b) => a.complianceScore - b.complianceScore)
    .slice(0, 5);

  return (
    <div style={{
      backgroundColor: 'rgba(17,24,39,0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,61,87,0.15)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF' }}>
          Requieren Acción
        </h2>
        <span style={{ backgroundColor: 'rgba(255,61,87,0.15)', color: '#FF3D57', fontSize: '11px', fontWeight: 700, borderRadius: '8px', padding: '3px 8px' }}>
          {urgent.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {urgent.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8892A4', fontSize: '13px' }}>
            ✓ Sin trabajadores críticos
          </div>
        ) : urgent.map((worker) => {
          const initials = `${worker.nombre[0]}${worker.apellidos[0]}`;
          const hasExpired = worker.certifications.some(c => c.estado === 'vencido');
          return (
            <div
              key={worker.id}
              onClick={() => navigate(`/workers/${worker.id}`)}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(28,35,51,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {worker.foto
                ? <img src={worker.foto} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1C2333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E5FF', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{initials}</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4FF', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {worker.nombre} {worker.apellidos}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ProgressBar value={worker.complianceScore} showLabel={false} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: hasExpired ? '#FF3D57' : '#FFB800', flexShrink: 0 }}>
                    {worker.complianceScore}%
                  </span>
                </div>
                {hasExpired && (
                  <p style={{ fontSize: '10px', color: '#FF3D57', marginTop: '2px' }}>Cert. vencida</p>
                )}
              </div>
              <ArrowRight style={{ width: '14px', height: '14px', color: '#4A5568', flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
        <button
          onClick={() => navigate('/workers')}
          style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '8px', padding: '8px', fontSize: '12px', color: '#00E5FF', cursor: 'pointer', fontWeight: 600 }}
        >
          Ver todos los trabajadores →
        </button>
      </div>
    </div>
  );
}
