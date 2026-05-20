interface ExpiryBadgeProps {
  diasRestantes: number;
}

export function ExpiryBadge({ diasRestantes }: ExpiryBadgeProps) {
  const getStyle = () => {
    if (diasRestantes <= 0) {
      return {
        text: 'VENCIDO',
        className: 'bg-[rgba(255,61,87,0.15)] text-[#FF3D57] border-[rgba(255,61,87,0.3)] animate-glow-pulse',
      };
    }
    if (diasRestantes <= 15) {
      return {
        text: `${diasRestantes}d`,
        className: 'bg-[rgba(255,61,87,0.1)] text-[#FF3D57] border-[rgba(255,61,87,0.3)]',
      };
    }
    if (diasRestantes <= 60) {
      return {
        text: `${diasRestantes}d`,
        className: 'bg-[rgba(255,184,0,0.1)] text-[#FFB800] border-[rgba(255,184,0,0.3)]',
      };
    }
    return {
      text: `${diasRestantes}d`,
      className: 'bg-[rgba(170,255,0,0.1)] text-[#AAFF00] border-[rgba(170,255,0,0.3)]',
    };
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium border rounded-sm ${style.className}`}
    >
      {style.text}
    </span>
  );
}
