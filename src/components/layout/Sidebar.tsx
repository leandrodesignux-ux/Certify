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
  LayoutGrid,
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
  { icon: LayoutGrid, label: 'Cómo lo construí', route: '/como-lo-construi' },
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
        border: '2px solid var(--surface-card)',
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
        backgroundColor: 'var(--surface-elevated)',
        color: 'var(--color-brand)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'],
        whiteSpace: 'nowrap',
        border: '1px solid var(--border-default)',
        zIndex: 100,
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: 'var(--shadow-md)',
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
          borderColor: 'transparent var(--border-default) transparent transparent',
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
    certifications: 'var(--status-danger)',
    reports: 'var(--status-warning)',
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
      <div className="h-16 flex items-center px-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <Zap className="w-7 h-7 flex-shrink-0" style={{ color: 'var(--color-brand)', strokeWidth: 2 }} />
        <span
          style={{
            marginLeft: '12px',
            fontSize: 'var(--text-h2)',
            fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
            color: 'var(--color-brand)',
            fontFamily: 'var(--font-display)',
            letterSpacing: 'var(--tracking-tight)',
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
            className="ml-auto p-2 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Toggle Button (desktop only) */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="w-6 h-6 flex items-center justify-center transition-all duration-150"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)', position: 'absolute', right: '-12px', top: '80px', zIndex: 60 }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-brand)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
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
                    padding: '12px 16px',
                    minHeight: '48px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all var(--transition-fast)',
                    backgroundColor: isActive
                      ? 'var(--color-primary-soft)'
                      : isHovered
                        ? 'var(--surface-soft)'
                        : 'transparent',
                    color: isActive
                      ? 'var(--color-primary)'
                      : isHovered
                        ? 'var(--color-brand)'
                        : 'var(--color-text-muted)',
                    borderLeft: isActive
                      ? '2px solid var(--color-primary)'
                      : '2px solid transparent',
                    fontWeight: isActive
                      ? 'var(--weight-semibold)' as React.CSSProperties['fontWeight']
                      : 'var(--weight-medium)' as React.CSSProperties['fontWeight'],
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'relative' }}>
                    <Icon
                      style={{
                        width: '20px',
                        height: '20px',
                        flexShrink: 0,
                      }}
                      strokeWidth={1.5}
                    />
                    {badgeCount > 0 && badgeColor && (
                      <NotificationBadge count={badgeCount} color={badgeColor} />
                    )}
                  </span>
                  <span
                    style={{
                      marginLeft: '12px',
                      fontSize: 'var(--text-body)',
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
            <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)' }}>Colapsar sidebar</span>
            <kbd
              style={{
                padding: '2px 6px',
                backgroundColor: 'var(--surface-soft)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                border: '1px solid var(--border-default)',
              }}
            >
              ⌘B
            </kbd>
          </motion.div>
        )}
      </nav>

      {/* User Section */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-default)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-soft)',
            justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-soft)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
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
            <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'], color: 'var(--color-brand)' }}>Administrador</p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)' }}>Admin</p>
          </div>
          {!sidebarCollapsed && (
            <button
              style={{
                marginLeft: 'auto',
                padding: '10px',
                color: isHoverLogout ? 'var(--status-danger)' : 'var(--color-text-faint)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={() => setIsHoverLogout(true)}
              onMouseLeave={() => setIsHoverLogout(false)}
            >
              <LogOut style={{ width: '16px', height: '16px' }} strokeWidth={1.5} />
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
        className="hidden md:flex h-screen flex-col fixed left-0 top-0 z-50"
        style={{ backgroundColor: 'var(--surface-card)', borderRight: '1px solid var(--border-default)' }}
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
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] flex flex-col z-[60]"
              style={{ backgroundColor: 'var(--surface-card)', borderRight: '1px solid var(--border-default)' }}
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
