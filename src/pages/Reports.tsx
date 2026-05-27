import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Image as ImageIcon,
  TrendingUp,
  Award,
  AlertTriangle,
  AlertCircle,
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
  const [showProTooltip, setShowProTooltip] = useState(false);
  const [showAllRisk, setShowAllRisk] = useState(false);

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
      let color = 'var(--color-danger)';
      if (avgScore > 80) color = 'var(--color-success)';
      else if (avgScore > 60) color = 'var(--color-warning)';

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
      { name: 'Vigentes', value: vigentes, color: 'var(--chart-vigente)', percentage: ((vigentes / total) * 100).toFixed(1) },
      { name: 'Próx. vencer', value: proximas, color: 'var(--chart-proximo)', percentage: ((proximas / total) * 100).toFixed(1) },
      { name: 'Vencidas', value: vencidas, color: 'var(--chart-vencido)', percentage: ((vencidas / total) * 100).toFixed(1) },
      { name: 'Pendientes', value: pendientes, color: 'var(--chart-pendiente)', percentage: ((pendientes / total) * 100).toFixed(1) },
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
        
        let scoreColor = 'var(--color-danger)';
        if (worker.complianceScore >= 80) scoreColor = 'var(--color-success)';
        else if (worker.complianceScore >= 60) scoreColor = 'var(--color-warning)';

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

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getComplianceLabel = (score: number) => {
    if (score >= 80) return 'Óptimo';
    if (score >= 60) return 'Regular';
    return 'Crítico';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
        <div className="flex flex-col gap-4">
          {/* Top row: título + acciones */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h1 className="font-display font-bold text-gradient tracking-tight" style={{ fontSize: 'var(--text-h1)' }}>
                Reportes y Análisis
              </h1>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                Compliance y exportación · Período:{' '}
                <span style={{ color: 'var(--color-purple-light)', fontWeight: 'var(--font-weight-medium)' }}>
                  {new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={exportSummaryCSV}
                aria-label="Exportar resumen como CSV"
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
                  padding: '8px 14px',
                  backgroundColor: 'var(--color-surface-alt)',
                  border: '1px solid var(--border-brand)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-purple-light)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'var(--transition-base)',
                  minHeight: '36px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={exportSENCE}
                aria-label="Exportar reporte SENCE"
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
                  padding: '8px 14px',
                  backgroundColor: 'var(--color-electric)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'var(--transition-base)',
                  minHeight: '36px',
                }}
              >
                <FileText className="w-4 h-4" />
                SENCE
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: KPIs */}
      <div className="grid gap-4 kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
        role="region" aria-label="Indicadores clave de cumplimiento">
        <KPICard
          title="Índice de Cumplimiento Global"
          value={`${kpis.avgCompliance}%`}
          subtitle={`de ${workers.length} trabajadores`}
          trendLabel={getComplianceLabel(kpis.avgCompliance)}
          trend={kpis.avgCompliance >= 80 ? 'up' : kpis.avgCompliance >= 60 ? 'neutral' : 'down'}
          icon={TrendingUp}
          color={getComplianceColor(kpis.avgCompliance)}
          delay={0.1}
        />
        <KPICard
          title="Certificaciones Activas"
          value={kpis.activeCerts}
          subtitle={`de ${certifications.length} totales`}
          trendLabel={`${Math.round((kpis.activeCerts / (certifications.length || 1)) * 100)}% del total`}
          trend="up"
          icon={Award}
          color="var(--color-success)"
          delay={0.15}
        />
        <KPICard
          title="Vencimientos en 30 días"
          value={kpis.expiringSoon}
          subtitle="Requieren atención"
          trendLabel={kpis.expiringSoon > 5 ? 'Nivel alto' : 'Nivel normal'}
          trend={kpis.expiringSoon > 5 ? 'down' : 'neutral'}
          icon={Clock}
          color="var(--color-warning)"
          delay={0.2}
        />
        <KPICard
          title="Trabajadores en Riesgo"
          value={kpis.workersAtRisk}
          subtitle={`de ${workers.length} totales`}
          trendLabel={kpis.workersAtRisk > 3 ? 'Crítico' : 'Controlado'}
          trend={kpis.workersAtRisk > 3 ? 'down' : 'neutral'}
          icon={AlertTriangle}
          color="var(--color-danger)"
          delay={0.25}
        />
      </div>

      {/* SECTION 2 & 3: Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '32px' }}>
        {/* Compliance por Área - Bar Chart */}
        <motion.div
          custom={0.5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variant="glass" padding="lg" className="h-[420px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--color-text-primary)' }}>
                Cumplimiento por Área
              </h3>
              <span style={{
                fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-surface-alt)',
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-brand)',
              }}>
                {complianceByArea.length} áreas
              </span>
            </div>
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={complianceByArea} layout="vertical" margin={{ left: 90, right: 28, top: 4, bottom: 4 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="area"
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-body)' }}
                  width={80}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(91,34,119,0.07)' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {complianceByArea.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
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
              <h3 className="font-display font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--color-text-primary)' }}>
                Estado de Certificaciones
              </h3>
              <span style={{
                fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-surface-alt)',
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-brand)',
              }}>
                {certifications.length} total
              </span>
            </div>
            <div className="flex items-center h-[calc(100%-52px)]">
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie
                    data={certStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={96}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {certStatusData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Leyenda */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {certStatusData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        {item.value}
                      </span>
                      <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* SECTION 4: Top Trabajadores en Riesgo */}
      <motion.div custom={0.7} variants={sectionVariants} initial="hidden" animate="visible">
        <Card variant="glass" padding="lg">
          {/* Header de sección */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--color-danger)', flexShrink: 0 }} aria-hidden="true" />
              <h3 className="font-display font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--color-text-primary)' }}>
                Trabajadores en Riesgo
              </h3>
            </div>
            <span style={{
              fontSize: 'var(--text-micro)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-surface-alt)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-brand)',
            }}>
              Top {topRiskWorkers.length}
            </span>
          </div>

          {/* Tabla */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Trabajadores con menor cumplimiento">
              <colgroup>
                <col style={{ width: '40px' }} />   {/* Rank */}
                <col style={{ width: '44px' }} />   {/* Avatar */}
                <col />                              {/* Nombre / Área */}
                <col style={{ width: '100px' }} />  {/* Score */}
                <col style={{ width: '80px' }} />   {/* Vencidas */}
                <col style={{ width: '80px' }} />   {/* Próximas */}
                <col style={{ width: '72px' }} />   {/* Acción */}
              </colgroup>
              <thead>
                <tr>
                  {['#', '', 'Trabajador', 'Score', 'Vencidas', 'Próximas', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '6px 10px',
                      fontSize: 'var(--text-micro)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-muted)',
                      textAlign: i >= 3 ? 'center' : 'left',
                      borderBottom: '1px solid var(--border-brand)',
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
                    style={{ borderBottom: '1px solid var(--border-brand)', cursor: 'default' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(124,77,171,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'; }}
                  >
                    {/* Rank */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span className="font-display font-bold" style={{
                        fontSize: '16px',
                        color: index === 0 ? 'var(--color-danger)' : index === 1 ? 'var(--color-warning)' : 'var(--color-text-muted)',
                      }}>
                        {index + 1}
                      </span>
                    </td>
                    {/* Avatar */}
                    <td style={{ padding: '10px 6px' }}>
                      {worker.foto
                        ? <img src={worker.foto} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        : (
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: 'var(--color-surface-alt)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 'var(--text-micro)', fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-purple-mid)',
                          }}>
                            {worker.nombre[0]}{worker.apellidos[0]}
                          </div>
                        )
                      }
                    </td>
                    {/* Nombre / Área */}
                    <td style={{ padding: '10px 8px', minWidth: 0 }}>
                      <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {worker.nombre} {worker.apellidos}
                      </p>
                      <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {worker.area} · {worker.cargo}
                      </p>
                    </td>
                    {/* Score */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-small)',
                        fontWeight: 'var(--font-weight-bold)',
                        backgroundColor: worker.scoreColor + '18',
                        color: worker.scoreColor,
                        border: `1px solid ${worker.scoreColor}30`,
                      }}>
                        {worker.complianceScore}%
                      </span>
                    </td>
                    {/* Vencidas */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {worker.expiredCount > 0
                        ? <span style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-danger)' }}>{worker.expiredCount}</span>
                        : <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>—</span>
                      }
                    </td>
                    {/* Próximas */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {worker.expiringCount > 0
                        ? <span style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-warning)' }}>{worker.expiringCount}</span>
                        : <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>—</span>
                      }
                    </td>
                    {/* Acción */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/workers/${worker.id}`)}
                        aria-label={`Ver perfil de ${worker.nombre} ${worker.apellidos}`}
                        style={{
                          padding: '6px 14px',
                          minHeight: '32px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-brand)',
                          backgroundColor: 'transparent',
                          color: 'var(--color-purple-light)',
                          fontSize: 'var(--text-micro)',
                          fontWeight: 'var(--font-weight-medium)',
                          cursor: 'pointer',
                          transition: 'var(--transition-base)',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand-hover)'; e.currentTarget.style.backgroundColor = 'rgba(124,77,171,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
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
                marginTop: 'var(--space-md)',
                padding: 'var(--space-sm) var(--space-md)',
                minHeight: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-brand)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-small)',
                cursor: 'pointer',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand-hover)'; e.currentTarget.style.color = 'var(--color-purple-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              aria-expanded={showAllRisk}
            >
              {showAllRisk ? '▲ Mostrar menos' : `▼ Ver ${topRiskWorkers.length - 5} trabajadores más`}
            </button>
          )}
        </Card>
      </motion.div>

      {/* SECTION 5: Exportar Reportes */}
      <motion.div custom={0.8} variants={sectionVariants} initial="hidden" animate="visible">
        <Card variant="glass" padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <Download style={{ width: '20px', height: '20px', color: 'var(--color-purple-mid)' }} aria-hidden="true" />
            <h3 className="font-display font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--color-text-primary)' }}>
              Exportar Reportes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Download,
                label: 'Resumen CSV',
                description: 'Datos completos de trabajadores y certificaciones en formato CSV',
                onClick: exportSummaryCSV,
                disabled: false,
                color: 'var(--color-purple-mid)',
                colorHex: '#9b6ab5',
              },
              {
                icon: FileText,
                label: 'Reporte SENCE',
                description: 'Formato texto para organismos reguladores y auditorías',
                onClick: exportSENCE,
                disabled: false,
                color: 'var(--color-success)',
                colorHex: '#729362',
              },
              {
                icon: ImageIcon,
                label: 'Exportar PNG',
                description: 'Gráficos e informes visuales — disponible en versión Pro',
                onClick: () => setShowProTooltip(p => !p),
                disabled: true,
                color: 'var(--color-warning)',
                colorHex: '#FFB800',
              },
            ].map((item) => (
              <div key={item.label} style={{ position: 'relative' }}>
                <button
                  onClick={item.onClick}
                  disabled={item.disabled}
                  aria-label={item.label}
                  aria-disabled={item.disabled}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-lg) var(--space-md)',
                    minHeight: '140px',
                    backgroundColor: 'var(--color-surface)',
                    border: `1px solid var(--border-brand)`,
                    borderRadius: 'var(--radius-md)',
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    opacity: item.disabled ? 0.55 : 1,
                    transition: 'var(--transition-base)',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => {
                    if (!item.disabled) {
                      e.currentTarget.style.borderColor = item.colorHex + '70';
                      e.currentTarget.style.backgroundColor = item.colorHex + '0a';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!item.disabled) {
                      e.currentTarget.style.borderColor = 'var(--border-brand)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    }
                  }}
                >
                  <div style={{
                    width: '52px', height: '52px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: item.colorHex + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon style={{ width: '24px', height: '24px', color: item.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', lineHeight: 1.4, maxWidth: '180px', margin: '0 auto' }}>
                      {item.description}
                    </p>
                  </div>
                </button>

                {/* Tooltip Pro */}
                {item.disabled && showProTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--border-brand-hover)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 'var(--space-sm) var(--space-md)',
                      fontSize: 'var(--text-small)',
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      boxShadow: 'var(--shadow-brand)',
                    }}
                    role="tooltip"
                  >
                    ✦ Actualiza a <strong style={{ color: 'var(--color-purple-light)' }}>CertifyX Pro</strong> para desbloquear
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Reports;
