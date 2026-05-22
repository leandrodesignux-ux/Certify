import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, BookOpen, ChevronRight, Search, X, GraduationCap, TrendingUp } from 'lucide-react';
import { mockMeshes } from '../data/mockData';
import { MeshGrid } from '../components/curriculum/MeshGrid';
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

// Progress Ring Component
function ProgressRing({ percentage, size = 40 }: { percentage: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const color = percentage > 80 ? '#00E676' : percentage > 50 ? '#FFB800' : '#FF3D57';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color,
        }}
      >
        {percentage}%
      </div>
    </div>
  );
}

// Course Status Dots Component
function CourseStatusDots({ courses }: { courses: Mesh['cursos'] }) {
  const statusColors: Record<string, string> = {
    completado: '#00E676',
    en_progreso: '#FFB800',
    pendiente: '#4A5568',
    bloqueado: '#1C2333',
  };

  return (
    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
      {courses.slice(0, 8).map((course) => (
        <div
          key={course.id}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: statusColors[course.estado] || '#4A5568',
          }}
          title={`${course.nombre} - ${course.estado}`}
        />
      ))}
      {courses.length > 8 && (
        <span style={{ fontSize: '9px', color: '#8892A4', marginLeft: '2px' }}>
          +{courses.length - 8}
        </span>
      )}
    </div>
  );
}

// Avatar Stack Component
function AvatarStack({ count }: { count: number }) {
  const displayCount = Math.min(count, 3);
  const initials = Array.from({ length: displayCount }, (_, i) => 
    String.fromCharCode(65 + i)
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', marginRight: '6px' }}>
        {initials.map((letter, i) => (
          <div
            key={i}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,229,255,0.15)',
              border: '2px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 600,
              color: '#00E5FF',
              marginLeft: i > 0 ? '-8px' : 0,
              zIndex: displayCount - i,
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      <span style={{ fontSize: '12px', color: '#8892A4' }}>
        {count} trabajador{count !== 1 ? 'es' : ''}
      </span>
    </div>
  );
}

interface MeshCardProps {
  mesh: Mesh;
  onClick: () => void;
  index: number;
}

function MeshCard({ mesh, onClick, index }: MeshCardProps) {
  const workersCount = mesh.trabajadoresAsignados.length;
  const coursesCount = mesh.cursos.length;
  
  // Derive category from name or default
  const category = mesh.nombre.includes('Seguridad') ? 'Seguridad' 
    : mesh.nombre.includes('Operaciones') ? 'Operaciones'
    : mesh.nombre.includes('Inducción') ? 'Inducción'
    : 'Capacitación';
  
  const categoryColors: Record<string, string> = {
    'Seguridad': '#AAFF00',
    'Operaciones': '#00E5FF',
    'Inducción': '#FFB800',
    'Capacitación': '#00E676',
  };
  
  // Gradient border color based on completion
  const borderColor = mesh.completionRate > 80 ? '#00E676' 
    : mesh.completionRate > 50 ? '#FFB800' 
    : '#FF3D57';

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
        className="cursor-pointer group relative overflow-hidden"
        onClick={onClick}
        style={{
          borderTop: `3px solid ${borderColor}`,
        }}
      >
        {/* Hover gradient overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.03), transparent)',
          }}
        />

        <div className="relative z-10">
          {/* Top Row: Icon + Tag + Chevron */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[rgba(0,229,255,0.1)] rounded-lg">
                <Layers className="w-6 h-6 text-[#00E5FF]" />
              </div>
              <span 
                className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md"
                style={{ 
                  backgroundColor: `${categoryColors[category]}15`,
                  color: categoryColors[category],
                }}
              >
                {category}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4A5568] group-hover:text-[#00E5FF] transition-colors" />
          </div>

          {/* Title & Description */}
          <h3 className="font-display text-xl font-semibold text-[#F0F4FF] mb-2">
            {mesh.nombre}
          </h3>
          <p className="text-sm text-[#8892A4] line-clamp-2 mb-4">
            {mesh.descripcion}
          </p>

          {/* Course Status Dots */}
          <div className="mb-4">
            <p className="text-[10px] text-[#4A5568] uppercase tracking-wider mb-2">
              Estado de cursos
            </p>
            <CourseStatusDots courses={mesh.cursos} />
          </div>

          {/* Bottom Row: Stats + Progress Ring */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-[#AAFF00]" />
                <span className="text-[#F0F4FF]">{coursesCount}</span>
                <span className="text-[#8892A4]">cursos</span>
              </div>
              <AvatarStack count={workersCount} />
            </div>
            <ProgressRing percentage={mesh.completionRate} size={48} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function Curriculum() {
  const [selectedMesh, setSelectedMesh] = useState<Mesh | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalMeshes = mockMeshes.length;
    const totalCourses = mockMeshes.reduce((sum, m) => sum + m.cursos.length, 0);
    const avgCompletion = totalMeshes > 0 
      ? Math.round(mockMeshes.reduce((sum, m) => sum + m.completionRate, 0) / totalMeshes)
      : 0;
    return { totalMeshes, totalCourses, avgCompletion };
  }, []);

  // Filter meshes
  const filteredMeshes = useMemo(() => {
    if (!searchQuery.trim()) return mockMeshes;
    const query = searchQuery.toLowerCase();
    return mockMeshes.filter(m => 
      m.nombre.toLowerCase().includes(query) ||
      m.descripcion.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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

      {/* Summary Stats Bar */}
      <motion.div
        custom={0.05}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-[rgba(17,24,39,0.6)] border border-[rgba(0,229,255,0.1)] rounded-lg">
          <div className="p-2 bg-[rgba(0,229,255,0.1)] rounded-md">
            <Layers className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-[#F0F4FF]">{stats.totalMeshes}</p>
            <p className="text-xs text-[#8892A4]">Total Mallas</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-[rgba(17,24,39,0.6)] border border-[rgba(0,229,255,0.1)] rounded-lg">
          <div className="p-2 bg-[rgba(170,255,0,0.1)] rounded-md">
            <GraduationCap className="w-4 h-4 text-[#AAFF00]" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-[#F0F4FF]">{stats.totalCourses}</p>
            <p className="text-xs text-[#8892A4]">Total Cursos</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-[rgba(17,24,39,0.6)] border border-[rgba(0,229,255,0.1)] rounded-lg">
          <div className="p-2 bg-[rgba(0,230,118,0.1)] rounded-md">
            <TrendingUp className="w-4 h-4 text-[#00E676]" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-[#F0F4FF]">{stats.avgCompletion}%</p>
            <p className="text-xs text-[#8892A4]">Completitud Promedio</p>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        custom={0.1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Buscar mallas por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-lg pl-12 pr-12 text-sm text-[#F0F4FF] placeholder-[#4A5568] focus:outline-none focus:border-[rgba(0,229,255,0.3)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5568] hover:text-[#F0F4FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Mesh Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMeshes.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-[#8892A4] text-lg">No se encontraron mallas</p>
            <p className="text-[#4A5568] text-sm mt-2">Intenta con otra búsqueda</p>
          </div>
        ) : (
          filteredMeshes.map((mesh, index) => (
            <MeshCard
              key={mesh.id}
              mesh={mesh}
              onClick={() => setSelectedMesh(mesh)}
              index={index}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMesh && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
              className="relative z-10 w-full max-w-4xl"
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
