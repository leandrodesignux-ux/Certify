import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, BookOpen, Clock, CheckCircle, AlertTriangle, Plus, Download, Bell } from 'lucide-react';
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
  { id: 'h1', tipo: 'certificacion', titulo: 'Certificación renovada', descripcion: 'Certificación de Altura aprobada', fecha: '2024-05-15T10:30:00', color: '#729362' },
  { id: 'h2', tipo: 'malla', titulo: 'Malla completada', descripcion: 'Malla de Seguridad Industrial 100% completada', fecha: '2024-05-10T14:20:00', color: '#8a9e52' },
  { id: 'h3', tipo: 'alerta', titulo: 'Alerta de vencimiento', descripcion: 'Próximo vencimiento: Equipos Pesados', fecha: '2024-05-08T09:15:00', color: '#FFB800' },
  { id: 'h4', tipo: 'curso', titulo: 'Curso iniciado', descripcion: 'Inició curso de Liderazgo en Terreno', fecha: '2024-05-05T11:00:00', color: '#9b6ab5' },
  { id: 'h5', tipo: 'certificacion', titulo: 'Nueva certificación', descripcion: 'Certificación de Primeros Auxilios obtenida', fecha: '2024-05-01T16:45:00', color: '#729362' },
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
        color: hasExpired ? '#FF3D57' : hasExpiring ? '#FFB800' : hasValid ? '#729362' : 'rgba(91,34,119,0.2)',
        count: certsInMonth.length,
        certNames: certsInMonth.map(c => c.nombre),
      };
    });
  }, [certifications]);

  const maxCount = Math.max(...monthData.map(d => d.count), 1);

  return (
    <Card variant="glass" style={{ padding: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <Clock style={{ width: '16px', height: '16px', color: '#9b6ab5' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4FF' }}>
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
                  backgroundColor: '#130b3a',
                  border: '1px solid rgba(91,34,119,0.4)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: '#F0F4FF',
                  whiteSpace: 'nowrap',
                  zIndex: 50,
                  pointerEvents: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
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
              color: index === currentMonth ? '#9b6ab5' : 'var(--color-text-muted)',
              fontWeight: index === currentMonth ? 700 : 400,
            }}>
              {month}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Mesh Card Component
function MeshCompactCard({ mesh }: { mesh: typeof mockMeshes[number] }) {
  return (
    <Card variant="glass" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'rgba(138,158,82,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookOpen style={{ width: '20px', height: '20px', color: '#8a9e52' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4FF', marginBottom: '4px' }}>{mesh.nombre}</h4>
          <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '8px' }}>{mesh.cursos.length} cursos</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '6px', backgroundColor: '#231455', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mesh.completionRate}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', backgroundColor: mesh.completionRate >= 80 ? '#729362' : mesh.completionRate >= 50 ? '#FFB800' : '#FF3D57', borderRadius: '3px' }}
              />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: mesh.completionRate >= 80 ? '#729362' : mesh.completionRate >= 50 ? '#FFB800' : '#FF3D57' }}>
              {mesh.completionRate}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Worker Side Panel Component (Left Column)
function WorkerSidePanel({ worker }: { worker: WorkerType }) {
  const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
  const compliance = worker.complianceScore >= 90 ? { color: '#9b6ab5', label: 'Excelente' }
    : worker.complianceScore >= 70 ? { color: '#8a9e52', label: 'Bueno' }
    : worker.complianceScore >= 50 ? { color: '#FFB800', label: 'Regular' }
    : { color: '#FF3D57', label: 'Crítico' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '24px' }}>
      
      {/* === CARD 1: Identidad === */}
      <div style={{ backgroundColor: 'rgba(26,16,64,0.85)', border: '1px solid rgba(91,34,119,0.25)', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* Banner de color según compliance */}
        <div style={{ height: '72px', background: `linear-gradient(135deg, ${compliance.color}30 0%, ${compliance.color}08 100%)`, position: 'relative' }}>
          {/* Botón editar */}
          <button style={{ position: 'absolute', top: '10px', right: '12px', padding: '5px 10px', backgroundColor: 'rgba(26,16,64,0.7)', border: '1px solid rgba(91,34,119,0.3)', borderRadius: '6px', color: '#8892A4', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ✎ Editar
          </button>
        </div>

        {/* Avatar superpuesto al banner */}
        <div style={{ padding: '0 20px 20px', position: 'relative' }}>
          <div style={{ marginTop: '-36px', marginBottom: '12px', position: 'relative', display: 'inline-block' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${compliance.color}`, backgroundColor: '#231455', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {worker.foto
                ? <img src={worker.foto} alt={`${worker.nombre}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: '"Barlow Condensed"', fontSize: '24px', fontWeight: 700, color: compliance.color }}>{initials}</span>
              }
            </div>
          </div>

          {/* Nombre + cargo */}
          <h2 style={{ fontFamily: '"Barlow Condensed"', fontSize: '22px', fontWeight: 700, color: '#F0F4FF', lineHeight: 1.1, marginBottom: '4px' }}>
            {worker.nombre} {worker.apellidos}
          </h2>
          <p style={{ fontSize: '13px', color: '#c49fe0', marginBottom: '12px' }}>{worker.cargo}</p>

          {/* Badge de rango */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: `${compliance.color}15`, border: `1px solid ${compliance.color}40`, borderRadius: '20px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: compliance.color }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: compliance.color, letterSpacing: '0.5px' }}>{compliance.label.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* === CARD 2: Métricas === */}
      <div style={{ backgroundColor: 'rgba(26,16,64,0.85)', border: '1px solid rgba(91,34,119,0.25)', borderRadius: '12px', padding: '16px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Métricas</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Compliance', value: `${worker.complianceScore}%`, color: worker.complianceScore >= 80 ? '#8a9e52' : worker.complianceScore >= 60 ? '#FFB800' : '#FF3D57' },
            { label: 'Certificaciones', value: worker.certifications.length, color: '#9b6ab5' },
            { label: 'Vigentes', value: worker.certifications.filter(c => c.estado === 'vigente').length, color: '#729362' },
            { label: 'Vencidas', value: worker.certifications.filter(c => c.estado === 'vencido').length, color: worker.certifications.filter(c => c.estado === 'vencido').length > 0 ? '#FF3D57' : '#4A5568' },
          ].map(metric => (
            <div key={metric.label} style={{ backgroundColor: 'rgba(91,34,119,0.06)', borderRadius: '8px', padding: '10px 12px', border: '1px solid rgba(91,34,119,0.12)' }}>
              <p style={{ fontFamily: '"Barlow Condensed"', fontSize: '26px', fontWeight: 700, color: metric.color, lineHeight: 1, marginBottom: '2px' }}>
                {metric.value}
              </p>
              <p style={{ fontSize: '10px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* === CARD 3: Datos personales === */}
      <div style={{ backgroundColor: 'rgba(26,16,64,0.85)', border: '1px solid rgba(91,34,119,0.25)', borderRadius: '12px', padding: '16px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Información</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {[
            { label: 'RUT', value: formatRut(worker.rut) },
            { label: 'Email', value: worker.email },
            { label: 'Faena', value: worker.departamento },
            { label: 'Área', value: worker.area },
            { label: 'Empresa', value: worker.empresa },
            { label: 'Ingreso', value: new Date(worker.fechaIngreso).toLocaleDateString('es-CL') },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(91,34,119,0.1)' : 'none', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', flexShrink: 0 }}>{item.label}</span>
              <span style={{ fontSize: '12px', color: '#F0F4FF', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', maxWidth: '160px' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === CARD 4: Acciones === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { label: 'Agregar Certificación', color: '#9b6ab5', bg: 'rgba(91,34,119,0.12)', border: 'rgba(91,34,119,0.35)', icon: Plus },
          { label: 'Exportar Perfil', color: '#729362', bg: 'rgba(114,147,98,0.1)', border: 'rgba(114,147,98,0.3)', icon: Download },
          { label: 'Enviar Alerta', color: '#FFB800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.25)', icon: Bell },
        ].map(action => (
          <button key={action.label}
            style={{ width: '100%', padding: '10px 16px', backgroundColor: action.bg, border: `1px solid ${action.border}`, borderRadius: '8px', color: action.color, fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <action.icon style={{ width: '16px', height: '16px' }} />
              {action.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}

// History Activity Item
function HistoryItem({ activity, index }: { activity: typeof mockHistoryActivities[0]; index: number }) {
  const icons = {
    certificacion: CheckCircle,
    malla: BookOpen,
    alerta: AlertTriangle,
    curso: Award,
  };
  const Icon = icons[activity.tipo as keyof typeof icons] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{ display: 'flex', gap: '16px', position: 'relative' }}
    >
      {/* Timeline line */}
      {index < mockHistoryActivities.length - 1 && (
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '32px',
            width: '2px',
            height: 'calc(100% + 8px)',
            backgroundColor: 'rgba(91,34,119,0.2)',
          }}
        />
      )}
      {/* Dot */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: `${activity.color}20`,
          border: `2px solid ${activity.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <Icon style={{ width: '14px', height: '14px', color: activity.color }} />
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingBottom: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4FF', marginBottom: '2px' }}>{activity.titulo}</p>
        <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '4px' }}>{activity.descripcion}</p>
        <p style={{ fontSize: '11px', color: '#4A5568' }}>{getRelativeTime(activity.fecha)}</p>
      </div>
    </motion.div>
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
        <p className="text-[#F0F4FF] text-lg">Trabajador no encontrado</p>
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
      color: '#7c4dab',
      count: worker.certifications.length,
      alertCount: expiredCertCount,
    },
    {
      id: 'mallas' as TabType,
      label: 'Mallas',
      icon: BookOpen,
      color: '#8a9e52',
      count: workerMeshes.length,
      alertCount: 0,
    },
    {
      id: 'historial' as TabType,
      label: 'Historial',
      icon: Clock,
      color: '#FFB800',
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
      >
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/workers')}>
          Volver
        </Button>
      </motion.div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column - Worker Side Panel (ALWAYS VISIBLE) */}
        <WorkerSidePanel worker={worker} />
        
        {/* Right Column - Tabs + Dynamic Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tabs navigation */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(26,16,64,0.7)', borderRadius: '10px', padding: '4px', gap: '2px', border: '1px solid rgba(91,34,119,0.2)', width: 'fit-content' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(91,34,119,0.35)' : 'transparent',
                    color: isActive ? '#c49fe0' : '#6B7280',
                    fontSize: '13px', fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif',
                    boxShadow: isActive ? '0 1px 6px rgba(91,34,119,0.3)' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#a89fc4'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6B7280'; }}
                >
                  <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: isActive ? 'rgba(91,34,119,0.4)' : 'rgba(91,34,119,0.15)', color: isActive ? '#c49fe0' : '#6B7280', borderRadius: '20px', padding: '0 6px', minWidth: '18px', textAlign: 'center', fontFamily: '"JetBrains Mono"' }}>
                      {tab.count}
                    </span>
                  )}
                  {tab.alertCount > 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(255,61,87,0.2)', color: '#FF5C71', borderRadius: '20px', padding: '0 5px', border: '1px solid rgba(255,61,87,0.3)' }}>
                      {tab.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

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
  const complianceColor = compliance >= 80 ? '#8a9e52' : compliance >= 60 ? '#FFB800' : '#FF3D57';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Fila superior: 3 módulos de estado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {[
          { label: 'Vigentes', value: vigentes, total, color: '#729362', pct: total > 0 ? Math.round((vigentes/total)*100) : 0 },
          { label: 'Por Vencer', value: proximas, total, color: '#FFB800', pct: total > 0 ? Math.round((proximas/total)*100) : 0 },
          { label: 'Vencidas', value: vencidas, total, color: '#FF3D57', pct: total > 0 ? Math.round((vencidas/total)*100) : 0 },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'rgba(26,16,64,0.85)', border: `1px solid ${stat.color}25`, borderRadius: '10px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }} />
            <p style={{ fontFamily: '"Barlow Condensed"', fontSize: '36px', fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: '2px' }}>{stat.value}</p>
            <p style={{ fontSize: '11px', color: '#6B7280' }}>{stat.label}</p>
            <p style={{ fontSize: '10px', color: stat.color, marginTop: '6px', fontFamily: '"JetBrains Mono"' }}>{stat.pct}% del total</p>
          </div>
        ))}
      </div>

      {/* Fila: Score visual + Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        
        {/* Overall Score */}
        <div style={{ backgroundColor: 'rgba(26,16,64,0.85)', border: '1px solid rgba(91,34,119,0.2)', borderRadius: '10px', padding: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#8892A4', marginBottom: '16px' }}>Score Global</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* SVG ring */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(91,34,119,0.15)" strokeWidth="7" />
                <motion.circle cx="40" cy="40" r="34" fill="none" stroke={complianceColor} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - compliance / 100) }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Barlow Condensed"', fontSize: '20px', fontWeight: 700, color: complianceColor }}>{compliance}</span>
              </div>
            </div>
            <div>
              {compliance >= 80 && <p style={{ fontSize: '12px', color: '#8a9e52', fontWeight: 600, marginBottom: '4px' }}>✓ Cumplimiento OK</p>}
              {compliance < 80 && compliance >= 60 && <p style={{ fontSize: '12px', color: '#FFB800', fontWeight: 600, marginBottom: '4px' }}>⚠ Requiere atención</p>}
              {compliance < 60 && <p style={{ fontSize: '12px', color: '#FF3D57', fontWeight: 600, marginBottom: '4px' }}>✕ Acción urgente</p>}
              <p style={{ fontSize: '11px', color: '#6B7280' }}>{total} certificaciones en total</p>
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{pendientes} pendientes</p>
            </div>
          </div>
        </div>

        {/* Timeline mini */}
        <MiniComplianceTimeline certifications={worker.certifications} />
      </div>

      {/* Lista de certificaciones */}
      <div style={{ backgroundColor: 'rgba(26,16,64,0.85)', border: '1px solid rgba(91,34,119,0.2)', borderRadius: '10px', padding: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4FF', marginBottom: '12px' }}>
          Certificaciones <span style={{ color: '#6B7280', fontWeight: 400, fontSize: '12px' }}>({total})</span>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {worker.certifications.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>

    </div>
  );
}

// Mallas Tab Component
function MallasTab({ worker, workerMeshes }: { worker: WorkerType; workerMeshes: typeof mockMeshes }) {
  return (
    <div className="worker-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(0, 3fr)', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="glass" padding="lg" style={{ borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed"', fontSize: '16px', fontWeight: 700, color: '#F0F4FF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Información
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Fecha ingreso', value: new Date(worker.fechaIngreso).toLocaleDateString('es-CL') },
              { label: 'Departamento', value: worker.departamento },
              { label: 'Email', value: worker.email },
              { label: 'Empresa', value: worker.empresa },
            ].map(item => (
              <div key={item.label} style={{ borderBottom: '1px solid rgba(91,34,119,0.1)', paddingBottom: '10px' }}>
                <p style={{ fontSize: '10px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card variant="glass" padding="lg" style={{ borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed"', fontSize: '16px', fontWeight: 700, color: '#F0F4FF', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Competencias
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Operación Maquinaria', 'Seguridad Industrial', 'Trabajo en Equipo', 'Liderazgo'].map(tag => (
              <span key={tag} style={{ padding: '4px 10px', backgroundColor: 'rgba(91,34,119,0.12)', color: '#c49fe0', fontSize: '11px', borderRadius: '20px', border: '1px solid rgba(91,34,119,0.25)', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </div>
      <div>
        <h2 style={{ fontFamily: '"Barlow Condensed"', fontSize: '18px', fontWeight: 700, color: '#F0F4FF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Mallas Asignadas</span>
          <span style={{ fontSize: '12px', color: '#8892A4', fontWeight: 400, fontFamily: 'DM Sans' }}>({workerMeshes.length} mallas)</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {workerMeshes.map((mesh) => (
            <MeshCompactCard key={mesh.id} mesh={mesh} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Historial Tab Component
function HistorialTab() {
  return (
    <Card variant="glass" padding="lg" style={{ borderRadius: 'var(--radius-lg)', maxWidth: '800px' }}>
      <h3 style={{ fontFamily: '"Barlow Condensed"', fontSize: '18px', fontWeight: 700, color: '#F0F4FF', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Historial de Actividad
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {mockHistoryActivities.map((activity, index) => (
          <HistoryItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </Card>
  );
}

