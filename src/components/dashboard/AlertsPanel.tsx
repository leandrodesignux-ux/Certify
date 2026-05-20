import { AlertTriangle } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';
import { StatusIndicator } from '../ui/StatusIndicator';
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
    <div className="bg-[#111827]/80 backdrop-blur-[12px] border border-[rgba(0,229,255,0.1)] rounded-sm flex flex-col h-[400px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(0,229,255,0.1)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#FFB800]" />
          <h2 className="font-display text-lg font-semibold text-[#F0F4FF]">Alertas</h2>
        </div>
        {criticalCount > 0 && (
          <span className="px-2 py-0.5 bg-[#FF3D57] text-white text-xs font-medium rounded-sm">
            {criticalCount}
          </span>
        )}
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#8892A4] text-sm">
            Sin alertas pendientes
          </div>
        ) : (
          <div className="divide-y divide-[rgba(0,229,255,0.05)]">
            {sortedAlerts.map((alert) => {
              const status = getAlertStatus(alert);
              
              return (
                <div
                  key={alert.id}
                  className="px-5 py-3 hover:bg-[#1C2333]/50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-3">
                    <StatusIndicator status={status} pulse={status === 'vencido'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F0F4FF] truncate">
                        <span className="font-medium">{alert.workerName}</span>
                      </p>
                      <p className="text-xs text-[#8892A4] mt-0.5 line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-[#4A5568] mt-1">
                        {new Date(alert.createdAt).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {alert.diasRestantes !== undefined && (
                      <ExpiryBadge diasRestantes={alert.diasRestantes} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
