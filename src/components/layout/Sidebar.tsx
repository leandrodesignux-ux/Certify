import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

interface NavItem {
  icon: React.ElementType;
  label: string;
  route: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', route: '/dashboard' },
  { icon: Users, label: 'Trabajadores', route: '/workers' },
  { icon: Award, label: 'Certificaciones', route: '/certifications' },
  { icon: BookOpen, label: 'Mallas', route: '/curriculum' },
  { icon: BarChart2, label: 'Reportes', route: '/reports' },
  { icon: Settings, label: 'Configuración', route: '/settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-collapse on tablet (<1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768 && !sidebarCollapsed) {
        toggleSidebar();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPath = location.pathname;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen bg-[#0D1B2A] border-r border-[rgba(0,229,255,0.1)] flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[rgba(0,229,255,0.1)]">
        <Zap className="w-7 h-7 text-[#00E5FF] flex-shrink-0" />
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="ml-3 font-display text-xl font-bold text-[#00E5FF] tracking-wide"
            >
              CertifyX
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#111827] border border-[rgba(0,229,255,0.2)] rounded-sm flex items-center justify-center text-[#8892A4] hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-all duration-150"
        style={{ zIndex: 60 }}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.route || currentPath.startsWith(`${item.route}/`);

            return (
              <li key={item.route}>
                <button
                  onClick={() => navigate(item.route)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease',
                    backgroundColor: isActive ? 'rgba(0,229,255,0.12)' : 'transparent',
                    color: isActive ? '#00E5FF' : '#8892A4',
                    borderLeft: isActive ? '2px solid #00E5FF' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#F0F4FF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#8892A4';
                    }
                  }}
                >
                  <Icon
                    style={{
                      width: '20px',
                      height: '20px',
                      flexShrink: 0,
                      color: isActive ? '#00E5FF' : '#8892A4',
                    }}
                  />
                  <AnimatePresence mode="wait">
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15, delay: 0.05 }}
                        style={{ marginLeft: '12px', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(0,229,255,0.1)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            borderRadius: '4px',
            backgroundColor: 'rgba(28,35,51,0.3)',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(170,255,0,0.2) 100%)',
              border: '1px solid rgba(0,229,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User style={{ width: '16px', height: '16px', color: '#00E5FF' }} />
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                style={{ marginLeft: '12px' }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#F0F4FF' }}>Administrador</p>
                <p style={{ fontSize: '12px', color: '#8892A4' }}>Admin</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <button
              style={{
                marginLeft: 'auto',
                padding: '6px',
                color: '#8892A4',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF3D57'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#8892A4'}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
