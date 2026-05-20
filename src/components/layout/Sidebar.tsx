import { motion, AnimatePresence } from 'framer-motion';
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
  { icon: LayoutDashboard, label: 'Dashboard', route: '/' },
  { icon: Users, label: 'Trabajadores', route: '/workers' },
  { icon: Award, label: 'Certificaciones', route: '/certifications' },
  { icon: BookOpen, label: 'Mallas', route: '/meshes' },
  { icon: BarChart2, label: 'Reportes', route: '/reports' },
  { icon: Settings, label: 'Configuración', route: '/settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeRoute, setActiveRoute } = useUIStore();

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-60';

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`${sidebarWidth} h-screen bg-[#0D1B2A] border-r border-[rgba(0,229,255,0.1)] flex flex-col fixed left-0 top-0 z-50`}
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
        className="absolute -right-3 top-20 w-6 h-6 bg-[#111827] border border-[rgba(0,229,255,0.2)] rounded-sm flex items-center justify-center text-[#8892A4] hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-all duration-150 z-50"
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
            const isActive = activeRoute === item.route;

            return (
              <li key={item.route}>
                <button
                  onClick={() => setActiveRoute(item.route)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-sm transition-all duration-150 group ${
                    isActive
                      ? 'bg-[#1C2333] text-[#00E5FF] border-l-[3px] border-[#00E5FF]'
                      : 'text-[#8892A4] hover:bg-[#1C2333]/50 hover:text-[#F0F4FF] border-l-[3px] border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-[#00E5FF]' : 'text-[#8892A4] group-hover:text-[#F0F4FF]'
                    }`}
                  />
                  <AnimatePresence mode="wait">
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15, delay: 0.05 }}
                        className="ml-3 text-sm font-medium whitespace-nowrap"
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
      <div className="p-3 border-t border-[rgba(0,229,255,0.1)]">
        <div className="flex items-center px-3 py-2.5 rounded-sm bg-[#1C2333]/30">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#00E5FF]/20 to-[#AAFF00]/20 border border-[rgba(0,229,255,0.2)] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-[#F0F4FF]">Administrador</p>
                <p className="text-xs text-[#8892A4]">Admin</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <button className="ml-auto p-1.5 text-[#8892A4] hover:text-[#FF3D57] transition-colors duration-150">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
