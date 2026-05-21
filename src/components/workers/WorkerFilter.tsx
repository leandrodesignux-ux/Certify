import { Search, X, LayoutGrid, List } from 'lucide-react';
import { useWorkerStore } from '../../store/useWorkerStore';

interface WorkerFilterProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export function WorkerFilter({ viewMode, onViewModeChange }: WorkerFilterProps) {
  const { filters, setFilters, clearFilters, workers } = useWorkerStore();

  const areas = ['Todas', 'Operaciones', 'Mantención', 'Seguridad', 'Logística', 'RRHH'];
  const complianceLevels = [
    { value: 'all', label: 'Todos' },
    { value: '90', label: 'Excelente >90%' },
    { value: '70', label: 'Bueno 70-89%' },
    { value: '50', label: 'Regular 50-69%' },
    { value: '0', label: 'Crítico <50%' },
  ];

  const activeFiltersCount = [
    filters.area,
    filters.search,
    filters.complianceMin > 0,
  ].filter(Boolean).length;

  return (
    <div className="bg-[#111827]/80 backdrop-blur-[12px] border border-[rgba(0,229,255,0.1)] rounded-sm p-4 space-y-4">
      {/* Top Row: Search + View Toggle */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT, cargo..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full h-10 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm pl-10 pr-4 text-sm text-[#F0F4FF] placeholder-[#4A5568] focus:outline-none focus:border-[rgba(0,229,255,0.3)] transition-all duration-150"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5568] hover:text-[#F0F4FF]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#1C2333] rounded-sm p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-sm transition-all duration-150 ${
              viewMode === 'grid'
                ? 'bg-[rgba(0,229,255,0.15)] text-[#00E5FF]'
                : 'text-[#8892A4] hover:text-[#F0F4FF]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-2 rounded-sm transition-all duration-150 ${
              viewMode === 'table'
                ? 'bg-[rgba(0,229,255,0.15)] text-[#00E5FF]'
                : 'text-[#8892A4] hover:text-[#F0F4FF]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Area Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8892A4]">Área:</span>
          <select
            value={filters.area || 'Todas'}
            onChange={(e) =>
              setFilters({ area: e.target.value === 'Todas' ? '' : e.target.value })
            }
            className="h-9 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm px-3 text-sm text-[#F0F4FF] focus:outline-none focus:border-[rgba(0,229,255,0.3)] cursor-pointer"
            style={{ backgroundColor: '#1C2333', color: '#F0F4FF' }}
          >
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Compliance Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8892A4]">Compliance:</span>
          <select
            value={
              filters.complianceMin === 0
                ? 'all'
                : filters.complianceMin === 90
                ? '90'
                : filters.complianceMin === 70
                ? '70'
                : filters.complianceMin === 50
                ? '50'
                : '0'
            }
            onChange={(e) => {
              const value = e.target.value;
              const min =
                value === 'all' ? 0 : value === '90' ? 90 : value === '70' ? 70 : value === '50' ? 50 : 0;
              setFilters({ complianceMin: min });
            }}
            className="h-9 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm px-3 text-sm text-[#F0F4FF] focus:outline-none focus:border-[rgba(0,229,255,0.3)] cursor-pointer"
            style={{ backgroundColor: '#1C2333', color: '#F0F4FF' }}
          >
            {complianceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#FF3D57] hover:bg-[rgba(255,61,87,0.1)] rounded-sm transition-colors duration-150"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar filtros ({activeFiltersCount})
          </button>
        )}

        {/* Results Count */}
        <span className="text-sm text-[#8892A4] ml-auto">
          {workers.length} trabajador{workers.length !== 1 ? 'es' : ''}
        </span>
      </div>
    </div>
  );
}
