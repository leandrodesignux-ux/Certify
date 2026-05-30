import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';
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

// Parse cert name from alert message
function getCertName(message: string): string {
  const match = message.match(/["']([^"']+)["']/);
  return match ? match[1] : 'Certificación';
}

interface AlertItemProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

function AlertItem({ alert, onDismiss }: AlertItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = getAlertStatus(alert);
  const certName = getCertName(alert.message);

  const getRecommendedAction = () => {
    if (status === 'vencido') return 'Renovar certificación inmediatamente. Contactar al trabajador para programar recertificación.';
    if (status === 'proximo_vencer') return 'Programar renovación en los próximos días. Verificar disponibilidad de cursos.';
    return 'Monitorear estado de certificación.';
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      layout
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '10px 20px',
        borderBottom: '1px solid rgba(91,34,119,0.1)',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      onKeyDown={(e) => { if (e.key === 'Enter') setIsExpanded(v => !v); }}
    >
      {/* Main alert row */}
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Dot indicator */}
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '4px',
          backgroundColor: status === 'vencido' ? 'var(--color-danger)' : status === 'proximo_vencer' ? 'var(--color-warning)' : 'var(--color-text-secondary)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <ExpiryBadge diasRestantes={alert.diasRestantes ?? 0} />
          {isExpanded ? (
            <ChevronUp style={{ width: '14px', height: '14px', color: '#8892A4' }} />
          ) : (
            <ChevronDown style={{ width: '14px', height: '14px', color: '#8892A4' }} />
          )}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', marginTop: '12px', marginLeft: '20px' }}
          >
            <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(91,34,119,0.18)' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Certificación</span>
                <p style={{ fontSize: '12px', color: '#F0F4FF', marginTop: '2px' }}>{certName}</p>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Días restantes</span>
                <p style={{ fontSize: '12px', color: status === 'vencido' ? 'var(--color-danger)' : status === 'proximo_vencer' ? 'var(--color-warning)' : 'var(--color-success)', marginTop: '2px', fontWeight: 600 }}>
                  {alert.diasRestantes && alert.diasRestantes < 0 ? `${Math.abs(alert.diasRestantes)} días vencida` : `${alert.diasRestantes} días`}
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Acción recomendada</span>
                <p style={{ fontSize: '12px', color: '#8892A4', marginTop: '2px' }}>{getRecommendedAction()}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(alert.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(114,147,98,0.12)',
                  border: '1px solid rgba(114,147,98,0.3)',
                  borderRadius: '6px',
                  color: '#729362',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(114,147,98,0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(114,147,98,0.12)';
                }}
              >
                <X style={{ width: '12px', height: '12px' }} />
                Marcar como visto
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AlertsPanel() {
  const navigate = useNavigate();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = mockAlerts.filter(a => !dismissedIds.has(a.id));
  const sortedAlerts = [...visibleAlerts].sort((a, b) => getAlertPriority(b) - getAlertPriority(a));
  const criticalCount = sortedAlerts.filter(a => getAlertPriority(a) >= 3).length;

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  return (
    <div style={{
      backgroundColor: 'rgba(26,16,64,0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-brand)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(91,34,119,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle style={{ width: '20px', height: '20px', color: '#FFB800' }} />
          <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF' }}>Alertas</h2>
        </div>
        {criticalCount > 0 && (
          <span style={{ padding: '2px 8px', backgroundColor: '#FF3D57', color: '#fff', fontSize: '12px', fontWeight: 500, borderRadius: 'var(--radius-sm)' }}>
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
          <AnimatePresence mode="popLayout">
            {sortedAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} onDismiss={handleDismiss} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer link */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(91,34,119,0.15)' }}>
        <button
          onClick={() => navigate('/certifications?tab=vencidas')}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: '1px solid rgba(91,34,119,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px',
            fontSize: '12px',
            color: '#9b6ab5',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Ver todas las alertas →
        </button>
      </div>
    </div>
  );
}
