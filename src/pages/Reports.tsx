import { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { SegmentedBar, SegmentedBarLegend } from '../components/reports/SegmentedBar';
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
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { Card } from '../components/ui/Card';
import { useWorkerStore } from '../store/useWorkerStore';
import { useCertStore } from '../store/useCertStore';
import { toast } from '../store/useToastStore';
import { useNavigate } from 'react-router-dom';
import { ReportTabs } from '../components/reports/ReportTabs';
import { InlineKPI } from '../components/reports/InlineKPI';
import { useCountUp } from '../components/certifications/CertStatCard';
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

  // Animated compliance hero value
  const animatedCompliance = useCountUp(kpis.avgCompliance, 1.0);

  // SECTION 2: Compliance por Área (Bar Chart Data)
  const complianceByArea = useMemo(() => {
    const areas = Array.from(new Set(workers.map(w => w.area)));
    return areas.map(area => {
      const areaWorkers = workers.filter(w => w.area === area);
      const avgScore = areaWorkers.length > 0
        ? Math.round(areaWorkers.reduce((sum, w) => sum + w.complianceScore, 0) / areaWorkers.length)
        : 0;
      return { area, score: avgScore };
    }).sort((a, b) => a.score - b.score);
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
      { name: 'Pendientes', value: pendientes, color: '#a6bbd1', percentage: ((pendientes / total) * 100).toFixed(1) },
    ];
  }, [certifications]);

  // Distribution by compliance band
  const distribution = useMemo(() => {
    const total = workers.length;
    const enRegla = workers.filter(w => w.complianceScore >= 80).length;
    const advertencia = workers.filter(w => w.complianceScore >= 60 && w.complianceScore < 80).length;
    const enRiesgo = workers.filter(w => w.complianceScore < 60).length;
    return { total, enRegla, advertencia, enRiesgo };
  }, [workers]);

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
    try {
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
      toast.success(
        'Reporte exportado',
        `${workers.length} trabajadores exportados en CSV.`
      );
    } catch (err) {
      toast.error(
        'No pudimos exportar',
        'Reintentá en unos segundos.'
      );
    }
  };

  const exportSENCE = () => {
    try {
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
      toast.success(
        'Reporte SENCE generado',
        'Archivo .txt descargado.'
      );
    } catch (err) {
      toast.error(
        'No pudimos generar el reporte',
        'Reintentá en unos segundos.'
      );
    }
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
                <div className="flex flex-col md:flex-row" style={{ gap: 'var(--space-lg)', alignItems: 'flex-start', height: '100%' }}>
                  {/* KPI hero */}
                  <div style={{ flexShrink: 0, minWidth: '140px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>
                      {animatedCompliance}%
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

      {/* FILA 2: 3-card grid */}
      <motion.div custom={0.3} variants={sectionVariants} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* CARD A: Distribución de Trabajadores */}
          <Card variant="default" padding="lg" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', margin: 0, letterSpacing: 'var(--tracking-snug)' }}>Distribución de Trabajadores</h3>
              <KebabMenu />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>
                  {distribution.total}
                </div>
                <button onClick={() => navigate('/workers')} style={{ fontSize: 'var(--text-caption)', color: 'var(--color-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: '4px', textDecoration: 'underline', textUnderlineOffset: '2px', fontWeight: 'var(--weight-medium)' }}>
                  Total registrados
                </button>
              </div>
              <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)' }}>
                Promedio: <span style={{ color: 'var(--color-brand)', fontWeight: 'var(--weight-semibold)' }}>{kpis.avgCompliance}%</span>
              </span>
            </div>
            <SegmentedBar
              segments={[
                { label: 'En regla',    value: distribution.enRegla,    color: '#297a3a', status: 'success' },
                { label: 'Advertencia', value: distribution.advertencia, color: '#b25000', status: 'warning' },
                { label: 'En riesgo',   value: distribution.enRiesgo,   color: '#e5484d', status: 'danger'  },
              ]}
              height={8}
            />
            <div style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <SegmentedBarLegend
                segments={[
                  { label: 'En regla',    value: distribution.enRegla,    color: '#297a3a' },
                  { label: 'Advertencia', value: distribution.advertencia, color: '#b25000' },
                  { label: 'En riesgo',   value: distribution.enRiesgo,   color: '#e5484d' },
                ]}
                orientation="horizontal"
              />
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--border-default)', margin: 'var(--space-md) 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <span style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top en Riesgo</span>
              <button onClick={() => navigate('/workers')} style={{ fontSize: 'var(--text-micro)', color: 'var(--color-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 'var(--weight-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Ver todos <ChevronRight style={{ width: '12px', height: '12px' }} strokeWidth={2} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {topRiskWorkers.slice(0, 4).map((worker) => (
                <div key={worker.id} onClick={() => navigate(`/workers/${worker.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', cursor: 'pointer' }}>
                  {worker.foto ? (
                    <img src={worker.foto} alt="" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-default)' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                      {worker.nombre[0]}{worker.apellidos[0]}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-brand)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.nombre} {worker.apellidos}</p>
                    <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', margin: 0 }}>{worker.area}</p>
                  </div>
                  {worker.complianceScore < 60 ? (
                    <span style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', color: '#e5484d', backgroundColor: 'transparent', border: '1px solid rgba(229,72,77,0.35)', padding: '3px 10px', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>En riesgo</span>
                  ) : (
                    <span style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', color: '#b25000', backgroundColor: 'transparent', border: '1px solid rgba(178,80,0,0.35)', padding: '3px 10px', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>Atención</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* CARD B: Cumplimiento por Área */}
          <Card variant="default" padding="lg" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', margin: 0, letterSpacing: 'var(--tracking-snug)' }}>Cumplimiento por Área</h3>
              <KebabMenu />
            </div>
            <div style={{ backgroundColor: 'var(--surface-soft)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '24px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>{complianceByArea.length}</div>
                <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', marginTop: '4px', margin: 0 }}>áreas monitoreadas</p>
              </div>
              <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', maxWidth: '160px', margin: 0, lineHeight: 1.4 }}>Identificá áreas con menor cumplimiento para priorizar capacitaciones.</p>
            </div>
            <div style={{ height: `${Math.max(180, complianceByArea.length * 36)}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceByArea} layout="vertical" margin={{ left: 0, right: 36, top: 0, bottom: 0 }} barCategoryGap="35%">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="area" tick={{ fill: '#476788', fontSize: 11, fontFamily: 'var(--font-body)' }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,107,255,0.04)' }} contentStyle={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-caption)', color: 'var(--color-brand)' }} formatter={(v) => [`${v}%`, 'Compliance']} />
                  <Bar dataKey="score" fill="#006bff" radius={[0, 4, 4, 0]} barSize={12}>
                    <LabelList dataKey="score" position="right" style={{ fill: 'var(--color-brand)', fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-body)' }} formatter={(v: unknown) => `${v as number}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <button onClick={() => navigate('/workers')} style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--text-micro)', color: 'var(--color-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 'var(--weight-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Ver más detalle <ChevronRight style={{ width: '12px', height: '12px' }} strokeWidth={2} />
            </button>
          </Card>

          {/* CARD C: Estado de Certificaciones */}
          <Card variant="default" padding="lg" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', margin: 0, letterSpacing: 'var(--tracking-snug)' }}>Estado de Certificaciones</h3>
              <KebabMenu />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(41,122,58,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: '#297a3a' }} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>{certifications.length}</div>
                <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', marginTop: '4px', margin: 0 }}>certificaciones totales</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', margin: 0, marginBottom: 'var(--space-md)', lineHeight: 1.4 }}>Distribución por estado de cumplimiento vigente.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{ width: '140px', height: '140px', flexShrink: 0, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={certStatusData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {certStatusData.map((entry, index) => (
                        <Cell key={`pie-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-caption)', color: 'var(--color-brand)' }} formatter={(v, name) => [v, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    {Math.round((kpis.activeCerts / (certifications.length || 1)) * 100)}%
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>vigentes</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {certStatusData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-brand)', fontWeight: 'var(--weight-semibold)', fontFeatureSettings: '"tnum"' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>
      </motion.div>

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const items = [
    { label: 'Exportar datos',      onClick: () => console.log('export') },
    { label: 'Ver detalle',         onClick: () => console.log('detail') },
    { label: 'Configurar alertas',  onClick: () => console.log('alerts') },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-label="Más opciones"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
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

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          minWidth: '180px',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 50,
          overflow: 'hidden',
        }}>
          {items.map(item => (
            <button
              key={item.label}
              onClick={() => { item.onClick(); setOpen(false); }}
              style={{
                width: '100%', textAlign: 'left',
                padding: '8px 12px',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text)',
                backgroundColor: 'transparent',
                border: 'none', cursor: 'pointer',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-soft)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
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
