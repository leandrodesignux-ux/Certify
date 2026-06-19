import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, BookOpen, Search, X, GraduationCap, Star, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
  'Seguridad':    { color: '#297a3a', bg: 'rgba(41,122,58,0.06)',   icon: Layers },
  'Operaciones':  { color: '#4d4d4d', bg: 'rgba(23,23,23,0.05)',    icon: Layers },
  'Inducción':    { color: '#b25000', bg: 'rgba(178,80,0,0.06)',    icon: Layers },
  'Liderazgo':    { color: '#b25000', bg: 'rgba(178,80,0,0.06)',    icon: Layers },
  'Emergencias':  { color: '#e5484d', bg: 'rgba(229,72,77,0.06)',   icon: Layers },
  'Capacitación': { color: '#4d4d4d', bg: 'rgba(23,23,23,0.04)',    icon: Layers },
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
  const completionColor = mesh.completionRate >= 80 ? '#297a3a'
    : mesh.completionRate >= 50 ? '#b25000'
    : '#e5484d';

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
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        border: `1px solid ${hovered ? '#d4d4d4' : '#ebebeb'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
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
              fill="none" stroke="#ebebeb" strokeWidth={strokeW} />
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
            fontSize: '9px', fontWeight: 600, color: completionColor,
            fontFamily: 'var(--font-mono)',
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
            padding: '3px 10px',
            backgroundColor: cfg.bg,
            color: cfg.color,
            fontSize: '11px', fontWeight: 500,
            borderRadius: '9999px',
            border: `1px solid ${cfg.color}30`,
          }}>
            {category}
          </span>
          {/* Rating badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            backgroundColor: 'rgba(178,80,0,0.06)',
            border: '1px solid rgba(178,80,0,0.15)',
            borderRadius: '9999px',
            padding: '3px 8px',
          }}>
            <Star style={{ width: '10px', height: '10px', color: '#b25000', fill: '#b25000' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#b25000', fontFamily: 'var(--font-mono)' }}>
              {mock.rating}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '15px', fontWeight: 600,
          color: 'var(--color-brand)', lineHeight: 1.3, letterSpacing: 'var(--tracking-snug)',
          marginBottom: '5px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {mesh.nombre}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '12px', color: '#666666',
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
              <Calendar style={{ width: '12px', height: '12px', color: '#a8a8a8' }} strokeWidth={1.5} />
              <span style={{ fontSize: '11px', color: '#a8a8a8' }}>Inicio: {mock.startDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users style={{ width: '12px', height: '12px', color: '#a8a8a8' }} strokeWidth={1.5} />
              <span style={{ fontSize: '11px', color: '#a8a8a8' }}>{workersCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen style={{ width: '12px', height: '12px', color: '#a8a8a8' }} strokeWidth={1.5} />
              <span style={{ fontSize: '11px', color: '#a8a8a8' }}>{coursesCount} cursos</span>
            </div>
          </div>

          {/* Ver Malla pill button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="transition-colors duration-200"
            style={{
              padding: '6px 14px',
              backgroundColor: hovered ? 'var(--color-primary-hover)' : 'var(--color-primary)',
              border: 'none',
              borderRadius: '9999px',
              color: '#ffffff',
              fontSize: '13px', fontWeight: 500,
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
      backgroundColor: '#ffffff',
      border: '1px solid #ebebeb',
      borderRadius: '6px',
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a8a8', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-brand)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-faint)')}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} strokeWidth={1.5} />
          </button>
          <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-brand)' }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a8a8', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-brand)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-faint)')}
          >
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Day headers + cells */}
        <div style={{ width: '100%', overflowX: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
            {DAY_LABELS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 500, color: '#a8a8a8', padding: '4px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((day, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: isToday(day) ? 600 : 400,
                  color: day === null ? 'transparent'
                    : isToday(day) ? '#ffffff'
                    : '#666666',
                  backgroundColor: isToday(day) ? 'var(--color-brand)' : 'transparent',
                  borderRadius: '50%',
                  minWidth: 0,
                  cursor: day ? 'default' : 'default',
                }}
              >
                {day ?? ''}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#ebebeb', margin: '0 20px' }} />

      {/* ── Próximas Actividades ── */}
      <div style={{ padding: '16px 20px 20px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
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
                backgroundColor: '#fafafa',
                border: '1px solid #ebebeb',
                borderRadius: '6px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4d4d4')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ebebeb')}
            >
              {/* Day number */}
              <div style={{ width: '32px', flexShrink: 0, textAlign: 'center' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: '#a8a8a8',
                }}>
                  {SCHEDULE_DAYS[i]}
                </span>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-caption)', fontWeight: 500, color: 'var(--color-brand)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.nombre}
                </p>
                <p style={{ fontSize: '11px', color: '#a8a8a8', marginTop: '2px' }}>
                  {item.completados} de {item.total} capítulos
                </p>
              </div>
              {/* Time */}
              <span style={{ fontSize: '10px', color: '#a8a8a8', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6" style={{ alignItems: 'flex-start' }} onKeyDown={handleKeyDown}>
      {/* Main content column */}
      <div className="space-y-6" style={{ minWidth: 0 }}>
      {/* Header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{ marginBottom: '24px' }}
      >
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <h1 className="text-3xl font-semibold tracking-tight truncate" style={{ color: 'var(--color-brand)', letterSpacing: 'var(--tracking-tight)', fontSize: 'var(--text-h1)' }}>
            Mallas Curriculares
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body)' }}>
            {mockMeshes.length} mallas de capacitación activas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search input — relocated to header right */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a8a8a8' }} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Buscar mallas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: '38px',
                width: '224px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                paddingLeft: '40px',
                paddingRight: '32px',
                fontSize: 'var(--text-body)',
                color: 'var(--color-text)',
                outline: 'none'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-focus)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#a8a8a8' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div style={{ flexShrink: 0 }}>
            <Button variant="ghost" size="md" icon={Plus}>
              Nueva Malla
            </Button>
          </div>
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
          borderBottom: '1px solid #ebebeb',
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
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-1px',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--color-brand)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              {tab.dot && (
                <span style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--border-default)',
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
        className="grid grid-cols-3 gap-2 sm:gap-3" style={{ marginBottom: '24px' }}
      >
        {[
          { label: 'Mallas totales', value: stats.totalMeshes, icon: Layers },
          { label: 'Total recursos', value: stats.totalCourses, icon: BookOpen },
          { label: 'Completadas', value: Math.round(mockMeshes.filter(m => m.completionRate === 100).length), icon: GraduationCap },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb', borderRadius: '6px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#f5f5f5', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <stat.icon style={{ width: '18px', height: '18px', color: '#4d4d4d' }} strokeWidth={1.5} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 600, color: 'var(--color-brand)', lineHeight: 1, margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '2px 0 0 0' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>


      {/* Mesh Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMeshes.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-lg" style={{ color: '#666666' }}>No se encontraron mallas</p>
            <p className="text-sm mt-2" style={{ color: '#a8a8a8' }}>Intenta con otra búsqueda</p>
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
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl"
              style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '6px' }}
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
