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

// Custom Tooltip for Bar Chart
function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#1a1040',
        border: '1px solid rgba(91,34,119,0.5)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        minWidth: '160px',
      }}>
        <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '6px', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: '22px', fontWeight: 700, color: '#9b6ab5', fontFamily: '"Barlow Condensed"', lineHeight: 1 }}>
          {payload[0].value}%
        </p>
        <p style={{ fontSize: '11px', color: '#4A5568', marginTop: '4px' }}>Cumplimiento promedio</p>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Pie Chart
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: '#1a1040',
        border: '1px solid rgba(91,34,119,0.5)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        minWidth: '140px',
      }}>
        <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '6px' }}>{data.name}</p>
        <p style={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Barlow Condensed"', lineHeight: 1, color: data.payload.color }}>
          {data.value}
        </p>
      </div>
    );
  }
  return null;
}

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
          <Card variant="glass" padding="lg" className="h-[400px]">
            <h3 className="font-display text-lg font-bold text-[#F0F4FF] mb-6">
              Cumplimiento por Área
            </h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={complianceByArea} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="area"
                  tick={{ fill: '#8892A4', fontSize: 12 }}
                  width={70}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(91,34,119,0.08)' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                  {complianceByArea.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
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
          <Card variant="glass" padding="lg" className="h-[400px]">
            <h3 className="font-display text-lg font-bold text-[#F0F4FF] mb-4">
              Estado de Certificaciones
            </h3>
            <div className="flex items-center h-[calc(100%-40px)]">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={certStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {certStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex-1 space-y-3">
                {certStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-[#8892A4]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-[#F0F4FF]">{item.value}</span>
                      <span className="text-xs text-[#4A5568] ml-1">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* SECTION 4: Top Trabajadores en Riesgo */}
      <motion.div
        custom={0.7}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: '32px' }}
      >
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-[#FF3D57]" />
            <h3 className="font-display text-lg font-bold text-[#F0F4FF]">
              Top 10 Trabajadores en Riesgo
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topRiskWorkers.slice(0, showAllRisk ? 10 : 3).map((worker, index) => (
              <div key={worker.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                backgroundColor: index === 0 ? 'rgba(255,61,87,0.06)' : index === 1 ? 'rgba(255,184,0,0.04)' : 'rgba(26,16,64,0.4)',
                borderRadius: '10px',
                border: `1px solid ${index === 0 ? 'rgba(255,61,87,0.2)' : 'rgba(91,34,119,0.15)'}`,
                transition: 'background 0.15s',
              }}>
                {/* Rank */}
                <span style={{ fontFamily: '"Barlow Condensed"', fontSize: '20px', fontWeight: 700, color: index === 0 ? '#FF3D57' : index === 1 ? '#FFB800' : '#4A5568', width: '24px', flexShrink: 0, textAlign: 'center' }}>
                  #{index + 1}
                </span>
                {/* Avatar */}
                {worker.foto
                  ? <img src={worker.foto} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#231455', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#9b6ab5', flexShrink: 0 }}>{worker.nombre[0]}{worker.apellidos[0]}</div>
                }
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', color: '#F0F4FF', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.nombre} {worker.apellidos}</p>
                  <p style={{ fontSize: '11px', color: '#8892A4' }}>{worker.area} · {worker.cargo}</p>
                </div>
                {/* Score */}
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, backgroundColor: worker.scoreColor + '15', color: worker.scoreColor, flexShrink: 0 }}>{worker.complianceScore}%</span>
                {/* Action */}
                <button onClick={() => navigate(`/workers/${worker.id}`)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(91,34,119,0.3)', backgroundColor: 'transparent', color: '#c49fe0', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>Ver</button>
              </div>
            ))}
          </div>

          {/* Expand/Collapse Button */}
          {topRiskWorkers.length > 3 && (
            <button onClick={() => setShowAllRisk(s => !s)} style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(91,34,119,0.3)', backgroundColor: 'transparent', color: '#8892A4', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(91,34,119,0.5)'; e.currentTarget.style.color = '#c49fe0'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(91,34,119,0.3)'; e.currentTarget.style.color = '#8892A4'; }}>
              {showAllRisk ? '▲ Mostrar menos' : `▼ Ver ${topRiskWorkers.length - 3} trabajadores más`}
            </button>
          )}
        </Card>
      </motion.div>

      {/* SECTION 5: Export Panel */}
      <motion.div
        custom={0.8}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-[#9b6ab5]" />
            <h3 className="font-display text-lg font-bold text-[#F0F4FF]">
              Exportar Reportes
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Download, label: 'Exportar Resumen CSV', description: 'Datos de trabajadores y certificaciones', onClick: exportSummaryCSV, disabled: false, color: '#9b6ab5' },
              { icon: FileText, label: 'Reporte SENCE', description: 'Formato texto simulado para SENCE', onClick: exportSENCE, disabled: false, color: '#729362' },
              { icon: ImageIcon, label: 'Exportar Gráficos PNG', description: 'Disponible en versión Pro', onClick: () => setShowProTooltip(!showProTooltip), disabled: true, color: '#FFB800' },
            ].map((item) => (
              <button key={item.label} onClick={item.onClick}
                style={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', padding: '24px 16px',
                  backgroundColor: 'rgba(26,16,64,0.6)',
                  border: `1px solid ${item.disabled ? 'rgba(91,34,119,0.15)' : 'rgba(91,34,119,0.25)'}`,
                  borderRadius: '12px', cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.6 : 1, transition: 'all 0.15s', width: '100%',
                }}
                onMouseEnter={e => { if (!item.disabled) { e.currentTarget.style.borderColor = item.color + '60'; e.currentTarget.style.backgroundColor = item.color + '08'; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = item.disabled ? 'rgba(91,34,119,0.15)' : 'rgba(91,34,119,0.25)'; e.currentTarget.style.backgroundColor = 'rgba(26,16,64,0.6)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon style={{ width: '22px', height: '22px', color: item.color }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#F0F4FF', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontSize: '12px', color: '#4A5568' }}>{item.description}</p>
                </div>
                {item.disabled && showProTooltip && (
                  <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1a1040', border: '1px solid rgba(91,34,119,0.4)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#8892A4', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                    Actualiza a CertifyX Pro para desbloquear
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Reports;
