import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useWorkerStore } from '../store/useWorkerStore';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { CertCard } from '../components/certifications/CertCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockMeshes } from '../data/mockData';
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

const tabs = [
  { id: 'certificaciones' as TabType, label: 'Certificaciones', icon: Award, color: '#00E5FF' },
  { id: 'mallas' as TabType, label: 'Mallas', icon: BookOpen, color: '#AAFF00' },
  { id: 'historial' as TabType, label: 'Historial', icon: Clock, color: '#FFB800' },
];

// Mock history activities
const mockHistoryActivities = [
  { id: 'h1', tipo: 'certificacion', titulo: 'Certificación renovada', descripcion: 'Certificación de Altura aprobada', fecha: '2024-05-15T10:30:00', color: '#00E676' },
  { id: 'h2', tipo: 'malla', titulo: 'Malla completada', descripcion: 'Malla de Seguridad Industrial 100% completada', fecha: '2024-05-10T14:20:00', color: '#AAFF00' },
  { id: 'h3', tipo: 'alerta', titulo: 'Alerta de vencimiento', descripcion: 'Próximo vencimiento: Equipos Pesados', fecha: '2024-05-08T09:15:00', color: '#FFB800' },
  { id: 'h4', tipo: 'curso', titulo: 'Curso iniciado', descripcion: 'Inició curso de Liderazgo en Terreno', fecha: '2024-05-05T11:00:00', color: '#00E5FF' },
  { id: 'h5', tipo: 'certificacion', titulo: 'Nueva certificación', descripcion: 'Certificación de Primeros Auxilios obtenida', fecha: '2024-05-01T16:45:00', color: '#00E676' },
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

// Mini Compliance Timeline Component
function MiniComplianceTimeline({ certifications }: { certifications: WorkerType['certifications'] }) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();

  // Calculate certs expiring per month
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
        color: hasExpired ? '#FF3D57' : hasExpiring ? '#FFB800' : hasValid ? '#00E676' : '#1C2333',
        count: certsInMonth.length,
      };
    });
  }, [certifications]);

  return (
    <Card variant="glass" style={{ padding: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <Clock style={{ width: '16px', height: '16px', color: '#00E5FF' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4FF' }}>Timeline de Vencimientos {new Date().getFullYear()}</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', height: '32px' }}>
        {monthData.map((data, index) => (
          <motion.div
            key={index}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{
              flex: 1,
              backgroundColor: data.color,
              borderRadius: '4px',
              opacity: index === currentMonth ? 1 : 0.7,
              position: 'relative',
              transformOrigin: 'bottom',
            }}
          >
            {data.count > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#0A0E1A',
                }}
              >
                {data.count}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
        {months.map((month, index) => (
          <div key={index} style={{ flex: 1, textAlign: 'center' }}>
            <span
              style={{
                fontSize: '9px',
                color: index === currentMonth ? '#00E5FF' : '#4A5568',
                fontWeight: index === currentMonth ? 700 : 400,
              }}
            >
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
            backgroundColor: 'rgba(170,255,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookOpen style={{ width: '20px', height: '20px', color: '#AAFF00' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4FF', marginBottom: '4px' }}>{mesh.nombre}</h4>
          <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '8px' }}>{mesh.cursos.length} cursos</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '6px', backgroundColor: '#1C2333', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mesh.completionRate}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', backgroundColor: mesh.completionRate >= 80 ? '#00E676' : mesh.completionRate >= 50 ? '#FFB800' : '#FF3D57', borderRadius: '3px' }}
              />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: mesh.completionRate >= 80 ? '#00E676' : mesh.completionRate >= 50 ? '#FFB800' : '#FF3D57' }}>
              {mesh.completionRate}%
            </span>
          </div>
        </div>
      </div>
    </Card>
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
            backgroundColor: 'rgba(0,229,255,0.1)',
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

      {/* Profile Header */}
      <ProfileHeader worker={worker} />

      {/* Tabs: Certificaciones / Mallas / Historial */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              maxWidth: '200px',
              padding: '12px 24px',
              backgroundColor: activeTab === tab.id ? `${tab.color}15` : 'transparent',
              border: `1px solid ${activeTab === tab.id ? tab.color : 'rgba(0,229,255,0.15)'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = `${tab.color}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)';
              }
            }}
          >
            <tab.icon style={{ width: '16px', height: '16px', color: activeTab === tab.id ? tab.color : '#8892A4' }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: activeTab === tab.id ? tab.color : '#8892A4',
                fontFamily: '"Barlow Condensed", sans-serif',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
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
  );
}

// Certificaciones Tab Component
function CertificacionesTab({ worker }: { worker: WorkerType }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="glass" padding="lg" style={{ borderRadius: '6px' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed"', fontSize: '16px', fontWeight: 700, color: '#F0F4FF', marginBottom: '16px', textTransform: 'uppercase' }}>
            Resumen
          </h3>
          {[
            { label: 'Vigentes', value: worker.certifications.filter((c: { estado: string }) => c.estado === 'vigente').length, color: '#00E676' },
            { label: 'Vencidas', value: worker.certifications.filter((c: { estado: string }) => c.estado === 'vencido').length, color: '#FF3D57' },
            { label: 'Próx. vencer', value: worker.certifications.filter((c: { estado: string }) => c.estado === 'proximo_vencer').length, color: '#FFB800' },
            { label: 'Pendientes', value: worker.certifications.filter((c: { estado: string }) => c.estado === 'pendiente').length, color: '#4A5568' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
              <span style={{ fontSize: '13px', color: '#8892A4' }}>{item.label}</span>
              <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Barlow Condensed"', color: item.color }}>{item.value}</span>
            </div>
          ))}
        </Card>
        <MiniComplianceTimeline certifications={worker.certifications} />
      </div>
      <Card variant="glass" padding="lg" style={{ borderRadius: '6px' }}>
        <h3 style={{ fontFamily: '"Barlow Condensed"', fontSize: '16px', fontWeight: 700, color: '#F0F4FF', marginBottom: '16px', textTransform: 'uppercase' }}>
          Certificaciones
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
          {worker.certifications.map(cert => (
            <CertCard key={cert.id} cert={cert} index={0} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// Mallas Tab Component
function MallasTab({ worker, workerMeshes }: { worker: WorkerType; workerMeshes: typeof mockMeshes }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="glass" padding="lg" style={{ borderRadius: '6px' }}>
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
              <div key={item.label} style={{ borderBottom: '1px solid rgba(0,229,255,0.06)', paddingBottom: '10px' }}>
                <p style={{ fontSize: '10px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card variant="glass" padding="lg" style={{ borderRadius: '6px' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed"', fontSize: '16px', fontWeight: 700, color: '#F0F4FF', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Competencias
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Operación Maquinaria', 'Seguridad Industrial', 'Trabajo en Equipo', 'Liderazgo'].map(tag => (
              <span key={tag} style={{ padding: '4px 10px', backgroundColor: 'rgba(0,229,255,0.1)', color: '#00E5FF', fontSize: '11px', borderRadius: '20px', border: '1px solid rgba(0,229,255,0.2)', fontWeight: 500 }}>
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
    <Card variant="glass" padding="lg" style={{ borderRadius: '16px', maxWidth: '800px' }}>
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

