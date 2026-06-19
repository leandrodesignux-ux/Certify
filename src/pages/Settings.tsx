import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Palette, Database, Shield, CheckCircle, Camera } from 'lucide-react';
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

// ─── Input helpers ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '38px',
  backgroundColor: '#ffffff',
  border: '1px solid #ebebeb',
  borderRadius: '6px',
  padding: '0 12px',
  fontSize: '13px',
  color: '#171717',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: '#666666',
  marginBottom: '6px',
};

function FormField({
  label, value, onChange, type = 'text', error, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: error ? '#e5484d' : focused ? '#171717' : '#ebebeb',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && (
        <p style={{ fontSize: '11px', color: '#e5484d', marginTop: '4px', margin: '4px 0 0' }}>{error}</p>
      )}
    </div>
  );
}

// ─── Perfil Section ────────────────────────────────────────────────────────────

const INITIAL_PROFILE = {
  nombre: 'Administrador',
  email: 'admin@certifyx.cl',
  cargo: 'Administrador del Sistema',
  telefono: '+56 9 1234 5678',
};

function PerfilSection() {
  const [form, setForm] = useState({ ...INITIAL_PROFILE });
  const [saved, setSaved] = useState({ ...INITIAL_PROFILE });
  const [emailError, setEmailError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = form.nombre
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSave = () => {
    if (!validateEmail(form.email)) {
      setEmailError('Ingresá un email válido (ej: usuario@dominio.cl)');
      return;
    }
    setSaved({ ...form });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setEmailError('');
  };

  const set = (field: keyof typeof form) => (v: string) => {
    setForm(prev => ({ ...prev, [field]: v }));
    if (field === 'email') setEmailError('');
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#f0f0f0', border: '2px solid #ebebeb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: 600, color: '#4d4d4d',
          }}>
            {initials}
          </div>
          <label
            title="Cambiar foto (próximamente)"
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '22px', height: '22px', borderRadius: '50%',
              backgroundColor: '#171717', border: '2px solid #ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'not-allowed', opacity: 0.7,
            }}
          >
            <Camera style={{ width: '10px', height: '10px', color: '#ffffff' }} strokeWidth={2} />
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} disabled />
          </label>
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>{form.nombre}</p>
          <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>{form.email}</p>
          <p style={{ fontSize: '11px', color: '#d4d4d4', margin: '4px 0 0' }}>Cambio de foto próximamente</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#f5f5f5' }} />

      {/* Campos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Nombre completo" value={form.nombre} onChange={set('nombre')} placeholder="Ej: Juan Pérez" />
        <FormField
          label="Email" value={form.email} onChange={set('email')}
          type="email" error={emailError} placeholder="usuario@dominio.cl"
        />
        <FormField label="Cargo" value={form.cargo} onChange={set('cargo')} placeholder="Ej: Administrador" />
        <FormField label="Teléfono" value={form.telefono} onChange={set('telefono')} type="tel" placeholder="+56 9 0000 0000" />
      </div>

      {/* Feedback + acciones */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        {/* Feedback */}
        <AnimatePresence>
          {saveStatus === 'saved' && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle style={{ width: '14px', height: '14px', color: '#297a3a' }} strokeWidth={2} />
              <span style={{ fontSize: '13px', color: '#297a3a', fontWeight: 500 }}>Cambios guardados</span>
            </motion.div>
          )}
          {saveStatus === 'idle' && <div />}
        </AnimatePresence>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={handleCancel}
            disabled={!isDirty}
            style={{
              height: '36px', padding: '0 16px', fontSize: '13px', fontWeight: 500,
              color: isDirty ? '#4d4d4d' : '#d4d4d4',
              backgroundColor: 'transparent',
              border: `1px solid ${isDirty ? '#ebebeb' : '#f0f0f0'}`,
              borderRadius: '6px', cursor: isDirty ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (isDirty) e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            style={{
              height: '36px', padding: '0 16px', fontSize: '13px', fontWeight: 500,
              color: '#ffffff',
              backgroundColor: isDirty ? '#171717' : '#d4d4d4',
              border: 'none', borderRadius: '6px',
              cursor: isDirty ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => { if (isDirty) e.currentTarget.style.backgroundColor = '#2e2e2e'; }}
            onMouseLeave={e => { if (isDirty) e.currentTarget.style.backgroundColor = '#171717'; }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

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

                {/* Cuerpo de sección */}
                {activeSection === 'perfil' ? (
                  <PerfilSection />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '10px', textAlign: 'center' }}>
                    <active.icon style={{ width: '32px', height: '32px', color: '#d4d4d4' }} strokeWidth={1} />
                    <p style={{ fontSize: '13px', color: '#a8a8a8', margin: 0 }}>{active.description}</p>
                    <p style={{ fontSize: '12px', color: '#d4d4d4', margin: 0 }}>Contenido disponible próximamente</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}

export default Settings;
