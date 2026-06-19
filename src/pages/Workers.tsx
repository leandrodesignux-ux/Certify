import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, ShieldCheck, ShieldAlert, Users2, Filter, Search, LayoutGrid, List } from 'lucide-react';
import { useWorkerStore } from '../store/useWorkerStore';
import { FlipWorkerCard } from '../components/workers/FlipWorkerCard';
import { WorkerFilter } from '../components/workers/WorkerFilter';
import { WorkerTable } from '../components/workers/WorkerTable';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

type ViewMode = 'grid' | 'table';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

function WorkersComponent() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { filteredWorkers, workers, filters, setFilters, clearFilters } = useWorkerStore();

  const displayWorkers = filteredWorkers();
  const totalWorkers = workers.length;
  const activeFiltersCount = [filters.area, filters.search, filters.complianceMin > 0, filters.complianceMax !== undefined].filter(Boolean).length;

  // Stats calculations
  const complianceOkCount = workers.filter(w => w.complianceScore >= 80).length;
  const requireActionCount = workers.filter(w =>
    w.certifications.some(c => c.estado === 'vencido')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
      >
        <div style={{ flex: 1 }}>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-brand)', letterSpacing: 'var(--tracking-tight)', fontSize: 'var(--text-h1)' }}>
            Trabajadores
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body)', marginTop: '4px' }}>
            {totalWorkers} trabajadores registrados · Corpa Andina Minera S.A.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="md" icon={Download}>
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Stats Bar — Clickeables para filtrar */}
      <motion.div
        custom={0.08}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {/* Total Trabajadores — limpia filtros */}
        <div
          onClick={clearFilters}
          style={{ 
            cursor: 'pointer',
            minWidth: 0,
            padding: 'clamp(10px, 2vw, 14px) clamp(10px, 2vw, 16px)',
            borderRadius: '10px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            border: '1px solid #ebebeb',
            backgroundColor: '#ffffff',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#d4d4d4'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#ebebeb'}
        >
          <div className="hidden sm:flex" style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            borderRadius: '6px', 
            backgroundColor: '#f0f0f0',
            flexShrink: 0
          }}>
            <Users2 style={{ width: '20px', height: '20px', color: '#4d4d4d' }} strokeWidth={1.5} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ 
              fontSize: '26px', 
              lineHeight: 1, 
              fontWeight: 600, 
              color: 'var(--color-brand)',
              margin: 0
            }}>{totalWorkers}</p>
            <p style={{ 
              fontSize: 'var(--text-caption)', 
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '2px 0 0 0'
            }}>Total trabajadores</p>
          </div>
        </div>

        {/* Cumplimiento OK — filtra score >= 80 */}
        <div
          onClick={() => setFilters({ complianceMin: 80 })}
          style={{ 
            cursor: 'pointer',
            minWidth: 0,
            padding: 'clamp(10px, 2vw, 14px) clamp(10px, 2vw, 16px)',
            borderRadius: '10px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            border: filters.complianceMin === 80 ? '1px solid rgba(41,122,58,0.4)' : '1px solid rgba(41,122,58,0.15)',
            backgroundColor: filters.complianceMin === 80 ? 'rgba(41,122,58,0.04)' : '#ffffff',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(41,122,58,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = filters.complianceMin === 80 ? 'rgba(41,122,58,0.4)' : 'rgba(41,122,58,0.15)'}
        >
          <div className="hidden sm:flex" style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            borderRadius: '6px', 
            backgroundColor: 'rgba(41,122,58,0.08)',
            flexShrink: 0
          }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: '#297a3a' }} strokeWidth={1.5} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ 
              fontSize: '26px', 
              lineHeight: 1, 
              fontWeight: 600, 
              color: 'var(--color-brand)',
              margin: 0
            }}>{complianceOkCount}</p>
            <p style={{ 
              fontSize: 'var(--text-caption)', 
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '2px 0 0 0'
            }}>Cumplimiento OK</p>
          </div>
        </div>

        {/* Requieren acción — filtra con vencimientos */}
        <div
          onClick={() => setFilters({ complianceMin: 0, complianceMax: 79 })}
          style={{ 
            cursor: 'pointer',
            minWidth: 0,
            padding: 'clamp(10px, 2vw, 14px) clamp(10px, 2vw, 16px)',
            borderRadius: '10px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            border: filters.complianceMax === 79 ? '1px solid rgba(229,72,77,0.4)' : '1px solid rgba(229,72,77,0.15)',
            backgroundColor: filters.complianceMax === 79 ? 'rgba(229,72,77,0.04)' : '#ffffff',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(229,72,77,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = filters.complianceMax === 79 ? 'rgba(229,72,77,0.4)' : 'rgba(229,72,77,0.15)'}
        >
          <div className="hidden sm:flex" style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            borderRadius: '6px', 
            backgroundColor: 'rgba(229,72,77,0.08)',
            flexShrink: 0
          }}>
            <ShieldAlert style={{ width: '20px', height: '20px', color: '#e5484d' }} strokeWidth={1.5} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ 
              fontSize: '26px', 
              lineHeight: 1, 
              fontWeight: 600, 
              color: 'var(--color-brand)',
              margin: 0
            }}>{requireActionCount}</p>
            <p style={{ 
              fontSize: 'var(--text-caption)', 
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '2px 0 0 0'
            }}>Requieren acción</p>
          </div>
        </div>
      </motion.div>

      {/* Search Bar + Controls — Siempre visible */}
      <motion.div
        custom={0.09}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}
      >
        {/* Búsqueda */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#a8a8a8' }} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar trabajador, RUT, cargo..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            style={{
              width: '100%',
              height: '40px',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '0 16px 0 42px',
              fontSize: 'var(--text-body)',
              color: 'var(--color-text)',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-focus)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Toggle Grid / Tabla — Siempre visible */}
        <div style={{ display: 'flex', gap: '2px', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '3px', flexShrink: 0 }}>
          {(['grid', 'table'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                minWidth: '36px', height: '36px',
                borderRadius: '4px',
                border: viewMode === mode ? '1px solid var(--border-default)' : '1px solid transparent',
                backgroundColor: viewMode === mode ? 'var(--surface-card)' : 'transparent',
                color: viewMode === mode ? 'var(--color-brand)' : 'var(--color-text-faint)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {mode === 'grid' ? <LayoutGrid style={{ width: '16px', height: '16px' }} /> : <List style={{ width: '16px', height: '16px' }} />}
            </button>
          ))}
        </div>

        {/* Botón filtros avanzados */}
        <button
          onClick={() => setShowFilters(f => !f)}
          style={{
            padding: '0 14px',
            height: '40px',
            backgroundColor: showFilters ? 'var(--surface-soft)' : 'var(--surface-card)',
            border: `1px solid ${showFilters ? 'var(--border-strong)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-sm)',
            color: showFilters ? 'var(--color-brand)' : 'var(--color-text-muted)',
            fontSize: 'var(--text-body)',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
        >
          <Filter style={{ width: '14px', height: '14px' }} />
          Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
        </button>
      </motion.div>

      {/* Chips de filtros activos */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-faint)', flexShrink: 0 }}>Filtros activos:</span>
          {filters.search && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px',
                minHeight: '28px',
                backgroundColor: 'var(--color-primary-soft)',
                border: '1px solid var(--color-primary-border)',
                borderRadius: '9999px',
                fontSize: 'var(--text-caption)', color: 'var(--color-primary)',
                cursor: 'pointer',
              }}
              onClick={() => setFilters({ search: '' })}
            >
              "{filters.search}" ×
            </span>
          )}
          {filters.area && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px',
                minHeight: '28px',
                backgroundColor: 'var(--color-primary-soft)',
                border: '1px solid var(--color-primary-border)',
                borderRadius: '9999px',
                fontSize: 'var(--text-caption)', color: 'var(--color-primary)',
                cursor: 'pointer',
              }}
              onClick={() => setFilters({ area: '' })}
            >
              Área: {filters.area} ×
            </span>
          )}
          {filters.complianceMin > 0 && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px',
                minHeight: '28px',
                backgroundColor: 'var(--color-primary-soft)',
                border: '1px solid var(--color-primary-border)',
                borderRadius: '9999px',
                fontSize: 'var(--text-caption)', color: 'var(--color-primary)',
                cursor: 'pointer',
              }}
              onClick={() => setFilters({ complianceMin: 0 })}
            >
              Compliance ≥{filters.complianceMin}% ×
            </span>
          )}
          <button
            onClick={clearFilters}
            style={{
              padding: '3px 10px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(229,72,77,0.2)',
              borderRadius: '9999px',
              color: '#e5484d',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Limpiar todo
          </button>
        </motion.div>
      )}

      {/* Filters - Toggleable */}
      {showFilters && (
        <motion.div
          custom={0.1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <WorkerFilter />
        </motion.div>
      )}

      {/* Visual Separator */}
      <div style={{ 
        height: '1px', 
        backgroundColor: 'var(--border-default)',
        margin: '8px 0' 
      }} />

      {/* Results Summary */}
      <motion.div
        custom={0.15}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
        style={{ marginBottom: '20px' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body)' }}>
          Mostrando{' '}
          <span style={{ color: 'var(--color-brand)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'] }}>{displayWorkers.length}</span> de{' '}
          <span style={{ color: 'var(--color-brand)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'] }}>{totalWorkers}</span> trabajadores
        </p>
      </motion.div>

      {/* Content: Grid or Table */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {displayWorkers.length === 0 ? (
          <Card variant="glass" padding="lg" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Animated Users Icon with rings */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px', width: '80px', height: '80px' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: '-15px',
                    borderRadius: '50%',
                    border: '1px dashed #d4d4d4',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ebebeb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users style={{ width: '32px', height: '32px', color: '#a8a8a8' }} strokeWidth={1.5} />
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'], color: 'var(--color-brand)', marginBottom: '8px', letterSpacing: 'var(--tracking-snug)' }}>
                Sin trabajadores
              </h3>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)', marginBottom: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                No se encontraron trabajadores con los filtros aplicados. Intenta ajustar tu búsqueda o limpiar los filtros.
              </p>
              <Button variant="ghost" size="md" onClick={() => window.location.reload()}>
                Limpiar filtros
              </Button>
            </motion.div>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
            {displayWorkers.map((worker, index) => (
              <FlipWorkerCard key={worker.id} worker={worker} index={index} />
            ))}
          </div>
        ) : (
          <WorkerTable workers={displayWorkers} />
        )}
      </motion.div>

      {/* Pagination / Load More */}
      {displayWorkers.length > 0 && (
        <motion.div
          custom={0.3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center pt-4"
        >
          <p className="text-sm" style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-body)' }}>
            Mostrando todos los resultados filtrados
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default WorkersComponent;
