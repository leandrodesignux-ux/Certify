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
  cert:       { icon: Award,       color: '#297a3a' },
  course:     { icon: BookOpen,    color: '#4d4d4d' },
  compliance: { icon: CheckCircle, color: '#297a3a' },
  alert:      { icon: AlertCircle, color: '#e5484d' },
  user:       { icon: UserPlus,    color: '#171717' },
  system:     { icon: FileText,    color: '#a8a8a8' },
  renewal:    { icon: RefreshCw,   color: '#b25000' },
};

export function ActivityFeed() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #ebebeb',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock style={{ width: '20px', height: '20px', color: '#4d4d4d' }} strokeWidth={1.5} />
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#171717', letterSpacing: '-0.02em' }}>Actividad Reciente</h2>
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
                borderBottom: '1px solid #ebebeb',
                transition: 'background 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Icon indicator */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0,
                backgroundColor: '#f5f5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: '16px', height: '16px', color: config.color }} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: '#171717', marginBottom: '2px', lineHeight: 1.4 }}>{activity.message}</p>
                <p style={{ fontSize: '11px', color: '#a8a8a8' }}>
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
