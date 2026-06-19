import { motion } from 'framer-motion';
import type { Certification } from '../../types';
import { Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/dates';

interface CertTimelineProps {
  certs: Certification[];
}

const statusConfig = {
  vigente:       { icon: CheckCircle, color: '#297a3a', bg: '#f0f7f1' },
  proximo_vencer:{ icon: Clock,       color: '#b25000', bg: '#fdf3ed' },
  vencido:       { icon: AlertCircle, color: '#e5484d', bg: '#fdf2f2' },
  pendiente:     { icon: Award,       color: '#a6bbd1', bg: '#e7edf6' },
};

export function CertTimeline({ certs }: CertTimelineProps) {
  const sortedCerts = [...certs].sort(
    (a, b) => new Date(b.fechaObtension).getTime() - new Date(a.fechaObtension).getTime()
  );

  return (
    <div className="py-4">
      {/* Timeline Track */}
      <div className="relative">
        {/* Track Line */}
        <div
          className="absolute top-6 left-0 right-0 h-px"
          style={{ backgroundColor: 'var(--border-default)' }}
        />

        {/* Points */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {sortedCerts.map((cert, index) => {
            const config = statusConfig[cert.estado];
            const Icon = config.icon;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="flex flex-col items-center min-w-[120px] relative"
              >
                {/* Point */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border z-10"
                  style={{ backgroundColor: config.bg, borderColor: config.color }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} strokeWidth={1.5} />
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p className="text-xs font-medium truncate max-w-[100px]" style={{ color: 'var(--color-brand)' }}>
                    {cert.nombre.length > 20 ? cert.nombre.slice(0, 18) + '...' : cert.nombre}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(cert.fechaObtension)}
                  </p>
                  <div
                    className="w-2 h-2 rounded-full mx-auto mt-1.5"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
