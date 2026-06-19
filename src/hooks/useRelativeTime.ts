import { useEffect, useState } from 'react';

/**
 * Returns a relative time string ("hace 5 min", "ayer", etc.) that
 * re-renders periodically. Self-throttles the interval based on age:
 * - Under 1 hour → updates every 60s
 * - Under 1 day → updates every 5 min
 * - Over 1 day → no auto-update needed (text doesn't change daily)
 */
export function useRelativeTime(dateString: string): string {
  const compute = () => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  const [text, setText] = useState(compute);

  useEffect(() => {
    const update = () => setText(compute());
    update();

    const diffMs = Date.now() - new Date(dateString).getTime();
    const intervalMs = diffMs < 3600000 ? 60000
      : diffMs < 86400000 ? 300000
      : 0;

    if (intervalMs === 0) return;
    const id = window.setInterval(update, intervalMs);
    return () => clearInterval(id);
  }, [dateString]);

  return text;
}
