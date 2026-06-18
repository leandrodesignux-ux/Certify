import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import { mockStats, mockWorkers, mockAlerts } from '../data/mockData';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ComplianceGauge } from '../components/dashboard/ComplianceGauge';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { CertTrendChart } from '../components/dashboard/CertTrendChart';
import { ComplianceBarChart } from '../components/dashboard/ComplianceBarChart';
import { StatusDonutChart } from '../components/dashboard/StatusDonutChart';
import { TopUrgentWorkers } from '../components/dashboard/TopUrgentWorkers';
import { AreaComplianceCards } from '../components/dashboard/AreaComplianceCards';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Title */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-1 flex items-center gap-2" style={{ color: '#171717', letterSpacing: '-0.02em' }}>
            Panel Operacional <Zap style={{ width: '16px', height: '16px', color: '#a8a8a8' }} strokeWidth={1.5} />
          </h1>
          <p style={{ color: '#666666', fontSize: '14px' }}>
            Corpa Andina Minera S.A. · Turno día activo · {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {/* Mini status pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(41,122,58,0.08)', border: '1px solid rgba(41,122,58,0.2)', borderRadius: '9999px', padding: '4px 12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#297a3a' }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#297a3a' }}>Sistema Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(178,80,0,0.08)', border: '1px solid rgba(178,80,0,0.2)', borderRadius: '9999px', padding: '4px 12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#b25000' }}>{criticalAlerts} alertas críticas</span>
          </div>
        </div>
      </motion.div>
      {/* Stats Row - 4 KPI Cards */}
      <motion.div
        custom={0.1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '16px' }}
      >
        {isLoading ? (
          <>
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
          </>
        ) : (
          <>
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
          </>
        )}
      </motion.div>

      {/* FILA: Mini cards de compliance por área */}
      <motion.div custom={0.15} variants={sectionVariants} initial="hidden" animate="visible">
        <AreaComplianceCards />
      </motion.div>

      {/* FILA 2: Layout asimétrico — 2/3 izquierda + 1/3 derecha */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5" style={{ alignItems: 'start' }}
      >
        {/* Columna izquierda: "Cumplimiento por Área" */}
        <Card variant="glass" style={{ borderRadius: '6px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Cumplimiento por Área
            </h3>
            <span style={{ fontSize: '12px', color: '#a8a8a8' }}>{new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</span>
          </div>
          <ComplianceBarChart />
        </Card>

        {/* Columna derecha: Gauge de compliance global */}
        <Card variant="glass" style={{ borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', letterSpacing: '-0.01em', marginBottom: '16px', textAlign: 'center' }}>
            Compliance Global
          </h3>
          <ComplianceGauge score={avgCompliance} />
          <div style={{ marginTop: '16px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#666666' }}>Meta mensual</span>
              <span style={{ fontSize: '12px', color: '#171717', fontWeight: 500 }}>85%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${avgCompliance}%`, backgroundColor: avgCompliance >= 85 ? '#297a3a' : '#b25000', borderRadius: '2px', transition: 'width 1s ease' }} />
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
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Tendencia Anual */}
        <Card variant="glass" style={{ borderRadius: '6px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', letterSpacing: '-0.01em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Tendencia de Certificaciones
          </h3>
          <CertTrendChart />
        </Card>
        {/* Distribución de estados */}
        <Card variant="glass" style={{ borderRadius: '6px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', letterSpacing: '-0.01em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" style={{ alignItems: 'start' }}
      >
        {/* Panel 1: Alertas */}
        <AlertsPanel />

        {/* Panel 2: Actividad Reciente */}
        <ActivityFeed />

        {/* Panel 3: Top Trabajadores con mayor urgencia */}
        <TopUrgentWorkers />
      </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
