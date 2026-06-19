import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

type TabType = 'todas' | 'vigentes' | 'proximas' | 'vencidas';

interface EmptyStateProps {
  search?: string;
  activeTab?: TabType;
  onClearSearch?: () => void;
  onSwitchToAll?: () => void;
}

export function CertEmptyState({ search, activeTab, onClearSearch, onSwitchToAll }: EmptyStateProps) {
  const hasSearch = search && search.trim().length > 0;
  const hasTabFilter = activeTab && activeTab !== 'todas';

  // Determine message based on filters
  let title = 'Sin certificaciones';
  let subtitle = 'No hay certificaciones para mostrar en este momento';

  if (hasSearch) {
    title = `No hay resultados para "${search}"`;
    subtitle = 'Intenta con otros términos de búsqueda';
  } else if (hasTabFilter) {
    const tabLabels: Record<TabType, string> = {
      todas: 'Todas',
      vigentes: 'Vigentes',
      proximas: 'Próximas a vencer',
      vencidas: 'Vencidas',
    };
    title = `Sin certificaciones ${tabLabels[activeTab].toLowerCase()}`;
    subtitle = `No hay certificaciones en estado "${tabLabels[activeTab]}"`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      role="alert"
      aria-live="assertive"
      style={{ 
        textAlign: 'center', 
        padding: '48px 20px',
        background: 'var(--surface-canvas)',
        borderRadius: 'var(--radius-sm)',
        border: '1px dashed var(--border-strong)',
        margin: '20px'
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px', width: '80px', height: '80px' }}>
        {/* 3 rotating orbit rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            border: '1px dashed var(--border-strong)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-25px',
            borderRadius: '50%',
            border: '1px dashed var(--border-default)',
          }}
        />
        <Award style={{ width: '48px', height: '48px', color: 'var(--color-text-faint)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} strokeWidth={1.5} />
      </div>
      <p style={{ fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--color-brand)', marginBottom: '8px', letterSpacing: 'var(--tracking-tight)' }}>
        {title}
      </p>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
        {subtitle}
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {hasSearch && onClearSearch && (
          <button
            onClick={onClearSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--surface-soft)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-soft)';
            }}
          >
            Limpiar búsqueda
          </button>
        )}
        {hasTabFilter && onSwitchToAll && (
          <button
            onClick={onSwitchToAll}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            }}
          >
            Ver todas las certificaciones
          </button>
        )}
        {hasSearch && hasTabFilter && onClearSearch && onSwitchToAll && (
          <button
            onClick={() => {
              onClearSearch?.();
              onSwitchToAll?.();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(229,72,77,0.08)',
              border: '1px solid rgba(229,72,77,0.2)',
              borderRadius: '6px',
              color: '#e5484d',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229,72,77,0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229,72,77,0.08)';
            }}
          >
            Limpiar todo
          </button>
        )}
      </div>
    </motion.div>
  );
}
