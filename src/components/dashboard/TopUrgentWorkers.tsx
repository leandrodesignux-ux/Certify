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
      backgroundColor: '#ffffff',
      border: '1px solid #ebebeb',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#171717', letterSpacing: '-0.02em' }}>
          Requieren Acción
        </h2>
        <span style={{ backgroundColor: 'rgba(229,72,77,0.08)', color: '#e5484d', fontSize: '11px', fontWeight: 500, borderRadius: 'var(--radius-sm)', padding: '3px 8px', border: '1px solid rgba(229,72,77,0.2)' }}>
          {urgent.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {urgent.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#a8a8a8', fontSize: '13px' }}>
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
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {worker.foto
                ? <img src={worker.foto} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f0f0f0', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4d4d4d', fontWeight: 500, fontSize: '13px', flexShrink: 0 }}>{initials}</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#171717', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {worker.nombre} {worker.apellidos}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ProgressBar value={worker.complianceScore} showLabel={false} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: hasExpired ? '#e5484d' : '#b25000', flexShrink: 0 }}>
                    {worker.complianceScore}%
                  </span>
                </div>
                {hasExpired && (
                  <p style={{ fontSize: '10px', color: '#e5484d', marginTop: '2px' }}>Cert. vencida</p>
                )}
              </div>
              <ArrowRight
                style={{
                  width: '14px',
                  height: '14px',
                  color: '#a8a8a8',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                strokeWidth={1.5}
              />
            </div>
          );
        })}
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid #ebebeb' }}>
        <button
          onClick={() => navigate('/workers')}
          style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #ebebeb', borderRadius: 'var(--radius-sm)', padding: '8px', fontSize: '12px', color: '#4d4d4d', cursor: 'pointer', fontWeight: 500, transition: 'background 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Ver todos los trabajadores →
        </button>
      </div>
    </div>
  );
}
