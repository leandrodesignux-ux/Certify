import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { useCertStore } from '../store/useCertStore';
import { useWorkerStore } from '../store/useWorkerStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/dates';
import { CertTableSkeleton } from '../components/certifications/CertTableSkeleton';
import { CertStatCard } from '../components/certifications/CertStatCard';
import { DaysSparkline } from '../components/certifications/DaysSparkline';
import { CertEmptyState } from '../components/certifications/CertEmptyState';
import { Suspense, lazy } from 'react';

const CertDetailDrawer = lazy(() => import('../components/certifications/CertDetailDrawer'));

type TabType = 'todas' | 'vigentes' | 'proximas' | 'vencidas';
type SortField = 'worker' | 'cert' | 'tipo' | 'fechaObt' | 'fechaVen' | 'estado';
type SortOrder = 'asc' | 'desc';

const tabs = [
  { id: 'todas' as TabType, label: 'Todas', color: '#7c4dab', countKey: 'total' as const },
  { id: 'vigentes' as TabType, label: 'Vigentes', color: '#729362', countKey: 'vigentes' as const },
  { id: 'proximas' as TabType, label: 'Por vencer', color: '#FFB800', countKey: 'porvencer' as const },
  { id: 'vencidas' as TabType, label: 'Vencidas', color: '#FF3D57', countKey: 'vencidas' as const },
];

// Notification Badge Component (kept local as it's small and used only here)
function NotificationBadge({ count, color }: { count: number; color: string }) {
  if (count === 0) return null;
  return (
    <span
      style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: color,
        color: '#fff',
        fontSize: '10px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--color-navy-deep)',
      }}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

export function Certifications() {
  const { certifications, activeTab, setActiveTab } = useCertStore();
  const { workers } = useWorkerStore();

  const [sortField, setSortField] = useState<SortField>('fechaVen');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, areaFilter, tipoFilter, activeTab]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFocused, setSearchFocused] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Smooth scroll to top when changing page
  const scrollToTop = () => {
    if (window.scrollY > 300) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard shortcut: "/" to focus search input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Calculate selected certification data
  const selectedCertData = certifications.find(c => c.id === selectedCert);
  const selectedWorker = workers.find(w => w.id === selectedCertData?.workerId);

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
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedCerts = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Summary counts
  const summary = useMemo(() => {
    const total = certifications.length;
    const vigentes = certifications.filter((c) => c.diasRestantes > 60).length;
    const compliance = total > 0 ? ((vigentes / total) * 100).toFixed(1) : '0.0';
    return {
      total,
      vigentes,
      porvencer: certifications.filter((c) => c.diasRestantes > 0 && c.diasRestantes <= 60).length,
      vencidas: certifications.filter((c) => c.diasRestantes <= 0).length,
      pendientes: certifications.filter((c) => c.estado === 'pendiente').length,
      compliance: compliance as string,
    };
  }, [certifications]);

  // Tab counts
  const tabCounts = useMemo(() => ({
    total: summary.total,
    vigentes: summary.vigentes,
    porvencer: summary.porvencer,
    vencidas: summary.vencidas,
  }), [summary]);

  // Get unique areas and types for chip filters
  const uniqueAreas = useMemo(() => {
    const areas = new Set<string>();
    certifications.forEach(cert => {
      const worker = workers.find(w => w.id === cert.workerId);
      if (worker?.area) {
        areas.add(worker.area);
      }
    });
    return Array.from(areas).sort();
  }, [certifications, workers]);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    certifications.forEach(cert => {
      if (cert.tipo) {
        types.add(cert.tipo);
      }
    });
    return Array.from(types).sort();
  }, [certifications]);

  // CSV export - all results
  const exportCSV = useCallback(async () => {
    setExporting(true);
    try {
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
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setExporting(false);
    }
  }, [sorted, workers, activeTab]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-[#9b6ab5]" />
    ) : (
      <ChevronDown className="w-4 h-4 text-[#9b6ab5]" />
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
        style={{ marginBottom: '20px' }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 
              className="font-display font-bold text-gradient"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                letterSpacing: '-0.02em',
              }}
            >
              Certificaciones
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {(() => {
                const hasFilters = activeTab !== 'todas' || search || areaFilter || tipoFilter;
                if (hasFilters) {
                  return `${filtered.length} de ${certifications.length} certificaciones`;
                }
                return `${certifications.length} certificaciones en total`;
              })()}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={exporting ? undefined : Download}
            onClick={exportCSV}
            disabled={exporting}
            loading={exporting}
          >
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        style={{ 
          marginBottom: '28px' 
        }}
      >
        <CertStatCard
          icon={CheckCircle}
          value={summary.vigentes}
          label="Vigentes"
          color="var(--color-success)"
          total={summary.total}
        />
        <CertStatCard
          icon={Clock}
          value={summary.porvencer}
          label="Por vencer"
          color="var(--color-warning)"
          total={summary.total}
        />
        <CertStatCard
          icon={AlertCircle}
          value={summary.vencidas}
          label="Vencidas"
          color="var(--color-danger)"
          total={summary.total}
        />
        <CertStatCard
          icon={Award}
          value={summary.pendientes}
          label="Pendientes"
          color="var(--color-electric)"
          total={summary.total}
        />
        <CertStatCard
          icon={TrendingUp}
          value={summary.compliance}
          label="Compliance total"
          color={
            parseFloat(summary.compliance) >= 80 
              ? 'var(--color-success)' 
              : parseFloat(summary.compliance) >= 60 
                ? 'var(--color-warning)' 
                : 'var(--color-danger)'
          }
          total={summary.total}
          isPercentage={true}
        />
      </motion.div>

      {/* Tabs with Guaranteed Min-Width Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        role="tablist"
        className="overflow-x-auto -webkit-overflow-scrolling touch"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
            let newIndex;
            if (e.key === 'ArrowRight') {
              newIndex = (currentIndex + 1) % tabs.length;
            } else {
              newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }
            setActiveTab(tabs[newIndex].id);
            setCurrentPage(1);
            scrollToTop();
          }
        }}
        style={{
          display: 'flex',
          gap: '8px',
          padding: '8px',
          marginBottom: '20px',
          backgroundColor: 'rgba(19,11,58,0.8)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-brand)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tabCounts[tab.countKey];
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              aria-label={`Ver certificaciones ${tab.label} - ${count} certificaciones`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); scrollToTop(); }}
              style={{
                minWidth: 'var(--tab-min-width)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? `${tab.color}1F` : 'transparent',
                border: isActive ? `1px solid ${tab.color}66` : '1px solid transparent',
                borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                color: isActive ? tab.color : 'var(--color-text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: tab.color,
                  flexShrink: 0,
                }}
              />
              <span>{tab.label}</span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor: isActive ? `${tab.color}33` : 'rgba(255,255,255,0.06)',
                  color: isActive ? tab.color : 'var(--color-text-muted)',
                  flexShrink: 0,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Visual Separator */}
      <div style={{ height: '20px' }} />

      {/* Search & Filters Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          padding: '16px',
          backgroundColor: 'rgba(19,11,58,0.4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-brand)',
        }}
      >
        {/* ROW 1 - Search + Controls */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-3 md:items-center">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
              style={{ color: searchFocused ? '#9b6ab5' : '#4A5568' }} 
            />
            <input
              type="text"
              placeholder="Buscar... (presiona / para enfocar)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Buscar certificaciones"
              aria-describedby="search-results-count"
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: 'var(--color-surface-alt)',
                border: `1px solid ${searchFocused ? 'var(--border-brand-hover)' : (searchInput ? 'rgba(91,34,119,0.4)' : 'var(--border-brand)')}`,
                borderRadius: 'var(--radius-md)',
                paddingLeft: '52px',
                paddingRight: search ? '48px' : '16px',
                fontSize: '14px',
                color: 'var(--color-text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            {search && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5568] hover:text-[#F0F4FF] transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
            style={{
              height: '44px',
              padding: '0 16px',
              backgroundColor: activeFilters > 0 ? 'rgba(255,61,87,0.1)' : 'rgba(91,34,119,0.1)',
              border: '1px solid var(--border-brand)',
              borderRadius: 'var(--radius-md)',
              color: activeFilters > 0 ? '#FF5C71' : '#9b6ab5',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = activeFilters > 0 ? 'rgba(255,61,87,0.15)' : 'rgba(91,34,119,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeFilters > 0 ? 'rgba(255,61,87,0.1)' : 'rgba(91,34,119,0.1)';
            }}
          >
            <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
            Filtros
            {activeFilters > 0 && (
              <NotificationBadge count={activeFilters} color="#FF3D57" />
            )}
          </button>
        </div>

        {/* Results Count - Below Input */}
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px', marginLeft: '4px' }}>
          {filtered.length} certificaciones encontradas
        </p>

        {/* No results message below input */}
        {search && sorted.length === 0 && (
          <>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: '12px', color: '#FF3D57', marginTop: '8px', marginLeft: '4px' }}
            >
              No se encontraron certificaciones para "{search}". Intenta con otros términos.
            </motion.p>
            <p style={{fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', marginLeft: '4px'}}>
              Prueba buscar por nombre completo, nombre de certificación o empresa emisora.
            </p>
          </>
        )}

        {/* ROW 2 - Chip Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ 
                position: 'relative',
                padding: '20px', 
                backgroundColor: 'rgba(13,9,32,0.6)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(91,34,119,0.2)', 
                backdropFilter: 'blur(8px)',
                overflow: 'hidden'
              }}
            >
              {/* Clear Filters Button - Top Right */}
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    setSearch('');
                    setAreaFilter('');
                    setTipoFilter('');
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: '#FF5C71',
                    backgroundColor: 'rgba(255,61,87,0.1)',
                    border: '1px solid rgba(255,61,87,0.2)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    zIndex: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,61,87,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,61,87,0.1)';
                  }}
                >
                  <X style={{ width: '14px', height: '14px' }} />
                  Limpiar filtros
                </button>
              )}

              {/* Area Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  letterSpacing: '0.12em', 
                  color: 'var(--color-text-muted)', 
                  textTransform: 'uppercase',
                  width: '48px',
                  flexShrink: 0 
                }}>
                  Área:
                </span>
                {['Todas', ...uniqueAreas].map(area => {
                  const isActive = area === 'Todas' ? !areaFilter : areaFilter === area;
                  return (
                    <button 
                      key={area} 
                      onClick={() => setAreaFilter(area === 'Todas' ? '' : area)}
                      style={{ 
                        padding: '5px 14px', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '12px', 
                        fontWeight: 500, 
                        border: '1px solid', 
                        cursor: 'pointer', 
                        transition: 'all 0.15s ease', 
                        borderColor: isActive ? 'rgba(124,77,171,0.4)' : 'rgba(255,255,255,0.08)', 
                        backgroundColor: isActive ? 'rgba(124,77,171,0.15)' : 'transparent', 
                        color: isActive ? '#c49fe0' : 'var(--color-text-muted)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>

              {/* Separator */}
              <hr style={{ border: 'none', borderTop: '1px solid rgba(91,34,119,0.1)', margin: '12px 0' }} />

              {/* Tipo Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  letterSpacing: '0.12em', 
                  color: 'var(--color-text-muted)', 
                  textTransform: 'uppercase',
                  width: '48px',
                  flexShrink: 0 
                }}>
                  Tipo:
                </span>
                {['Todos', ...uniqueTypes].map(tipo => {
                  const isActive = tipo === 'Todos' ? !tipoFilter : tipoFilter === tipo;
                  const getTipoStyles = (type: string, active: boolean) => {
                    if (!active) return {
                      borderColor: 'rgba(255,255,255,0.08)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-muted)'
                    };
                    switch (type) {
                      case 'obligatoria':
                        return {
                          borderColor: 'rgba(255,61,87,0.4)',
                          backgroundColor: 'rgba(255,61,87,0.15)',
                          color: '#FF5C71'
                        };
                      case 'complementaria':
                        return {
                          borderColor: 'rgba(138,158,82,0.4)',
                          backgroundColor: 'rgba(138,158,82,0.15)',
                          color: '#9aaa58'
                        };
                      case 'legal':
                        return {
                          borderColor: 'rgba(155,106,181,0.4)',
                          backgroundColor: 'rgba(155,106,181,0.15)',
                          color: '#9b6ab5'
                        };
                      default:
                        return {
                          borderColor: 'rgba(255,255,255,0.08)',
                          backgroundColor: 'transparent',
                          color: 'var(--color-text-muted)'
                        };
                    }
                  };
                  const styles = getTipoStyles(tipo, isActive);
                  return (
                    <button 
                      key={tipo} 
                      onClick={() => setTipoFilter(tipo === 'Todos' ? '' : tipo)}
                      style={{ 
                        padding: '5px 14px', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '12px', 
                        fontWeight: 500, 
                        border: '1px solid', 
                        cursor: 'pointer', 
                        transition: 'all 0.15s ease',
                        ...styles
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {tipo === 'obligatoria' ? 'Obligatoria' : 
                       tipo === 'complementaria' ? 'Complementaria' : 
                       tipo === 'legal' ? 'Legal' : tipo}
                    </button>
                  );
                })}
              </div>

              {/* Results Count */}
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Visual Separator */}
      <div style={{ height: '16px' }} />

      {/* Virtualization Info */}
        {sorted.length > 100 && (
          <p style={{fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', marginLeft: '4px'}}>
            Mostrando primeras {itemsPerPage} de {sorted.length}. Usa filtros para refinar.
          </p>
        )}

        {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{ backgroundColor: 'rgba(26,16,64,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(91,34,119,0.2)', borderRadius: '8px', overflow: 'hidden' }}
      >
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(91,34,119,0.3) transparent' }}>
          <table className="w-full" role="grid">
            {/* Column widths definition */}
            <colgroup>
              <col style={{width: '22%'}} />  {/* Trabajador */}
              <col style={{width: '28%'}} />  {/* Certificación — la más importante */}
              <col style={{width: '10%'}} />  {/* Tipo */}
              <col style={{width: '15%'}} />  {/* Vencimiento */}
              <col style={{width: '12%'}} />  {/* Estado */}
              <col style={{width: '10%'}} />  {/* Fecha Obtención - hidden md */}
              <col style={{width: '3%'}} />   {/* Detalle */}
            </colgroup>
            <thead 
              className="sticky top-0 z-10"
              style={{
                backgroundColor: 'var(--color-obsidian)',
                borderTop: '1px solid rgba(91,34,119,0.15)',
              }}
            >
              <tr>
                <th
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSort('worker')}
                  aria-sort={sortField === 'worker' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8B3C5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <div className="flex items-center gap-1">
                    Trabajador
                    <SortIcon field="worker" />
                  </div>
                </th>
                <th
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSort('cert')}
                  aria-sort={sortField === 'cert' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8B3C5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <div className="flex items-center gap-1">
                    Certificación
                    <SortIcon field="cert" />
                  </div>
                </th>
                <th
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSort('tipo')}
                  aria-sort={sortField === 'tipo' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8B3C5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <div className="flex items-center gap-1">
                    Tipo
                    <SortIcon field="tipo" />
                  </div>
                </th>
                <th
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSort('fechaVen')}
                  aria-sort={sortField === 'fechaVen' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8B3C5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <div className="flex items-center gap-1">
                    Vencimiento
                    <SortIcon field="fechaVen" />
                  </div>
                </th>
                <th
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSort('estado')}
                  aria-sort={sortField === 'estado' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8B3C5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <div className="flex items-center justify-center gap-1">
                    Estado
                    <SortIcon field="estado" />
                  </div>
                </th>
                <th
                  className="hidden md:table-cell"
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onClick={() => handleSort('fechaObt')}
                  aria-sort={sortField === 'fechaObt' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8B3C5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <div className="flex items-center gap-1">
                    Fecha Obtención
                    <SortIcon field="fechaObt" />
                  </div>
                </th>
                <th
                  style={{ 
                    paddingTop: '14px', 
                    paddingBottom: '14px', 
                    paddingLeft: '20px', 
                    paddingRight: '20px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    userSelect: 'none',
                  }}
                >
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              {certifications.length === 0 && workers.length === 0 ? (
                <CertTableSkeleton />
              ) : (
                <AnimatePresence mode="wait">
                  {paginatedCerts.map((cert, index) => {
                  const worker = workers.find((w) => w.id === cert.workerId);
                  const initials = worker
                    ? `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase()
                    : '?';
                  const borderColor = cert.estado === 'vigente' ? '#729362' : cert.estado === 'proximo_vencer' ? '#FFB800' : cert.estado === 'vencido' ? '#FF3D57' : '#7c4dab';

                  return (
                    <>
                      <motion.tr
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.02, duration: 0.3 }}
                        className="group cursor-pointer"
                        style={{
                          backgroundColor: 'transparent',
                          borderLeft: '3px solid transparent',
                          transition: 'background-color 0.2s ease, border-left-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(124,77,171,0.06)';
                          e.currentTarget.style.borderLeftColor = borderColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                        }}
                      >
                        {/* Trabajador */}
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {worker?.foto ? (
                              <img
                                src={worker.foto}
                                alt={`${worker.nombre} ${worker.apellidos}`}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(91,34,119,0.3)',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(124,77,171,0.15)',
                                  border: '1px solid rgba(91,34,119,0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#c49fe0' }}>
                                  {initials}
                                </span>
                              </div>
                            )}
                            <div>
                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: 'var(--color-text-primary)',
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '160px',
                                }}
                                title={`${worker?.nombre} ${worker?.apellidos}`}
                              >
                                {worker?.nombre} {worker?.apellidos}
                              </span>
                              {worker?.cargo && (
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: 'var(--color-text-muted)',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '160px',
                                  }}
                                  title={worker.cargo}
                                >
                                  {worker.cargo}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Certificación */}
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.3, margin: 0 }}>
                              {cert.nombre}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px', margin: 0 }}>
                              {cert.emisor}
                            </p>
                          </div>
                        </td>

                        {/* Tipo */}
                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                          <Badge status={cert.tipo} />
                        </td>

                        {/* Vencimiento */}
                        <td style={{ padding: '12px 20px' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#A8B3C5', display: 'block', marginBottom: '4px' }}>
                              {formatDate(cert.fechaVencimiento)}
                            </span>
                            <DaysSparkline diasRestantes={cert.diasRestantes} barWidth={72} barHeight={5} textSize="11px" />
                          </div>
                        </td>

                        {/* Estado */}
                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            {cert.estado === 'vencido' && (
                              <AlertCircle style={{ width: '14px', height: '14px', color: '#FF3D57', flexShrink: 0 }} />
                            )}
                            <Badge status={cert.estado} size="md" />
                          </div>
                        </td>

                        {/* Fecha Obtención */}
                        <td className="hidden md:table-cell" style={{ padding: '12px 20px' }}>
                          <span style={{ fontSize: '13px', color: '#A8B3C5' }}>
                            {formatDate(cert.fechaObtension)}
                          </span>
                        </td>

                        {/* Detalle */}
                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedCert(cert.id)}
                            style={{
                              padding: '8px',
                              borderRadius: '6px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            title="Ver detalle"
                            aria-label={`Ver detalle de ${cert.nombre}`}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.15)';
                              const icon = e.currentTarget.querySelector('svg');
                              if (icon) icon.style.color = '#c49fe0';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              const icon = e.currentTarget.querySelector('svg');
                              if (icon) icon.style.color = '#9b6ab5';
                            }}
                          >
                            <Eye style={{ width: '16px', height: '16px', color: '#9b6ab5', transition: 'color 0.15s' }} />
                          </button>
                        </td>
                      </motion.tr>
                    </>
                  );
                })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <CertEmptyState
            search={search}
            activeTab={activeTab}
            onClearSearch={() => { setSearchInput(''); setSearch(''); }}
            onSwitchToAll={() => setActiveTab('todas')}
          />
        )}

        {/* Pagination */}
        {sorted.length > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '16px 20px',
            backgroundColor: 'rgba(13,9,32,0.4)',
            borderTop: '1px solid rgba(91,34,119,0.15)'
          }}>
            {/* Left side - Items per page segmented control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Registros por página">
              {[10, 25, 50].map(count => (
                <button
                  key={count}
                  onClick={() => {
                    setItemsPerPage(count);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '40px',
                    height: '32px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    borderColor: itemsPerPage === count 
                      ? 'rgba(91,34,119,0.4)' 
                      : 'rgba(91,34,119,0.15)',
                    backgroundColor: itemsPerPage === count 
                      ? 'rgba(91,34,119,0.2)' 
                      : 'transparent',
                    color: itemsPerPage === count ? '#c49fe0' : 'var(--color-text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    if (itemsPerPage !== count) {
                      e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (itemsPerPage !== count) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {count}
                </button>
              ))}
            </div>

            {/* Center - Showing info */}
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sorted.length)} de {sorted.length} certificaciones
            </span>

            {/* Right side - Navigation controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* First page button */}
              <button
                onClick={() => { setCurrentPage(1); scrollToTop(); }}
                disabled={currentPage === 1}
                aria-label="Primera página"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-brand)',
                  backgroundColor: 'rgba(19,11,58,0.6)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(19,11,58,0.6)';
                }}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous button */}
              <button
                onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); scrollToTop(); }}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-brand)',
                  backgroundColor: 'rgba(19,11,58,0.6)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(19,11,58,0.6)';
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page number pills */}
              {(() => {
                const pages = [];
                const maxVisible = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                
                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }

                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => { setCurrentPage(1); scrollToTop(); }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-brand)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-secondary)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      1
                    </button>
                  );
                  
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" style={{ 
                        padding: '0 8px', 
                        color: 'var(--color-text-muted)', 
                        fontSize: '13px' 
                      }}>
                        ...
                      </span>
                    );
                  }
                }

                // Add visible pages
                for (let i = startPage; i <= endPage; i++) {
                  const isActive = i === currentPage;
                  pages.push(
                    <button
                      key={i}
                      onClick={() => { setCurrentPage(i); scrollToTop(); }}
                      aria-label={`Página ${i}`}
                      aria-current={isActive ? 'page' : undefined}
                      className="hidden sm:flex"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: `1px solid ${isActive ? 'rgba(124,77,171,0.5)' : 'var(--border-brand)'}`,
                        backgroundColor: isActive ? 'rgba(124,77,171,0.25)' : 'transparent',
                        color: isActive ? '#c49fe0' : 'var(--color-text-secondary)',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isActive ? 'rgba(124,77,171,0.25)' : 'transparent';
                      }}
                    >
                      {i}
                    </button>
                  );
                }

                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" style={{ 
                        padding: '0 8px', 
                        color: 'var(--color-text-muted)', 
                        fontSize: '13px' 
                      }}>
                        ...
                      </span>
                    );
                  }
                  
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => { setCurrentPage(totalPages); scrollToTop(); }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-brand)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-secondary)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              {/* Next button */}
              <button
                onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); scrollToTop(); }}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-brand)',
                  backgroundColor: 'rgba(19,11,58,0.6)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(19,11,58,0.6)';
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page button */}
              <button
                onClick={() => { setCurrentPage(totalPages); scrollToTop(); }}
                disabled={currentPage === totalPages}
                aria-label="Última página"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-brand)',
                  backgroundColor: 'rgba(19,11,58,0.6)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(19,11,58,0.6)';
                }}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Certification Detail Drawer */}
      <AnimatePresence>
        <Suspense fallback={null}>
          <CertDetailDrawer
            cert={selectedCertData || null}
            worker={selectedWorker}
            isOpen={selectedCert !== null}
            onClose={() => setSelectedCert(null)}
          />
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default Certifications;
