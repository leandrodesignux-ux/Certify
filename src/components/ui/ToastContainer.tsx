import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import type { ToastVariant } from '../../store/useToastStore';

const variantConfig: Record<ToastVariant, {
  icon: typeof CheckCircle;
  color: string;
  bg: string;
  border: string;
}> = {
  success: {
    icon: CheckCircle,
    color: 'var(--status-success)',
    bg: 'var(--status-success-bg)',
    border: 'var(--status-success-border)',
  },
  error: {
    icon: AlertCircle,
    color: 'var(--status-danger)',
    bg: 'var(--status-danger-bg)',
    border: 'var(--status-danger-border)',
  },
  info: {
    icon: Info,
    color: 'var(--color-primary)',
    bg: 'var(--color-primary-soft)',
    border: 'var(--color-primary-border)',
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--status-warning)',
    bg: 'var(--status-warning-bg)',
    border: 'var(--status-warning-border)',
  },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();
  const reduceMotion = useReducedMotion();

  // Esc dismisses the most recent toast
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        dismiss(toasts[toasts.length - 1].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toasts, dismiss]);

  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 48px)',
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((t) => {
          const config = variantConfig[t.variant];
          const Icon = config.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="status"
              style={{
                pointerEvents: 'auto',
                minWidth: '320px',
                maxWidth: '420px',
                backgroundColor: 'var(--surface-elevated)',
                border: `1px solid ${config.border}`,
                borderLeft: `3px solid ${config.color}`,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: config.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon style={{ width: '16px', height: '16px', color: config.color }} strokeWidth={2} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--color-brand)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {t.title}
                </p>
                {t.description && (
                  <p
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-muted)',
                      margin: '4px 0 0',
                      lineHeight: 1.4,
                    }}
                  >
                    {t.description}
                  </p>
                )}
                {t.action && (
                  <button
                    onClick={() => {
                      t.action!.onClick();
                      dismiss(t.id);
                    }}
                    style={{
                      marginTop: '8px',
                      fontSize: 'var(--text-caption)',
                      fontWeight: 'var(--weight-semibold)',
                      color: config.color,
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    {t.action.label}
                  </button>
                )}
              </div>

              {/* Close */}
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-faint)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-soft)';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-faint)';
                }}
              >
                <X style={{ width: '14px', height: '14px' }} strokeWidth={2} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
