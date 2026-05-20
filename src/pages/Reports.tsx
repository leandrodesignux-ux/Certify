import { motion } from 'framer-motion';
import { FileText, BarChart3, Download, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
            <h1 className="font-display text-3xl font-bold text-[#F0F4FF] tracking-tight">
              Reportes
            </h1>
            <p className="text-[#8892A4] mt-1">
              Generación de informes y análisis de cumplimiento
            </p>
          </div>
          <Button variant="ghost" size="md" icon={Download}>
            Exportar todo
          </Button>
        </div>
      </motion.div>

      {/* Coming Soon Card */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card variant="glass" padding="lg" className="text-center py-16">
          <div className="inline-flex p-4 bg-[rgba(0,229,255,0.1)] rounded-full mb-6">
            <BarChart3 className="w-12 h-12 text-[#00E5FF]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#F0F4FF] mb-3">
            Próximamente
          </h2>
          <p className="text-[#8892A4] max-w-md mx-auto mb-8">
            Estamos desarrollando un módulo completo de reportes con análisis de compliance,
            exportación a Excel/PDF, y dashboards personalizables.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-[#1C2333]/50 rounded-sm">
              <FileText className="w-6 h-6 text-[#AAFF00] mx-auto mb-2" />
              <p className="text-sm text-[#F0F4FF]">Reportes SENCE</p>
              <p className="text-xs text-[#8892A4]">Formato oficial</p>
            </div>
            <div className="p-4 bg-[#1C2333]/50 rounded-sm">
              <BarChart3 className="w-6 h-6 text-[#00E5FF] mx-auto mb-2" />
              <p className="text-sm text-[#F0F4FF]">Análisis de tendencias</p>
              <p className="text-xs text-[#8892A4]">Mensual/anual</p>
            </div>
            <div className="p-4 bg-[#1C2333]/50 rounded-sm">
              <Clock className="w-6 h-6 text-[#FFB800] mx-auto mb-2" />
              <p className="text-sm text-[#F0F4FF]">Programación</p>
              <p className="text-xs text-[#8892A4]">Reportes automáticos</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
