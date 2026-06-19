import type { LucideIcon } from 'lucide-react';

export interface PageTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
  alertCount?: number;
  disabled?: boolean;
}

interface PageTabsProps {
  tabs: PageTab[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

export function PageTabs({ tabs, activeId, onChange, ariaLabel }: PageTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="scrollbar-hidden"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 0,
        borderBottom: '1px solid var(--border-default)',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const isDisabled = tab.disabled ?? false;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const enabledTabs = tabs.filter((t) => !t.disabled);
                const currentIdx = enabledTabs.findIndex((t) => t.id === activeId);
                const nextIdx = e.key === 'ArrowRight'
                  ? (currentIdx + 1) % enabledTabs.length
                  : (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
                onChange(enabledTabs[nextIdx].id);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              fontSize: 'var(--text-body-sm)',
              fontWeight: isActive
                ? 'var(--weight-semibold)'
                : 'var(--weight-medium)',
              color: isActive
                ? 'var(--color-primary)'
                : 'var(--color-text-muted)',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isActive
                ? '2px solid var(--color-primary)'
                : '2px solid transparent',
              marginBottom: '-1px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.4 : 1,
              transition: 'color var(--transition-fast)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.color = 'var(--color-brand)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }
            }}
          >
            {Icon && (
              <Icon
                style={{ width: '16px', height: '16px', flexShrink: 0 }}
                strokeWidth={1.5}
              />
            )}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && tab.count >= 0 && (
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-micro)',
                  fontWeight: 'var(--weight-medium)',
                  backgroundColor: isActive
                    ? 'var(--color-primary-soft)'
                    : 'var(--surface-soft)',
                  color: isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-text-faint)',
                  fontFamily: 'var(--font-mono)',
                  minWidth: '20px',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {tab.count}
              </span>
            )}
            {tab.alertCount !== undefined && tab.alertCount > 0 && (
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px',
                  fontWeight: 'var(--weight-semibold)',
                  backgroundColor: 'var(--status-danger-bg)',
                  color: 'var(--status-danger)',
                  border: '1px solid var(--status-danger-border)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.4,
                }}
              >
                {tab.alertCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
