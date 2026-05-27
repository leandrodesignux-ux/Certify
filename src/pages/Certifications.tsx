import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
const StatCard = React.memo(function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  total,
  isPercentage = false 
}: { 
  icon: React.ElementType; 
  value: number | string; 
  label: string; 
  color: string; 
  total: number;
  isPercentage?: boolean;
}) {
  const animatedValue = isPercentage ? value : useCountUp(value as number);
  const percentage = total > 0 && !isPercentage ? (value as number / total) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -2, 
        transition: { duration: 0.15 },
        boxShadow: `0 8px 25px ${color}20`
      }}
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-brand)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      {/* Glow effect at bottom */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          boxShadow: `0 0 20px ${color}40`,
        }}
        whileHover={{
          boxShadow: `0 0 30px ${color}60`,
          height: '3px'
        }}
      />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ width: '24px', height: '24px', color }} />
        </div>
        <div style={{ flex: 1 }}>
          <motion.p
            role="status"
            aria-live="polite"
            aria-label={`${animatedValue}${isPercentage ? '%' : ''} ${label}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {animatedValue}{isPercentage ? '%' : ''}
          </motion.p>
          <p style={{ fontSize: '13px', color: '#8892A4', marginTop: '4px' }}>{label}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      {!isPercentage && (
        <>
          <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
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
        </>
      )}
    </motion.div>
  );
});

// Sparkline component for days remaining
function DaysSparkline({ diasRestantes }: { diasRestantes: number }) {
  const maxDays = 365;
  const percentage = Math.min(Math.max((diasRestantes / maxDays) * 100, 0), 100);
  const color = diasRestantes <= 0 ? '#FF3D57' : diasRestantes <= 60 ? '#FFB800' : '#729362';
  
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

// Notification Badge Component
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
        border: '2px solid #130b3a',
      }}
    >
      {count > 9 ? '9+' : count}
    </span>
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
      role="alert"
      aria-live="assertive"
      style={{ 
        textAlign: 'center', 
        padding: '48px 20px',
        background: 'rgba(91,34,119,0.04)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed rgba(91,34,119,0.15)',
        margin: '20px'
      }}
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
            border: '2px dashed rgba(91,34,119,0.4)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '-25px',
            borderRadius: '50%',
            border: '2px dashed rgba(138,158,82,0.25)',
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
        <Award style={{ width: '64px', height: '64px', color: '#7c4dab', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />
      </div>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '24px', fontWeight: 700, color: '#F0F4FF', marginBottom: '8px' }}>
        {title}
      </p>
      <p style={{ fontSize: '14px', color: '#8892A4', marginBottom: '20px' }}>
        {subtitle}
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {hasSearch && onClearSearch && (
          <button
            onClick={onClearSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(91,34,119,0.12)',
              border: '1px solid rgba(91,34,119,0.35)',
              borderRadius: '6px',
              color: '#9b6ab5',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
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
              backgroundColor: 'rgba(138,158,82,0.1)',
              border: '1px solid rgba(138,158,82,0.35)',
              borderRadius: '6px',
              color: '#8a9e52',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(138,158,82,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(138,158,82,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Ver todas las certificaciones
          </button>
        )}
        {hasSearch && hasTabFilter && onClearSearch && onSwitchToAll && (
          <button
            onClick={() => {
              onClearSearch?.();
              onSwitchToAll?.();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255,61,87,0.1)',
              border: '1px solid rgba(255,61,87,0.35)',
              borderRadius: '6px',
              color: '#ff3d57',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,61,87,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,61,87,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Limpiar todo
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

  // Smooth scroll to top when changing page
  const scrollToTop = () => {
    if (window.scrollY > 300) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
  const exportCSV = useCallback(() => {
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
        style={{ marginBottom: '24px' }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient tracking-tight">
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
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        style={{ 
          marginBottom: '28px' 
        }}
      >
        <StatCard
          icon={CheckCircle}
          value={summary.vigentes}
          label="Vigentes"
          color="var(--color-success)"
          total={summary.total}
        />
        <StatCard
          icon={Clock}
          value={summary.porvencer}
          label="Por vencer"
          color="var(--color-warning)"
          total={summary.total}
        />
        <StatCard
          icon={AlertCircle}
          value={summary.vencidas}
          label="Vencidas"
          color="var(--color-danger)"
          total={summary.total}
        />
        <StatCard
          icon={Award}
          value={summary.pendientes}
          label="Pendientes"
          color="var(--color-electric)"
          total={summary.total}
        />
        <StatCard
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

      {/* Filters - Toolbar Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        {/* ROW 1 - Search + Controls */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-3 md:items-center">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
            <input
              type="text"
              placeholder="Buscar certificación, trabajador, emisor..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Buscar certificaciones"
              aria-describedby="search-results-count"
              style={{
                width: '100%',
                height: '40px',
                backgroundColor: '#231455',
                border: `1px solid ${searchInput ? (sorted.length === 0 ? 'rgba(255,61,87,0.4)' : 'rgba(91,34,119,0.5)') : 'rgba(91,34,119,0.25)'}`,
                borderRadius: '8px',
                paddingLeft: '48px',
                paddingRight: searchInput ? '48px' : '100px',
                fontSize: '14px',
                color: '#F0F4FF',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <span id="search-results-count" className="sr-only">
              {sorted.length} certificaciones encontradas
            </span>
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
                  color: '#9b6ab5',
                  backgroundColor: 'rgba(91,34,119,0.12)',
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

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
            style={{
              height: '40px',
              padding: '0 16px',
              backgroundColor: 'rgba(91,34,119,0.1)',
              border: '1px solid var(--border-brand)',
              borderRadius: '8px',
              color: '#9b6ab5',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
            }}
          >
            <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
            Filtros
            {activeFilters > 0 && (
              <NotificationBadge count={activeFilters} color="#FF3D57" />
            )}
          </button>
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

        {/* ROW 2 - Chip Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ 
                padding: '16px', 
                backgroundColor: 'rgba(26,16,64,0.4)', 
                borderRadius: '10px', 
                border: '1px solid rgba(91,34,119,0.15)', 
                overflow: 'hidden'
              }}
            >
              {/* Area Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Área:</span>
                {['Todas', ...uniqueAreas].map(area => {
                  const isActive = area === 'Todas' ? !areaFilter : areaFilter === area;
                  return (
                    <button 
                      key={area} 
                      onClick={() => setAreaFilter(area === 'Todas' ? '' : area)}
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 500, 
                        border: '1px solid', 
                        cursor: 'pointer', 
                        transition: 'all 0.12s', 
                        borderColor: isActive ? 'rgba(155,106,181,0.6)' : 'rgba(91,34,119,0.2)', 
                        backgroundColor: isActive ? 'rgba(155,106,181,0.15)' : 'transparent', 
                        color: isActive ? '#9b6ab5' : '#8892A4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isActive && (
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#9b6ab5',
                          flexShrink: 0
                        }} />
                      )}
                      {area}
                    </button>
                  );
                })}
              </div>

              {/* Tipo Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Tipo:</span>
                {['Todos', ...uniqueTypes].map(tipo => {
                  const isActive = tipo === 'Todos' ? !tipoFilter : tipoFilter === tipo;
                  return (
                    <button 
                      key={tipo} 
                      onClick={() => setTipoFilter(tipo === 'Todos' ? '' : tipo)}
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 500, 
                        border: '1px solid', 
                        cursor: 'pointer', 
                        transition: 'all 0.12s', 
                        borderColor: isActive ? 'rgba(138,158,82,0.6)' : 'rgba(91,34,119,0.2)', 
                        backgroundColor: isActive ? 'rgba(138,158,82,0.15)' : 'transparent', 
                        color: isActive ? '#8a9e52' : '#8892A4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isActive && (
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#8a9e52',
                          flexShrink: 0
                        }} />
                      )}
                      {tipo === 'obligatoria' ? 'Obligatoria' : 
                       tipo === 'complementaria' ? 'Complementaria' : 
                       tipo === 'legal' ? 'Legal' : tipo}
                    </button>
                  );
                })}
              </div>

              {/* Clear Filters and Results Count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setAreaFilter('');
                      setTipoFilter('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: '#FF3D57',
                      backgroundColor: 'rgba(255,61,87,0.1)',
                      border: '1px solid rgba(255,61,87,0.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                    Limpiar filtros
                  </button>
                )}
                <span style={{ fontSize: '13px', color: '#8892A4', marginLeft: activeFilters > 0 ? 'auto' : '0' }}>
                  {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Visual Separator */}
      <div style={{ height: '16px' }} />

      {/* Virtualization Warning */}
        {sorted.length > 100 && (
          <div style={{ 
            padding: '8px 16px', 
            background: 'rgba(255,184,0,0.08)', 
            border: '1px solid rgba(255,184,0,0.2)', 
            borderRadius: '6px', 
            fontSize: '13px', 
            color: '#FFB800', 
            marginBottom: '12px' 
          }}>
            Mostrando los primeros {itemsPerPage} de {sorted.length} resultados. Usa los filtros para refinar.
          </div>
        )}

        {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-[#1a1040]/90 backdrop-blur-[12px] border border-[rgba(91,34,119,0.2)] rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full" role="grid">
            <thead 
              className="sticky top-0 z-10"
              style={{
                backgroundColor: 'rgba(19,11,58,0.9)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Gradient fade at bottom */}
              <tr>
                <th colSpan={7} className="p-0">
                  <div className="h-px bg-gradient-to-r from-transparent via-[rgba(91,34,119,0.3)] to-transparent" />
                </th>
              </tr>
              <tr className="border-b border-[rgba(91,34,119,0.2)]">
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('worker')}
                  aria-sort={sortField === 'worker' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#F0F4FF';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = '#a89fc4';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.3';
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Trabajador
                    <SortIcon field="worker" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('cert')}
                  aria-sort={sortField === 'cert' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#F0F4FF';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = '#a89fc4';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.3';
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Certificación
                    <SortIcon field="cert" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('tipo')}
                  aria-sort={sortField === 'tipo' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#F0F4FF';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = '#a89fc4';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.3';
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Tipo
                    <SortIcon field="tipo" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('fechaVen')}
                  aria-sort={sortField === 'fechaVen' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#F0F4FF';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = '#a89fc4';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.3';
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Vencimiento
                    <SortIcon field="fechaVen" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none"
                  onClick={() => handleSort('estado')}
                  aria-sort={sortField === 'estado' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#F0F4FF';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = '#a89fc4';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.3';
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    Estado
                    <SortIcon field="estado" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors select-none hidden md:table-cell"
                  onClick={() => handleSort('fechaObt')}
                  aria-sort={sortField === 'fechaObt' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.color = '#F0F4FF';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.color = '#a89fc4';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon && icon.classList.contains('opacity-30')) {
                      icon.style.opacity = '0.3';
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Fecha Obtención
                    <SortIcon field="fechaObt" />
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
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
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                        className="group cursor-pointer"
                        style={{
                          backgroundColor: index % 2 === 0 ? 'rgba(26,16,64,0.5)' : 'rgba(19,11,58,0.4)',
                          borderLeft: `3px solid ${borderColor}`,
                          transition: 'background-color 0.2s ease, border-left-width 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
                          e.currentTarget.style.borderLeftWidth = '4px';
                          e.currentTarget.style.borderLeftColor = borderColor;
                          e.currentTarget.style.filter = 'brightness(1.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(26,16,64,0.5)' : 'rgba(19,11,58,0.4)';
                          e.currentTarget.style.borderLeftWidth = '3px';
                          e.currentTarget.style.borderLeftColor = borderColor;
                          e.currentTarget.style.filter = 'brightness(1)';
                        }}
                      >
                        {/* Trabajador */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {worker?.foto ? (
                              <img
                                src={worker.foto}
                                alt={`${worker.nombre} ${worker.apellidos}`}
                                className="w-8 h-8 rounded-full object-cover border border-[rgba(91,34,119,0.3)]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#231455] border border-[rgba(91,34,119,0.3)] flex items-center justify-center">
                                <span className="text-xs font-display font-semibold text-[#c49fe0]">
                                  {initials}
                                </span>
                              </div>
                            )}
                            <div>
                              <span
                                className="text-sm text-[#F0F4FF] truncate block"
                                style={{ maxWidth: '160px' }}
                                title={`${worker?.nombre} ${worker?.apellidos}`}
                              >
                                {worker?.nombre} {worker?.apellidos}
                              </span>
                              {worker?.cargo && (
                                <span
                                  className="text-xs text-[#6B7280] truncate block"
                                  style={{ maxWidth: '160px' }}
                                  title={worker.cargo}
                                >
                                  {worker.cargo}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Certificación */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-[#F0F4FF] truncate mb-1" style={{ maxWidth: '200px' }}>
                              {cert.nombre}
                            </p>
                            <p className="text-xs text-[#6B7280] truncate" style={{ maxWidth: '200px' }}>
                              {cert.emisor}
                            </p>
                          </div>
                        </td>

                        {/* Tipo */}
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

                        {/* Vencimiento */}
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm text-[#F0F4FF] block mb-1">
                              {formatDate(cert.fechaVencimiento)}
                            </span>
                            <DaysSparkline diasRestantes={cert.diasRestantes} />
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3 text-center">
                          <Badge status={cert.estado} />
                        </td>

                        {/* Fecha Obtención */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-[#F0F4FF]">
                            {formatDate(cert.fechaObtension)}
                          </span>
                        </td>

                        {/* Detalle */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedCert(cert.id)}
                            className="p-1.5 rounded-md hover:bg-[rgba(91,34,119,0.15)] transition-colors"
                            title="Ver detalle"
                            aria-label={`Ver detalle de ${cert.nombre}`}
                          >
                            <Eye className="w-4 h-4 text-[#9b6ab5]" />
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
          <EmptyState
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
            padding: '12px 16px',
            borderTop: '1px solid rgba(91,34,119,0.2)'
          }}>
            {/* Left side - Items per page selector and info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Items per page selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    height: '32px',
                    backgroundColor: 'var(--surface-alt)', // #231455
                    border: '1px solid var(--border-brand)',
                    borderRadius: '6px',
                    color: '#F0F4FF',
                    fontSize: '13px',
                    padding: '0 8px',
                    cursor: 'pointer'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>
                  registros por página
                </span>
              </div>

              {/* Showing info */}
              <span style={{ fontSize: '13px', color: '#8892A4' }}>
                Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sorted.length)} de {sorted.length} certificaciones
              </span>
            </div>

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
                  color: '#F0F4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.3)';
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
                  color: '#F0F4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.3)';
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
                        color: '#8892A4',
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
                        color: '#6B7280', 
                        fontSize: '13px' 
                      }}>
                        ...
                      </span>
                    );
                  }
                }

                // Add visible pages
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => { setCurrentPage(i); scrollToTop(); }}
                      aria-label={`Página ${i}`}
                      aria-current={i === currentPage ? 'page' : undefined}
                      className="hidden sm:flex"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: `1px solid ${i === currentPage ? 'rgba(91,34,119,0.5)' : 'var(--border-brand)'}`,
                        backgroundColor: i === currentPage ? 'rgba(91,34,119,0.25)' : 'transparent',
                        color: i === currentPage ? '#c49fe0' : '#8892A4',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (i !== currentPage) {
                          e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = i === currentPage ? 'rgba(91,34,119,0.25)' : 'transparent';
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
                        color: '#6B7280', 
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
                        color: '#8892A4',
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
                  color: '#F0F4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.3)';
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
                  color: '#F0F4FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.3)';
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
