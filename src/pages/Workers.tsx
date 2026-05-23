import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, ShieldCheck, ShieldAlert, Users2, Filter } from 'lucide-react';
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
  const { filteredWorkers, workers, filters } = useWorkerStore();

  const displayWorkers = filteredWorkers();
  const totalWorkers = workers.length;
  const activeFiltersCount = [filters.area, filters.search, filters.complianceMin > 0].filter(Boolean).length;

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
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}
      >
        <div style={{ flex: 1 }}>
          <h1 className="font-display text-3xl font-bold text-gradient tracking-wider">
            Trabajadores
          </h1>
          <p style={{ color: '#8892A4', fontSize: '13px', marginTop: '4px' }}>
            {totalWorkers} trabajadores registrados · Corpa Andina Minera S.A.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              padding: '8px 20px',
              backgroundColor: showFilters ? 'rgba(91,34,119,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(91,34,119,0.35)',
              borderRadius: '8px',
              color: '#9b6ab5',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Filter style={{ width: '14px', height: '14px' }} />
            FILTROS {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </button>
          <Button variant="ghost" size="md" icon={Download}>
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        custom={0.08}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-4"
      >
        {/* Total Trabajadores */}
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(91,34,119,0.2)] bg-[#1a1040]/70 px-4 py-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(91,34,119,0.2)]">
            <Users2 className="w-5 h-5 text-[#9b6ab5]" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#F0F4FF]">{totalWorkers}</p>
            <p className="text-xs text-[#8892A4]">Total trabajadores</p>
          </div>
        </div>

        {/* Cumplimiento OK */}
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(91,34,119,0.2)] bg-[#1a1040]/70 px-4 py-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(114,147,98,0.18)]">
            <ShieldCheck className="w-5 h-5 text-[#729362]" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#F0F4FF]">{complianceOkCount}</p>
            <p className="text-xs text-[#8892A4]">Cumplimiento OK</p>
          </div>
        </div>

        {/* Requieren acción */}
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(91,34,119,0.2)] bg-[#1a1040]/70 px-4 py-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(255,61,87,0.15)]">
            <ShieldAlert className="w-5 h-5 text-[#FF3D57]" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#F0F4FF]">{requireActionCount}</p>
            <p className="text-xs text-[#8892A4]">Requieren acción</p>
          </div>
        </div>
      </motion.div>

      {/* Filters - Toggleable */}
      {showFilters && (
        <motion.div
          custom={0.1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <WorkerFilter viewMode={viewMode} onViewModeChange={setViewMode} />
        </motion.div>
      )}

      {/* Results Summary */}
      <motion.div
        custom={0.15}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <p className="text-sm text-[#8892A4]">
          Mostrando{' '}
          <span className="text-[#F0F4FF] font-medium">{displayWorkers.length}</span> de{' '}
          <span className="text-[#F0F4FF] font-medium">{totalWorkers}</span> trabajadores
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
              <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '22px', fontWeight: 600, color: '#F0F4FF', marginBottom: '8px' }}>
                Sin trabajadores
              </h3>
              <p style={{ fontSize: '14px', color: '#8892A4', marginBottom: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                No se encontraron trabajadores con los filtros aplicados. Intenta ajustar tu búsqueda o limpiar los filtros.
              </p>
              <Button variant="ghost" size="md" onClick={() => window.location.reload()}>
                Limpiar filtros
              </Button>
            </motion.div>
          </Card>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
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
          <p className="text-sm text-[#8892A4]">
            Mostrando todos los resultados filtrados
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default WorkersComponent;
