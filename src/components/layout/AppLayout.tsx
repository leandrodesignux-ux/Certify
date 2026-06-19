import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '../../store/useUIStore';

interface AppLayoutProps {
  pageTitle: string;
  breadcrumbs?: { label: string; route?: string }[];
}

export function AppLayout({ pageTitle, breadcrumbs }: AppLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: isMobile ? '0px' : (sidebarCollapsed ? '64px' : '240px'),
          transition: 'margin-left 0.3s cubic-bezier(0.16,1,0.3,1)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        <Topbar pageTitle={pageTitle} breadcrumbs={breadcrumbs} />
        <main
          style={{
            flex: 1,
            paddingTop: '80px',
            paddingLeft: isMobile ? '16px' : '28px',
            paddingRight: isMobile ? '16px' : '28px',
            paddingBottom: '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
