import { X } from 'lucide-react';
import { useWorkerStore } from '../../store/useWorkerStore';

interface WorkerFilterProps {
  // Solo filtros avanzados — búsqueda y toggle se movieron a Workers.tsx
}

export function WorkerFilter({}: WorkerFilterProps) {
  const { filters, setFilters, clearFilters } = useWorkerStore();

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
      backgroundColor: '#ffffff',
      border: '1px solid #ebebeb',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      {/* Área Select */}
      <select
        value={filters.area || 'Todas'}
        onChange={(e) =>
          setFilters({ area: e.target.value === 'Todas' ? '' : e.target.value })
        }
        style={{
          height: '32px',
          backgroundColor: '#ffffff',
          border: '1px solid #ebebeb',
          borderRadius: '9999px',
          padding: '0 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: '#171717',
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
          height: '32px',
          backgroundColor: '#ffffff',
          border: '1px solid #ebebeb',
          borderRadius: '9999px',
          padding: '0 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: '#171717',
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
            height: '32px',
            padding: '0 12px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(229,72,77,0.2)',
            borderRadius: '9999px',
            color: '#e5484d',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(229,72,77,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <X style={{ width: '13px', height: '13px' }} strokeWidth={1.5} />
          Limpiar ({activeFiltersCount})
        </button>
      )}
    </div>
  );
}
