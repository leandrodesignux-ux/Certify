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
    <div className="bg-[#111827]/80 backdrop-blur-[12px] border border-[rgba(0,229,255,0.1)] rounded-sm h-[400px] flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(0,229,255,0.1)] flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#00E5FF]" />
        <h2 className="font-display text-lg font-semibold text-[#F0F4FF]">Actividad Reciente</h2>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-[rgba(0,229,255,0.05)]">
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className={`px-5 py-3 border-l-2 ${config.borderColor} hover:bg-[#1C2333]/30 transition-colors duration-150`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-1.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F0F4FF] line-clamp-2">{activity.message}</p>
                    <p className="text-xs text-[#4A5568] mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
