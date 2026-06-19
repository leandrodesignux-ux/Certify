import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Palette, Database, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const panelVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
  exit:   { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

type SectionId = 'perfil' | 'notificaciones' | 'apariencia' | 'datos' | 'seguridad';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  subtitle: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'perfil',          label: 'Perfil',          icon: User,     subtitle: 'Información personal y cuenta',          description: 'Actualizá tu nombre, correo y datos personales.' },
  { id: 'notificaciones',  label: 'Notificaciones',  icon: Bell,     subtitle: 'Alertas y recordatorios',                description: 'Configurá qué notificaciones recibís y por qué canales.' },
  { id: 'apariencia',      label: 'Apariencia',      icon: Palette,  subtitle: 'Tema y preferencias visuales',           description: 'Personalizá el aspecto de la interfaz.' },
  { id: 'datos',           label: 'Datos',           icon: Database, subtitle: 'Exportación y backup',                   description: 'Gestioná la exportación y restauración de datos.' },
  { id: 'seguridad',       label: 'Seguridad',       icon: Shield,   subtitle: 'Contraseña y autenticación',             description: 'Cambiá tu contraseña y configurá la autenticación.' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState<SectionId>('perfil');

  const active = NAV_ITEMS.find(i => i.id === activeSection)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible"
        style={{ paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
        <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 600, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
          Configuración
        </h1>
        <p style={{ fontSize: '13px', color: '#666666', marginTop: '6px', margin: '6px 0 0' }}>
          Gestiona preferencias y opciones del sistema
        </p>
      </motion.div>

      {/* Layout 2 columnas */}
      <motion.div custom={0.1} variants={sectionVariants} initial="hidden" animate="visible"
        style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* ── Nav vertical ── */}
        <nav
          aria-label="Secciones de configuración"
          style={{
            width: '220px',
            flexShrink: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #ebebeb',
            borderRadius: '6px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            boxShadow: 'rgba(0,0,0,0.06) 0px 1px 2px 0px, rgba(0,0,0,0.08) 0px 1px 3px 0px, rgba(0,0,0,0.04) 0px 0px 0px 1px',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#171717' : '#4d4d4d',
                  backgroundColor: isActive ? '#f5f5f5' : 'transparent',
                  position: 'relative',
                  transition: 'background-color 0.12s, color 0.12s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#fafafa'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Indicador activo izquierdo */}
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '6px', bottom: '6px',
                    width: '3px', backgroundColor: '#171717', borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <Icon style={{ width: '15px', height: '15px', flexShrink: 0, color: isActive ? '#171717' : '#a8a8a8' }} strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Panel de sección activa ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card variant="default" padding="lg" hover={false}>
                {/* Sección header */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#f5f5f5', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <active.icon style={{ width: '16px', height: '16px', color: '#4d4d4d' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#171717', letterSpacing: '-0.01em', margin: 0 }}>
                        {active.label}
                      </h2>
                      <p style={{ fontSize: '12px', color: '#a8a8a8', marginTop: '2px', marginBottom: 0 }}>
                        {active.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cuerpo vacío — placeholder */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '10px', color: '#a8a8a8', textAlign: 'center' }}>
                  <active.icon style={{ width: '32px', height: '32px', color: '#d4d4d4' }} strokeWidth={1} />
                  <p style={{ fontSize: '13px', color: '#a8a8a8', margin: 0 }}>{active.description}</p>
                  <p style={{ fontSize: '12px', color: '#d4d4d4', margin: 0 }}>Contenido disponible próximamente</p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}

export default Settings;
