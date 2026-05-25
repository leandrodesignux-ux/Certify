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
import { Button } from '../components/ui/Button';
import { useWorkerStore } from '../store/useWorkerStore';
import { useCertStore } from '../store/useCertStore';
import { useNavigate } from 'react-router-dom';

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

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

function KPICard({ title, value, subtitle, icon: Icon, color, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      custom={delay}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <Card variant="glass" padding="lg" className="h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
        <p className="text-sm text-[#8892A4] mb-1">{title}</p>
        <p
          className="text-3xl font-display font-bold"
          style={{ color }}
        >
          {value}
        </p>
        {subtitle && <p className="text-xs text-[#4A5568] mt-2">{subtitle}</p>}
      </Card>
    </motion.div>
  );
}

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
      let color = '#FF3D57';
      if (avgScore > 80) color = '#729362';
      else if (avgScore > 60) color = '#FFB800';

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
      { name: 'Vigentes', value: vigentes, color: '#729362', percentage: ((vigentes / total) * 100).toFixed(1) },
      { name: 'Próx. vencer', value: proximas, color: '#FFB800', percentage: ((proximas / total) * 100).toFixed(1) },
      { name: 'Vencidas', value: vencidas, color: '#FF3D57', percentage: ((vencidas / total) * 100).toFixed(1) },
      { name: 'Pendientes', value: pendientes, color: '#8892A4', percentage: ((pendientes / total) * 100).toFixed(1) },
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
        
        let scoreColor = '#FF3D57';
        if (worker.complianceScore >= 80) scoreColor = '#729362';
        else if (worker.complianceScore >= 60) scoreColor = '#FFB800';

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
    if (score >= 80) return '#729362';
    if (score >= 60) return '#FFB800';
    return '#FF3D57';
  };

  const getComplianceLabel = (score: number) => {
    if (score >= 80) return 'Óptimo';
    if (score >= 60) return 'Regular';
    return 'Crítico';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient tracking-tight">
              Reportes y Análisis
            </h1>
            <p className="text-[#8892A4] mt-1">
              Dashboard de compliance y exportación de datos
            </p>
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: KPI Header Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        <KPICard
          title="Índice de Cumplimiento Global"
          value={`${kpis.avgCompliance}%`}
          subtitle={getComplianceLabel(kpis.avgCompliance)}
          icon={TrendingUp}
          color={getComplianceColor(kpis.avgCompliance)}
          delay={0.1}
        />
        <KPICard
          title="Certificaciones Activas"
          value={kpis.activeCerts}
          subtitle={`de ${certifications.length} totales`}
          icon={Award}
          color="#729362"
          delay={0.2}
        />
        <KPICard
          title="Vencimientos Próximos 30 días"
          value={kpis.expiringSoon}
          subtitle="Requieren atención inmediata"
          icon={Clock}
          color="#FFB800"
          delay={0.3}
        />
        <KPICard
          title="Trabajadores en Riesgo"
          value={kpis.workersAtRisk}
          subtitle={`de ${workers.length} totales`}
          icon={AlertTriangle}
          color="#FF3D57"
          delay={0.4}
        />
      </div>

      {/* SECTION 2 & 3: Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      >
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-[#FF3D57]" />
            <h3 className="font-display text-lg font-bold text-[#F0F4FF]">
              Top 10 Trabajadores en Riesgo
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[rgba(91,34,119,0.2)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                    Trabajador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                    Certs Vencidas
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                    Certs Por Vencer
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {topRiskWorkers.map((worker, index) => (
                  <tr
                    key={worker.id}
                    className="group hover:bg-[rgba(91,34,119,0.08)] transition-colors"
                    style={{
                      backgroundColor: index % 2 === 0 ? 'rgba(26,16,64,0.3)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {worker.foto ? (
                          <img
                            src={worker.foto}
                            alt={`${worker.nombre} ${worker.apellidos}`}
                            className="w-8 h-8 rounded-full object-cover border border-[rgba(91,34,119,0.3)]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#231455] border border-[rgba(91,34,119,0.3)] flex items-center justify-center">
                            <span className="text-xs font-semibold text-[#c49fe0]">
                              {worker.nombre[0]}{worker.apellidos[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-[#F0F4FF]">
                            {worker.nombre} {worker.apellidos}
                          </p>
                          <p className="text-xs text-[#4A5568]">{worker.cargo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8892A4]">{worker.area}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: `${worker.scoreColor}15`,
                          color: worker.scoreColor,
                        }}
                      >
                        {worker.complianceScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${worker.expiredCount > 0 ? 'text-[#FF3D57] font-medium' : 'text-[#8892A4]'}`}>
                        {worker.expiredCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${worker.expiringCount > 0 ? 'text-[#FFB800] font-medium' : 'text-[#8892A4]'}`}>
                        {worker.expiringCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/workers/${worker.id}`)}
                      >
                        Ver perfil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <Button
              variant="ghost"
              size="lg"
              icon={Download}
              onClick={exportSummaryCSV}
              className="justify-center h-auto py-4 flex-col items-center gap-3"
            >
              <span className="font-medium">Exportar Resumen CSV</span>
              <span className="text-xs text-[#4A5568] font-normal">
                Datos de trabajadores y certificaciones
              </span>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              icon={FileText}
              onClick={exportSENCE}
              className="justify-center h-auto py-4 flex-col items-center gap-3"
            >
              <span className="font-medium">Reporte SENCE (simulado)</span>
              <span className="text-xs text-[#4A5568] font-normal">
                Formato texto para SENCE
              </span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="lg"
                icon={ImageIcon}
                onClick={() => setShowProTooltip(!showProTooltip)}
                className="justify-center h-auto py-4 flex-col items-center gap-3 w-full opacity-70"
              >
                <span className="font-medium">Exportar Gráficos PNG</span>
                <span className="text-xs text-[#4A5568] font-normal">
                  Disponible en versión Pro
                </span>
              </Button>
              
              {showProTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#231455] border border-[rgba(91,34,119,0.35)] rounded-lg text-xs text-[#8892A4] whitespace-nowrap z-10"
                >
                  Actualiza a CertifyX Pro para desbloquear
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[rgba(91,34,119,0.35)]" />
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Reports;
