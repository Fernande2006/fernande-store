// Élément signature du site : la "route commerciale" en pointillés
// qui relie les pays de sourcing, en écho direct au logo (avion +
// trajectoire en pointillés autour du globe). Réutilisé dans le
// Hero et le Footer pour créer un fil visuel cohérent.

export default function RouteLine({ stops = ["Paris", "Guangzhou", "Cotonou"] }) {
  const n = stops.length;
  const width = 900;
  const y = 40;
  const marginX = 60;
  const step = (width - marginX * 2) / (n - 1);

  const points = stops.map((label, i) => ({
    label,
    x: marginX + step * i,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} 80`}
        className="w-full min-w-[560px] h-16"
        aria-hidden="true"
      >
        <line
          x1={points[0].x}
          y1={y}
          x2={points[n - 1].x}
          y2={y}
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          className="route-dash"
          opacity="0.55"
        />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle
              cx={p.x}
              cy={y}
              r={i === n - 1 ? 6 : 4.5}
              fill={i === n - 1 ? "var(--color-route)" : "var(--color-ink)"}
            />
            <text
              x={p.x}
              y={y + 26}
              textAnchor="middle"
              className="font-mono"
              fontSize="12"
              letterSpacing="0.08em"
              fill="var(--color-ink-soft)"
            >
              {p.label.toUpperCase()}
            </text>
          </g>
        ))}
        {/* avion au point médian, orienté vers la destination */}
        <g transform={`translate(${points[Math.floor((n - 1) / 2)].x + step / 2}, ${y})`}>
          <path
            d="M -9 0 L 7 -4 L 3 0 L 7 4 Z"
            fill="var(--color-route)"
          />
        </g>
      </svg>
    </div>
  );
}
