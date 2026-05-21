import { motion } from 'framer-motion';
import { Users, Award, AlertTriangle, BookOpen } from 'lucide-react';
import { mockStats, mockWorkers, mockAlerts } from '../data/mockData';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ComplianceGauge } from '../components/dashboard/ComplianceGauge';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { CertTrendChart } from '../components/dashboard/CertTrendChart';
import { ComplianceBarChart } from '../components/dashboard/ComplianceBarChart';
import { StatusDonutChart } from '../components/dashboard/StatusDonutChart';
import { TopUrgentWorkers } from '../components/dashboard/TopUrgentWorkers';
import { Card } from '../components/ui/Card';

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

export function Dashboard() {
  const avgCompliance = Math.round(
    mockWorkers.reduce((acc, w) => acc + w.complianceScore, 0) / mockWorkers.length
  );
  const criticalAlerts = mockAlerts?.filter(a => (a.diasRestantes ?? 0) < 0).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
      >
        <div>
          <h1 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '32px', fontWeight: 700, color: '#F0F4FF', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Panel Operacional ⚡
          </h1>
          <p style={{ color: '#8892A4', fontSize: '14px' }}>
            Corpa Andina Minera S.A. · Turno día activo · {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {/* Mini status pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)', borderRadius: '20px', padding: '6px 14px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00E676', boxShadow: '0 0 6px rgba(0,230,118,0.8)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#00E676' }}>Sistema Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.25)', borderRadius: '20px', padding: '6px 14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFB800' }}>⚠ {criticalAlerts} alertas críticas</span>
          </div>
        </div>
      </motion.div>
      {/* Stats Row - 4 KPI Cards */}
      <motion.div
        custom={0.1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          value={mockStats.totalWorkers}
          subtitle="Total Trabajadores"
          trend={{ direction: 'up', value: '+3 este mes' }}
          icon={Users}
          color="electric"
          delay={0}
        />
        <StatsCard
          value={mockStats.certVigentes}
          subtitle="Certificaciones Vigentes"
          trend={{ direction: 'up', value: '87% del total' }}
          icon={Award}
          color="success"
          delay={0.1}
        />
        <StatsCard
          value={mockStats.certProximas}
          subtitle="Próximas a Vencer"
          trend={{ direction: 'up', value: '+5 esta semana' }}
          icon={AlertTriangle}
          color="warning"
          delay={0.2}
        />
        <StatsCard
          value={`${avgCompliance}%`}
          subtitle="Compliance General"
          trend={{ direction: 'down', value: '-2% vs mes ant.' }}
          icon={BookOpen}
          color="volt"
          delay={0.3}
        />
      </motion.div>

      {/* FILA 2: Layout asimétrico — 2/3 izquierda + 1/3 derecha */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}
      >
        {/* Columna izquierda: "Cumplimiento por Área" */}
        <Card variant="glass" style={{ borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF' }}>
              Cumplimiento por Área
            </h3>
            <span style={{ fontSize: '12px', color: '#8892A4' }}>{new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</span>
          </div>
          <ComplianceBarChart />
        </Card>

        {/* Columna derecha: Gauge de compliance global */}
        <Card variant="glass" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF', marginBottom: '16px', textAlign: 'center' }}>
            Compliance Global
          </h3>
          <ComplianceGauge score={avgCompliance} />
          <div style={{ marginTop: '16px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#8892A4' }}>Meta mensual</span>
              <span style={{ fontSize: '12px', color: '#00E5FF', fontWeight: 600 }}>85%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#1C2333', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${avgCompliance}%`, backgroundColor: avgCompliance >= 85 ? '#00E676' : '#FFB800', borderRadius: '2px', transition: 'width 1s ease' }} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* FILA 3: Layout asimétrico — 1/2 + 1/2 */}
      <motion.div
        custom={0.3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* Tendencia Anual */}
        <Card variant="glass" style={{ borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF', marginBottom: '16px' }}>
            Tendencia de Certificaciones
          </h3>
          <CertTrendChart />
        </Card>
        {/* Distribución de estados */}
        <Card variant="glass" style={{ borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF', marginBottom: '16px' }}>
            Distribución de Estados
          </h3>
          <StatusDonutChart />
        </Card>
      </motion.div>

      {/* FILA 4: 3 columnas — Alertas | Actividad | Trabajadores críticos */}
      <motion.div
        custom={0.5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}
      >
        {/* Panel 1: Alertas */}
        <AlertsPanel />

        {/* Panel 2: Actividad Reciente */}
        <ActivityFeed />

        {/* Panel 3: Top Trabajadores con mayor urgencia */}
        <TopUrgentWorkers />
      </motion.div>
    </div>
  );
}

export default Dashboard;
