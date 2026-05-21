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
import { CompanyComparisonChart } from '../components/dashboard/CompanyComparisonChart';
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

      {/* Charts Row 1: Gauge + BarChart */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Compliance Gauge */}
        <Card variant="glass" padding="lg" className="flex flex-col">
          <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-2 text-center">
            Cumplimiento Global
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <ComplianceGauge score={avgCompliance} />
          </div>
        </Card>

        {/* BarChart - Compliance by Area */}
        <Card variant="glass" padding="lg" className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
            Cumplimiento por Área
          </h3>
          <ComplianceBarChart />
        </Card>
      </motion.div>

      {/* Charts Row 2: AreaChart + Donut */}
      <motion.div
        custom={0.3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* AreaChart - Trend */}
        <Card variant="glass" padding="lg">
          <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
            Tendencia Anual
          </h3>
          <CertTrendChart />
        </Card>

        {/* DonutChart - Status Distribution */}
        <Card variant="glass" padding="lg">
          <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
            Distribución de Estados
          </h3>
          <StatusDonutChart />
        </Card>
      </motion.div>

      {/* Charts Row 3: LineChart (Company Comparison) */}
      <motion.div
        custom={0.4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card variant="glass" padding="lg">
          <h3 className="font-display text-lg font-semibold text-[#F0F4FF] mb-4">
            Comparativa por Empresa (6 meses)
          </h3>
          <CompanyComparisonChart />
        </Card>
      </motion.div>

      {/* Bottom Row: Alerts + Activity */}
      <motion.div
        custom={0.5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AlertsPanel />
        <ActivityFeed />
      </motion.div>
    </div>
  );
}

export default Dashboard;
