import { AlertTriangle } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';
import { ExpiryBadge } from '../ui/ExpiryBadge';
import type { Alert } from '../../types';

function getAlertPriority(alert: Alert): number {
  if (alert.tipo === 'vencimiento' && (alert.diasRestantes ?? 0) < 0) return 4;
  if (alert.tipo === 'vencimiento' && (alert.diasRestantes ?? 0) <= 15) return 3;
  if (alert.tipo === 'vencimiento') return 2;
  if (alert.tipo === 'progreso') return 1;
  return 0;
}

function getAlertStatus(alert: Alert): 'vencido' | 'proximo_vencer' | 'pendiente' {
  if (alert.tipo === 'vencimiento' && (alert.diasRestantes ?? 0) < 0) return 'vencido';
  if (alert.tipo === 'vencimiento' && (alert.diasRestantes ?? 0) <= 15) return 'proximo_vencer';
  return 'pendiente';
}

export function AlertsPanel() {
  const sortedAlerts = [...mockAlerts].sort((a, b) => getAlertPriority(b) - getAlertPriority(a));
  const criticalCount = sortedAlerts.filter(a => getAlertPriority(a) >= 3).length;

  return (
    <div style={{
      backgroundColor: 'rgba(17,24,39,0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,229,255,0.1)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle style={{ width: '20px', height: '20px', color: '#FFB800' }} />
          <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF' }}>Alertas</h2>
        </div>
        {criticalCount > 0 && (
          <span style={{ padding: '2px 8px', backgroundColor: '#FF3D57', color: '#fff', fontSize: '12px', fontWeight: 500, borderRadius: '4px' }}>
            {criticalCount}
          </span>
        )}
      </div>

      {/* Alerts List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sortedAlerts.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8892A4', fontSize: '14px' }}>
            Sin alertas pendientes
          </div>
        ) : (
          sortedAlerts.map((alert) => {
            const status = getAlertStatus(alert);

            return (
              <div
                key={alert.id}
                style={{
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  borderBottom: '1px solid rgba(0,229,255,0.04)',
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(28,35,51,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Dot indicator */}
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '4px',
                  backgroundColor: status === 'vencido' ? '#FF3D57' : status === 'proximo_vencer' ? '#FFB800' : '#8892A4',
                  boxShadow: status === 'vencido' ? '0 0 6px rgba(255,61,87,0.6)' : 'none',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4FF', marginBottom: '2px' }}>
                    {alert.workerName}
                  </p>
                  <p style={{ fontSize: '11px', color: '#8892A4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {alert.message}
                  </p>
                </div>
                {/* Days badge */}
                <ExpiryBadge diasRestantes={alert.diasRestantes ?? 0} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
