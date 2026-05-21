import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useWorkerStore } from '../store/useWorkerStore';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { CertCard } from '../components/certifications/CertCard';
import { CertTimeline } from '../components/certifications/CertTimeline';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockMeshes } from '../data/mockData';
import { formatDate } from '../utils/dates';
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

// Mock courses for the worker
const mockCourses = [
  { id: 'c1', nombre: 'Seguridad Industrial Básica', progreso: 100, estado: 'completado' },
  { id: 'c2', nombre: 'Operación de Equipos Pesados', progreso: 75, estado: 'en_progreso' },
  { id: 'c3', nombre: 'Liderazgo en Terreno', progreso: 45, estado: 'en_progreso' },
  { id: 'c4', nombre: 'Primeros Auxilios', progreso: 0, estado: 'pendiente' },
];

export function WorkerDetail() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { workers } = useWorkerStore();
  const [activeTab, setActiveTab] = useState<'mallas' | 'cursos'>('mallas');

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

      {/* Tabs: MALLAS / CURSOS */}
      <div style={{ display: 'flex', gap: '0px', borderBottom: '2px solid rgba(0,229,255,0.1)', marginBottom: '24px' }}>
        {(['mallas', 'cursos'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '14px 40px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #00E5FF' : '2px solid transparent',
              marginBottom: '-2px',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: activeTab === tab ? '#00E5FF' : '#8892A4',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {tab === 'mallas' ? 'MALLAS' : 'CURSOS'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {activeTab === 'mallas' ? (
          <MallasTab worker={worker} workerMeshes={workerMeshes} />
        ) : (
          <CursosTab worker={worker} />
        )}
      </motion.div>
    </div>
  );
}

const MINING_IMAGES = [
  'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=200&fit=crop',
];

function MeshCourseCard({ course, index }: { course: typeof mockCourses[number]; index: number }) {
  const stateColor = course.estado === 'completado' ? '#00E676' : course.estado === 'en_progreso' ? '#00E5FF' : '#4A5568';
  const stateLabel = course.estado === 'completado' ? 'Completado' : course.estado === 'en_progreso' ? 'En progreso' : 'Pendiente';
  return (
    <div style={{
      backgroundColor: '#111827',
      border: '1px solid rgba(0,229,255,0.1)',
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.1)'; }}
    >
      <div style={{ height: '100px', overflow: 'hidden', position: 'relative', backgroundColor: '#1C2333' }}>
        <img src={MINING_IMAGES[index % MINING_IMAGES.length]} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        <span style={{
          position: 'absolute', top: '8px', right: '8px',
          padding: '2px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 700,
          backgroundColor: `${stateColor}25`, color: stateColor, border: `1px solid ${stateColor}40`,
        }}>{stateLabel}</span>
      </div>
      <div style={{ padding: '12px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#F0F4FF', marginBottom: '10px', lineHeight: 1.3, minHeight: '34px' }}>
          {course.nombre}
        </p>
        <ProgressBar value={course.progreso} showLabel={false} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', color: '#4A5568' }}>Avance</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: stateColor }}>{course.progreso}%</span>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {['Evaluación', 'Fecha prueba', 'Vigencia certificado', 'Aprobación'].map(meta => (
            <div key={meta} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '9px', color: '#4A5568' }}>{meta}</span>
              <span style={{ fontSize: '9px', color: '#8892A4' }}>—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MallasTab({ worker, workerMeshes }: { worker: WorkerType; workerMeshes: typeof mockMeshes }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card variant="glass" padding="lg" style={{ borderRadius: '16px' }}>
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
        <Card variant="glass" padding="lg" style={{ borderRadius: '16px' }}>
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
          <span>Malla y estado de cursos</span>
          <span style={{ fontSize: '12px', color: '#8892A4', fontWeight: 400, fontFamily: 'DM Sans' }}>({workerMeshes.length} mallas asignadas)</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {mockCourses.map((course, i) => (
            <MeshCourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CursosTab({ worker }: { worker: WorkerType }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
      <Card variant="glass" padding="lg" style={{ borderRadius: '16px' }}>
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
      <Card variant="glass" padding="lg" style={{ borderRadius: '16px' }}>
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

