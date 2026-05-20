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
    <div className="flex min-h-screen bg-[#0A0E1A]">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        {/* Topbar - Fixed */}
        <Topbar pageTitle={pageTitle} breadcrumbs={breadcrumbs} />

        {/* Scrollable Content */}
        <main className="flex-1 pt-16 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
