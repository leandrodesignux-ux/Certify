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
  backgroundColor: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)',
  padding: '0 12px',
  fontSize: 'var(--text-body)',
  color: 'var(--color-text)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-caption)',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
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
          borderColor: error ? 'var(--status-danger)' : focused ? 'var(--color-primary)' : 'var(--border-default)',
        boxShadow: focused && !error ? 'var(--shadow-focus)' : 'none',
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
              backgroundColor: 'var(--color-primary)', border: '2px solid #ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'not-allowed', opacity: 0.7,
            }}
          >
            <Camera style={{ width: '10px', height: '10px', color: '#ffffff' }} strokeWidth={2} />
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} disabled />
          </label>
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-brand)', margin: 0 }}>{form.nombre}</p>
          <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>{form.email}</p>
          <p style={{ fontSize: '11px', color: '#d4d4d4', margin: '4px 0 0' }}>Cambio de foto próximamente</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#f5f5f5' }} />

      {/* Campos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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
              backgroundColor: isDirty ? 'var(--color-primary)' : 'var(--border-default)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: isDirty ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => { if (isDirty) e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { if (isDirty) e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Switch({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      style={{
        width: '36px', height: '20px', flexShrink: 0,
        borderRadius: '10px', border: 'none', padding: '2px',
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--border-default)',
        cursor: 'pointer', position: 'relative',
        transition: 'background-color 0.2s',
        display: 'flex', alignItems: 'center',
      }}
    >
      <span style={{
        width: '16px', height: '16px', borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transform: checked ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)',
        display: 'block',
      }} />
    </button>
  );
}

// ─── Notificaciones Section ────────────────────────────────────────────────────

function NotificacionesSection() {
  const [prefs, setPrefs] = useState({
    vencimiento: true,
    resumenSemanal: false,
    trabajadoresRiesgo: true,
    nuevasCerts: false,
  });
  const [antelacion, setAntelacion] = useState<'7' | '15' | '30'>('15');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    setSaveStatus('idle');
  };

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const rows: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: 'vencimiento',        label: 'Alertas de vencimiento',          desc: 'Notificaciones cuando certificaciones están próximas a vencer.' },
    { key: 'resumenSemanal',     label: 'Resumen semanal por email',        desc: 'Recibí un resumen cada lunes con el estado general.' },
    { key: 'trabajadoresRiesgo', label: 'Trabajadores en riesgo',           desc: 'Alerta cuando un trabajador cae bajo el umbral de cumplimiento.' },
    { key: 'nuevasCerts',        label: 'Nuevas certificaciones agregadas', desc: 'Notificación al agregar una certificación al sistema.' },
  ];

  const selectStyle: React.CSSProperties = {
    height: '30px', padding: '0 28px 0 10px', fontSize: '12px',
    color: 'var(--color-text)', backgroundColor: 'var(--surface-card)',
    border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
    outline: 'none', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8a8a8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {rows.map((row, i) => (
        <div
          key={row.key}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '16px', padding: '16px 0',
            borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none',
          }}
        >
          {/* Label + desc */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor={`notif-${row.key}`} style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', cursor: 'pointer', display: 'block' }}>
              {row.label}
            </label>
            <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>{row.desc}</p>
            {/* Sub-select antelación solo en vencimiento */}
            {row.key === 'vencimiento' && prefs.vencimiento && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: '#666666' }}>Antelación:</span>
                <div style={{ position: 'relative' }}>
                  <select
                    value={antelacion}
                    onChange={e => setAntelacion(e.target.value as '7' | '15' | '30')}
                    style={selectStyle}
                  >
                    <option value="7">7 días</option>
                    <option value="15">15 días</option>
                    <option value="30">30 días</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {/* Switch */}
          <Switch checked={prefs[row.key]} onChange={() => toggle(row.key)} id={`notif-${row.key}`} />
        </div>
      ))}

      {/* Footer: save */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f5f5f5' }}>
        <AnimatePresence>
          {saveStatus === 'saved' && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle style={{ width: '14px', height: '14px', color: '#297a3a' }} strokeWidth={2} />
              <span style={{ fontSize: '13px', color: '#297a3a', fontWeight: 500 }}>Preferencias guardadas</span>
            </motion.div>
          )}
          {saveStatus === 'idle' && <div />}
        </AnimatePresence>
        <button
          onClick={handleSave}
          style={{
            height: '36px', padding: '0 16px', fontSize: '13px', fontWeight: 500,
            color: '#ffffff', backgroundColor: 'var(--color-primary)',
            border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
        >
          Guardar preferencias
        </button>
      </div>
    </div>
  );
}

// ─── Apariencia Section ───────────────────────────────────────────────────────

function AparienciaSection() {
  const [densidad, setDensidad] = useState<'comoda' | 'compacta'>('comoda');
  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const radioCard = (
    label: string, sub: string, value: string, current: string, onClick: () => void
  ) => {
    const active = value === current;
    return (
      <button
        onClick={onClick}
        style={{
          flex: 1, padding: '14px 16px', borderRadius: '6px', textAlign: 'left',
          border: `1px solid ${active ? 'var(--color-primary)' : 'var(--border-default)'}`,
          backgroundColor: active ? 'var(--surface-soft)' : 'var(--surface-card)',
          cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}
      >
        <span style={{
          width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
          border: `2px solid ${active ? 'var(--color-primary)' : 'var(--border-default)'}`,
          backgroundColor: active ? 'var(--color-primary)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}>
          {active && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'block' }} />}
        </span>
        <div>
          <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0 }}>{label}</p>
          <p style={{ fontSize: '11px', color: '#a8a8a8', margin: '2px 0 0' }}>{sub}</p>
        </div>
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Densidad */}
      <div>
        <p style={{ ...labelStyle, marginBottom: '10px', fontSize: 'var(--text-body-sm)', color: 'var(--color-brand)', fontWeight: 500 }}>Densidad de tablas</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {radioCard('Cómoda', 'Más espacio entre filas', 'comoda', densidad, () => setDensidad('comoda'))}
          {radioCard('Compacta', 'Más filas visibles', 'compacta', densidad, () => setDensidad('compacta'))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#f5f5f5' }} />

      {/* Idioma */}
      <div>
        <p style={{ ...labelStyle, marginBottom: '10px', fontSize: 'var(--text-body-sm)', color: 'var(--color-brand)', fontWeight: 500 }}>Idioma de la interfaz</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {radioCard('Español', 'Idioma predeterminado', 'es', idioma, () => setIdioma('es'))}
          {radioCard('English', 'English interface', 'en', idioma, () => setIdioma('en'))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#f5f5f5' }} />

      {/* Tema — deshabilitado */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', opacity: 0.5 }}>
        <div>
          <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0 }}>Tema oscuro</p>
          <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>Disponible próximamente — la app es light-only por ahora.</p>
        </div>
        <Switch checked={false} onChange={() => {}} id="tema-oscuro" />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #f5f5f5' }}>
        <AnimatePresence>
          {saveStatus === 'saved' && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle style={{ width: '14px', height: '14px', color: '#297a3a' }} strokeWidth={2} />
              <span style={{ fontSize: '13px', color: '#297a3a', fontWeight: 500 }}>Preferencias guardadas</span>
            </motion.div>
          )}
          {saveStatus === 'idle' && <div />}
        </AnimatePresence>
        <button onClick={handleSave}
          style={{ height: '36px', padding: '0 16px', fontSize: 'var(--text-body-sm)', fontWeight: 500, color: '#ffffff', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background-color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
        >
          Guardar apariencia
        </button>
      </div>
    </div>
  );
}

// ─── Datos Section ─────────────────────────────────────────────────────────────

const MOCK_SESSIONS = [
  { id: '1', device: 'Chrome · macOS', location: 'Santiago, CL', last: 'Ahora mismo', current: true },
  { id: '2', device: 'Safari · iPhone', location: 'Santiago, CL', last: 'Hace 2 horas', current: false },
  { id: '3', device: 'Firefox · Windows', location: 'Valparaíso, CL', last: 'Ayer 18:32', current: false },
];

function DatosSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'done'>('idle');
  const [exportStatus, setExportStatus] = useState<'idle' | 'done'>('idle');

  const handleExport = () => {
    setExportStatus('done');
    setTimeout(() => setExportStatus('idle'), 3000);
  };

  const handleReset = () => {
    setShowConfirm(false);
    setResetStatus('done');
    setTimeout(() => setResetStatus('idle'), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Exportar */}
      <div style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0 }}>Exportar todos los datos</p>
          <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>Descargá un archivo CSV con trabajadores, certificaciones y mallas.</p>
          {exportStatus === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
              <CheckCircle style={{ width: '12px', height: '12px', color: '#297a3a' }} strokeWidth={2} />
              <span style={{ fontSize: '11px', color: '#297a3a' }}>Exportación iniciada</span>
            </div>
          )}
        </div>
        <button onClick={handleExport}
          style={{ height: '34px', padding: '0 14px', fontSize: 'var(--text-caption)', fontWeight: 500, flexShrink: 0, color: 'var(--color-text)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-card)'; }}
        >
          Exportar CSV
        </button>
      </div>

      {/* Importar */}
      <div style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', opacity: 0.5 }}>
        <div>
          <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0 }}>Importar datos</p>
          <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>Importá datos desde un archivo CSV. Próximamente disponible.</p>
        </div>
        <button disabled
          style={{ height: '34px', padding: '0 14px', fontSize: '12px', fontWeight: 500, flexShrink: 0, color: '#a8a8a8', backgroundColor: '#f5f5f5', border: '1px solid #ebebeb', borderRadius: '6px', cursor: 'not-allowed' }}
        >
          Próximamente
        </button>
      </div>

      {/* Zona de peligro */}
      <div style={{ marginTop: '24px', padding: '20px', border: '1px solid rgba(229,72,77,0.2)', borderRadius: '6px', backgroundColor: 'rgba(229,72,77,0.02)' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#e5484d', margin: '0 0 4px' }}>Zona de peligro</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '12px' }}>
          <div>
            <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0 }}>Restablecer datos de demo</p>
            <p style={{ fontSize: '12px', color: '#a8a8a8', margin: '2px 0 0' }}>Restaura los datos mock originales. Esta acción no se puede deshacer.</p>
            {resetStatus === 'done' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                <CheckCircle style={{ width: '12px', height: '12px', color: '#297a3a' }} strokeWidth={2} />
                <span style={{ fontSize: '11px', color: '#297a3a' }}>Datos restablecidos correctamente</span>
              </div>
            )}
          </div>
          <button onClick={() => setShowConfirm(true)}
            style={{ height: '34px', padding: '0 14px', fontSize: '12px', fontWeight: 500, flexShrink: 0, color: '#e5484d', backgroundColor: 'transparent', border: '1px solid #e5484d', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(229,72,77,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Restablecer
          </button>
        </div>
      </div>

      {/* Modal confirmación reset */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
            onClick={() => setShowConfirm(false)}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }} />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.18 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#ffffff', border: '1px solid #ebebeb', borderRadius: '6px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              <div style={{ padding: '20px 20px 16px', flexShrink: 0, borderBottom: '1px solid #f5f5f5' }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-brand)', margin: 0 }}>¿Restablecer datos de demo?</p>
                <p style={{ fontSize: '13px', color: '#666666', marginTop: '6px', marginBottom: 0 }}>Esta acción restaurará todos los datos mock. Los cambios actuales se perderán.</p>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end', flexShrink: 0 }}>
                <button onClick={() => setShowConfirm(false)}
                  style={{ height: '34px', padding: '0 14px', fontSize: '13px', fontWeight: 500, color: '#4d4d4d', backgroundColor: 'transparent', border: '1px solid #ebebeb', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Cancelar
                </button>
                <button onClick={handleReset}
                  style={{ height: '34px', padding: '0 14px', fontSize: '13px', fontWeight: 500, color: '#ffffff', backgroundColor: '#e5484d', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#c73d41'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#e5484d'; }}
                >
                  Sí, restablecer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Seguridad Section ────────────────────────────────────────────────────────

function SeguridadSection() {
  const [pwd, setPwd] = useState({ actual: '', nueva: '', confirmar: '' });
  const [errors, setErrors] = useState({ nueva: '', confirmar: '' });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const setPwdField = (field: keyof typeof pwd) => (v: string) => {
    setPwd(prev => ({ ...prev, [field]: v }));
    setErrors({ nueva: '', confirmar: '' });
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleSavePwd = () => {
    const errs = { nueva: '', confirmar: '' };
    if (pwd.nueva.length < 8) errs.nueva = 'Mínimo 8 caracteres.';
    if (pwd.nueva !== pwd.confirmar) errs.confirmar = 'Las contraseñas no coinciden.';
    if (errs.nueva || errs.confirmar) { setErrors(errs); return; }
    setPwd({ actual: '', nueva: '', confirmar: '' });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const canSave = pwd.actual.length > 0 && pwd.nueva.length > 0 && pwd.confirmar.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Cambio de contraseña */}
      <div>
        <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', marginBottom: '16px', margin: '0 0 16px' }}>Cambiar contraseña</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px' }}>
          <FormField label="Contraseña actual" value={pwd.actual} onChange={setPwdField('actual')} type="password" placeholder="••••••••" />
          <FormField label="Nueva contraseña" value={pwd.nueva} onChange={setPwdField('nueva')} type="password" error={errors.nueva} placeholder="Mínimo 8 caracteres" />
          <FormField label="Confirmar contraseña" value={pwd.confirmar} onChange={setPwdField('confirmar')} type="password" error={errors.confirmar} placeholder="Repetí la nueva contraseña" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
          <button onClick={handleSavePwd} disabled={!canSave}
            style={{ height: '36px', padding: '0 16px', fontSize: 'var(--text-body-sm)', fontWeight: 500, color: '#ffffff', backgroundColor: canSave ? 'var(--color-primary)' : 'var(--border-default)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: canSave ? 'pointer' : 'not-allowed', transition: 'background-color 0.15s' }}
            onMouseEnter={e => { if (canSave) e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { if (canSave) e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
          >
            Actualizar contraseña
          </button>
          <AnimatePresence>
            {saveStatus === 'saved' && (
              <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle style={{ width: '13px', height: '13px', color: '#297a3a' }} strokeWidth={2} />
                <span style={{ fontSize: '12px', color: '#297a3a', fontWeight: 500 }}>Contraseña actualizada</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#f5f5f5' }} />

      {/* Sesiones activas */}
      <div>
        <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', marginBottom: '12px', margin: '0 0 12px' }}>Sesiones activas</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {sessions.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: i < sessions.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: '#f5f5f5', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield style={{ width: '14px', height: '14px', color: s.current ? '#297a3a' : '#a8a8a8' }} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0 }}>{s.device}</p>
                    {s.current && <span style={{ fontSize: '10px', fontWeight: 500, color: '#297a3a', backgroundColor: 'rgba(41,122,58,0.08)', border: '1px solid rgba(41,122,58,0.2)', borderRadius: '9999px', padding: '1px 7px' }}>Esta sesión</span>}
                  </div>
                  <p style={{ fontSize: '11px', color: '#a8a8a8', margin: '2px 0 0' }}>{s.location} · {s.last}</p>
                </div>
              </div>
              {!s.current && (
                <button onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))}
                  style={{ height: '30px', padding: '0 12px', fontSize: '12px', fontWeight: 500, color: '#e5484d', backgroundColor: 'transparent', border: '1px solid rgba(229,72,77,0.3)', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(229,72,77,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          ))}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible"
        style={{ paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
        <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1.1, margin: 0 }}>
          Configuración
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
          Gestiona preferencias y opciones del sistema
        </p>
      </motion.div>

      {/* Tabs horizontales */}
      <motion.div custom={0.05} variants={sectionVariants} initial="hidden" animate="visible">
        <div
          role="tablist"
          aria-label="Secciones de configuración"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '0',
            borderBottom: '1px solid #ebebeb',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="scrollbar-hidden"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '10px 14px',
                  fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--color-brand)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              >
                <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Panel de sección activa */}
      <motion.div custom={0.1} variants={sectionVariants} initial="hidden" animate="visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            id={`panel-${activeSection}`}
            role="tabpanel"
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
                    <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--color-brand)', letterSpacing: 'var(--tracking-snug)', margin: 0 }}>
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
              ) : activeSection === 'notificaciones' ? (
                <NotificacionesSection />
              ) : activeSection === 'apariencia' ? (
                <AparienciaSection />
              ) : activeSection === 'datos' ? (
                <DatosSection />
              ) : (
                <SeguridadSection />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

export default Settings;
