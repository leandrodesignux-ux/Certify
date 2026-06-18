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
          borderBottom: '1px solid #ebebeb',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {/* Trabajador */}
        <td 
          className="px-4 py-3"
          style={{ 
            borderRight: '1px solid #ebebeb',
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
                backgroundColor: '#f0f0f0',
                border: '1px solid #ebebeb',
                color: '#4d4d4d',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="text-sm font-medium truncate" style={{ maxWidth: '180px', color: '#171717' }}>
                {worker ? `${worker.nombre} ${worker.apellidos}` : 'Trabajador no encontrado'}
              </p>
              <p className="text-xs truncate" style={{ maxWidth: '180px', color: '#666666' }}>
                {worker?.cargo || 'Sin cargo'}
              </p>
            </div>
          </div>
        </td>

        {/* Certificación */}
        <td className="px-4 py-3">
          <div>
            <p className="text-sm truncate mb-1" style={{ maxWidth: '200px', color: '#171717' }}>
              {cert.nombre}
            </p>
            <p className="text-xs truncate" style={{ maxWidth: '200px', color: '#666666' }}>
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
            <p className="text-sm mb-1" style={{ color: '#171717' }}>
              {formatDate(cert.fechaVencimiento)}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '40px', 
                height: '4px', 
                backgroundColor: '#ebebeb', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(Math.max((cert.diasRestantes / 365) * 100, 0), 100)}%`,
                  height: '100%',
                  backgroundColor: cert.diasRestantes <= 0 ? '#e5484d' : cert.diasRestantes <= 60 ? '#b25000' : '#297a3a',
                  borderRadius: '2px'
                }} />
              </div>
              <span style={{ 
                fontSize: '11px', 
                color: cert.diasRestantes <= 0 ? '#e5484d' : cert.diasRestantes <= 60 ? '#b25000' : '#297a3a',
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
          <span className="text-sm" style={{ color: '#171717' }}>
            {formatDate(cert.fechaObtension)}
          </span>
        </td>

        {/* Detalle */}
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => onEyeClick(cert.id)}
            className="p-1.5 rounded-md transition-colors"
            title="Ver detalle"
            aria-label={`Ver detalle de ${cert.nombre}`}
            style={{ color: '#4d4d4d' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Eye className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </td>
      </motion.tr>
    </>
  );
});
