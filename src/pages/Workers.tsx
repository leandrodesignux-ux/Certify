import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download } from 'lucide-react';
import { useWorkerStore } from '../store/useWorkerStore';
import { WorkerCard } from '../components/workers/WorkerCard';
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
  const { filteredWorkers, workers } = useWorkerStore();

  const displayWorkers = filteredWorkers();
  const totalWorkers = workers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F0F4FF] tracking-tight">
            Trabajadores
          </h1>
          <p className="text-[#8892A4] mt-1">
            {totalWorkers} trabajadores registrados en el sistema
          </p>
        </div>
        <Button variant="ghost" size="md" icon={Download}>
          Exportar
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        custom={0.1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <WorkerFilter viewMode={viewMode} onViewModeChange={setViewMode} />
      </motion.div>

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {displayWorkers.map((worker, index) => (
              <div key={worker.id} className="flex flex-col gap-2">
                <WorkerCard worker={worker} index={index} />
              </div>
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
