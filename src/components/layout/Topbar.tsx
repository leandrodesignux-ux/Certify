import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronRight, Menu, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { useCertStore } from '../../store/useCertStore';
import { mockAlerts } from '../../data/mockData';

interface TopbarProps {
  pageTitle: string;
  breadcrumbs?: { label: string; route?: string }[];
}

// Format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Hace minutos';
  if (diffHours === 1) return 'Hace 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
}

// Get alert icon based on type
function getAlertIcon(tipo: string) {
  switch (tipo) {
    case 'vencimiento':
      return <AlertTriangle className="w-4 h-4" style={{ color: '#b25000' }} strokeWidth={1.5} />;
    case 'progreso':
      return <CheckCircle className="w-4 h-4" style={{ color: '#297a3a' }} strokeWidth={1.5} />;
    default:
      return <Clock className="w-4 h-4" style={{ color: '#666666' }} strokeWidth={1.5} />;
  }
}

export function Topbar({ pageTitle, breadcrumbs = [] }: TopbarProps) {
  const { sidebarCollapsed, toggleMobileSidebar } = useUIStore();
  const { certifications } = useCertStore();
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

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: isMobile ? '0px' : (sidebarCollapsed ? '64px' : '240px'),
        height: '64px',
        zIndex: 40,
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #ebebeb',
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
          style={{ color: '#4d4d4d' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col" style={{ minWidth: 0, overflow: 'hidden' }}>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center text-xs mb-0.5" style={{ color: '#a8a8a8' }}>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-3 h-3 mx-1.5" strokeWidth={1.5} />}
                  {crumb.route ? (
                    <button className="transition-colors duration-150" style={{ color: '#666666' }}>
                      {crumb.label}
                    </button>
                  ) : (
                    <span style={{ color: '#4d4d4d' }}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display text-lg font-semibold truncate" style={{ color: '#171717', letterSpacing: '-0.03em' }}>
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
              backgroundColor: '#ffffff',
              border: searchFocused ? '1px solid #171717' : '1px solid #ebebeb',
              borderRadius: 'var(--radius-sm)',
              paddingLeft: '40px',
              paddingRight: searchFocused ? '16px' : '60px',
              fontSize: '14px',
              color: '#171717',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'none',
            }}
          />
          {/* Keyboard shortcut hint */}
          {!searchFocused && (
            <kbd
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '2px 6px',
                backgroundColor: '#fafafa',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#666666',
                fontFamily: 'var(--font-mono)',
                border: '1px solid #ebebeb',
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
            style={{ color: '#4d4d4d' }}
          >
            <Bell className="w-5 h-5" />
            {hasExpiredCerts && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#e5484d',
                  borderRadius: '50%',
                  border: '2px solid #fafafa',
                }}
              />
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #ebebeb',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 8px 0px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #ebebeb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-medium text-sm" style={{ color: '#171717' }}>Notificaciones</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs hover:underline"
                    style={{ color: '#4d4d4d' }}
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
                        borderBottom: '1px solid #ebebeb',
                        display: 'flex',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {getAlertIcon(alert.tipo)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="text-sm font-medium truncate" style={{ color: '#171717' }}>
                          {alert.workerName}
                        </p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#666666' }}>
                          {alert.message}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#a8a8a8' }}>
                          {getRelativeTime(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  style={{
                    padding: '10px 16px',
                    borderTop: '1px solid #ebebeb',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <p className="text-xs text-center" style={{ color: '#666666' }}>
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
          <div className="w-9 h-9 flex items-center justify-center" style={{ borderRadius: 'var(--radius-sm)', background: '#f0f0f0', border: '1px solid #ebebeb' }}>
            <span className="text-sm font-medium" style={{ color: '#171717' }}>AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium" style={{ color: '#171717' }}>Admin</p>
            <p className="text-xs" style={{ color: '#666666' }}>admin@certifyx.cl</p>
          </div>
        </div>
      </div>
    </header>
  );
}
