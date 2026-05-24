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
      backgroundColor: 'var(--color-surface)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(91,34,119,0.2)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    }}>
      {/* Área Select */}
      <select
        value={filters.area || 'Todas'}
        onChange={(e) =>
          setFilters({ area: e.target.value === 'Todas' ? '' : e.target.value })
        }
        style={{
          height: '40px',
          backgroundColor: 'var(--color-surface-alt)',
          border: '1px solid rgba(91,34,119,0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0 12px',
          fontSize: '13px',
          color: 'var(--color-text-primary)',
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
          backgroundColor: 'var(--color-surface-alt)',
          border: '1px solid rgba(91,34,119,0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0 12px',
          fontSize: '13px',
          color: 'var(--color-text-primary)',
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
            borderRadius: 'var(--radius-md)',
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
    </div>
  );
}
