import { motion } from 'framer-motion';
import type { Certification } from '../../types';
import { Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/dates';

interface CertTimelineProps {
  certs: Certification[];
}

const statusConfig = {
  vigente: { icon: CheckCircle, color: '#729362', bg: 'bg-[rgba(114,147,98,0.15)]' },
  proximo_vencer: { icon: Clock, color: '#FFB800', bg: 'bg-[rgba(255,184,0,0.15)]' },
  vencido: { icon: AlertCircle, color: '#FF3D57', bg: 'bg-[rgba(255,61,87,0.15)]' },
  pendiente: { icon: Award, color: '#7c4dab', bg: 'bg-[rgba(91,34,119,0.15)]' },
};

export function CertTimeline({ certs }: CertTimelineProps) {
  const sortedCerts = [...certs].sort(
    (a, b) => new Date(b.fechaObtension).getTime() - new Date(a.fechaObtension).getTime()
  );

  return (
    <div className="py-4">
      {/* Timeline Track */}
      <div className="relative">
        {/* Gradient Line */}
        <div
          className="absolute top-6 left-0 right-0 h-0.5"
          style={{
            background: 'linear-gradient(90deg, #729362 0%, #FFB800 50%, #FF3D57 100%)',
            opacity: 0.3,
          }}
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
                  className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center border-2 z-10`}
                  style={{ borderColor: config.color }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-[#F0F4FF] font-medium truncate max-w-[100px]">
                    {cert.nombre.length > 20 ? cert.nombre.slice(0, 18) + '...' : cert.nombre}
                  </p>
                  <p className="text-xs text-[#8892A4] mt-0.5">
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
