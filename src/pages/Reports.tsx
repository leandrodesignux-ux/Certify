import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Image as ImageIcon,
  TrendingUp,
  Award,
  AlertTriangle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Label,
} from 'recharts';
import { Card } from '../components/ui/Card';
import { useWorkerStore } from '../store/useWorkerStore';
import { useCertStore } from '../store/useCertStore';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../components/reports/KPICard';
import { CustomBarTooltip, CustomPieTooltip } from '../components/reports/ChartTooltips';

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

export function Reports() {
  const navigate = useNavigate();
  const { workers } = useWorkerStore();
  const { certifications } = useCertStore();
  const [showAllRisk, setShowAllRisk] = useState(false);
  const [activeReport, setActiveReport] = useState<'general' | 'cumplimiento' | 'riesgo' | 'exportar'>('general');

  const reportTabs = [
    { id: 'general',      label: 'Resumen General' },
    { id: 'cumplimiento', label: 'Cumplimiento' },
    { id: 'riesgo',       label: 'Trabajadores Riesgo' },
    { id: 'exportar',     label: 'Exportar' },
  ] as const;

  // SECTION 1: KPI Calculations
  const kpis = useMemo(() => {
    // Índice de Cumplimiento Global
    const avgCompliance = workers.length > 0
      ? Math.round(workers.reduce((sum, w) => sum + w.complianceScore, 0) / workers.length)
      : 0;

    // Certificaciones Activas (vigentes)
    const activeCerts = certifications.filter(c => c.estado === 'vigente').length;

    // Vencimientos próximos 30 días
    const expiringSoon = certifications.filter(
      c => c.diasRestantes > 0 && c.diasRestantes <= 30
    ).length;

    // Trabajadores en riesgo (al menos 1 cert vencido)
    const workersAtRisk = workers.filter(w =>
      w.certifications.some(c => c.estado === 'vencido')
    ).length;

    return {
      avgCompliance,
      activeCerts,
      expiringSoon,
      workersAtRisk,
    };
  }, [workers, certifications]);

  // SECTION 2: Compliance por Área (Bar Chart Data)
  const complianceByArea = useMemo(() => {
    const areas = Array.from(new Set(workers.map(w => w.area)));
    return areas.map(area => {
      const areaWorkers = workers.filter(w => w.area === area);
      const avgScore = areaWorkers.length > 0
        ? Math.round(areaWorkers.reduce((sum, w) => sum + w.complianceScore, 0) / areaWorkers.length)
        : 0;
      
      // Color coding
      let color = '#e5484d';
      if (avgScore > 80) color = '#297a3a';
      else if (avgScore > 60) color = '#b25000';

      return {
        area,
        score: avgScore,
        fill: color,
      };
    }).sort((a, b) => b.score - a.score);
  }, [workers]);

  // SECTION 3: Estado de Certificaciones (Donut Chart Data)
  const certStatusData = useMemo(() => {
    const vigentes = certifications.filter(c => c.estado === 'vigente').length;
    const proximas = certifications.filter(c => c.estado === 'proximo_vencer').length;
    const vencidas = certifications.filter(c => c.estado === 'vencido').length;
    const pendientes = certifications.filter(c => c.estado === 'pendiente').length;
    const total = certifications.length || 1;

    return [
      { name: 'Vigentes', value: vigentes, color: '#297a3a', percentage: ((vigentes / total) * 100).toFixed(1) },
      { name: 'Próx. vencer', value: proximas, color: '#b25000', percentage: ((proximas / total) * 100).toFixed(1) },
      { name: 'Vencidas', value: vencidas, color: '#e5484d', percentage: ((vencidas / total) * 100).toFixed(1) },
      { name: 'Pendientes', value: pendientes, color: '#a8a8a8', percentage: ((pendientes / total) * 100).toFixed(1) },
    ];
  }, [certifications]);

  // SECTION 4: Top 10 Trabajadores en Riesgo
  const topRiskWorkers = useMemo(() => {
    return [...workers]
      .sort((a, b) => a.complianceScore - b.complianceScore)
      .slice(0, 10)
      .map(worker => {
        const expiredCount = worker.certifications.filter(c => c.estado === 'vencido').length;
        const expiringCount = worker.certifications.filter(c => c.estado === 'proximo_vencer').length;
        
        let scoreColor = '#e5484d';
        if (worker.complianceScore >= 80) scoreColor = '#297a3a';
        else if (worker.complianceScore >= 60) scoreColor = '#b25000';

        return {
          ...worker,
          expiredCount,
          expiringCount,
          scoreColor,
        };
      });
  }, [workers]);

  // SECTION 5: Export Functions
  const exportSummaryCSV = () => {
    const headers = ['ID', 'Nombre', 'Apellidos', 'Area', 'Compliance Score', 'Certs Vigentes', 'Certs Vencidas', 'Certs Proximas'];
    const rows = workers.map(w => {
      const vigentes = w.certifications.filter(c => c.estado === 'vigente').length;
      const vencidas = w.certifications.filter(c => c.estado === 'vencido').length;
      const proximas = w.certifications.filter(c => c.estado === 'proximo_vencer').length;
      return [
        w.id,
        w.nombre,
        w.apellidos,
        w.area,
        w.complianceScore,
        vigentes,
        vencidas,
        proximas,
      ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_resumen_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSENCE = () => {
    const content = `REPORTE SENCE - SISTEMA CERTIFYX
================================
Fecha: ${new Date().toLocaleDateString('es-CL')}
Empresa: Corpa Andina Minera S.A.

RESUMEN DE CAPACITACIÓN:
- Total trabajadores: ${workers.length}
- Total certificaciones: ${certifications.length}
- Certificaciones vigentes: ${kpis.activeCerts}
- Vencimientos próximos 30 días: ${kpis.expiringSoon}

CUMPLIMIENTO POR ÁREA:
${complianceByArea.map(a => `- ${a.area}: ${a.score}%`).join('\n')}

TRABAJADORES EN RIESGO: ${kpis.workersAtRisk}

Generado automáticamente por CertifyX
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_sence_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#297a3a';
    if (score >= 60) return '#b25000';
    return '#e5484d';
  };

  const getComplianceLabel = (score: number) => {
    if (score >= 80) return 'Óptimo';
    if (score >= 60) return 'Regular';
    return 'Crítico';
  };

  return (
    <div className="space-y-8" role="main" aria-label="Vista de reportes">
      {/* Header */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex flex-col gap-4">
          {/* Top row: título + acciones */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight" style={{ color: '#171717', letterSpacing: '-0.02em' }}>
                Reportes y Análisis
              </h1>
              <p style={{ fontSize: '13px', color: '#666666', marginTop: '4px' }}>
                Compliance y exportación · Período:{' '}
                <span style={{ color: '#171717', fontWeight: 500 }}>
                  {new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                </span>
              </p>
            </div>
            <div className="flex items-center flex-shrink-0" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={exportSummaryCSV}
                aria-label="Exportar resumen como CSV"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ebebeb',
                  borderRadius: '6px',
                  color: '#171717',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  minHeight: '38px',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                CSV
              </button>
              <button
                onClick={exportSENCE}
                aria-label="Exportar reporte SENCE"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: '#171717',
                  border: '1px solid #171717',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  minHeight: '38px',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2e2e2e'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#171717'; }}
              >
                <FileText className="w-4 h-4" strokeWidth={1.5} />
                SENCE
              </button>
            </div>
          </div>

          {/* Bottom row: tabs de tipo de reporte */}
          <div
            role="tablist"
            aria-label="Tipo de reporte"
            className="[&::-webkit-scrollbar]:hidden"
            style={{
              display: 'flex',
              gap: '0',
              borderBottom: '1px solid #ebebeb',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              maxWidth: '100%',
              marginTop: '16px',
            }}
          >
            {reportTabs.map((tab) => {
              const isActive = activeReport === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  aria-label={tab.label}
                  onClick={() => { setActiveReport(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    padding: '10px 18px',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #171717' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: isActive ? '#171717' : '#4d4d4d',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#171717'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#4d4d4d'; }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Context Banner */}
      <motion.div custom={0.08} variants={sectionVariants} initial="hidden" animate="visible">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          backgroundColor: '#fafafa',
          border: '1px solid #ebebeb',
          borderRadius: '6px',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {/* Período activo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#297a3a' }} />
            <span style={{ fontSize: '13px', color: '#666666' }}>
              Período activo:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#171717' }}>
              {new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Stats rápidos inline */}
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            {[
              { label: 'Trabajadores', value: workers.length },
              { label: 'Certificaciones totales', value: certifications.length },
              { label: 'Áreas monitoreadas', value: new Set(workers.map(w => w.area)).size },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#a8a8a8' }}>{stat.label}:</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#171717' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: KPIs */}
      <motion.div custom={0.1} variants={sectionVariants} initial="hidden" animate="visible">
        <div
          className="grid gap-4 grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Indicadores clave de cumplimiento"
        >
          <KPICard
            title="Índice de Cumplimiento Global"
            value={`${kpis.avgCompliance}%`}
            subtitle={`de ${workers.length} trabajadores`}
            trendLabel={getComplianceLabel(kpis.avgCompliance)}
            trend={kpis.avgCompliance >= 80 ? 'up' : kpis.avgCompliance >= 60 ? 'neutral' : 'down'}
            icon={TrendingUp}
            color={getScoreColor(kpis.avgCompliance)}
            delay={0.1}
          />
          <KPICard
            title="Certificaciones Activas"
            value={kpis.activeCerts}
            subtitle={`de ${certifications.length} totales`}
            trendLabel={`${Math.round((kpis.activeCerts / (certifications.length || 1)) * 100)}% del total`}
            trend="up"
            icon={Award}
            color="#297a3a"
            delay={0.15}
          />
          <KPICard
            title="Vencimientos en 30 días"
            value={kpis.expiringSoon}
            subtitle="Requieren atención"
            trendLabel={kpis.expiringSoon > 5 ? 'Nivel alto' : 'Nivel normal'}
            trend={kpis.expiringSoon > 5 ? 'down' : 'neutral'}
            icon={Clock}
            color="#b25000"
            delay={0.2}
          />
          <KPICard
            title="Trabajadores en Riesgo"
            value={kpis.workersAtRisk}
            subtitle={`de ${workers.length} totales`}
            trendLabel={kpis.workersAtRisk > 3 ? 'Crítico' : 'Controlado'}
            trend={kpis.workersAtRisk > 3 ? 'down' : 'neutral'}
            icon={AlertTriangle}
            color="#e5484d"
            delay={0.25}
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
      {/* SECTION 2 & 3: Charts Row */}
      {(activeReport === 'general' || activeReport === 'cumplimiento') && (
      <motion.div key="charts-section" role="tabpanel" id={`panel-${activeReport}`} aria-labelledby={`tab-${activeReport}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* Compliance por Área - Bar Chart */}
        <motion.div
          custom={0.5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variant="glass" padding="lg" style={{ height: `${Math.max(360, complianceByArea.length * 58 + 80)}px` }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold" style={{ fontSize: '16px', color: '#171717', letterSpacing: '-0.01em' }}>
                  Cumplimiento por Área
                </h3>
                <p style={{ fontSize: '11px', color: '#a8a8a8', marginTop: '2px' }}>
                  Promedio de compliance por área operativa
                </p>
              </div>
              <span style={{
                fontSize: '11px', color: '#666666',
                backgroundColor: '#f5f5f5',
                padding: '3px 10px', borderRadius: '9999px',
                border: '1px solid #ebebeb',
              }}>
                {complianceByArea.length} áreas
              </span>
            </div>
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={complianceByArea} layout="vertical" margin={{ left: 90, right: 44, top: 4, bottom: 4 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="area"
                  tick={{ fill: '#666666', fontSize: 11, fontFamily: 'var(--font-body)' }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(23,23,23,0.04)' }} />
                <Bar dataKey={() => 100} radius={[0, 6, 6, 0]} barSize={18} fill="#f0f0f0" isAnimationActive={false} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={18}>
                  {complianceByArea.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="score"
                    position="right"
                    style={{ fill: '#666666', fontSize: '11px', fontFamily: 'var(--font-body)' }}
                    formatter={(v) => `${v}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Estado de Certificaciones - Donut Chart */}
        <motion.div
          custom={0.6}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variant="glass" padding="lg" className="h-[420px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold" style={{ fontSize: '16px', color: '#171717', letterSpacing: '-0.01em' }}>
                  Estado de Certificaciones
                </h3>
                <p style={{ fontSize: '11px', color: '#a8a8a8', marginTop: '2px' }}>
                  Distribución por estado actual
                </p>
              </div>
              <span style={{
                fontSize: '11px', color: '#666666',
                backgroundColor: '#f5f5f5',
                padding: '3px 10px', borderRadius: '9999px',
                border: '1px solid #ebebeb',
              }}>
                {certifications.length} total
              </span>
            </div>
            <div className="flex items-center h-[calc(100%-60px)]">
              <ResponsiveContainer width="52%" height="100%">
                <PieChart>
                  <Pie
                    data={certStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {certStatusData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                    <Label
                      content={() => (
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                          <tspan x="50%" dy="-8" style={{ fill: '#171717', fontSize: '22px', fontWeight: 600 }}>
                            {certifications.length}
                          </tspan>
                          <tspan x="50%" dy="18" style={{ fill: '#a8a8a8', fontSize: '10px' }}>
                            total
                          </tspan>
                        </text>
                      )}
                    />
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Leyenda */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {certStatusData.map((item, idx) => (
                  <>
                    {idx === 1 && (
                      <div key={`sep-${idx}`} style={{ height: '1px', backgroundColor: '#ebebeb', marginTop: '8px', marginBottom: '8px' }} />
                    )}
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '2px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#4d4d4d', marginLeft: '8px' }}>{item.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>
                          {item.value}
                        </span>
                        <span style={{ fontSize: '11px', color: '#a8a8a8', marginLeft: '4px' }}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      </motion.div>
      )}

      {/* SECTION 4: Top Trabajadores en Riesgo */}
      {(activeReport === 'general' || activeReport === 'riesgo') && (
      <motion.div key="risk-section" role="tabpanel" id={`panel-${activeReport}`} aria-labelledby={`tab-${activeReport}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div custom={0.7} variants={sectionVariants} initial="hidden" animate="visible">
        <Card variant="glass" padding="lg">
          {/* Header de sección */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#e5484d', flexShrink: 0 }} strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold" style={{ fontSize: '16px', color: '#171717', letterSpacing: '-0.01em' }}>
                Trabajadores en Riesgo
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: '#a8a8a8' }}>Con cert. vencida</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#e5484d' }}>
                  {topRiskWorkers.filter(w => w.expiredCount > 0).length}
                </p>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: '#ebebeb' }} />
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: '#a8a8a8' }}>Por vencer</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#b25000' }}>
                  {topRiskWorkers.filter(w => w.expiringCount > 0).length}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div style={{ overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#d4d4d4 transparent' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Trabajadores con menor cumplimiento">
              <colgroup>
                <col style={{ width: '40px' }} />   {/* Rank */}
                <col style={{ width: '44px' }} />   {/* Avatar */}
                <col />                              {/* Nombre / Área */}
                <col style={{ width: '80px' }} />   {/* Vencidas */}
                <col style={{ width: '80px' }} />   {/* Próximas */}
                <col style={{ width: '72px' }} />   {/* Acción */}
              </colgroup>
              <thead>
                <tr>
                  {['#', '', 'Trabajador', 'Vencidas', 'Próximas', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#666666',
                      textAlign: i >= 3 ? 'center' : 'left',
                      borderBottom: '1px solid #ebebeb',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topRiskWorkers.slice(0, showAllRisk ? 10 : 5).map((worker, index) => (
                  <motion.tr
                    key={worker.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ borderBottom: index < (showAllRisk ? topRiskWorkers.length : Math.min(5, topRiskWorkers.length)) - 1 ? '1px solid #f5f5f5' : 'none', cursor: 'default' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#fafafa'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'; }}
                  >
                    {/* Rank */}
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        backgroundColor: index === 0 ? 'rgba(229,72,77,0.08)' : index === 1 ? 'rgba(178,80,0,0.08)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto',
                      }}>
                        <span style={{
                          fontSize: '13px', fontWeight: 600,
                          color: index === 0 ? '#e5484d' : index === 1 ? '#b25000' : '#a8a8a8',
                        }}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    {/* Avatar */}
                    <td style={{ padding: '12px 6px' }}>
                      {worker.foto
                        ? <img src={worker.foto} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        : (
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ebebeb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 600,
                            color: '#4d4d4d',
                          }}>
                            {worker.nombre[0]}{worker.apellidos[0]}
                          </div>
                        )
                      }
                    </td>
                    {/* Nombre / Área */}
                    <td style={{ padding: '12px 8px', minWidth: 0 }}>
                      <p style={{ fontSize: '13px', color: '#171717', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {worker.nombre} {worker.apellidos}
                      </p>
                      <p style={{ fontSize: '11px', color: '#a8a8a8', marginTop: '2px' }}>
                        {worker.area} · {worker.cargo}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <div style={{ width: '60px', height: '3px', backgroundColor: '#f0f0f0', borderRadius: '2px' }}>
                          <div style={{
                            height: '3px',
                            width: `${worker.complianceScore}%`,
                            backgroundColor: worker.scoreColor,
                            borderRadius: '2px',
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#a8a8a8' }}>{worker.complianceScore}%</span>
                      </div>
                    </td>
                    {/* Vencidas */}
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {worker.expiredCount > 0
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 500, color: '#e5484d' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e5484d', flexShrink: 0 }} />
                            {worker.expiredCount}
                          </span>
                        : <span style={{ fontSize: '13px', color: '#a8a8a8' }}>—</span>
                      }
                    </td>
                    {/* Próximas */}
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {worker.expiringCount > 0
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 500, color: '#b25000' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#b25000', flexShrink: 0 }} />
                            {worker.expiringCount}
                          </span>
                        : <span style={{ fontSize: '13px', color: '#a8a8a8' }}>—</span>
                      }
                    </td>
                    {/* Acción */}
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/workers/${worker.id}`)}
                        aria-label={`Ver perfil de ${worker.nombre} ${worker.apellidos}`}
                        style={{
                          padding: '5px 12px',
                          minHeight: '30px',
                          borderRadius: '6px',
                          border: '1px solid #ebebeb',
                          backgroundColor: '#ffffff',
                          color: '#171717',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                      >
                        Ver
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expandir/colapsar */}
          {topRiskWorkers.length > 5 && (
            <button
              onClick={() => setShowAllRisk(s => !s)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px 16px',
                minHeight: '38px',
                borderRadius: '6px',
                border: '1px dashed #d4d4d4',
                backgroundColor: 'transparent',
                color: '#666666',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#a8a8a8'; e.currentTarget.style.color = '#171717'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d4d4d4'; e.currentTarget.style.color = '#666666'; }}
              aria-expanded={showAllRisk}
            >
              {showAllRisk
                ? <><ChevronUp className="w-3 h-3 inline mr-1" />Mostrar menos</>
                : <><ChevronDown className="w-3 h-3 inline mr-1" />Ver {topRiskWorkers.length - 5} trabajadores más</>
              }
            </button>
          )}
        </Card>
      </motion.div>
      </motion.div>
      )}

      {/* SECTION 5: Exportar Reportes */}
      {(activeReport === 'general' || activeReport === 'exportar') && (
      <motion.div key="export-section" role="tabpanel" id={`panel-${activeReport}`} aria-labelledby={`tab-${activeReport}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div custom={0.8} variants={sectionVariants} initial="hidden" animate="visible">
        <Card variant="glass" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <Download style={{ width: '20px', height: '20px', color: '#4d4d4d' }} strokeWidth={1.5} aria-hidden="true" />
            <h3 className="font-semibold" style={{ fontSize: '16px', color: '#171717', letterSpacing: '-0.01em' }}>
              Exportar Reportes
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                icon: Download,
                label: 'Resumen CSV',
                description: 'Datos completos de trabajadores y certificaciones en formato CSV',
                meta: `Incluye ${workers.length} trabajadores · ${certifications.length} certificaciones`,
                onClick: exportSummaryCSV,
                disabled: false,
                pro: false,
                colorHex: '#4d4d4d',
              },
              {
                icon: FileText,
                label: 'Reporte SENCE',
                description: 'Formato texto para organismos reguladores y auditorías',
                meta: 'Formato .txt compatible con organismos reguladores',
                onClick: exportSENCE,
                disabled: false,
                pro: false,
                colorHex: '#297a3a',
              },
              {
                icon: ImageIcon,
                label: 'Exportar PNG',
                description: 'Gráficos e informes visuales en alta resolución',
                meta: 'Requiere plan Pro ✦',
                onClick: () => {},
                disabled: true,
                pro: true,
                colorHex: '#a8a8a8',
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.disabled}
                aria-label={item.label}
                aria-disabled={item.disabled}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  minHeight: '80px',
                  textAlign: 'left',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ebebeb',
                  borderRadius: '6px',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!item.disabled) {
                    e.currentTarget.style.borderColor = '#d4d4d4';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={e => {
                  if (!item.disabled) {
                    e.currentTarget.style.borderColor = '#ebebeb';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <div style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ebebeb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <item.icon style={{ width: '20px', height: '20px', color: '#4d4d4d' }} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#171717', display: 'flex', alignItems: 'center' }}>
                    {item.label}
                    {item.pro && (
                      <span style={{
                        fontSize: '10px', fontWeight: 500, padding: '2px 8px',
                        backgroundColor: '#f5f5f5', border: '1px solid #ebebeb',
                        borderRadius: '9999px', color: '#666666', marginLeft: '8px',
                      }}>PRO</span>
                    )}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666666', lineHeight: 1.5, marginTop: '2px' }}>
                    {item.description}
                  </p>
                  <p style={{ fontSize: '11px', color: '#a8a8a8', marginTop: '6px' }}>
                    {item.meta}
                  </p>
                </div>
                {!item.disabled && (
                  <span
                    className="export-arrow"
                    style={{ color: '#a8a8a8', fontSize: '18px', flexShrink: 0, marginLeft: 'auto', transition: 'color 0.15s' }}
                  >
                    →
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default Reports;
