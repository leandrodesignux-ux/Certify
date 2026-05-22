import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, BookOpen, Search, X, GraduationCap, TrendingUp, Star, Users, Calendar } from 'lucide-react';
import { mockMeshes } from '../data/mockData';
import { MeshGrid } from '../components/curriculum/MeshGrid';
import { Button } from '../components/ui/Button';
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

// Category config
const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: typeof Layers }> = {
  'Seguridad':    { color: '#AAFF00', bg: 'rgba(170,255,0,0.12)',   icon: Layers },
  'Operaciones':  { color: '#00E5FF', bg: 'rgba(0,229,255,0.12)',   icon: Layers },
  'Inducción':    { color: '#FFB800', bg: 'rgba(255,184,0,0.12)',   icon: Layers },
  'Liderazgo':    { color: '#FFB800', bg: 'rgba(255,184,0,0.12)',   icon: Layers },
  'Emergencias':  { color: '#FF3D57', bg: 'rgba(255,61,87,0.12)',   icon: Layers },
  'Capacitación': { color: '#00E676', bg: 'rgba(0,230,118,0.12)',   icon: Layers },
};

// Derive category from mesh name
function getMeshCategory(nombre: string): string {
  if (nombre.toLowerCase().includes('seguridad')) return 'Seguridad';
  if (nombre.toLowerCase().includes('operacion')) return 'Operaciones';
  if (nombre.toLowerCase().includes('induccion') || nombre.toLowerCase().includes('inducción')) return 'Inducción';
  if (nombre.toLowerCase().includes('liderazgo')) return 'Liderazgo';
  if (nombre.toLowerCase().includes('emergencia')) return 'Emergencias';
  return 'Capacitación';
}

// Deterministic mock rating & start date per mesh (avoids random re-renders)
const MESH_MOCK: Record<string, { rating: number; startDate: string }> = {
  m1: { rating: 4.8, startDate: 'Ene 2024' },
  m2: { rating: 4.6, startDate: 'Feb 2024' },
  m3: { rating: 4.3, startDate: 'Mar 2024' },
  m4: { rating: 4.7, startDate: 'Abr 2024' },
  m5: { rating: 4.5, startDate: 'May 2024' },
};

interface MeshCardProps {
  mesh: Mesh;
  onClick: () => void;
  index: number;
}

function MeshCard({ mesh, onClick, index }: MeshCardProps) {
  const [hovered, setHovered] = useState(false);
  const workersCount = mesh.trabajadoresAsignados.length;
  const coursesCount = mesh.cursos.length;
  const category = getMeshCategory(mesh.nombre);
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG['Capacitación'];
  const mock = MESH_MOCK[mesh.id] ?? { rating: 4.5, startDate: 'Ene 2024' };

  // Completion color
  const completionColor = mesh.completionRate >= 80 ? '#00E676'
    : mesh.completionRate >= 50 ? '#FFB800'
    : '#FF3D57';

  // Compact progress ring (inline SVG, no external component)
  const ringSize = 36;
  const strokeW = 3;
  const r = (ringSize - strokeW) / 2;
  const circ = r * 2 * Math.PI;
  const offset = circ - (mesh.completionRate / 100) * circ;

  return (
    <motion.div
      custom={0.2 + index * 0.1}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      style={{
        backgroundColor: '#1C2333',
        borderRadius: '12px',
        border: `1px solid ${hovered ? cfg.color + '40' : 'rgba(0,229,255,0.1)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
        boxShadow: hovered ? `0 8px 32px ${cfg.color}18, 0 0 0 1px ${cfg.color}20` : '0 2px 8px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'row',
        minHeight: '148px',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* LEFT: Illustration panel */}
      <div style={{
        width: '120px',
        flexShrink: 0,
        backgroundColor: cfg.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '16px 12px',
        position: 'relative',
      }}>
        {/* Large icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: cfg.color + '20',
          border: `1px solid ${cfg.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BookOpen style={{ width: '24px', height: '24px', color: cfg.color }} />
        </div>

        {/* Progress ring */}
        <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW} />
            <motion.circle
              cx={ringSize / 2} cy={ringSize / 2} r={r}
              fill="none" stroke={completionColor} strokeWidth={strokeW} strokeLinecap="round"
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
              style={{ strokeDasharray: circ }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: completionColor,
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            {mesh.completionRate}%
          </div>
        </div>
      </div>

      {/* RIGHT: Content */}
      <div style={{
        flex: 1,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: 0,
      }}>
        {/* Top: category tag + rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 9px',
            backgroundColor: cfg.bg,
            color: cfg.color,
            fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.6px',
            borderRadius: '20px',
            border: `1px solid ${cfg.color}30`,
          }}>
            {category}
          </span>
          {/* Rating badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            backgroundColor: 'rgba(255,184,0,0.12)',
            border: '1px solid rgba(255,184,0,0.25)',
            borderRadius: '20px',
            padding: '3px 8px',
          }}>
            <Star style={{ width: '10px', height: '10px', color: '#FFB800', fill: '#FFB800' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#FFB800', fontFamily: '"JetBrains Mono", monospace' }}>
              {mock.rating}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: '17px', fontWeight: 700,
          color: '#F0F4FF', lineHeight: 1.25,
          marginBottom: '5px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {mesh.nombre}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '12px', color: '#8892A4',
          lineHeight: 1.5, marginBottom: '10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {mesh.descripcion}
        </p>

        {/* Bottom: meta + button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Start date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar style={{ width: '12px', height: '12px', color: '#4A5568' }} />
              <span style={{ fontSize: '11px', color: '#8892A4' }}>Inicio: {mock.startDate}</span>
            </div>
            {/* Workers count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users style={{ width: '12px', height: '12px', color: '#4A5568' }} />
              <span style={{ fontSize: '11px', color: '#8892A4' }}>{workersCount}</span>
            </div>
            {/* Courses count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen style={{ width: '12px', height: '12px', color: '#4A5568' }} />
              <span style={{ fontSize: '11px', color: '#8892A4' }}>{coursesCount} cursos</span>
            </div>
          </div>

          {/* Ver Malla pill button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{
              padding: '6px 16px',
              backgroundColor: hovered ? '#00E5FF' : 'rgba(0,229,255,0.1)',
              border: '1px solid rgba(0,229,255,0.35)',
              borderRadius: '20px',
              color: hovered ? '#0A0E1A' : '#00E5FF',
              fontSize: '12px', fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            Ver Malla
          </button>
        </div>
      </div>
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
          <h1 className="font-display text-3xl font-bold text-gradient tracking-tight">
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
      <div className="grid grid-cols-1 gap-4">
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
