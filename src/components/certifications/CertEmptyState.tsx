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
        background: 'rgba(91,34,119,0.04)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed rgba(91,34,119,0.15)',
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
            border: '2px dashed rgba(91,34,119,0.4)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-25px',
            borderRadius: '50%',
            border: '2px dashed rgba(138,158,82,0.25)',
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-40px',
            borderRadius: '50%',
            border: '2px dashed rgba(255,184,0,0.15)',
          }}
        />
        <Award style={{ width: '64px', height: '64px', color: '#7c4dab', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />
      </div>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '24px', fontWeight: 700, color: '#F0F4FF', marginBottom: '8px' }}>
        {title}
      </p>
      <p style={{ fontSize: '14px', color: '#8892A4', marginBottom: '20px' }}>
        {subtitle}
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {hasSearch && onClearSearch && (
          <button
            onClick={onClearSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(91,34,119,0.12)',
              border: '1px solid rgba(91,34,119,0.35)',
              borderRadius: '6px',
              color: '#9b6ab5',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
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
              backgroundColor: 'rgba(138,158,82,0.1)',
              border: '1px solid rgba(138,158,82,0.35)',
              borderRadius: '6px',
              color: '#8a9e52',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(138,158,82,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(138,158,82,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
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
              backgroundColor: 'rgba(255,61,87,0.1)',
              border: '1px solid rgba(255,61,87,0.35)',
              borderRadius: '6px',
              color: '#ff3d57',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,61,87,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,61,87,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Limpiar todo
          </button>
        )}
      </div>
    </motion.div>
  );
}
