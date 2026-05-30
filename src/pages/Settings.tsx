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
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
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
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Próximamente
          </h2>
          <p className="max-w-md mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            El panel de configuración está en desarrollo. Pronto podrás gestionar usuarios,
            notificaciones, integraciones y más.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'rgba(35,20,85,0.6)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-brand)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--color-purple-mid)' }} />
              <div className="text-left">
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Usuarios y roles</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Gestión de permisos</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'rgba(35,20,85,0.6)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-brand)' }}>
              <Bell className="w-6 h-6" style={{ color: 'var(--color-purple-mid)' }} />
              <div className="text-left">
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Notificaciones</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Alertas y recordatorios</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'rgba(35,20,85,0.6)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-brand)' }}>
              <Shield className="w-6 h-6" style={{ color: 'var(--color-purple-mid)' }} />
              <div className="text-left">
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Seguridad</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Autenticación y acceso</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'rgba(35,20,85,0.6)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-brand)' }}>
              <Database className="w-6 h-6" style={{ color: 'var(--color-purple-mid)' }} />
              <div className="text-left">
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Datos</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Backup y restauración</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Settings;
