import type { ReactNode } from 'react';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PanelHeader({ title, subtitle, action }: PanelHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px',
    }}>
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#171717',
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '12px', color: '#a8a8a8', marginTop: '2px', marginBottom: 0 }}>
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
