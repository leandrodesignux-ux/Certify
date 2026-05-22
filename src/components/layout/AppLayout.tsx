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

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0E1A' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: sidebarCollapsed ? '64px' : '240px',
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
            padding: '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
