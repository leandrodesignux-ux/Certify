import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Worker } from '../../types';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/StatusIndicator';
import { getComplianceColor } from '../../utils/colors';
import { Eye } from 'lucide-react';

interface WorkerTableProps {
  workers: Worker[];
}

export function WorkerTable({ workers }: WorkerTableProps) {
  const navigate = useNavigate();

  const getWorkerStatus = (worker: Worker): 'vigente' | 'proximo_vencer' | 'vencido' => {
    const hasExpired = worker.certifications.some((c) => c.estado === 'vencido');
    const hasNearExpiry = worker.certifications.some((c) => c.estado === 'proximo_vencer');
    if (hasExpired) return 'vencido';
    if (hasNearExpiry) return 'proximo_vencer';
    return 'vigente';
  };

  return (
    <div className="bg-[#1a1040]/90 backdrop-blur-[12px] border border-[rgba(91,34,119,0.2)] rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(91,34,119,0.2)]">
              <th className="px-5 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Trabajador
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Área
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Score
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Certs Vigentes
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Estado
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-[#a89fc4] uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(91,34,119,0.1)]">
            {workers.map((worker, index) => {
              const status = getWorkerStatus(worker);
              const scoreColor = getComplianceColor(worker.complianceScore);
              const initials = `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase();
              const activeCerts = worker.certifications.filter(
                (c) => c.estado === 'vigente'
              ).length;

              return (
                <motion.tr
                  key={worker.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="hover:bg-[rgba(91,34,119,0.08)] transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {worker.foto ? (
                        <img
                          src={worker.foto}
                          alt={`${worker.nombre} ${worker.apellidos}`}
                          className="w-10 h-10 rounded-full object-cover border border-[rgba(91,34,119,0.3)]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#231455] border border-[rgba(91,34,119,0.3)] flex items-center justify-center">
                          <span className="font-display text-sm font-semibold text-[#c49fe0]">
                            {initials}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#F0F4FF]">
                          {worker.nombre} {worker.apellidos}
                        </p>
                        <p className="text-xs text-[#8892A4]">{worker.empresa}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#F0F4FF]">{worker.area}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#F0F4FF]">{worker.cargo}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-display text-xl font-bold ${scoreColor}`}>
                      {worker.complianceScore}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-mono text-sm text-[#8fb87a]">{activeCerts}</span>
                    <span className="text-[#4A5568] text-sm">
                      /{worker.certifications.length}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      <StatusIndicator status={status} pulse={status === 'vencido'} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate(`/workers/${worker.id}`)}
                    >
                      Ver
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
