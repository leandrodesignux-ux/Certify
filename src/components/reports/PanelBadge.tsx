import type { ReactNode } from 'react';

export function PanelBadge({ children }: { children: ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 500,
      color: 'var(--color-text-muted)',
      backgroundColor: 'var(--surface-soft)',
      border: '1px solid var(--border-default)',
      borderRadius: '9999px',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
