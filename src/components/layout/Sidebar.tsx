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
        border: '2px solid var(--color-surface-deep)',
      }}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

// Tooltip Component for collapsed sidebar
function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <span
      style={{
        position: 'absolute',
        left: '56px',
        backgroundColor: '#231455',
        color: '#F0F4FF',
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '12px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        border: '1px solid rgba(91,34,119,0.4)',
        zIndex: 100,
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.12s',
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
          borderColor: 'transparent rgba(91,34,119,0.4) transparent transparent',
        }}
      />
    </span>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const { certifications } = useCertStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isHoverLogout, setIsHoverLogout] = useState(false);

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
      <div className="h-16 flex items-center px-4 border-b border-[rgba(91,34,119,0.2)]">
        <Zap className="w-7 h-7 text-[#9b6ab5] flex-shrink-0" />
        <span
          style={{
            marginLeft: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#c49fe0',
            fontFamily: '"Barlow Condensed", sans-serif',
            letterSpacing: '0.05em',
            opacity: sidebarCollapsed ? 0 : 1,
            width: sidebarCollapsed ? 0 : 'auto',
            overflow: 'hidden',
            transition: 'opacity 0.15s, width 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          CertifyX
        </span>
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
          className="w-6 h-6 bg-[#1a1040] border border-[rgba(91,34,119,0.3)] rounded-sm flex items-center justify-center text-[#a89fc4] hover:text-[#9b6ab5] hover:border-[#5b2277]/50 transition-all duration-150"
          style={{ position: 'absolute', right: '-12px', top: '80px', zIndex: 60, borderRadius: 'var(--radius-sm)' }}
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
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.15s ease',
                    backgroundColor: isActive
                      ? 'rgba(91,34,119,0.25)'
                      : isHovered
                        ? 'rgba(91,34,119,0.12)'
                        : 'transparent',
                    color: isActive ? '#c49fe0' : isHovered ? '#F0F4FF' : 'var(--color-text-muted)',
                    borderLeft: isActive
                      ? '2px solid #9b6ab5'
                      : isHovered
                        ? '2px solid rgba(91,34,119,0.4)'
                        : '2px solid transparent',
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'relative' }}>
                    <Icon
                      style={{
                        width: '20px',
                        height: '20px',
                        flexShrink: 0,
                        color: isActive ? '#c49fe0' : isHovered ? '#F0F4FF' : 'var(--color-text-muted)',
                      }}
                    />
                    {badgeCount > 0 && badgeColor && (
                      <NotificationBadge count={badgeCount} color={badgeColor} />
                    )}
                  </span>
                  <span
                    style={{
                      marginLeft: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      opacity: sidebarCollapsed ? 0 : 1,
                      width: sidebarCollapsed ? 0 : 'auto',
                      overflow: 'hidden',
                      transition: 'opacity 0.15s, width 0.15s',
                    }}
                  >
                    {item.label}
                  </span>
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
                backgroundColor: 'rgba(28,16,80,0.5)',
                borderRadius: '4px',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                fontFamily: 'monospace',
                border: '1px solid rgba(91,34,119,0.2)',
              }}
            >
              ⌘B
            </kbd>
          </motion.div>
        )}
      </nav>

      {/* User Section */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(91,34,119,0.2)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(28,35,51,0.3)',
            justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(91,34,119,0.25)',
              border: '1px solid rgba(91,34,119,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User style={{ width: '16px', height: '16px', color: '#9b6ab5' }} />
          </div>
          <div
            style={{
              marginLeft: '12px',
              opacity: sidebarCollapsed ? 0 : 1,
              width: sidebarCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'opacity 0.15s, width 0.15s',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#F0F4FF' }}>Administrador</p>
            <p style={{ fontSize: '12px', color: '#8892A4' }}>Admin</p>
          </div>
          {!sidebarCollapsed && (
            <button
              style={{
                marginLeft: 'auto',
                padding: '6px',
                color: isHoverLogout ? '#FF3D57' : '#8892A4',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={() => setIsHoverLogout(true)}
              onMouseLeave={() => setIsHoverLogout(false)}
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
        className="hidden md:flex h-screen bg-[#130b3a] border-r border-[rgba(91,34,119,0.2)] flex-col fixed left-0 top-0 z-50"
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
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-[#130b3a] border-r border-[rgba(91,34,119,0.2)] flex flex-col z-[60]"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
