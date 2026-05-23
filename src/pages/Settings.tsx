import { motion } from 'framer-motion';
import { Settings2, Bell, Shield, Users, Database } from 'lucide-react';
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

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="font-display text-3xl font-bold text-gradient tracking-tight">
          Configuración
        </h1>
        <p className="text-[#8892A4] mt-1">
          Gestiona preferencias y opciones del sistema
        </p>
      </motion.div>

      {/* Coming Soon Card */}
      <motion.div
        custom={0.2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Card variant="glass" padding="lg" className="text-center py-16">
          <div className="inline-flex p-4 bg-[rgba(91,34,119,0.15)] rounded-full mb-6">
            <Settings2 className="w-12 h-12 text-[#9b6ab5]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#F0F4FF] mb-3">
            Próximamente
          </h2>
          <p className="text-[#8892A4] max-w-md mx-auto mb-8">
            El panel de configuración está en desarrollo. Pronto podrás gestionar usuarios,
            notificaciones, integraciones y más.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-[#231455]/60 rounded-sm flex items-center gap-4">
              <Users className="w-6 h-6 text-[#8a9e52]" />
              <div className="text-left">
                <p className="text-sm text-[#F0F4FF]">Usuarios y roles</p>
                <p className="text-xs text-[#8892A4]">Gestión de permisos</p>
              </div>
            </div>
            <div className="p-4 bg-[#231455]/60 rounded-sm flex items-center gap-4">
              <Bell className="w-6 h-6 text-[#9b6ab5]" />
              <div className="text-left">
                <p className="text-sm text-[#F0F4FF]">Notificaciones</p>
                <p className="text-xs text-[#8892A4]">Alertas y recordatorios</p>
              </div>
            </div>
            <div className="p-4 bg-[#231455]/60 rounded-sm flex items-center gap-4">
              <Shield className="w-6 h-6 text-[#FFB800]" />
              <div className="text-left">
                <p className="text-sm text-[#F0F4FF]">Seguridad</p>
                <p className="text-xs text-[#8892A4]">Autenticación y acceso</p>
              </div>
            </div>
            <div className="p-4 bg-[#231455]/60 rounded-sm flex items-center gap-4">
              <Database className="w-6 h-6 text-[#FF3D57]" />
              <div className="text-left">
                <p className="text-sm text-[#F0F4FF]">Datos</p>
                <p className="text-xs text-[#8892A4]">Backup y restauración</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Settings;
