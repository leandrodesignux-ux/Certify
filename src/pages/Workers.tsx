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
          <h1 className="font-display text-3xl font-bold text-gradient tracking-wider">
            Trabajadores
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
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
            border: '1px solid var(--border-brand)',
            backgroundColor: 'var(--color-surface)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-brand-hover)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-brand)'}
        >
          <div className="hidden sm:flex" style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(91,34,119,0.2)',
            flexShrink: 0
          }}>
            <Users2 style={{ width: '20px', height: '20px', color: '#9b6ab5' }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ 
              fontSize: '28px', 
              lineHeight: 1, 
              fontFamily: '"Barlow Condensed", sans-serif', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)',
              margin: 0
            }}>{totalWorkers}</p>
            <p style={{ 
              fontSize: '11px', 
              color: 'var(--color-text-secondary)',
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
            border: filters.complianceMin === 80 ? '1px solid rgba(114,147,98,0.6)' : '1px solid rgba(114,147,98,0.2)',
            backgroundColor: 'var(--color-surface)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(114,147,98,0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = filters.complianceMin === 80 ? 'rgba(114,147,98,0.6)' : 'rgba(114,147,98,0.2)'}
        >
          <div className="hidden sm:flex" style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(114,147,98,0.18)',
            flexShrink: 0
          }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: '#729362' }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ 
              fontSize: '28px', 
              lineHeight: 1, 
              fontFamily: '"Barlow Condensed", sans-serif', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)',
              margin: 0
            }}>{complianceOkCount}</p>
            <p style={{ 
              fontSize: '11px', 
              color: 'var(--color-text-secondary)',
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
            border: filters.complianceMax === 79 ? '1px solid rgba(255,61,87,0.6)' : '1px solid rgba(255,61,87,0.2)',
            backgroundColor: filters.complianceMax === 79 ? 'rgba(255,61,87,0.06)' : 'var(--color-surface)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,61,87,0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = filters.complianceMax === 79 ? 'rgba(255,61,87,0.6)' : 'rgba(255,61,87,0.2)'}
        >
          <div className="hidden sm:flex" style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(255,61,87,0.15)',
            flexShrink: 0
          }}>
            <ShieldAlert style={{ width: '20px', height: '20px', color: '#FF3D57' }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ 
              fontSize: '28px', 
              lineHeight: 1, 
              fontFamily: '"Barlow Condensed", sans-serif', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)',
              margin: 0
            }}>{requireActionCount}</p>
            <p style={{ 
              fontSize: '11px', 
              color: 'var(--color-text-secondary)',
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
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar trabajador, RUT, cargo..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            style={{
              width: '100%',
              height: '42px',
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid rgba(91,34,119,0.25)',
              borderRadius: '10px',
              padding: '0 16px 0 42px',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(91,34,119,0.6)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(91,34,119,0.25)'}
          />
        </div>

        {/* Toggle Grid / Tabla — Siempre visible */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '10px', padding: '4px', flexShrink: 0 }}>
          {(['grid', 'table'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                minWidth: '44px', height: '44px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === mode ? 'rgba(124,77,171,0.3)' : 'transparent',
                color: viewMode === mode ? 'var(--color-purple-mid)' : 'var(--color-text-secondary)',
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
            padding: '0 16px',
            height: '42px',
            backgroundColor: showFilters ? 'var(--color-surface-alt)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showFilters ? 'rgba(91,34,119,0.5)' : 'rgba(91,34,119,0.25)'}`,
            borderRadius: '10px',
            color: showFilters ? '#9b6ab5' : 'var(--color-text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
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
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', flexShrink: 0 }}>Filtros activos:</span>
          {filters.search && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px 3px 10px',
                minHeight: '28px',
                backgroundColor: 'rgba(91,34,119,0.15)',
                border: '1px solid rgba(91,34,119,0.35)',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px', color: '#c49fe0',
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
                backgroundColor: 'rgba(91,34,119,0.15)',
                border: '1px solid rgba(91,34,119,0.35)',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px', color: '#c49fe0',
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
                backgroundColor: 'rgba(91,34,119,0.15)',
                border: '1px solid rgba(91,34,119,0.35)',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px', color: '#c49fe0',
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
              border: '1px solid rgba(255,61,87,0.3)',
              borderRadius: 'var(--radius-full)',
              color: '#FF5C71',
              fontSize: '12px',
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
        background: 'linear-gradient(to right, transparent, rgba(91,34,119,0.3), transparent)', 
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
        <p className="text-sm text-[var(--color-text-secondary)]">
          Mostrando{' '}
          <span className="text-[var(--color-text-primary)] font-medium">{displayWorkers.length}</span> de{' '}
          <span className="text-[var(--color-text-primary)] font-medium">{totalWorkers}</span> trabajadores
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
                    border: '2px dashed rgba(91,34,119,0.25)',
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
                    backgroundColor: 'rgba(91,34,119,0.08)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users style={{ width: '32px', height: '32px', color: '#9b6ab5' }} />
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Sin trabajadores
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                No se encontraron trabajadores con los filtros aplicados. Intenta ajustar tu búsqueda o limpiar los filtros.
              </p>
              <Button variant="ghost" size="md" onClick={() => window.location.reload()}>
                Limpiar filtros
              </Button>
            </motion.div>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
          <p className="text-sm text-[var(--color-text-secondary)]">
            Mostrando todos los resultados filtrados
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default WorkersComponent;
