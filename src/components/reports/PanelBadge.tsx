import type { ReactNode } from 'react';

export function PanelBadge({ children }: { children: ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 500,
      color: '#666666',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ebebeb',
      borderRadius: '9999px',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
