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
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #ebebeb', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: '#d4d4d4 transparent' }}>
        <table role="table" aria-label="Lista de trabajadores" style={{ width: '100%' }}>
          <colgroup>
            <col style={{ width: '220px' }} />  {/* Trabajador */}
            <col style={{ width: '120px' }} className="hidden md:table-column" />  {/* Área */}
            <col className="hidden lg:table-column" />                              {/* Cargo */}
            <col style={{ width: '80px' }} />   {/* Score */}
            <col style={{ width: '100px' }} />  {/* Certs */}
            <col style={{ width: '80px' }} />   {/* Estado */}
            <col style={{ width: '90px' }} />   {/* Acción */}
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid #ebebeb', backgroundColor: '#fafafa' }}>
              {['Trabajador', 'Área|md', 'Cargo|lg', 'Score|center', 'Certs Vigentes|center', 'Estado|center', 'Acción|right'].map(col => {
                const [label, align] = col.split('|');
                const responsive = align === 'md' ? 'hidden md:table-cell' : align === 'lg' ? 'hidden lg:table-cell' : '';
                const textAlign = (align === 'center' || align === 'right') ? align as 'center' | 'right' : 'left';
                return (
                  <th key={label} scope="col" className={responsive} style={{ padding: '12px 20px', textAlign: textAlign, fontSize: '11px', fontWeight: 500, color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
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
                  style={{ borderBottom: index < workers.length - 1 ? '1px solid #ebebeb' : 'none', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {worker.foto ? (
                        <img
                          src={worker.foto}
                          alt={`${worker.nombre} ${worker.apellidos}`}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ebebeb' }}
                        />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#4d4d4d' }}>
                            {initials}
                          </span>
                        </div>
                      )}
                      <div>
                        <p style={{ fontWeight: 500, color: '#171717' }}>
                          {worker.nombre} {worker.apellidos}
                        </p>
                        <p style={{ fontSize: '12px', color: '#666666' }}>{worker.empresa}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell" style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '14px', color: '#171717' }}>{worker.area}</span>
                  </td>
                  <td className="hidden lg:table-cell" style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '14px', color: '#171717' }}>{worker.cargo}</span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span className={`font-display text-xl font-semibold ${scoreColor}`}>
                      {worker.complianceScore}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#297a3a' }}>{activeCerts}</span>
                    <span style={{ color: '#a8a8a8', fontSize: '14px' }}>
                      /{worker.certifications.length}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <StatusIndicator status={status} pulse={status === 'vencido'} />
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', minHeight: '44px', minWidth: '44px', alignItems: 'center', justifyContent: 'center' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => navigate(`/workers/${worker.id}`)}
                      >
                        Ver
                      </Button>
                    </div>
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
