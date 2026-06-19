import type { ReactNode } from 'react';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  spacing?: number;
}

export function PanelHeader({ title, subtitle, action, spacing = 16 }: PanelHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: `${spacing}px`,
    }}>
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--color-brand)',
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-faint)', marginTop: '4px', marginBottom: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0 }}>
          {action}
        </div>
      )}
    </div>
  );
}
