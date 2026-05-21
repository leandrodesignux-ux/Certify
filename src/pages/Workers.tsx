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
          <h1 style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            color: '#F0F4FF',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            MALLA DE APRENDIZAJE
          </h1>
          <p style={{ color: '#8892A4', fontSize: '13px', textAlign: 'center', marginTop: '4px' }}>
            {totalWorkers} trabajadores registrados · Corpa Andina Minera S.A.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              padding: '8px 20px',
              backgroundColor: showFilters ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,229,255,0.3)',
              borderRadius: '8px',
              color: '#00E5FF',
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
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(0,229,255,0.1)] bg-[#111827]/60 px-4 py-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.15)]">
            <Users2 className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#F0F4FF]">{totalWorkers}</p>
            <p className="text-xs text-[#8892A4]">Total trabajadores</p>
          </div>
        </div>

        {/* Cumplimiento OK */}
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(0,229,255,0.1)] bg-[#111827]/60 px-4 py-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(0,230,118,0.15)]">
            <ShieldCheck className="w-5 h-5 text-[#00E676]" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[#F0F4FF]">{complianceOkCount}</p>
            <p className="text-xs text-[#8892A4]">Cumplimiento OK</p>
          </div>
        </div>

        {/* Requieren acción */}
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(0,229,255,0.1)] bg-[#111827]/60 px-4 py-3">
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
          <Card variant="glass" padding="lg" className="text-center py-16">
            <div className="inline-flex p-4 bg-[rgba(0,229,255,0.05)] rounded-full mb-6">
              <Users className="w-12 h-12 text-[#4A5568]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#F0F4FF] mb-2">
              Sin resultados
            </h3>
            <p className="text-[#8892A4] mb-6 max-w-md mx-auto">
              No se encontraron trabajadores con los filtros aplicados. Intenta ajustar tu búsqueda.
            </p>
            <Button variant="ghost" size="md" onClick={() => window.location.reload()}>
              Limpiar filtros
            </Button>
          </Card>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
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
