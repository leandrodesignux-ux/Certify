import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Search, CornerDownLeft, LayoutDashboard, Users, Award, BookOpen,
  BarChart3, Settings, Download, FileText,
} from 'lucide-react';
import { useCommandPalette } from '../../store/useCommandPalette';
import { useCertStore } from '../../store/useCertStore';
import { useWorkerStore } from '../../store/useWorkerStore';
import { toast } from '../../store/useToastStore';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: typeof Search;
  group: 'Navegación' | 'Acciones' | 'Trabajadores' | 'Certificaciones';
  keywords?: string[];
  onExecute: () => void;
}

export function CommandPalette() {
  const { open, close } = useCommandPalette();
  const navigate = useNavigate();
  const { workers } = useWorkerStore();
  const { certifications, setActiveTab } = useCertStore();
  const reduceMotion = useReducedMotion();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = [
      { id: 'nav-dashboard', label: 'Ir a Dashboard', icon: LayoutDashboard, group: 'Navegación', keywords: ['inicio', 'home'], onExecute: () => navigate('/dashboard') },
      { id: 'nav-workers', label: 'Ir a Trabajadores', icon: Users, group: 'Navegación', keywords: ['equipo', 'staff'], onExecute: () => navigate('/workers') },
      { id: 'nav-certs', label: 'Ir a Certificaciones', icon: Award, group: 'Navegación', keywords: ['certs'], onExecute: () => navigate('/certifications') },
      { id: 'nav-curriculum', label: 'Ir a Curriculum', icon: BookOpen, group: 'Navegación', keywords: ['mallas', 'cursos'], onExecute: () => navigate('/curriculum') },
      { id: 'nav-reports', label: 'Ir a Reportes', icon: BarChart3, group: 'Navegación', keywords: ['informes'], onExecute: () => navigate('/reports') },
      { id: 'nav-settings', label: 'Ir a Configuración', icon: Settings, group: 'Navegación', keywords: ['ajustes'], onExecute: () => navigate('/settings') },
    ];

    const actionCommands: Command[] = [
      {
        id: 'action-export-csv',
        label: 'Exportar listado de certificaciones',
        description: 'Descarga CSV con todas las certificaciones',
        icon: Download,
        group: 'Acciones',
        keywords: ['descargar', 'csv', 'export'],
        onExecute: () => {
          navigate('/certifications');
          toast.info('Buscá el botón "Exportar CSV" arriba a la derecha');
        },
      },
      {
        id: 'action-generate-report',
        label: 'Generar reporte SENCE',
        description: 'Vista de Reportes',
        icon: FileText,
        group: 'Acciones',
        keywords: ['informe', 'sence', 'reporte'],
        onExecute: () => navigate('/reports'),
      },
      {
        id: 'action-view-expired',
        label: 'Ver certificaciones vencidas',
        description: `${certifications.filter(c => c.estado === 'vencido').length} actualmente`,
        icon: Award,
        group: 'Acciones',
        keywords: ['vencidas', 'expirado', 'critico'],
        onExecute: () => {
          setActiveTab('vencidas');
          navigate('/certifications');
        },
      },
      {
        id: 'action-view-expiring',
        label: 'Ver certificaciones por vencer',
        description: `${certifications.filter(c => c.estado === 'proximo_vencer').length} actualmente`,
        icon: Award,
        group: 'Acciones',
        keywords: ['proximas', 'pronto'],
        onExecute: () => {
          setActiveTab('proximas');
          navigate('/certifications');
        },
      },
    ];

    const workerCommands: Command[] = workers.slice(0, 30).map((w) => ({
      id: `worker-${w.id}`,
      label: `${w.nombre} ${w.apellidos}`,
      description: `${w.area} · ${w.cargo}`,
      icon: Users,
      group: 'Trabajadores' as const,
      keywords: [w.area, w.cargo],
      onExecute: () => navigate(`/workers/${w.id}`),
    }));

    return [...navCommands, ...actionCommands, ...workerCommands];
  }, [workers, certifications, navigate, setActiveTab]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter((c) => {
      const haystack = [
        c.label,
        c.description ?? '',
        c.group,
        ...(c.keywords ?? []),
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [commands, query]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((c) => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[activeIndex];
        if (cmd) {
          cmd.onExecute();
          close();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close, filteredCommands, activeIndex]);

  useEffect(() => {
    const el = document.querySelector(`[data-cmd-index="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(11,53,88,0.40)',
              backdropFilter: 'blur(2px)',
              zIndex: 998,
            }}
          />

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Paleta de comandos"
            style={{
              position: 'fixed',
              top: '15vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90vw',
              maxWidth: '600px',
              zIndex: 999,
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '70vh',
            }}
          >
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            >
              <Search style={{ width: '18px', height: '18px', color: 'var(--color-text-muted)', flexShrink: 0 }} strokeWidth={1.75} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                placeholder="Buscá un comando o navegá…"
                aria-label="Buscá un comando"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-brand)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <kbd style={{
                padding: '2px 6px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--surface-soft)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
              }}>ESC</kbd>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px',
            }}
            >
              {filteredCommands.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-body-sm)',
                }}
                >
                  Ningún comando coincide con "{query}".
                </div>
              ) : (
                Object.entries(groupedCommands).map(([groupName, groupCmds]) => (
                  <div key={groupName} style={{ marginBottom: '4px' }}>
                    <div style={{
                      padding: '8px 12px 4px',
                      fontSize: '10px',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--color-text-faint)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-wide)',
                    }}
                    >
                      {groupName}
                    </div>
                    {groupCmds.map((cmd) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isActive = globalIndex === activeIndex;
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          data-cmd-index={globalIndex}
                          onClick={() => { cmd.onExecute(); close(); }}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isActive ? 'var(--color-primary-soft)' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color var(--transition-fast)',
                          }}
                        >
                          <Icon style={{
                            width: '16px', height: '16px',
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            flexShrink: 0,
                          }} strokeWidth={1.5}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 'var(--text-body-sm)',
                              fontWeight: 'var(--weight-medium)',
                              color: isActive ? 'var(--color-primary)' : 'var(--color-brand)',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}
                            >
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div style={{
                                fontSize: 'var(--text-micro)',
                                color: 'var(--color-text-muted)',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}
                              >
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {isActive && (
                            <CornerDownLeft style={{
                              width: '14px', height: '14px',
                              color: 'var(--color-primary)',
                              flexShrink: 0,
                            }} strokeWidth={1.75}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border-default)',
              backgroundColor: 'var(--surface-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 'var(--text-micro)',
              color: 'var(--color-text-muted)',
            }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <span><kbd style={kbdStyle}>↑↓</kbd> navegar</span>
                <span><kbd style={kbdStyle}>↵</kbd> ejecutar</span>
                <span><kbd style={kbdStyle}>esc</kbd> cerrar</span>
              </div>
              <span>{filteredCommands.length} comandos</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: '1px 5px',
  fontFamily: 'var(--font-mono)',
  backgroundColor: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: '4px',
};
