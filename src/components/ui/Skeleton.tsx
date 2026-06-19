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
        backgroundColor: 'var(--surface-soft)',
        borderRadius: rounded ? 'var(--radius-full)' : 'var(--radius-sm)',
      }}
    />
  );
}
