import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, Users, BookOpen, ChevronRight } from 'lucide-react';
import { mockMeshes } from '../data/mockData';
import { MeshGrid } from '../components/curriculum/MeshGrid';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { Mesh } from '../types';

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

interface MeshCardProps {
  mesh: Mesh;
  onClick: () => void;
  index: number;
}

function MeshCard({ mesh, onClick, index }: MeshCardProps) {
  const workersCount = mesh.trabajadoresAsignados.length;
  const coursesCount = mesh.cursos.length;

  return (
    <motion.div
      custom={0.2 + index * 0.1}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        variant="glass"
        padding="lg"
        className="cursor-pointer group"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[rgba(0,229,255,0.1)] rounded-sm">
            <Layers className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <ChevronRight className="w-5 h-5 text-[#4A5568] group-hover:text-[#00E5FF] transition-colors" />
        </div>

        <h3 className="font-display text-xl font-semibold text-[#F0F4FF] mb-2">
          {mesh.nombre}
        </h3>
        <p className="text-sm text-[#8892A4] line-clamp-2 mb-4">
          {mesh.descripcion}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm">
            <BookOpen className="w-4 h-4 text-[#AAFF00]" />
            <span className="text-[#F0F4FF]">{coursesCount}</span>
            <span className="text-[#8892A4]">cursos</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-[#F0F4FF]">{workersCount}</span>
            <span className="text-[#8892A4]">
              trabajador{workersCount !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {/* Completion Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#8892A4]">Completado</span>
            <span className="text-xs font-mono text-[#00E5FF]">{mesh.completionRate}%</span>
          </div>
          <ProgressBar value={mesh.completionRate} showLabel={false} />
        </div>
      </Card>
    </motion.div>
  );
}

export function Curriculum() {
  const [selectedMesh, setSelectedMesh] = useState<Mesh | null>(null);

  // Close modal on ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedMesh(null);
    }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
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
            Mallas Curriculares
          </h1>
          <p className="text-[#8892A4] mt-1">
            {mockMeshes.length} mallas de capacitación activas
          </p>
        </div>
        <Button variant="ghost" size="md" icon={Plus}>
          Nueva Malla
        </Button>
      </motion.div>

      {/* Mesh Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMeshes.map((mesh, index) => (
          <MeshCard
            key={mesh.id}
            mesh={mesh}
            onClick={() => setSelectedMesh(mesh)}
            index={index}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMesh && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setSelectedMesh(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0A0E1A]/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MeshGrid
                mesh={selectedMesh}
                onClose={() => setSelectedMesh(null)}
                isModal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Curriculum;
