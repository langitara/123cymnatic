/**
 * SparkLine.jsx
 * A pure SVG mini-sparkline chart component.
 * No external chart library required — lightweight and fast.
 *
 * Props:
 *   data     {number[]}  — array of price values (most recent last)
 *   positive {boolean}   — true = green line, false = red line
 *   width    {number}    — SVG width in px  (default 120)
 *   height   {number}    — SVG height in px (default 40)
 */

const SparkLine = ({ data = [], positive = true, width = 120, height = 40 }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid div-by-zero

  // Padding so the line doesn't clip at the edges
  const padX = 4;
  const padY = 4;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  // Map each data point to SVG (x, y) coordinates
  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * innerW;
    const y = padY + (1 - (v - min) / range) * innerH;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  // Build the filled area path (polyline + close bottom)
  const firstX = padX;
  const lastX = padX + innerW;
  const bottomY = padY + innerH;
  const areaPath = `M${firstX},${bottomY} L${points.join(' L')} L${lastX},${bottomY} Z`;

  // Colors
  const strokeColor = positive ? '#10b981' : '#f43f5e';
  const fillColor   = positive ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)';
  const gradId      = `spark-grad-${positive ? 'g' : 'r'}-${Math.random().toString(36).slice(2,7)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={strokeColor} stopOpacity="0.20" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
        </linearGradient>
      </defs>

      {/* Filled area under the line */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* The line itself */}
      <polyline
        points={polyline}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dot at the last (current) price point */}
      <circle
        cx={lastX}
        cy={points[points.length - 1].split(',')[1]}
        r="2.5"
        fill={strokeColor}
        opacity="0.9"
      />
    </svg>
  );
};

export default SparkLine;
