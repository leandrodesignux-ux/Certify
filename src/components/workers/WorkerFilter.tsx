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
    <div style={{
      backgroundColor: 'rgba(17,24,39,0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,229,255,0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    }}>
      {/* Search - prominente */}
      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#4A5568' }} />
        <input
          type="text"
          placeholder="Buscar trabajador, RUT, cargo..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          style={{
            flex: 1,
            width: '100%',
            minWidth: '240px',
            height: '40px',
            backgroundColor: '#1C2333',
            border: '1px solid rgba(0,229,255,0.15)',
            borderRadius: '10px',
            padding: '0 16px 0 40px',
            fontSize: '13px',
            color: '#F0F4FF',
            outline: 'none',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)'}
        />
        {filters.search && (
          <button
            onClick={() => setFilters({ search: '' })}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568', padding: '4px' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {/* Área Select */}
      <select
        value={filters.area || 'Todas'}
        onChange={(e) =>
          setFilters({ area: e.target.value === 'Todas' ? '' : e.target.value })
        }
        style={{
          height: '40px',
          backgroundColor: '#1C2333',
          border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: '10px',
          padding: '0 12px',
          fontSize: '13px',
          color: '#F0F4FF',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '120px',
        }}
      >
        {areas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>

      {/* Compliance Select */}
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
        style={{
          height: '40px',
          backgroundColor: '#1C2333',
          border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: '10px',
          padding: '0 12px',
          fontSize: '13px',
          color: '#F0F4FF',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '150px',
        }}
      >
        {complianceLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>

      {/* Limpiar filtros */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          style={{
            height: '40px',
            padding: '0 14px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,61,87,0.3)',
            borderRadius: '10px',
            color: '#FF3D57',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <X style={{ width: '14px', height: '14px' }} />
          Limpiar ({activeFiltersCount})
        </button>
      )}

      {/* Grid/List Toggle */}
      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#1C2333', borderRadius: '10px', padding: '4px' }}>
        {(['grid', 'table'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            style={{
              width: '36px', height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === mode ? 'rgba(0,229,255,0.2)' : 'transparent',
              color: viewMode === mode ? '#00E5FF' : '#8892A4',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            {mode === 'grid' ? <LayoutGrid style={{ width: '16px', height: '16px' }} /> : <List style={{ width: '16px', height: '16px' }} />}
          </button>
        ))}
      </div>

      {/* Results count */}
      <span style={{ fontSize: '13px', color: '#8892A4', marginLeft: 'auto' }}>
        {workers.length} trabajador{workers.length !== 1 ? 'es' : ''}
      </span>
    </div>
  );
}
