interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = '16px', className = '', rounded = false }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${className}`}
      style={{
        width,
        height,
        backgroundColor: 'rgba(91,34,119,0.12)',
        borderRadius: rounded ? '9999px' : '4px',
      }}
    />
  );
}
