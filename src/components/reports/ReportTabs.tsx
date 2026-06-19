interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface ReportTabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function ReportTabs({ tabs, activeId, onChange }: ReportTabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '4px',
        padding: 0,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const isDisabled = tab.disabled ?? false;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              fontSize: 'var(--text-body-sm)',
              fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
              backgroundColor: isActive ? 'var(--surface-card)' : 'transparent',
              border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.5 : 1,
              pointerEvents: isDisabled ? 'none' : 'auto',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.color = 'var(--color-brand)';
                e.currentTarget.style.backgroundColor = 'var(--surface-soft)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {isActive && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  marginRight: '8px',
                  flexShrink: 0,
                }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
