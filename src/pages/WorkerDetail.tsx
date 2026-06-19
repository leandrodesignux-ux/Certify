import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, BookOpen, Clock, CheckCircle, AlertTriangle, Plus, Download, Bell } from 'lucide-react';
import { PageTabs, type PageTab } from '../components/ui/PageTabs';
import { useWorkerStore } from '../store/useWorkerStore';
import { CertCard } from '../components/certifications/CertCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockMeshes } from '../data/mockData';
import { formatRut } from '../utils/format';
import type { Worker as WorkerType } from '../types';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

type TabType = 'certificaciones' | 'mallas' | 'historial';

// Mock history activities
const mockHistoryActivities = [
  { id: 'h1', tipo: 'certificacion', titulo: 'Certificación renovada', descripcion: 'Certificación de Altura aprobada', fecha: '2024-05-15T10:30:00', color: '#297a3a' },
  { id: 'h2', tipo: 'malla', titulo: 'Malla completada', descripcion: 'Malla de Seguridad Industrial 100% completada', fecha: '2024-05-10T14:20:00', color: '#297a3a' },
  { id: 'h3', tipo: 'alerta', titulo: 'Alerta de vencimiento', descripcion: 'Próximo vencimiento: Equipos Pesados', fecha: '2024-05-08T09:15:00', color: '#b25000' },
  { id: 'h4', tipo: 'curso', titulo: 'Curso iniciado', descripcion: 'Inició curso de Liderazgo en Terreno', fecha: '2024-05-05T11:00:00', color: '#476788' },
  { id: 'h5', tipo: 'certificacion', titulo: 'Nueva certificación', descripcion: 'Certificación de Primeros Auxilios obtenida', fecha: '2024-05-01T16:45:00', color: '#297a3a' },
];

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
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString('es-CL');
}

function MiniComplianceTimeline({ certifications }: { certifications: WorkerType['certifications'] }) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();
  const [tooltip, setTooltip] = useState<{ index: number; certs: string[] } | null>(null);

  const monthData = useMemo(() => {
    return months.map((_, index) => {
      const certsInMonth = certifications.filter((cert) => {
        const expDate = new Date(cert.fechaVencimiento);
        return expDate.getMonth() === index && expDate.getFullYear() === new Date().getFullYear();
      });

      const hasExpired = certsInMonth.some((c) => c.estado === 'vencido');
      const hasExpiring = certsInMonth.some((c) => c.estado === 'proximo_vencer');
      const hasValid = certsInMonth.some((c) => c.estado === 'vigente');

      return {
        color: hasExpired ? '#e5484d' : hasExpiring ? '#b25000' : hasValid ? '#297a3a' : 'var(--border-default)',
        count: certsInMonth.length,
        certNames: certsInMonth.map(c => c.nombre),
      };
    });
  }, [certifications]);

  const maxCount = Math.max(...monthData.map(d => d.count), 1);

  return (
    <Card variant="glass" style={{ padding: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <Clock style={{ width: '16px', height: '16px', color: 'var(--color-text-faint)' }} strokeWidth={1.5} />
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-brand)' }}>
          Timeline de Vencimientos {new Date().getFullYear()}
        </span>
      </div>

      {/* Barras con altura proporcional */}
      <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
        {monthData.map((data, index) => {
          const barHeight = data.count > 0
            ? Math.max((data.count / maxCount) * 36, 8)
            : 4;

          return (
            <div
              key={index}
              style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end' }}
              onMouseEnter={() => data.count > 0 && setTooltip({ index, certs: data.certNames })}
              onMouseLeave={() => setTooltip(null)}
            >
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                style={{
                  width: '100%',
                  height: `${barHeight}px`,
                  backgroundColor: data.color,
                  borderRadius: '3px',
                  opacity: index === currentMonth ? 1 : 0.65,
                  cursor: data.count > 0 ? 'pointer' : 'default',
                  transformOrigin: 'bottom',
                  transition: 'opacity 0.15s',
                }}
              />
              {/* Tooltip */}
              {tooltip?.index === index && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-brand)',
                  whiteSpace: 'nowrap',
                  zIndex: 50,
                  pointerEvents: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}>
                  {tooltip.certs.map((name, i) => (
                    <div key={i} style={{ color: data.color }}>{name}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels de mes — mínimo 11px */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
        {months.map((month, index) => (
          <div key={index} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: '11px',
              color: index === currentMonth ? 'var(--color-brand)' : 'var(--color-text-faint)',
              fontWeight: index === currentMonth ? 600 : 400,
            }}>
              {month}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}


// Worker Side Panel Component (Left Column)
function WorkerSidePanel({ worker }: { worker: WorkerType }) {
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const compliance = worker.complianceScore >= 90 ? { color: '#297a3a', label: 'Excelente' }
    : worker.complianceScore >= 70 ? { color: '#297a3a', label: 'Bueno' }
    : worker.complianceScore >= 50 ? { color: '#b25000', label: 'Regular' }
    : { color: '#e5484d', label: 'Crítico' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="lg:sticky lg:top-6">
      
      {/* === CARD 1: Identidad === */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          
          {/* Banner — fafafa con engineering grid */}
          <div style={{ height: '64px', backgroundColor: 'var(--surface-canvas)', backgroundImage: 'linear-gradient(rgba(23,23,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', position: 'relative', borderBottom: '1px solid var(--border-default)' }}>
            <button style={{ position: 'absolute', top: '10px', right: '12px', padding: '4px 10px', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-soft)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--surface-card)'}
            >
              ✎ Editar
            </button>
          </div>

          {/* Avatar superpuesto al banner */}
          <div style={{ padding: '0 20px 20px', position: 'relative' }}>
            <div style={{ marginTop: '-32px', marginBottom: '12px', position: 'relative', display: 'inline-block' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-default)', backgroundColor: 'var(--surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {worker.foto
                  ? <img src={worker.foto} alt={`${worker.nombre}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{initials}</span>
                }
              </div>
            </div>

            {/* Nombre + cargo */}
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', lineHeight: 1.2, marginBottom: '4px', letterSpacing: 'var(--tracking-snug)' }}>
              {worker.nombre} {worker.apellidos}
            </h2>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>{worker.cargo}</p>

            {/* Badge de rango */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: `${compliance.color}0d`, border: `1px solid ${compliance.color}30`, borderRadius: '9999px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: compliance.color }} />
              <span style={{ fontSize: '11px', fontWeight: 500, color: compliance.color }}>{compliance.label}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* === CARD 2: Métricas === */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
          <p style={{ fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Métricas</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Compliance', value: `${worker.complianceScore}%`, color: worker.complianceScore >= 80 ? '#297a3a' : worker.complianceScore >= 60 ? '#b25000' : '#e5484d' },
              { label: 'Certificaciones', value: worker.certifications.length, color: 'var(--color-brand)' },
              { label: 'Vigentes', value: worker.certifications.filter(c => c.estado === 'vigente').length, color: '#297a3a' },
              { label: 'Vencidas', value: worker.certifications.filter(c => c.estado === 'vencido').length, color: worker.certifications.filter(c => c.estado === 'vencido').length > 0 ? '#e5484d' : '#a8a8a8' },
            ].map(metric => (
              <div key={metric.label} style={{ backgroundColor: 'var(--surface-canvas)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', border: '1px solid var(--border-default)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: metric.color, lineHeight: 1, marginBottom: '2px' }}>
                  {metric.value}
                </p>
                <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* === CARD 3: Datos personales === */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
          <p style={{ fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Información</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            {[
              { label: 'RUT', value: formatRut(worker.rut) },
              { label: 'Email', value: worker.email },
              { label: 'Faena', value: worker.departamento },
              { label: 'Área', value: worker.area },
              { label: 'Empresa', value: worker.empresa },
              { label: 'Ingreso', value: new Date(worker.fechaIngreso).toLocaleDateString('es-CL') },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-default)' : 'none', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', flexShrink: 0 }}>{item.label}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-brand)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', maxWidth: '160px' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* === CARD 4: Acciones === */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Agregar Certificación', icon: Plus },
            { label: 'Exportar Perfil', icon: Download },
            { label: 'Enviar Alerta', icon: Bell },
          ].map(action => (
            <button key={action.label}
              style={{ width: '100%', padding: '9px 16px', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: 'var(--text-body-sm)', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-card)'; }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <action.icon style={{ width: '16px', height: '16px' }} />
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}


export function WorkerDetail() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { workers } = useWorkerStore();
  const [activeTab, setActiveTab] = useState<TabType>('certificaciones');

  const worker = workers.find((w) => w.id === workerId);

  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg" style={{ color: 'var(--color-brand)' }}>Trabajador no encontrado</p>
        <Button variant="ghost" onClick={() => navigate('/workers')} className="mt-4">
          ← Volver a trabajadores
        </Button>
      </div>
    );
  }

  const workerMeshes = mockMeshes.filter((m) => worker.activeMeshes.includes(m.id));

  const expiredCertCount = worker.certifications.filter(c => c.estado === 'vencido').length;

  const tabs = [
    {
      id: 'certificaciones' as TabType,
      label: 'Certificaciones',
      icon: Award,
      count: worker.certifications.length,
      alertCount: expiredCertCount,
    },
    {
      id: 'mallas' as TabType,
      label: 'Mallas',
      icon: BookOpen,
      count: workerMeshes.length,
      alertCount: 0,
    },
    {
      id: 'historial' as TabType,
      label: 'Historial',
      icon: Clock,
      count: 0,
      alertCount: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: '8px' }}
      >
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/workers')}>
          Volver
        </Button>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6" style={{ alignItems: 'start' }}>
        {/* Left Column - Worker Side Panel (ALWAYS VISIBLE) */}
        <WorkerSidePanel worker={worker} />
        
        {/* Right Column - Tabs + Dynamic Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tabs navigation */}
          <PageTabs
            tabs={tabs.map<PageTab>((tab) => ({
              id: tab.id,
              label: tab.label,
              icon: tab.icon,
              count: tab.count > 0 ? tab.count : undefined,
              alertCount: tab.alertCount > 0 ? tab.alertCount : undefined,
            }))}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as TabType)}
            ariaLabel="Secciones del perfil del trabajador"
          />

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'certificaciones' && <CertificacionesTab worker={worker} />}
              {activeTab === 'mallas' && <MallasTab worker={worker} workerMeshes={workerMeshes} />}
              {activeTab === 'historial' && <HistorialTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Certificaciones Tab Component
function CertificacionesTab({ worker }: { worker: WorkerType }) {
  const vigentes = worker.certifications.filter(c => c.estado === 'vigente').length;
  const vencidas = worker.certifications.filter(c => c.estado === 'vencido').length;
  const proximas = worker.certifications.filter(c => c.estado === 'proximo_vencer').length;
  const pendientes = worker.certifications.filter(c => c.estado === 'pendiente').length;
  const total = worker.certifications.length;
  const compliance = worker.complianceScore;
  const complianceColor = compliance >= 80 ? '#297a3a' : compliance >= 60 ? '#b25000' : '#e5484d';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Fila superior: 3 módulos de estado */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Vigentes', value: vigentes, total, color: '#297a3a', pct: total > 0 ? Math.round((vigentes/total)*100) : 0 },
          { label: 'Por Vencer', value: proximas, total, color: '#b25000', pct: total > 0 ? Math.round((proximas/total)*100) : 0 },
          { label: 'Vencidas', value: vencidas, total, color: '#e5484d', pct: total > 0 ? Math.round((vencidas/total)*100) : 0 },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'var(--surface-card)', border: `1px solid ${stat.color}20`, borderRadius: 'var(--radius-sm)', padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: stat.color, opacity: 0.25 }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 600, color: stat.color, lineHeight: 1, marginBottom: '2px' }}>{stat.value}</p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)' }}>{stat.label}</p>
            <p style={{ fontSize: '10px', color: stat.color, marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{stat.pct}% del total</p>
          </div>
        ))}
      </div>

      {/* Fila: Score visual + Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Overall Score */}
        <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '20px' }}>
          <p style={{ fontSize: 'var(--text-caption)', fontWeight: 500, color: 'var(--color-text-faint)', marginBottom: '16px' }}>Score Global</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* SVG ring */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#d4e0ed" strokeWidth="7" />
                <motion.circle cx="40" cy="40" r="34" fill="none" stroke={complianceColor} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - compliance / 100) }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 600, color: complianceColor }}>{compliance}</span>
              </div>
            </div>
            <div>
              {compliance >= 80 && <p style={{ fontSize: 'var(--text-caption)', color: '#297a3a', fontWeight: 500, marginBottom: '4px' }}>Cumplimiento OK</p>}
              {compliance < 80 && compliance >= 60 && <p style={{ fontSize: 'var(--text-caption)', color: '#b25000', fontWeight: 500, marginBottom: '4px' }}>Requiere atención</p>}
              {compliance < 60 && <p style={{ fontSize: 'var(--text-caption)', color: '#e5484d', fontWeight: 500, marginBottom: '4px' }}>Acción urgente</p>}
              <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)' }}>{total} certificaciones en total</p>
              <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', marginTop: '2px' }}>{pendientes} pendientes</p>
            </div>
          </div>
        </div>

        {/* Timeline mini */}
        <MiniComplianceTimeline certifications={worker.certifications} />
      </div>

      {/* Lista de certificaciones */}
      {worker.certifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-faint)' }}>
          <p style={{ fontSize: '14px' }}>No hay certificaciones registradas</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
          <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', marginBottom: '12px' }}>
            Certificaciones <span style={{ color: 'var(--color-text-faint)', fontWeight: 400, fontSize: 'var(--text-caption)' }}>({total})</span>
          </p>
          <div 
            className="certs-scroll" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              maxHeight: worker.certifications.length > 4 ? '420px' : 'none',
              overflowY: worker.certifications.length > 4 ? 'auto' : 'visible',
              scrollbarWidth: 'thin'
            }}
          >
            {worker.certifications.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Mallas Tab Component
function MallasTab({ worker, workerMeshes }: { worker: WorkerType; workerMeshes: typeof mockMeshes }) {
  // Use worker parameter to avoid TypeScript warning
  const workerName = worker.nombre;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header de sección */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', letterSpacing: 'var(--tracking-snug)' }}>
            Mallas Curriculares
          </h3>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {workerMeshes.length} mallas asignadas a {workerName}
          </p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Total mallas', value: workerMeshes.length, color: 'var(--color-brand)' },
          { label: 'Completadas', value: workerMeshes.filter(m => m.completionRate === 100).length, color: '#297a3a' },
          { label: 'En progreso', value: workerMeshes.filter(m => m.completionRate > 0 && m.completionRate < 100).length, color: '#b25000' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', marginTop: '2px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de mallas — una por fila con stats internas */}
      {workerMeshes.length === 0 ? (
        <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-body)' }}>No hay mallas asignadas</p>
        </div>
      ) : (
        workerMeshes.map((mesh, index) => {
          const completionColor = mesh.completionRate >= 80 ? '#297a3a' : mesh.completionRate >= 50 ? '#b25000' : '#e5484d';
          const cursosCompletados = Math.round((mesh.completionRate / 100) * mesh.cursos.length);
          
          return (
            <motion.div key={mesh.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${completionColor}`, borderRadius: 'var(--radius-sm)', padding: '16px 20px' }}
            >
              {/* Nombre + porcentaje */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-body)', fontWeight: 500, color: 'var(--color-brand)', marginBottom: '2px' }}>{mesh.nombre}</p>
                  <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)' }}>{mesh.cursos.length} cursos · {cursosCompletados} completados</p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 600, color: completionColor, lineHeight: 1 }}>
                  {mesh.completionRate}%
                </span>
              </div>

              {/* Barra de progreso */}
              <div style={{ height: '4px', backgroundColor: 'var(--surface-soft)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mesh.completionRate}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                  style={{ height: '100%', backgroundColor: completionColor, borderRadius: '3px' }}
                />
              </div>

              {/* Mini stats de cursos por estado */}
              <div style={{ display: 'flex', gap: '16px' }}>
                {[
                  { label: 'Completados', value: cursosCompletados, color: '#297a3a' },
                  { label: 'En curso', value: Math.max(0, mesh.cursos.length - cursosCompletados - 1), color: '#b25000' },
                  { label: 'Pendientes', value: Math.max(0, mesh.cursos.length - cursosCompletados), color: '#a6bbd1' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', marginTop: '1px' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

// Historial Tab Component
function HistorialTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', letterSpacing: 'var(--tracking-snug)' }}>Historial de Actividad</h3>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{mockHistoryActivities.length} eventos registrados</p>
        </div>
        <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', borderRadius: '9999px', padding: '4px 12px' }}>
          Últimos 30 días
        </span>
      </div>

      {/* Lista de eventos */}
      <div style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '8px 0', overflow: 'hidden' }}>
        {mockHistoryActivities.map((activity, index) => {
          const icons = { certificacion: CheckCircle, malla: BookOpen, alerta: AlertTriangle, curso: Award };
          const Icon = icons[activity.tipo as keyof typeof icons] || Clock;
          const isLast = index === mockHistoryActivities.length - 1;

          return (
            <motion.div key={activity.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 20px', borderBottom: isLast ? 'none' : '1px solid var(--border-default)', transition: 'background 0.12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-canvas)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {/* Ícono */}
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: `${activity.color}15`, border: `1px solid ${activity.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: '15px', height: '15px', color: activity.color }} />
              </div>
              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', marginBottom: '1px' }}>{activity.titulo}</p>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.descripcion}</p>
              </div>
              {/* Tiempo */}
              <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                {getRelativeTime(activity.fecha)}
              </span>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

