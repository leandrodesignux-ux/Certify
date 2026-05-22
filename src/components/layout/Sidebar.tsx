import { useEffect, useState } from 'react';
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
  X,
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useCertStore } from '../../store/useCertStore';

interface NavItem {
  icon: React.ElementType;
  label: string;
  route: string;
  badge?: 'certifications' | 'reports';
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', route: '/dashboard' },
  { icon: Users, label: 'Trabajadores', route: '/workers' },
  { icon: Award, label: 'Certificaciones', route: '/certifications', badge: 'certifications' },
  { icon: BookOpen, label: 'Mallas', route: '/curriculum' },
  { icon: BarChart2, label: 'Reportes', route: '/reports', badge: 'reports' },
  { icon: Settings, label: 'Configuración', route: '/settings' },
];

// Notification Badge Component
function NotificationBadge({ count, color }: { count: number; color: string }) {
  if (count === 0) return null;
  return (
    <span
      style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: color,
        color: '#fff',
        fontSize: '10px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #0D1B2A',
      }}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

// Tooltip Component for collapsed sidebar
function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            left: '56px',
            backgroundColor: '#1C2333',
            color: '#F0F4FF',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            border: '1px solid rgba(0,229,255,0.2)',
            zIndex: 100,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {label}
          <span
            style={{
              position: 'absolute',
              left: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              borderWidth: '5px 5px 5px 0',
              borderStyle: 'solid',
              borderColor: 'transparent rgba(0,229,255,0.2) transparent transparent',
            }}
          />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const { certifications } = useCertStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Calculate badge counts
  const expiredCertsCount = certifications.filter(c => c.estado === 'vencido').length;
  const reportsAlertsCount = 3; // Hardcoded as requested

  const badgeCounts = {
    certifications: expiredCertsCount,
    reports: reportsAlertsCount,
  };

  const badgeColors = {
    certifications: '#FF3D57',
    reports: '#FFB800',
  };

  // Auto-collapse on tablet (<1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768 && !sidebarCollapsed) {
        toggleSidebar();
      }
      // Close mobile sidebar on resize to desktop
      if (window.innerWidth >= 768 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed, mobileSidebarOpen]);

  // Keyboard shortcut for sidebar toggle (⌘B or Ctrl+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const currentPath = location.pathname;

  // Desktop Sidebar Content
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
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
              className="ml-3 font-display text-xl font-bold text-[#00E5FF] tracking-wide text-glow-electric"
            >
              CertifyX
            </motion.span>
          )}
        </AnimatePresence>
        {isMobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto p-2 text-[#8892A4] hover:text-[#F0F4FF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toggle Button (desktop only) */}
      {!isMobile && (
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
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.route || currentPath.startsWith(`${item.route}/`);
            const badgeCount = item.badge ? badgeCounts[item.badge] : 0;
            const badgeColor = item.badge ? badgeColors[item.badge] : null;
            const isHovered = hoveredItem === item.route;

            return (
              <li key={item.route} style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    navigate(item.route);
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
                  onMouseEnter={() => setHoveredItem(item.route)}
                  onMouseLeave={() => setHoveredItem(null)}
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
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'relative' }}>
                    <Icon
                      style={{
                        width: '20px',
                        height: '20px',
                        flexShrink: 0,
                        color: isActive ? '#00E5FF' : '#8892A4',
                      }}
                    />
                    {badgeCount > 0 && badgeColor && (
                      <NotificationBadge count={badgeCount} color={badgeColor} />
                    )}
                  </span>
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
                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && !isMobile && (
                    <NavTooltip label={item.label} visible={isHovered} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Keyboard Shortcut Hint */}
        {!sidebarCollapsed && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: '24px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '11px', color: '#4A5568' }}>Colapsar sidebar</span>
            <kbd
              style={{
                padding: '2px 6px',
                backgroundColor: 'rgba(28,35,51,0.5)',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#8892A4',
                fontFamily: 'monospace',
                border: '1px solid rgba(0,229,255,0.1)',
              }}
            >
              ⌘B
            </kbd>
          </motion.div>
        )}
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
            justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex h-screen bg-[#0D1B2A] border-r border-[rgba(0,229,255,0.1)] flex-col fixed left-0 top-0 z-50"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                zIndex: 50,
              }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-[#0D1B2A] border-r border-[rgba(0,229,255,0.1)] flex flex-col z-[60]"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
