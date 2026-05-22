import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
} from 'lucide-react';
import { useCertStore } from '../store/useCertStore';
import { useWorkerStore } from '../store/useWorkerStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/dates';

type TabType = 'todas' | 'vigentes' | 'proximas' | 'vencidas';
type SortField = 'worker' | 'cert' | 'emisor' | 'tipo' | 'fechaObt' | 'fechaVen' | 'estado';
type SortOrder = 'asc' | 'desc';

const tabs = [
  { id: 'todas' as TabType, label: 'Todas', color: '#00E5FF', countKey: 'total' as const },
  { id: 'vigentes' as TabType, label: 'Vigentes', color: '#00E676', countKey: 'vigentes' as const },
  { id: 'proximas' as TabType, label: 'Por vencer', color: '#FFB800', countKey: 'porvencer' as const },
  { id: 'vencidas' as TabType, label: 'Vencidas', color: '#FF3D57', countKey: 'vencidas' as const },
];

// Animated counter hook
function useCountUp(end: number, duration: number = 1.5) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}

// Stat Card Component
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  total 
}: { 
  icon: React.ElementType; 
  value: number; 
  label: string; 
  color: string; 
  total: number;
}) {
  const animatedValue = useCountUp(value);
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: 'rgba(17,24,39,0.6)',
        border: '1px solid rgba(0,229,255,0.1)',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow effect at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        boxShadow: `0 0 20px ${color}40`,
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon style={{ width: '24px', height: '24px', color }} />
        </div>
        <div>
          <motion.p
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '36px',
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {animatedValue}
          </motion.p>
          <p style={{ fontSize: '13px', color: '#8892A4', marginTop: '4px' }}>{label}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ height: '100%', backgroundColor: color, borderRadius: '2px' }}
        />
      </div>
      <p style={{ fontSize: '11px', color: '#4A5568', marginTop: '8px', textAlign: 'right' }}>
        {percentage.toFixed(1)}% del total
      </p>
    </motion.div>
  );
}

// Sparkline component for days remaining
function DaysSparkline({ diasRestantes }: { diasRestantes: number }) {
  const maxDays = 365;
  const percentage = Math.min(Math.max((diasRestantes / maxDays) * 100, 0), 100);
  const color = diasRestantes <= 0 ? '#FF3D57' : diasRestantes <= 60 ? '#FFB800' : '#00E676';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '60px', 
        height: '6px', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '3px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontSize: '12px', color, fontWeight: 600 }}>
        {diasRestantes}d
      </span>
    </div>
  );
}

// Empty state with animated SVG illustration (3 rotating orbit rings)
interface EmptyStateProps {
  search?: string;
  activeTab?: TabType;
  onClearSearch?: () => void;
  onSwitchToAll?: () => void;
}

function EmptyState({ search, activeTab, onClearSearch, onSwitchToAll }: EmptyStateProps) {
  const hasSearch = search && search.trim().length > 0;
  const hasTabFilter = activeTab && activeTab !== 'todas';

  // Determine message based on filters
  let title = 'Sin certificaciones';
  let subtitle = 'No hay certificaciones para mostrar en este momento';

  if (hasSearch) {
    title = `No hay resultados para "${search}"`;
    subtitle = 'Intenta con otros términos de búsqueda';
  } else if (hasTabFilter) {
    const tabLabels: Record<TabType, string> = {
      todas: 'Todas',
      vigentes: 'Vigentes',
      proximas: 'Próximas a vencer',
      vencidas: 'Vencidas',
    };
    title = `Sin certificaciones ${tabLabels[activeTab].toLowerCase()}`;
    subtitle = `No hay certificaciones en estado "${tabLabels[activeTab]}"`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', padding: '60px 20px' }}
    >
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px', width: '80px', height: '80px' }}>
        {/* 3 rotating orbit rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            border: '2px dashed rgba(0,229,255,0.3)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-25px',
            borderRadius: '50%',
            border: '2px dashed rgba(170,255,0,0.2)',
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-40px',
            borderRadius: '50%',
            border: '2px dashed rgba(255,184,0,0.15)',
          }}
        />
        <Award style={{ width: '64px', height: '64px', color: '#00E5FF', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />
      </div>
      <p style={{ fontSize: '18px', fontWeight: 600, color: '#F0F4FF', marginBottom: '8px' }}>
        {title}
      </p>
      <p style={{ fontSize: '14px', color: '#8892A4', marginBottom: '20px' }}>
        {subtitle}
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {hasSearch && onClearSearch && (
          <button
            onClick={onClearSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(0,229,255,0.1)',
              border: '1px solid rgba(0,229,255,0.3)',
              borderRadius: '6px',
              color: '#00E5FF',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,229,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,229,255,0.1)';
            }}
          >
            Limpiar búsqueda
          </button>
        )}
        {hasTabFilter && onSwitchToAll && (
          <button
            onClick={onSwitchToAll}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(170,255,0,0.1)',
              border: '1px solid rgba(170,255,0,0.3)',
              borderRadius: '6px',
              color: '#AAFF00',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(170,255,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(170,255,0,0.1)';
            }}
          >
            Ver todas las certificaciones
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Certifications() {
  const { certifications, activeTab, setActiveTab } = useCertStore();
  const { workers } = useWorkerStore();

  const [sortField, setSortField] = useState<SortField>('fechaVen');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCert, setExpandedCert] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 15;

  // Filter by tab
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case 'vigentes':
        return certifications.filter((c) => c.diasRestantes > 60);
      case 'proximas':
        return certifications.filter((c) => c.diasRestantes > 0 && c.diasRestantes <= 60);
      case 'vencidas':
        return certifications.filter((c) => c.diasRestantes <= 0);
      default:
        return certifications;
    }
  }, [certifications, activeTab]);

  // Apply search and filters
  const filtered = useMemo(() => {
    return filteredByTab.filter((cert) => {
      const worker = workers.find((w) => w.id === cert.workerId);
      if (!worker) return false;

      if (search) {
        const searchLower = search.toLowerCase();
        const matchWorker = `${worker.nombre} ${worker.apellidos}`.toLowerCase().includes(searchLower);
        const matchCert = cert.nombre.toLowerCase().includes(searchLower);
        const matchEmisor = cert.emisor.toLowerCase().includes(searchLower);
        if (!matchWorker && !matchCert && !matchEmisor) return false;
      }

      if (areaFilter && worker.area !== areaFilter) return false;
      if (tipoFilter && cert.tipo !== tipoFilter) return false;

      return true;
    });
  }, [filteredByTab, workers, search, areaFilter, tipoFilter]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'worker': {
          const workerA = workers.find((w) => w.id === a.workerId);
          const workerB = workers.find((w) => w.id === b.workerId);
          return multiplier * `${workerA?.nombre}`.localeCompare(`${workerB?.nombre}`);
        }
        case 'cert':
          return multiplier * a.nombre.localeCompare(b.nombre);
        case 'emisor':
          return multiplier * a.emisor.localeCompare(b.emisor);
        case 'tipo':
          return multiplier * a.tipo.localeCompare(b.tipo);
        case 'fechaObt':
          return multiplier * (new Date(a.fechaObtension).getTime() - new Date(b.fechaObtension).getTime());
        case 'fechaVen':
          return multiplier * (new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());
        case 'estado':
          return multiplier * a.estado.localeCompare(b.estado);
        default:
          return 0;
      }
    });
  }, [filtered, sortField, sortOrder, workers]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedCerts = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Summary counts
  const summary = useMemo(() => {
    const total = certifications.length;
    return {
      total,
      vigentes: certifications.filter((c) => c.diasRestantes > 60).length,
      porvencer: certifications.filter((c) => c.diasRestantes > 0 && c.diasRestantes <= 60).length,
      vencidas: certifications.filter((c) => c.diasRestantes <= 0).length,
      pendientes: certifications.filter((c) => c.estado === 'pendiente').length,
    };
  }, [certifications]);

  // Tab counts
  const tabCounts = useMemo(() => ({
    total: summary.total,
    vigentes: summary.vigentes,
    porvencer: summary.porvencer,
    vencidas: summary.vencidas,
  }), [summary]);

  // CSV export - all results
  const exportCSV = () => {
    const headers = ['Trabajador', 'Certificación', 'Emisor', 'Tipo', 'Fecha Obtención', 'Vencimiento', 'Estado', 'Días Restantes'];
    const rows = sorted.map((cert) => {
      const worker = workers.find((w) => w.id === cert.workerId);
      return [
        `${worker?.nombre} ${worker?.apellidos}`,
        cert.nombre,
        cert.emisor,
        cert.tipo,
        cert.fechaObtension,
        cert.fechaVencimiento,
        cert.estado,
        cert.diasRestantes,
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificaciones_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="w-4" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-[#00E5FF]" />
    ) : (
      <ChevronDown className="w-4 h-4 text-[#00E5FF]" />
    );
  };

  const activeFilters = [search, areaFilter, tipoFilter].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#F0F4FF] tracking-tight">
              Certificaciones
            </h1>
            <p className="text-[#8892A4] mt-1">
              {filtered.length} certificaciones en vista{' '}
              {activeTab !== 'todas' && `(${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()})`}
            </p>
          </div>
          <Button variant="ghost" size="md" icon={Download} onClick={exportCSV}>
            Exportar CSV
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          icon={CheckCircle}
          value={summary.vigentes}
          label="Vigentes"
          color="#00E676"
          total={summary.total}
        />
        <StatCard
          icon={Clock}
          value={summary.porvencer}
          label="Por vencer"
          color="#FFB800"
          total={summary.total}
        />
        <StatCard
          icon={AlertCircle}
          value={summary.vencidas}
          label="Vencidas"
          color="#FF3D57"
          total={summary.total}
        />
        <StatCard
          icon={Award}
          value={summary.pendientes}
          label="Pendientes"
          color="#00E5FF"
          total={summary.total}
        />
      </motion.div>

      {/* Tabs with Sliding Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-[#0D1B2A] rounded-lg p-1 flex gap-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
            className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200"
            style={{
              color: activeTab === tab.id ? tab.color : '#8892A4',
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-md"
                style={{
                  backgroundColor: `${tab.color}15`,
                  boxShadow: `0 0 12px ${tab.color}33`,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tab.color }}
              />
              {tab.label}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1 px-1.5 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor: activeTab === tab.id ? `${tab.color}30` : 'rgba(136,146,164,0.2)',
                  color: activeTab === tab.id ? tab.color : '#8892A4',
                }}
              >
                {tabCounts[tab.countKey]}
              </motion.span>
            </span>
          </button>
        ))}
      </motion.div>

      {/* Filters - Two Row Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="space-y-3"
      >
        {/* Search - Full Width */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Buscar certificación, trabajador, emisor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#1C2333',
              border: `1px solid ${search ? (sorted.length === 0 ? 'rgba(255,61,87,0.4)' : 'rgba(0,229,255,0.4)') : 'rgba(0,229,255,0.15)'}`,
              borderRadius: '8px',
              paddingLeft: '48px',
              paddingRight: search ? '48px' : '100px',
              fontSize: '14px',
              color: '#F0F4FF',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          {/* Results count badge */}
          {!search && (
            <span
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: '#4A5568',
              }}
            >
              {filtered.length} resultados
            </span>
          )}
          {/* Search active badge */}
          {search && sorted.length > 0 && (
            <span
              style={{
                position: 'absolute',
                right: '48px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '11px',
                color: '#00E5FF',
                backgroundColor: 'rgba(0,229,255,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              {sorted.length} resultados
            </span>
          )}
          {/* No results warning */}
          {search && sorted.length === 0 && (
            <span
              style={{
                position: 'absolute',
                right: '48px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '11px',
                color: '#FF3D57',
                backgroundColor: 'rgba(255,61,87,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              Sin resultados
            </span>
          )}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5568] hover:text-[#F0F4FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* No results message below input */}
        {search && sorted.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '12px', color: '#FF3D57', marginTop: '8px', marginLeft: '4px' }}
          >
            No se encontraron certificaciones para "{search}". Intenta con otros términos.
          </motion.p>
        )}

        {/* Select Filters Row */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Area Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8892A4] uppercase tracking-wider">Área</label>
            <div className="relative">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="h-10 w-44 bg-[#1C2333] border border-[rgba(0,229,255,0.15)] rounded-lg pl-3 pr-10 text-sm text-[#F0F4FF] focus:outline-none focus:border-[rgba(0,229,255,0.4)] cursor-pointer appearance-none"
              >
                <option value="">Todas las áreas</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Mantención">Mantención</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Logística">Logística</option>
                <option value="RRHH">RRHH</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] pointer-events-none" />
            </div>
          </div>

          {/* Tipo Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8892A4] uppercase tracking-wider">Tipo</label>
            <div className="relative">
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="h-10 w-40 bg-[#1C2333] border border-[rgba(0,229,255,0.15)] rounded-lg pl-3 pr-10 text-sm text-[#F0F4FF] focus:outline-none focus:border-[rgba(0,229,255,0.4)] cursor-pointer appearance-none"
              >
                <option value="">Todos los tipos</option>
                <option value="obligatoria">Obligatoria</option>
                <option value="complementaria">Complementaria</option>
                <option value="legal">Legal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] pointer-events-none" />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilters > 0 && (
            <button
              onClick={() => {
                setSearch('');
                setAreaFilter('');
                setTipoFilter('');
              }}
              className="flex items-center gap-1.5 h-10 px-4 text-sm text-[#FF3D57] hover:bg-[rgba(255,61,87,0.1)] rounded-lg transition-colors border border-[rgba(255,61,87,0.2)]"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}

          {/* Results Count */}
          <span className="ml-auto text-sm text-[#8892A4]">
            {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-[rgba(17,24,39,0.8)] backdrop-blur-[12px] border border-[rgba(0,229,255,0.1)] rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead 
              className="sticky top-0 z-10"
              style={{
                backgroundColor: 'rgba(13,27,42,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Gradient fade at bottom */}
              <tr>
                <th colSpan={8} className="p-0">
                  <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,229,255,0.2)] to-transparent" />
                </th>
              </tr>
              <tr className="border-b border-[rgba(0,229,255,0.1)]">
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('worker')}
                >
                  <div className="flex items-center gap-1">
                    Trabajador
                    <SortIcon field="worker" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('cert')}
                >
                  <div className="flex items-center gap-1">
                    Certificación
                    <SortIcon field="cert" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('emisor')}
                >
                  <div className="flex items-center gap-1">
                    Emisor
                    <SortIcon field="emisor" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('tipo')}
                >
                  <div className="flex items-center gap-1">
                    Tipo
                    <SortIcon field="tipo" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('fechaObt')}
                >
                  <div className="flex items-center gap-1">
                    Obtención
                    <SortIcon field="fechaObt" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('fechaVen')}
                >
                  <div className="flex items-center gap-1">
                    Vencimiento
                    <SortIcon field="fechaVen" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('estado')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Estado
                    <SortIcon field="estado" />
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8892A4] uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {paginatedCerts.map((cert, index) => {
                  const worker = workers.find((w) => w.id === cert.workerId);
                  const initials = worker
                    ? `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase()
                    : '?';
                  const isExpanded = expandedCert === cert.id;
                  const borderColor = cert.estado === 'vigente' ? '#00E676' : cert.estado === 'proximo_vencer' ? '#FFB800' : cert.estado === 'vencido' ? '#FF3D57' : '#00E5FF';

                  return (
                    <motion.tr
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="group cursor-pointer"
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(17,24,39,0.6)' : 'rgba(28,35,51,0.4)',
                        borderLeft: `3px solid ${borderColor}`,
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,229,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(17,24,39,0.6)' : 'rgba(28,35,51,0.4)';
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {worker?.foto ? (
                            <img
                              src={worker.foto}
                              alt={`${worker.nombre} ${worker.apellidos}`}
                              className="w-8 h-8 rounded-full object-cover border border-[rgba(0,229,255,0.2)]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#1C2333] border border-[rgba(0,229,255,0.2)] flex items-center justify-center">
                              <span className="text-xs font-display font-semibold text-[#00E5FF]">
                                {initials}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-[#F0F4FF]">
                            {worker?.nombre} {worker?.apellidos}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[#F0F4FF] truncate max-w-[200px]">
                          {cert.nombre}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-[#8892A4] truncate max-w-[150px]">
                          {cert.emisor}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          status={cert.tipo}
                          label={
                            cert.tipo === 'obligatoria'
                              ? 'Oblig.'
                              : cert.tipo === 'complementaria'
                              ? 'Compl.'
                              : 'Legal'
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#F0F4FF]">
                          {formatDate(cert.fechaObtension)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <DaysSparkline diasRestantes={cert.diasRestantes} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge status={cert.estado} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setExpandedCert(isExpanded ? null : cert.id)}
                          className="p-1.5 rounded-md hover:bg-[rgba(0,229,255,0.1)] transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4 text-[#00E5FF]" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <EmptyState
            search={search}
            activeTab={activeTab}
            onClearSearch={() => setSearch('')}
            onSwitchToAll={() => setActiveTab('todas')}
          />
        )}

        {/* Pagination */}
        {sorted.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,229,255,0.1)]">
            <span className="text-sm text-[#8892A4]">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#F0F4FF] bg-[#1C2333] border border-[rgba(0,229,255,0.15)] rounded-md hover:border-[rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#F0F4FF] bg-[#1C2333] border border-[rgba(0,229,255,0.15)] rounded-md hover:border-[rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Certifications;
