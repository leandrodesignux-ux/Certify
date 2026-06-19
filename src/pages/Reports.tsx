import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  BarChart3,
  MoreHorizontal,
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
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { Card } from '../components/ui/Card';
import { useWorkerStore } from '../store/useWorkerStore';
import { useCertStore } from '../store/useCertStore';
import { useNavigate } from 'react-router-dom';
import { CustomBarTooltip, CustomPieTooltip } from '../components/reports/ChartTooltips';
import { PanelHeader } from '../components/reports/PanelHeader';
import { PanelBadge } from '../components/reports/PanelBadge';
import { ReportTabs } from '../components/reports/ReportTabs';
import { InlineKPI } from '../components/reports/InlineKPI';
import { mockComplianceTrend } from '../store/useCertStore';

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

  const getComplianceLabel = (score: number) => {
    if (score >= 80) return 'Óptimo';
    if (score >= 60) return 'Regular';
    return 'Crítico';
  };

  const [activeTab, setActiveTab] = useState<string>('general');

  const tabs = [
    { id: 'general',     label: 'Reporte General' },
    { id: 'compliance',  label: 'Cumplimiento',   disabled: true },
    { id: 'expirations', label: 'Vencimientos',   disabled: true },
    { id: 'by-worker',   label: 'Por Trabajador', disabled: true },
  ];

  return (
    <div className="space-y-16" role="main" aria-label="Vista de reportes">
      {/* ── HEADER HERO ── */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Izquierda: icono + saludo */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px' }}>
            {/* Icono circular */}
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px -8px rgba(0,107,255,0.30)' }}>
              <BarChart3 style={{ width: '28px', height: '28px', color: '#ffffff' }} strokeWidth={1.75} />
            </div>
            {/* Texto */}
            <div>
              <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1.1, margin: 0 }}>
                {(() => { const h = new Date().getHours(); if (h < 12) return 'Buenos días'; if (h < 19) return 'Buenas tardes'; return 'Buenas noches'; })()}, Admin
              </h1>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)', marginTop: '4px', marginBottom: 0 }}>
                Analizá el cumplimiento de tu equipo y exportá los reportes que necesités.
              </p>
            </div>
          </div>
          {/* Derecha: CTAs */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={exportSummaryCSV}
              aria-label="Exportar resumen como CSV"
              style={{ height: '40px', padding: '0 16px', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all var(--transition-fast)', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-card)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            >
              <Download style={{ width: '16px', height: '16px' }} strokeWidth={1.5} />
              Exportar CSV
            </button>
            <button
              onClick={exportSENCE}
              aria-label="Generar reporte SENCE"
              style={{ height: '40px', padding: '0 18px', backgroundColor: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', color: '#ffffff', fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-semibold)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all var(--transition-fast)', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
            >
              <Sparkles style={{ width: '16px', height: '16px', color: '#ffffff' }} strokeWidth={1.5} />
              Generar reporte
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── REPORT TABS ── */}
      <motion.div custom={0.05} variants={sectionVariants} initial="hidden" animate="visible" style={{ marginBottom: 'var(--space-lg)' }}>
        <ReportTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      </motion.div>

      {activeTab === 'general' ? (
        <>

      {/* FILA 1: Resumen + Tendencia */}
      <motion.div custom={0.1} variants={sectionVariants} initial="hidden" animate="visible" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CARD A: Resumen de Cumplimiento */}
          <Card variant="default" padding="lg" hover={false} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', margin: 0, letterSpacing: 'var(--tracking-snug)' }}>
                Resumen de Cumplimiento
              </h3>
              <KebabMenu />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <InlineKPI
                icon={TrendingUp}
                label="Compliance Global"
                value={kpis.avgCompliance}
                suffix="%"
                trendLabel={`${getComplianceLabel(kpis.avgCompliance)} este mes`}
                trendDirection={kpis.avgCompliance >= 80 ? 'up' : kpis.avgCompliance >= 60 ? 'neutral' : 'down'}
              />
              <InlineKPI
                icon={Award}
                label="Certs vigentes"
                value={kpis.activeCerts}
                trendLabel={`${Math.round((kpis.activeCerts / (certifications.length || 1)) * 100)}% del total`}
                trendDirection="up"
              />
              <InlineKPI
                icon={Clock}
                label="Vencen en 30d"
                value={kpis.expiringSoon}
                trendLabel={kpis.expiringSoon > 5 ? `${kpis.expiringSoon} crítico` : 'Bajo riesgo'}
                trendDirection={kpis.expiringSoon > 5 ? 'down' : 'neutral'}
              />
            </div>
          </Card>

          {/* CARD B: Tendencia de Cumplimiento */}
          {(() => {
            const trendColor = kpis.avgCompliance >= 80 ? '#297a3a' : kpis.avgCompliance >= 60 ? '#b25000' : '#e5484d';
            return (
              <Card variant="default" padding="lg" hover={false} style={{ position: 'relative', minHeight: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', margin: 0, letterSpacing: 'var(--tracking-snug)' }}>
                    Tendencia de Cumplimiento
                  </h3>
                  <KebabMenu />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start', height: '100%' }}>
                  {/* KPI hero */}
                  <div style={{ flexShrink: 0, minWidth: '140px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>
                      {kpis.avgCompliance}%
                    </div>
                    <div style={{ fontSize: 'var(--text-micro)', color: 'var(--status-success)', fontWeight: 'var(--weight-medium)', marginTop: '6px' }}>
                      ↑ +{Math.max(0, kpis.avgCompliance - mockComplianceTrend[0].value)}% últimos 30 días
                    </div>
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)', maxWidth: '160px', lineHeight: 1.4 }}>
                      Mantené el compliance del equipo por encima del 85%.
                    </p>
                  </div>
                  {/* Area chart */}
                  <div style={{ flex: 1, height: '160px', minHeight: '160px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockComplianceTrend} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={trendColor} stopOpacity={0.18} />
                            <stop offset="100%" stopColor={trendColor} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border-default)" strokeDasharray="2 4" vertical={false} />
                        <XAxis
                          dataKey="week"
                          tick={{ fill: '#476788', fontSize: 11, fontFamily: 'var(--font-body)' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis hide domain={[Math.min(...mockComplianceTrend.map(d => d.value)) - 8, 100]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-caption)', color: 'var(--color-brand)' }}
                          formatter={(v) => [`${v ?? ''}%`, 'Compliance']}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={trendColor}
                          strokeWidth={2}
                          fill="url(#trendGradient)"
                          dot={{ r: 0 }}
                          activeDot={{ r: 5, fill: trendColor, stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            );
          })()}

        </div>
      </motion.div>

      {/* FILA B: Charts */}
      <motion.div role="region" aria-label="Gráficos de cumplimiento y certificaciones" custom={0.3} variants={sectionVariants} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Compliance por Área - Bar Chart */}
        <motion.div className="flex flex-col" custom={0.5} variants={sectionVariants} initial="hidden" animate="visible">
          <Card variant="default" padding="lg" hover={false} style={{ flex: 1, minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <PanelHeader
              title="Cumplimiento por Área"
              subtitle="Promedio de compliance por área operativa"
              action={<PanelBadge>{complianceByArea.length} áreas</PanelBadge>}
              spacing={20}
            />
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceByArea} layout="vertical" margin={{ left: 100, right: 48, top: 4, bottom: 4 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    type="category"
                    dataKey="area"
                    tick={{ fill: '#476788', fontSize: 12, fontFamily: 'var(--font-body)' }}
                    width={100}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(23,23,23,0.04)' }} />
                  <Bar dataKey={() => 100} radius={[0, 4, 4, 0]} barSize={16} fill="#e7edf6" isAnimationActive={false} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                    {complianceByArea.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="score"
                      position="right"
                      style={{ fill: '#476788', fontSize: '12px', fontFamily: 'var(--font-body)' }}
                      formatter={(v: unknown) => `${v as number}%`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Estado de Certificaciones - Donut Chart */}
        <motion.div className="flex flex-col" custom={0.6} variants={sectionVariants} initial="hidden" animate="visible">
          <Card variant="default" padding="lg" hover={false} style={{ flex: 1, minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <PanelHeader
              title="Estado de Certificaciones"
              subtitle="Distribución por estado actual"
              action={<PanelBadge>{certifications.length} total</PanelBadge>}
              spacing={20}
            />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', marginTop: '8px', alignItems: 'center' }}>
              {/* Donut — ancho fijo 200px, crece hasta 240px */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', flex: '0 0 200px', maxWidth: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={certStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {certStatusData.map((entry, index) => (
                        <Cell key={`pie-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                      <Label
                        content={() => (
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                            <tspan x="50%" dy="-8" style={{ fill: 'var(--color-brand)', fontSize: '20px', fontWeight: 600 }}>
                              {certifications.length}
                            </tspan>
                            <tspan x="50%" dy="17" style={{ fill: '#476788', fontSize: '10px' }}>
                              total
                            </tspan>
                          </text>
                        )}
                      />
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} wrapperStyle={{ zIndex: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Leyenda — ocupa el espacio restante, mínimo 140px */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', flex: '1 1 140px', minWidth: '140px' }}>
                {certStatusData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', flexShrink: 0 }}>
                      <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-brand)' }}>{item.percentage}%</span>
                      <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)' }}>({item.value})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      </motion.div>

      {/* FILA C: Riesgo + Export lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

      {/* SECTION 4: Top Trabajadores en Riesgo */}
      <motion.div role="region" aria-label="Trabajadores en riesgo" className="flex flex-col" custom={0.5} variants={sectionVariants} initial="hidden" animate="visible">
        <Card variant="default" padding="lg" hover={false} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PanelHeader
            title="Trabajadores en Riesgo"
            subtitle="Menor índice de cumplimiento"
            action={
              <button
                onClick={() => navigate('/workers')}
                style={{ fontSize: 'var(--text-caption)', fontWeight: 500, color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px' }}
              >
                Ver todos
              </button>
            }
          />

          {/* Lista compacta top-5 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flex: 1, marginTop: '4px' }}>
            {topRiskWorkers.slice(0, 5).map((worker, index) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(`/workers/${worker.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 6px', borderRadius: '6px', cursor: 'pointer',
                  transition: 'background-color 0.12s',
                  borderBottom: index < Math.min(topRiskWorkers.length, 5) - 1 ? '1px solid var(--border-default)' : 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-canvas)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                {/* Avatar */}
                {worker.foto
                  ? <img src={worker.foto} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-default)' }} />
                  : (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 'var(--text-micro)', fontWeight: 600, color: 'var(--color-text-muted)',
                    }}>
                      {worker.nombre[0]}{worker.apellidos[0]}
                    </div>
                  )
                }
                {/* Nombre + cargo */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {worker.nombre} {worker.apellidos}
                  </p>
                  <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {worker.area} · {worker.cargo}
                  </p>
                </div>
                {/* Score + indicadores */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: worker.scoreColor, lineHeight: 1 }}>{worker.complianceScore}%</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {worker.expiredCount > 0 && (
                      <span
                        title={`${worker.expiredCount} vencida${worker.expiredCount > 1 ? 's' : ''}`}
                        aria-label={`${worker.expiredCount} certificación${worker.expiredCount > 1 ? 'es' : ''} vencida${worker.expiredCount > 1 ? 's' : ''}`}
                        style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1.4, fontSize: '10px', fontWeight: 500, color: '#e5484d', backgroundColor: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.2)', borderRadius: '9999px', padding: '2px 7px' }}
                      >
                        {worker.expiredCount}v
                      </span>
                    )}
                    {worker.expiringCount > 0 && (
                      <span
                        title={`${worker.expiringCount} próxima${worker.expiringCount > 1 ? 's' : ''} a vencer`}
                        aria-label={`${worker.expiringCount} certificación${worker.expiringCount > 1 ? 'es' : ''} próxima${worker.expiringCount > 1 ? 's' : ''} a vencer`}
                        style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1.4, fontSize: '10px', fontWeight: 500, color: '#b25000', backgroundColor: 'rgba(178,80,0,0.08)', border: '1px solid rgba(178,80,0,0.2)', borderRadius: '9999px', padding: '2px 7px' }}
                      >
                        {worker.expiringCount}p
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      </div>{/* fin FILA C */}

        </>
      ) : (
        <ComingSoonState
          tabLabel={tabs.find(t => t.id === activeTab)?.label ?? ''}
          onBack={() => setActiveTab('general')}
        />
      )}

    </div>
  );
}

function KebabMenu() {
  return (
    <button
      aria-label="Más opciones"
      style={{
        padding: '4px', backgroundColor: 'transparent',
        border: 'none', borderRadius: 'var(--radius-sm)',
        color: 'var(--color-text-faint)',
        cursor: 'pointer', transition: 'all var(--transition-fast)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-soft)';
        (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLElement).style.color = 'var(--color-text-faint)';
      }}
    >
      <MoreHorizontal style={{ width: '18px', height: '18px' }} strokeWidth={1.5} />
    </button>
  );
}

function ComingSoonState({ tabLabel, onBack }: { tabLabel: string; onBack: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 'var(--space-2xl)',
      minHeight: '400px',
      backgroundColor: 'var(--surface-card)',
      border: '1px dashed var(--border-default)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--surface-soft)',
        border: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 'var(--space-md)',
      }}>
        <Clock style={{ width: '24px', height: '24px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
      </div>
      <h3 style={{
        fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-semibold)',
        color: 'var(--color-brand)', margin: 0, marginBottom: '6px',
      }}>
        {tabLabel} — próximamente
      </h3>
      <p style={{
        fontSize: 'var(--text-body)', color: 'var(--color-text-muted)',
        textAlign: 'center', maxWidth: '380px', margin: 0,
      }}>
        Esta sección está en desarrollo. Por ahora podés ver el panorama
        completo en el Reporte General.
      </p>
      <button
        onClick={onBack}
        style={{
          marginTop: 'var(--space-lg)',
          padding: '8px 16px', backgroundColor: 'transparent',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-brand)',
          fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)',
          cursor: 'pointer',
        }}
      >
        Ir a Reporte General
      </button>
    </div>
  );
}

export default Reports;
