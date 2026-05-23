import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, BookOpen, Search, X, GraduationCap, TrendingUp, Star, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
  'Seguridad':    { color: '#8a9e52', bg: 'rgba(138,158,82,0.12)',  icon: Layers },
  'Operaciones':  { color: '#9b6ab5', bg: 'rgba(91,34,119,0.12)',   icon: Layers },
  'Inducción':    { color: '#FFB800', bg: 'rgba(255,184,0,0.12)',   icon: Layers },
  'Liderazgo':    { color: '#FFB800', bg: 'rgba(255,184,0,0.12)',   icon: Layers },
  'Emergencias':  { color: '#FF3D57', bg: 'rgba(255,61,87,0.12)',   icon: Layers },
  'Capacitación': { color: '#729362', bg: 'rgba(114,147,98,0.12)',  icon: Layers },
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
  const completionColor = mesh.completionRate >= 80 ? '#729362'
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
      className="transition-all duration-200"
      style={{
        backgroundColor: '#1a1040',
        borderRadius: '12px',
        border: `1px solid ${hovered ? cfg.color + '40' : 'rgba(91,34,119,0.2)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: hovered
          ? `0 4px 24px rgba(91,34,119,0.2), 0 0 0 1px ${cfg.color}20`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'row',
        minHeight: '148px',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* LEFT: Illustration panel — aspect-square w-[110px] */}
      <div style={{
        width: '110px',
        flexShrink: 0,
        backgroundColor: cfg.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '16px 10px',
        position: 'relative',
        aspectRatio: '1 / 1',
      }}>
        {/* Large icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundColor: cfg.color + '20',
          border: `1px solid ${cfg.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Layers style={{ width: '28px', height: '28px', color: cfg.color }} />
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
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 12px',
            backgroundColor: cfg.bg,
            color: cfg.color,
            fontSize: '12px', fontWeight: 500,
            borderRadius: '9999px',
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
            className="transition-colors duration-200"
            style={{
              padding: '8px 16px',
              backgroundColor: hovered ? '#7c4dab' : '#5b2277',
              border: 'none',
              borderRadius: '9999px',
              color: '#F0F4FF',
              fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
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

// ─── Side Panel ─────────────────────────────────────────────────────────────

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// Deterministic schedule times
const SCHEDULE_TIMES = ['09:00 - 10:30', '11:00 - 12:00', '13:30 - 15:00', '15:30 - 16:30', '08:00 - 09:30'];
// Spread events across the current month
const SCHEDULE_DAYS = [3, 8, 14, 19, 24];

function SidePanel() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-first: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number | null) =>
    d !== null &&
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Derive schedule from first 5 in-progress courses across all meshes
  const scheduleItems = useMemo(() => {
    const courses: { nombre: string; completados: number; total: number }[] = [];
    for (const mesh of mockMeshes) {
      for (const c of mesh.cursos) {
        if (c.estado === 'en_progreso' && courses.length < 5) {
          const total = Math.floor(Math.random() * 8) + 4; // 4-11 chapters
          const done = Math.floor(total * 0.4);
          courses.push({ nombre: c.nombre, completados: done, total });
        }
      }
    }
    // pad if fewer than 5
    while (courses.length < 5) {
      courses.push({ nombre: 'Módulo complementario', completados: 1, total: 4 });
    }
    return courses;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      width: '320px',
      flexShrink: 0,
      backgroundColor: '#1a1040',
      borderLeft: '1px solid rgba(91,34,119,0.2)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      overflow: 'hidden',
      alignSelf: 'flex-start',
      position: 'sticky',
      top: '24px',
    }}>
      {/* ── Calendar ── */}
      <div style={{ padding: '20px 20px 16px' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={prevMonth}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8892A4', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F0F4FF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8892A4')}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#F0F4FF', fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.5px' }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8892A4', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F0F4FF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8892A4')}
          >
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: '#4A5568', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {cells.map((day, i) => (
            <div
              key={i}
              style={{
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: isToday(day) ? 700 : 400,
                color: day === null ? 'transparent'
                  : isToday(day) ? '#0A0E1A'
                  : '#8892A4',
                backgroundColor: isToday(day) ? '#7c4dab' : 'transparent',
                borderRadius: '50%',
                width: '28px',
                margin: '0 auto',
                cursor: day ? 'default' : 'default',
              }}
            >
              {day ?? ''}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(91,34,119,0.15)', margin: '0 20px' }} />

      {/* ── Próximas Actividades ── */}
      <div style={{ padding: '16px 20px 20px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          Próximas Actividades
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {scheduleItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                backgroundColor: 'rgba(91,34,119,0.05)',
                border: '1px solid rgba(91,34,119,0.12)',
                borderRadius: '8px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(91,34,119,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(91,34,119,0.12)')}
            >
              {/* Day number */}
              <div style={{ width: '32px', flexShrink: 0, textAlign: 'center' }}>
                <span style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: '22px',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: '#8892A4',
                }}>
                  {SCHEDULE_DAYS[i]}
                </span>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.nombre}
                </p>
                <p style={{ fontSize: '11px', color: '#4A5568', marginTop: '2px' }}>
                  {item.completados} de {item.total} capítulos
                </p>
              </div>
              {/* Time */}
              <span style={{ fontSize: '10px', color: '#4A5568', flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                {SCHEDULE_TIMES[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type TabId = 'todas' | 'activas' | 'proximas' | 'completadas';

const TABS: { id: TabId; label: string; dot?: boolean }[] = [
  { id: 'todas',       label: 'Todas' },
  { id: 'activas',     label: 'Activas' },
  { id: 'proximas',    label: 'Próximas', dot: true },
  { id: 'completadas', label: 'Completadas' },
];

export function Curriculum() {
  const [selectedMesh, setSelectedMesh] = useState<Mesh | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('todas');

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalMeshes = mockMeshes.length;
    const totalCourses = mockMeshes.reduce((sum, m) => sum + m.cursos.length, 0);
    const avgCompletion = totalMeshes > 0 
      ? Math.round(mockMeshes.reduce((sum, m) => sum + m.completionRate, 0) / totalMeshes)
      : 0;
    return { totalMeshes, totalCourses, avgCompletion };
  }, []);

  // Filter meshes by tab + search
  const filteredMeshes = useMemo(() => {
    let list = mockMeshes;
    if (activeTab === 'activas')     list = list.filter(m => m.completionRate > 0 && m.completionRate < 100);
    if (activeTab === 'proximas')    list = list.filter(m => m.completionRate === 0);
    if (activeTab === 'completadas') list = list.filter(m => m.completionRate === 100);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m =>
        m.nombre.toLowerCase().includes(q) ||
        m.descripcion.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  // Close modal on ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedMesh(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }} onKeyDown={handleKeyDown}>
      {/* Main content column */}
      <div className="space-y-6" style={{ flex: 1, minWidth: 0 }}>
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
          <p className="text-[#8892A4] text-sm mt-1">
            {mockMeshes.length} mallas de capacitación activas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search input — relocated to header right */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
            <input
              type="text"
              placeholder="Buscar mallas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-56 bg-[#231455] border border-[rgba(91,34,119,0.25)] rounded-lg pl-9 pr-8 text-sm text-[#F0F4FF] placeholder-[#4A5568] focus:outline-none focus:border-[rgba(91,34,119,0.5)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A5568] hover:text-[#F0F4FF] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button variant="ghost" size="md" icon={Plus}>
            Nueva Malla
          </Button>
        </div>
      </motion.div>

      {/* Tabs bar */}
      <motion.div
        custom={0.04}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          borderBottom: '1px solid rgba(91,34,119,0.2)',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#9b6ab5' : '#8892A4',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #9b6ab5' : '2px solid transparent',
                marginBottom: '-1px',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#C8D6E5';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#8892A4';
              }}
            >
              {tab.dot && (
                <span style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#9b6ab5' : '#8892A4',
                  flexShrink: 0,
                  display: 'inline-block',
                  transition: 'background-color 0.15s',
                }} />
              )}
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Summary Stats Bar */}
      <motion.div
        custom={0.05}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1040]/70 border border-[rgba(91,34,119,0.2)] rounded-lg">
          <div className="p-2 bg-[rgba(91,34,119,0.15)] rounded-md">
            <Layers className="w-4 h-4 text-[#9b6ab5]" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-[#F0F4FF]">{stats.totalMeshes}</p>
            <p className="text-xs text-[#8892A4]">Total Mallas</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1040]/70 border border-[rgba(91,34,119,0.2)] rounded-lg">
          <div className="p-2 bg-[rgba(138,158,82,0.15)] rounded-md">
            <GraduationCap className="w-4 h-4 text-[#8a9e52]" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-[#F0F4FF]">{stats.totalCourses}</p>
            <p className="text-xs text-[#8892A4]">Total Cursos</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1040]/70 border border-[rgba(91,34,119,0.2)] rounded-lg">
          <div className="p-2 bg-[rgba(114,147,98,0.15)] rounded-md">
            <TrendingUp className="w-4 h-4 text-[#729362]" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-[#F0F4FF]">{stats.avgCompletion}%</p>
            <p className="text-xs text-[#8892A4]">Completitud Promedio</p>
          </div>
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

      </div>{/* end main column */}

      {/* Side Panel */}
      <SidePanel />

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
