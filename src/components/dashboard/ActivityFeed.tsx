import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
  UserPlus,
  FileText,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'cert' | 'course' | 'compliance' | 'alert' | 'user' | 'system' | 'renewal';
  message: string;
  timestamp: string;
}

const activities: Activity[] = [
  {
    id: 'a1',
    type: 'cert',
    message: 'Carlos Rodríguez completó certificación Operación de Grúa Horquilla',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'a2',
    type: 'alert',
    message: 'Alejandro Rojas tiene Trabajo en Altura vencido - requiere acción',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'a3',
    type: 'course',
    message: 'María Soto completó 75% de malla Liderazgo y Supervisión',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'a4',
    type: 'user',
    message: 'Nuevo trabajador registrado: Andrea Gutiérrez (Analista de Control)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'a5',
    type: 'renewal',
    message: 'Fernando Castro renovó certificación Primeros Auxilios',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'a6',
    type: 'compliance',
    message: 'Compliance general de Corpa Andina Minera subió a 89%',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'a7',
    type: 'system',
    message: 'Reporte mensual de certificaciones generado automáticamente',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'a8',
    type: 'cert',
    message: 'Mauricio Paredes venció certificación Manejo de HAZMAT',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const activityConfig = {
  cert: { icon: Award, color: '#00E676', borderColor: 'border-[#00E676]/30' },
  course: { icon: BookOpen, color: '#00E5FF', borderColor: 'border-[#00E5FF]/30' },
  compliance: { icon: CheckCircle, color: '#AAFF00', borderColor: 'border-[#AAFF00]/30' },
  alert: { icon: AlertCircle, color: '#FF3D57', borderColor: 'border-[#FF3D57]/30' },
  user: { icon: UserPlus, color: '#00E5FF', borderColor: 'border-[#00E5FF]/30' },
  system: { icon: FileText, color: '#8892A4', borderColor: 'border-[#8892A4]/30' },
  renewal: { icon: RefreshCw, color: '#FFB800', borderColor: 'border-[#FFB800]/30' },
};

export function ActivityFeed() {
  return (
    <div style={{
      backgroundColor: 'rgba(17,24,39,0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,229,255,0.1)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock style={{ width: '20px', height: '20px', color: '#00E5FF' }} />
        <h2 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '18px', fontWeight: 700, color: '#F0F4FF' }}>Actividad Reciente</h2>
      </div>

      {/* Activity List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                borderBottom: '1px solid rgba(0,229,255,0.04)',
                transition: 'background 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(28,35,51,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Icon indicator */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: `${config.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: '16px', height: '16px', color: config.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: '#F0F4FF', marginBottom: '2px', lineHeight: 1.4 }}>{activity.message}</p>
                <p style={{ fontSize: '11px', color: '#4A5568' }}>
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
