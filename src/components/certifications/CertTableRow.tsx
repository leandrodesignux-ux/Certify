import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils/dates';
import type { Certification, Worker } from '../../types';

interface CertTableRowProps {
  cert: Certification;
  worker: Worker | undefined;
  index: number;
  onEyeClick: (certId: string) => void;
}

export const CertTableRow = React.memo(function CertTableRow({ 
  cert, 
  worker, 
  index, 
  onEyeClick 
}: CertTableRowProps) {
  const initials = worker
    ? `${worker.nombre[0]}${worker.apellidos[0]}`.toUpperCase()
    : '?';
  const borderColor = cert.estado === 'vigente' ? '#729362' : cert.estado === 'proximo_vencer' ? '#FFB800' : cert.estado === 'vencido' ? '#FF3D57' : '#7c4dab';

  return (
    <>
      <motion.tr
        key={cert.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
        className="group cursor-pointer"
        style={{
          borderBottom: `1px solid ${borderColor}20`,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(91,34,119,0.04)';
          e.currentTarget.style.borderBottomColor = borderColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderBottomColor = `${borderColor}20`;
        }}
      >
        {/* Trabajador */}
        <td 
          className="px-4 py-3"
          style={{ 
            borderRight: '1px solid rgba(91,34,119,0.1)',
            verticalAlign: 'middle'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="flex items-center justify-center text-sm font-medium"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: worker ? `${worker.area === 'Producción' ? '#FF3D57' : worker.area === 'Calidad' ? '#8a9e52' : worker.area === 'Mantenimiento' ? '#FFB800' : '#9b6ab5'}15` : '#4A556815',
                color: worker ? (worker.area === 'Producción' ? '#FF3D57' : worker.area === 'Calidad' ? '#8a9e52' : worker.area === 'Mantenimiento' ? '#FFB800' : '#9b6ab5') : '#4A5568',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="text-sm text-[#F0F4FF] font-medium truncate" style={{ maxWidth: '180px' }}>
                {worker ? `${worker.nombre} ${worker.apellidos}` : 'Trabajador no encontrado'}
              </p>
              <p className="text-xs text-[#6B7280] truncate" style={{ maxWidth: '180px' }}>
                {worker?.cargo || 'Sin cargo'}
              </p>
            </div>
          </div>
        </td>

        {/* Certificación */}
        <td className="px-4 py-3">
          <div>
            <p className="text-sm text-[#F0F4FF] truncate mb-1" style={{ maxWidth: '200px' }}>
              {cert.nombre}
            </p>
            <p className="text-xs text-[#6B7280] truncate" style={{ maxWidth: '200px' }}>
              {cert.emisor}
            </p>
          </div>
        </td>

        {/* Tipo */}
        <td className="px-4 py-3">
          <Badge
            status={cert.tipo}
            label={
              cert.tipo === 'obligatoria'
                ? 'Obligatoria'
                : cert.tipo === 'complementaria'
                ? 'Complementaria'
                : cert.tipo === 'legal'
                ? 'Legal'
                : cert.tipo
            }
          />
        </td>

        {/* Vencimiento */}
        <td className="px-4 py-3">
          <div>
            <p className="text-sm text-[#F0F4FF] mb-1">
              {formatDate(cert.fechaVencimiento)}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '40px', 
                height: '4px', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(Math.max((cert.diasRestantes / 365) * 100, 0), 100)}%`,
                  height: '100%',
                  backgroundColor: cert.diasRestantes <= 0 ? '#FF3D57' : cert.diasRestantes <= 60 ? '#FFB800' : '#729362',
                  borderRadius: '2px'
                }} />
              </div>
              <span style={{ 
                fontSize: '11px', 
                color: cert.diasRestantes <= 0 ? '#FF3D57' : cert.diasRestantes <= 60 ? '#FFB800' : '#729362',
                fontWeight: 500
              }}>
                {cert.diasRestantes > 0 ? `${cert.diasRestantes}d` : 'Vencido'}
              </span>
            </div>
          </div>
        </td>

        {/* Estado */}
        <td className="px-4 py-3 text-center">
          <Badge status={cert.estado} />
        </td>

        {/* Fecha Obtención */}
        <td className="px-4 py-3 hidden md:table-cell">
          <span className="text-sm text-[#F0F4FF]">
            {formatDate(cert.fechaObtension)}
          </span>
        </td>

        {/* Detalle */}
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => onEyeClick(cert.id)}
            className="p-1.5 rounded-md hover:bg-[rgba(91,34,119,0.15)] transition-colors"
            title="Ver detalle"
            aria-label={`Ver detalle de ${cert.nombre}`}
          >
            <Eye className="w-4 h-4 text-[#9b6ab5]" />
          </button>
        </td>
      </motion.tr>
    </>
  );
});
