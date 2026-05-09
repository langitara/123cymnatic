/**
 * ChartPanel.jsx
 * Large main chart container — D3.js ready.
 *
 * This component renders a beautiful, polished chart area with:
 *  - Timeframe selector (1D, 1W, 1M, 1Y, All)
 *  - A styled div#main-chart-area for D3.js injection
 *  - Animated SVG placeholder (sine wave path) until D3 is connected
 *  - Axis labels, grid lines, and a legend
 *
 * === HOW TO INTEGRATE D3.js ===
 * 1. Install: npm install d3
 * 2. Import:  import * as d3 from 'd3'
 * 3. useEffect: target `#main-chart-area` and render your D3 chart there
 * 4. Remove the <PlaceholderChart> component below
 */

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Info, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateChartSeries } from '../data/mockData';

// ------------------------------------------------------------------
// Timeframe Configuration
// ------------------------------------------------------------------
const TIMEFRAMES = [
  { key: '1D',  label: '1D' },
  { key: '1W',  label: '1W' },
  { key: '1M',  label: '1M' },
  { key: '6M',  label: '6M' },
  { key: '1Y',  label: '1Y' },
  { key: 'ALL', label: 'All' },
];

// ------------------------------------------------------------------
// Placeholder Chart — pure SVG animated sine wave
// Replace this entire component with your D3 implementation
// ------------------------------------------------------------------
const PlaceholderChart = ({ data, positive }) => {
  const svgRef  = useRef(null);
  const width   = 900;
  const height  = 280;
  const padX    = 60;
  const padY    = 24;
  const innerW  = width  - padX * 2;
  const innerH  = height - padY * 2;

  if (!data || data.length < 2) return null;

  const values  = data.map(d => d.v);
  const times   = data.map(d => d.t);
  const minV    = Math.min(...values) * 0.998;
  const maxV    = Math.max(...values) * 1.002;
  const rangeV  = maxV - minV;
  const minT    = times[0];
  const maxT    = times[times.length - 1];
  const rangeT  = maxT - minT;

  // Map data to SVG coords
  const pts = data.map(d => ({
    x: padX + ((d.t - minT) / rangeT) * innerW,
    y: padY + (1 - (d.v - minV) / rangeV) * innerH,
  }));

  // Build SVG path (smooth curve using cubic bezier)
  const toPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      d += ` C ${cp1x},${p0.y} ${cp2x},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const linePath = toPath(pts);

  // Area path (close below the line)
  const areaPath = `${linePath} L ${pts[pts.length-1].x},${padY + innerH} L ${pts[0].x},${padY + innerH} Z`;

  const strokeColor = positive ? '#10b981' : '#f43f5e';
  const gradId = 'chart-area-grad';

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const frac = i / 4;
    const val  = minV + rangeV * (1 - frac);
    const y    = padY + frac * innerH;
    return { val, y };
  });

  // X-axis labels (5 ticks)
  const xTicks = Array.from({ length: 5 }, (_, i) => {
    const frac = i / 4;
    const t    = new Date(minT + rangeT * frac);
    const x    = padX + frac * innerW;
    return { label: t.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x };
  });

  return (
    <div
      id="main-chart-area"
      className="w-full overflow-hidden"
      style={{ minHeight: '300px' }}
      data-d3-target="true"
      aria-label="Main market price chart — connect D3.js here"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{ minHeight: '280px' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={strokeColor} stopOpacity="0.20" />
            <stop offset="80%"  stopColor={strokeColor} stopOpacity="0.03" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
          </linearGradient>
          <filter id="glow-line">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padX} y1={tick.y}
              x2={padX + innerW} y2={tick.y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 8} y={tick.y + 4}
              textAnchor="end"
              fill="#52525b"
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              {tick.val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick, i) => (
          <text
            key={i}
            x={tick.x} y={padY + innerH + 18}
            textAnchor="middle"
            fill="#52525b"
            fontSize="10"
            fontFamily="Inter, sans-serif"
          >
            {tick.label}
          </text>
        ))}

        {/* Filled area */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Price line */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#glow-line)"
        />

        {/* Current price dot at last point */}
        <circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r="5"
          fill={strokeColor}
          opacity="0.9"
        />
        {/* Ping animation ring */}
        <circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r="9"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          opacity="0.35"
        />

        {/* Price label at last point */}
        <rect
          x={pts[pts.length - 1].x - 36}
          y={pts[pts.length - 1].y - 28}
          width={72} height={18}
          rx={4}
          fill={strokeColor}
          opacity="0.9"
        />
        <text
          x={pts[pts.length - 1].x}
          y={pts[pts.length - 1].y - 15}
          textAnchor="middle"
          fill="#09090b"
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          ${values[values.length - 1].toLocaleString()}
        </text>
      </svg>
    </div>
  );
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
const CATEGORY_MAP = {
  Crypto:    { label: 'Crypto',    icon: '₿',   color: '#8b5cf6', defaultAsset: 'BTC / USD',   basePrice: 63000 },
  Forex:     { label: 'Forex',     icon: '€',   color: '#3b82f6', defaultAsset: 'EUR / USD',   basePrice: 1.0850 },
  Index:     { label: 'Index',     icon: '📈',  color: '#06b6d4', defaultAsset: 'S&P 500',     basePrice: 5200 },
  Commodity: { label: 'Commodity', icon: '🧈',  color: '#d4af37', defaultAsset: 'Gold',        basePrice: 2350 },
};

const ChartPanel = ({ category = 'Crypto', assetName }) => {
  const config = CATEGORY_MAP[category] || CATEGORY_MAP.Crypto;
  const displayName = assetName || config.defaultAsset;

  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [series, setSeries]                   = useState(() => generateChartSeries(60, config.basePrice));
  const [isPositive, setIsPositive]           = useState(true);

  // Regenerate chart data when timeframe changes or category changes
  useEffect(() => {
    const pts = activeTimeframe === '1D'  ? 48
              : activeTimeframe === '1W'  ? 56
              : activeTimeframe === '1M'  ? 60
              : activeTimeframe === '6M'  ? 60
              : activeTimeframe === '1Y'  ? 60
              : 60;

    const volatilityFrac = activeTimeframe === '1D' ? 0.005
                         : activeTimeframe === '1W' ? 0.01
                         : 0.02;

    const volatility = config.basePrice * volatilityFrac;

    const newSeries = generateChartSeries(pts, config.basePrice, volatility);
    setSeries(newSeries);
    const firstV = newSeries[0].v;
    const lastV  = newSeries[newSeries.length - 1].v;
    setIsPositive(lastV >= firstV);
  }, [activeTimeframe, category]);

  // Stats derived from series
  const prices   = series.map(d => d.v);
  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const pctChange = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
  const high      = Math.max(...prices).toLocaleString('en-US', { minimumFractionDigits: category === 'Forex' ? 4 : 2, maximumFractionDigits: category === 'Forex' ? 4 : 2 });
  const low       = Math.min(...prices).toLocaleString('en-US', { minimumFractionDigits: category === 'Forex' ? 4 : 2, maximumFractionDigits: category === 'Forex' ? 4 : 2 });

  return (
    <section
      id="main-chart-panel"
      className="glass rounded-2xl overflow-hidden flex flex-col"
      style={{ minHeight: '420px' }}
    >
      {/* ── Panel Header ────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {/* Left: Asset info */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: '40px',
              height: '40px',
              background: `${config.color}18`,
              border: `1px solid ${config.color}30`,
            }}
          >
            <span style={{ fontSize: '18px', color: config.color }}>{config.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: '#f4f4f5' }}>
                {displayName}
              </h2>
              <span
                className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                style={{
                  background: `${config.color}18`,
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                }}
              >
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span
                className="text-xl font-bold tabular-nums"
                style={{ color: '#f4f4f5' }}
              >
                ${lastPrice.toLocaleString('en-US', { minimumFractionDigits: category === 'Forex' ? 4 : 2, maximumFractionDigits: category === 'Forex' ? 4 : 2 })}
              </span>
              <span
                className="text-sm font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                  color:      isPositive ? '#10b981' : '#f43f5e',
                  border: `1px solid ${isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                }}
              >
                <TrendingUp size={12} strokeWidth={2.5} />
                {pctChange >= 0 ? '+' : ''}{pctChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Stats + Timeframe */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Mini stats */}
          <div className="hidden md:flex items-center gap-5 text-xs">
            <div>
              <p style={{ color: '#52525b' }}>High</p>
              <p className="font-semibold tabular-nums" style={{ color: '#10b981' }}>${high}</p>
            </div>
            <div>
              <p style={{ color: '#52525b' }}>Low</p>
              <p className="font-semibold tabular-nums" style={{ color: '#f43f5e' }}>${low}</p>
            </div>
            <div>
              <p style={{ color: '#52525b' }}>Vol 24h</p>
              <p className="font-semibold tabular-nums" style={{ color: '#a1a1aa' }}>$38.2B</p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block self-stretch"
            style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }}
          />

          {/* Timeframe Pills */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.key}
                id={`timeframe-${tf.key}`}
                onClick={() => setActiveTimeframe(tf.key)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{
                  background: activeTimeframe === tf.key
                    ? 'rgba(59,130,246,0.15)'
                    : 'transparent',
                  color: activeTimeframe === tf.key ? '#3b82f6' : '#71717a',
                  border: activeTimeframe === tf.key
                    ? '1px solid rgba(59,130,246,0.25)'
                    : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast('Chart metadata: BTC/USD, Source: Binance (Simulated)', { icon: 'ℹ️' })}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: '32px', height: '32px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#52525b',
                transition: 'all 0.15s',
              }}
              title="Chart info"
            >
              <Info size={14} />
            </button>
            <button
              onClick={() => toast('Full screen chart mode coming soon', { icon: '📐' })}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: '32px', height: '32px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#52525b',
                transition: 'all 0.15s',
              }}
              title="Expand chart"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Chart Area ─────────────────────────────────────
          🎯 D3.js Integration Point:
          1. Target the div with id="main-chart-area"
          2. Use a useEffect with d3.select('#main-chart-area')
          3. Clear + re-render on activeTimeframe change
          4. Remove <PlaceholderChart> below
      ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-4 min-h-[300px]">
        <PlaceholderChart data={series} positive={isPositive} />
      </div>

      {/* ── Panel Footer ────────────────────────────────── */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between text-xs"
        style={{
          borderColor: 'rgba(255,255,255,0.06)',
          color: '#52525b',
        }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block rounded-full"
            style={{ width: '6px', height: '6px', background: '#10b981' }}
          />
          Data simulated · Replace with live WebSocket feed
        </span>
        <span>
          Last updated: {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>
    </section>
  );
};

export default ChartPanel;
