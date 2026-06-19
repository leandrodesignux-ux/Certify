import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronRight, Menu, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { useCertStore } from '../../store/useCertStore';
import { useCommandPalette } from '../../store/useCommandPalette';
import { useRelativeTime } from '../../hooks/useRelativeTime';
import { mockAlerts } from '../../data/mockData';

interface TopbarProps {
  pageTitle: string;
  breadcrumbs?: { label: string; route?: string }[];
}

function RelativeTimeText({ dateString }: { dateString: string }) {
  const text = useRelativeTime(dateString);
  return <>{text}</>;
}

// Get alert icon based on type
function getAlertIcon(tipo: string) {
  switch (tipo) {
    case 'vencimiento':
      return <AlertTriangle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} strokeWidth={1.5} />;
    case 'progreso':
      return <CheckCircle className="w-4 h-4" style={{ color: 'var(--status-success)' }} strokeWidth={1.5} />;
    default:
      return <Clock className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} strokeWidth={1.5} />;
  }
}

export function Topbar({ pageTitle, breadcrumbs = [] }: TopbarProps) {
  const { sidebarCollapsed, toggleMobileSidebar } = useUIStore();
  const { certifications } = useCertStore();
  const reduceMotion = useReducedMotion();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Check for expired certs for red dot indicator
  const hasExpiredCerts = certifications.some(c => c.estado === 'vencido');

  // Get top 3 alerts
  const topAlerts = mockAlerts.slice(0, 3);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { show: showPalette } = useCommandPalette();

  // Keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPalette]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: isMobile ? '0px' : (sidebarCollapsed ? '64px' : '240px'),
        height: '64px',
        zIndex: 40,
        backgroundColor: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 24px',
        transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Left: Mobile Menu Button + Breadcrumb + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 transition-colors rounded-md"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col" style={{ minWidth: 0, overflow: 'hidden' }}>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center text-xs mb-0.5" style={{ color: 'var(--color-text-faint)' }}>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-3 h-3 mx-1.5" strokeWidth={1.5} />}
                  {crumb.route ? (
                    <button className="transition-colors duration-150" style={{ color: 'var(--color-text-muted)' }}>
                      {crumb.label}
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display text-lg font-semibold truncate" style={{ color: 'var(--color-brand)', letterSpacing: 'var(--tracking-tight)', fontFamily: 'var(--font-display)' }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div
        className="hidden md:block flex-1 max-w-md mx-8"
        style={{
          maxWidth: sidebarCollapsed ? '500px' : '400px',
          transition: 'max-width 0.3s ease',
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            id="global-search"
            type="text"
            aria-label="Buscar trabajador o certificación"
            placeholder="Buscar trabajador, certificación..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: '40px',
              backgroundColor: 'var(--surface-card)',
              border: searchFocused ? '1px solid var(--color-primary)' : '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              paddingLeft: '40px',
              paddingRight: searchFocused ? '16px' : '60px',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-brand)',
              outline: 'none',
              transition: 'all var(--transition-fast)',
              boxShadow: searchFocused ? 'var(--shadow-focus)' : 'none',
            }}
          />
          {/* Keyboard shortcut hint */}
          {!searchFocused && (
            <kbd
              onClick={showPalette}
              title="Abrir paleta de comandos (⌘K)"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '2px 6px',
                backgroundColor: 'var(--surface-soft)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-soft-hover, var(--surface-soft))';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--color-text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-soft)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            aria-label="Ver notificaciones"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 transition-colors duration-150 rounded-md"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Bell className="w-5 h-5" />
            {hasExpiredCerts && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--status-danger)',
                  borderRadius: '50%',
                  border: '2px solid var(--surface-card)',
                }}
              >
                {!reduceMotion && (
                  <motion.span
                    animate={{
                      scale: [1, 2.2, 2.2],
                      opacity: [0.6, 0, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50%',
                      backgroundColor: 'var(--status-danger)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </motion.span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: isMobile ? '-8px' : '0',
                  width: isMobile ? 'calc(100vw - 32px)' : '320px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-medium text-sm" style={{ color: 'var(--color-brand)' }}>Notificaciones</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Ver todas
                  </button>
                </div>

                {/* Alert Items */}
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {topAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-default)',
                        display: 'flex',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-soft)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {getAlertIcon(alert.tipo)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-brand)' }}>
                          {alert.workerName}
                        </p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                          {alert.message}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-faint)' }}>
                          <RelativeTimeText dateString={alert.createdAt} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  style={{
                    padding: '10px 16px',
                    borderTop: '1px solid var(--border-default)',
                    backgroundColor: 'var(--surface-soft)',
                  }}
                >
                  <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                    {hasExpiredCerts
                      ? `${certifications.filter(c => c.estado === 'vencido').length} certificaciones vencidas`
                      : 'Sin alertas pendientes'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center" style={{ borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)', border: '1px solid var(--border-default)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>Admin</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>admin@certifyx.cl</p>
          </div>
        </div>
      </div>
    </header>
  );
}
