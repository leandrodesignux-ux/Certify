import { Skeleton } from '../ui/Skeleton';

export function CertTableSkeleton() {
  return (
    <tbody>
      {[...Array(8)].map((_, index) => (
        <tr key={index} style={{ backgroundColor: 'transparent' }}>
          {/* Trabajador column */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton width="32px" height="32px" rounded={true} />
              <div className="flex flex-col gap-1">
                <Skeleton width="120px" height="16px" />
                <Skeleton width="80px" height="12px" />
              </div>
            </div>
          </td>

          {/* Certificación column */}
          <td className="px-4 py-3">
            <div className="flex flex-col gap-1">
              <Skeleton width="160px" height="16px" />
              <Skeleton width="100px" height="12px" />
            </div>
          </td>

          {/* Tipo column */}
          <td className="px-4 py-3">
            <Skeleton width="60px" height="24px" rounded={true} />
          </td>

          {/* Vencimiento column */}
          <td className="px-4 py-3">
            <div className="flex flex-col gap-1">
              <Skeleton width="90px" height="16px" />
              <Skeleton width="40px" height="12px" />
            </div>
          </td>

          {/* Estado column */}
          <td className="px-4 py-3 text-center">
            <Skeleton width="70px" height="24px" rounded={true} />
          </td>

          {/* Fecha Obtención column */}
          <td className="px-4 py-3">
            <Skeleton width="90px" height="16px" />
          </td>

          {/* Detalle column */}
          <td className="px-4 py-3 text-center">
            <Skeleton width="32px" height="32px" rounded={true} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
