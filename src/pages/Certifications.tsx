import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { useCertStore } from '../store/useCertStore';
import { useWorkerStore } from '../store/useWorkerStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ExpiryBadge } from '../components/ui/ExpiryBadge';
import { formatDate } from '../utils/dates';

type TabType = 'todas' | 'vigentes' | 'proximas' | 'vencidas';
type SortField = 'worker' | 'cert' | 'emisor' | 'tipo' | 'fechaObt' | 'fechaVen' | 'estado';
type SortOrder = 'asc' | 'desc';

const tabs = [
  { id: 'todas' as TabType, label: 'Todas', color: '#00E5FF' },
  { id: 'vigentes' as TabType, label: 'Vigentes', color: '#00E676' },
  { id: 'proximas' as TabType, label: 'Por vencer', color: '#FFB800' },
  { id: 'vencidas' as TabType, label: 'Vencidas', color: '#FF3D57' },
];

export function Certifications() {
  const { certifications, activeTab, setActiveTab } = useCertStore();
  const { workers } = useWorkerStore();

  const [sortField, setSortField] = useState<SortField>('fechaVen');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

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

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchWorker = `${worker.nombre} ${worker.apellidos}`.toLowerCase().includes(searchLower);
        const matchCert = cert.nombre.toLowerCase().includes(searchLower);
        const matchEmisor = cert.emisor.toLowerCase().includes(searchLower);
        if (!matchWorker && !matchCert && !matchEmisor) return false;
      }

      // Area filter
      if (areaFilter && worker.area !== areaFilter) return false;

      // Tipo filter
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

  // Summary counts
  const summary = useMemo(() => {
    return {
      vigentes: certifications.filter((c) => c.diasRestantes > 60).length,
      porvencer: certifications.filter((c) => c.diasRestantes > 0 && c.diasRestantes <= 60).length,
      vencidas: certifications.filter((c) => c.diasRestantes <= 0).length,
      pendientes: certifications.filter((c) => c.estado === 'pendiente').length,
    };
  }, [certifications]);

  // CSV export
  const exportCSV = () => {
    const headers = ['Trabajador', 'Certificación', 'Emisor', 'Tipo', 'Fecha Obtención', 'Vencimiento', 'Estado', 'Días Restantes'];
    const rows = sorted.slice(0, 20).map((cert) => {
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

      {/* Summary Mini Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card variant="glass" padding="sm" className="flex items-center gap-3">
          <div className="p-2 bg-[rgba(0,230,118,0.15)] rounded-sm">
            <CheckCircle className="w-5 h-5 text-[#00E676]" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-[#00E676]">{summary.vigentes}</p>
            <p className="text-xs text-[#8892A4]">Vigentes</p>
          </div>
        </Card>
        <Card variant="glass" padding="sm" className="flex items-center gap-3">
          <div className="p-2 bg-[rgba(255,184,0,0.15)] rounded-sm">
            <Clock className="w-5 h-5 text-[#FFB800]" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-[#FFB800]">{summary.porvencer}</p>
            <p className="text-xs text-[#8892A4]">Por vencer</p>
          </div>
        </Card>
        <Card variant="glass" padding="sm" className="flex items-center gap-3">
          <div className="p-2 bg-[rgba(255,61,87,0.15)] rounded-sm">
            <AlertCircle className="w-5 h-5 text-[#FF3D57]" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-[#FF3D57]">{summary.vencidas}</p>
            <p className="text-xs text-[#8892A4]">Vencidas</p>
          </div>
        </Card>
        <Card variant="glass" padding="sm" className="flex items-center gap-3">
          <div className="p-2 bg-[rgba(0,229,255,0.15)] rounded-sm">
            <Award className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-[#00E5FF]">{summary.pendientes}</p>
            <p className="text-xs text-[#8892A4]">Pendientes</p>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ display: 'flex', gap: '4px', backgroundColor: '#1C2333', padding: '4px', borderRadius: '4px' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: activeTab === tab.id ? 'rgba(0,229,255,0.15)' : 'transparent',
              color: activeTab === tab.id ? '#00E5FF' : '#8892A4',
              borderBottom: activeTab === tab.id ? '2px solid #00E5FF' : '2px solid transparent',
            }}
          >
            <span
              style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '9999px', marginRight: '8px', backgroundColor: tab.color }}
            />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-wrap items-center gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Buscar certificación o trabajador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm pl-10 pr-4 text-sm text-[#F0F4FF] placeholder-[#4A5568] focus:outline-none focus:border-[rgba(0,229,255,0.3)]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5568] hover:text-[#F0F4FF]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Area Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8892A4]" />
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="h-10 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm px-3 text-sm text-[#F0F4FF] focus:outline-none focus:border-[rgba(0,229,255,0.3)] cursor-pointer"
          >
            <option value="">Todas las áreas</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Mantención">Mantención</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Logística">Logística</option>
            <option value="RRHH">RRHH</option>
          </select>
        </div>

        {/* Tipo Filter */}
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="h-10 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm px-3 text-sm text-[#F0F4FF] focus:outline-none focus:border-[rgba(0,229,255,0.3)] cursor-pointer"
        >
          <option value="">Todos los tipos</option>
          <option value="obligatoria">Obligatoria</option>
          <option value="complementaria">Complementaria</option>
          <option value="legal">Legal</option>
        </select>

        {/* Clear Filters */}
        {activeFilters > 0 && (
          <button
            onClick={() => {
              setSearch('');
              setAreaFilter('');
              setTipoFilter('');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#FF3D57] hover:bg-[rgba(255,61,87,0.1)] rounded-sm transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar ({activeFilters})
          </button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{ backgroundColor: 'rgba(17,24,39,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,229,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}
      >
        <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-[#111827] z-10">
              <tr className="border-b border-[rgba(0,229,255,0.1)]">
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('worker')}
                >
                  <div className="flex items-center gap-1">
                    Trabajador
                    <SortIcon field="worker" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('cert')}
                >
                  <div className="flex items-center gap-1">
                    Certificación
                    <SortIcon field="cert" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('emisor')}
                >
                  <div className="flex items-center gap-1">
                    Emisor
                    <SortIcon field="emisor" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('tipo')}
                >
                  <div className="flex items-center gap-1">
                    Tipo
                    <SortIcon field="tipo" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('fechaObt')}
                >
                  <div className="flex items-center gap-1">
                    Obtención
                    <SortIcon field="fechaObt" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('fechaVen')}
                >
                  <div className="flex items-center gap-1">
                    Vencimiento
                    <SortIcon field="fechaVen" />
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8892A4] uppercase tracking-wider">
                  Estado
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-[#8892A4] uppercase tracking-wider cursor-pointer hover:text-[#F0F4FF] transition-colors"
                  onClick={() => handleSort('estado')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Estado
                    <SortIcon field="estado" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {sorted.slice(0, 20).map((cert, index) => {
                  const worker = workers.find((w) => w.id === cert.workerId);
                  const initials = worker
                    ? `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase()
                    : '?';

                  return (
                    <motion.tr
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.02, duration: 0.3 }}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(17,24,39,0.6)' : 'rgba(28,35,51,0.4)',
                        borderLeft: cert.estado === 'vigente' ? '3px solid #00E676' : cert.estado === 'proximo_vencer' ? '3px solid #FFB800' : cert.estado === 'vencido' ? '3px solid #FF3D57' : '3px solid #00E5FF',
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
                        <span className="text-sm text-[#F0F4FF]">
                          {formatDate(cert.fechaVencimiento)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ExpiryBadge diasRestantes={cert.diasRestantes} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge status={cert.estado} />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-[#4A5568] mx-auto mb-4" />
            <p className="text-[#F0F4FF]">No se encontraron certificaciones</p>
            <p className="text-sm text-[#8892A4] mt-1">Ajusta los filtros de búsqueda</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Certifications;
