import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Image as ImageIcon,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
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
import { PanelHeader } from '../components/reports/PanelHeader';
import { PanelBadge } from '../components/reports/PanelBadge';

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
    <div className="space-y-16" role="main" aria-label="Vista de reportes">
      {/* ── HEADER ── */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Izquierda: título + subtítulo */}
          <div>
            <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-brand)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1.1, margin: 0 }}>
              Reportes y Análisis
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap', rowGap: '2px' }}>
              {[
                <span key="periodo" style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-muted)' }}>Período: <span style={{ color: 'var(--color-brand)', fontWeight: 'var(--weight-medium)' }}>{new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</span></span>,
                <span key="workers" style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-faint)' }}>{workers.length} trabajadores</span>,
                <span key="certs" style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-faint)' }}>{certifications.length} certificaciones</span>,
                <span key="areas" style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-faint)' }}>{new Set(workers.map(w => w.area)).size} áreas</span>,
              ].reduce<React.ReactNode[]>((acc, item, i) => [
                ...acc,
                ...(i > 0 ? [<span key={`sep-${i}`} style={{ color: 'var(--border-strong)', fontSize: 'var(--text-body-sm)', userSelect: 'none' }} aria-hidden>·</span>] : []),
                item,
              ], [])}
            </div>
          </div>
          {/* Derecha: acciones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={exportSummaryCSV}
              aria-label="Exportar resumen como CSV"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', minHeight: '36px', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: 'var(--text-body)', fontWeight: 500, cursor: 'pointer', transition: 'background-color 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-card)'; }}
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              CSV
            </button>
            <button
              onClick={exportSENCE}
              aria-label="Exportar reporte SENCE"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', minHeight: '36px', backgroundColor: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', color: '#ffffff', fontSize: 'var(--text-body)', fontWeight: 500, cursor: 'pointer', transition: 'background-color 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
              SENCE
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: KPIs */}
      <motion.div custom={0.1} variants={sectionVariants} initial="hidden" animate="visible">
        <div
          className="grid gap-6 grid-cols-2 lg:grid-cols-4"
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

      {/* SECTION 5: Exportar Reportes */}
      <motion.div role="region" aria-label="Exportar reportes" className="flex flex-col" custom={0.6} variants={sectionVariants} initial="hidden" animate="visible">
        <Card variant="default" padding="lg" hover={false} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PanelHeader
            title="Exportar Reportes"
            subtitle="Descargá los datos en el formato que necesités"
            action={<PanelBadge>{workers.length} trabajadores</PanelBadge>}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
            {[
              {
                icon: Download,
                label: 'Resumen CSV',
                description: `${workers.length} trabajadores · ${certifications.length} certs`,
                onClick: exportSummaryCSV,
                disabled: false,
                pro: false,
              },
              {
                icon: FileText,
                label: 'Reporte SENCE',
                description: 'Formato .txt para organismos reguladores',
                onClick: exportSENCE,
                disabled: false,
                pro: false,
              },
              {
                icon: ImageIcon,
                label: 'Exportar PNG',
                description: 'Gráficos en alta resolución',
                onClick: () => {},
                disabled: true,
                pro: true,
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.disabled}
                aria-label={item.label}
                aria-disabled={item.disabled}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', textAlign: 'left',
                  backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1, transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!item.disabled) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.backgroundColor = 'var(--surface-canvas)'; } }}
                onMouseLeave={e => { if (!item.disabled) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.backgroundColor = 'var(--surface-card)'; } }}
              >
                <div style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '6px', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-brand)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.label}
                    {item.pro && <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1.4, fontSize: 'var(--text-micro)', fontWeight: 500, padding: '2px 7px', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border-default)', borderRadius: '9999px', color: 'var(--color-text-muted)' }}>PRO</span>}
                  </p>
                  <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                </div>
                {!item.disabled && <span style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-body)', flexShrink: 0, marginLeft: 'auto' }}>→</span>}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      </div>{/* fin FILA C */}
    </div>
  );
}

export default Reports;
