import { Search, Bell, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

interface TopbarProps {
  pageTitle: string;
  breadcrumbs?: { label: string; route?: string }[];
}

export function Topbar({ pageTitle, breadcrumbs = [] }: TopbarProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: sidebarCollapsed ? '64px' : '240px',
        height: '64px',
        zIndex: 40,
        backgroundColor: '#111827',
        borderBottom: '1px solid rgba(0,229,255,0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Left: Breadcrumb + Title */}
      <div className="flex flex-col">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center text-xs text-[#8892A4] mb-0.5">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 mx-1.5" />}
                {crumb.route ? (
                  <button className="hover:text-[#00E5FF] transition-colors duration-150">
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-[#4A5568]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-lg font-semibold text-[#F0F4FF] tracking-wide">
          {pageTitle}
        </h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
          <input
            type="text"
            placeholder="Buscar trabajadores, certificaciones..."
            className="w-full h-10 bg-[#1C2333] border border-[rgba(0,229,255,0.1)] rounded-sm pl-10 pr-4 text-sm text-[#F0F4FF] placeholder-[#4A5568] focus:outline-none focus:border-[rgba(0,229,255,0.3)] focus:ring-1 focus:ring-[rgba(0,229,255,0.1)] transition-all duration-150"
          />
        </div>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-[#8892A4] hover:text-[#F0F4FF] transition-colors duration-150">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF3D57] rounded-full flex items-center justify-center text-[10px] font-medium text-white">
            8
          </span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#00E5FF]/20 to-[#AAFF00]/20 border border-[rgba(0,229,255,0.2)] flex items-center justify-center">
            <span className="text-sm font-medium text-[#00E5FF]">AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#F0F4FF]">Admin</p>
            <p className="text-xs text-[#8892A4]">admin@certifyx.cl</p>
          </div>
        </div>
      </div>
    </header>
  );
}
