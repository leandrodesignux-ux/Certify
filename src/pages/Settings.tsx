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
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: '#171717', letterSpacing: '-0.02em' }}>
          Configuración
        </h1>
        <p style={{ color: '#666666', marginTop: '4px' }}>
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
          <div className="inline-flex p-4 rounded-full mb-6" style={{ backgroundColor: '#f5f5f5', border: '1px solid #ebebeb' }}>
            <Settings2 className="w-12 h-12" style={{ color: '#a8a8a8' }} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#171717', letterSpacing: '-0.02em' }}>
            Próximamente
          </h2>
          <p className="max-w-md mx-auto mb-8" style={{ color: '#666666' }}>
            El panel de configuración está en desarrollo. Pronto podrás gestionar usuarios,
            notificaciones, integraciones y más.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Users,    label: 'Usuarios y roles',   sub: 'Gestión de permisos' },
              { icon: Bell,     label: 'Notificaciones',     sub: 'Alertas y recordatorios' },
              { icon: Shield,   label: 'Seguridad',          sub: 'Autenticación y acceso' },
              { icon: Database, label: 'Datos',              sub: 'Backup y restauración' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="p-4 flex items-center gap-4" style={{ backgroundColor: '#fafafa', borderRadius: 'var(--radius-sm)', border: '1px solid #ebebeb' }}>
                <Icon className="w-6 h-6" style={{ color: '#a8a8a8' }} strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-sm" style={{ color: '#171717' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#666666' }}>{sub}</p>
                </div>
              </div>
            ))}

          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Settings;
