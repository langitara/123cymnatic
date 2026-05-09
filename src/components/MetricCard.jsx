/**
 * MetricCard.jsx
 * Individual market overview card for the top row of the dashboard.
 *
 * Features:
 *  - Live price tick simulation (updates every 2s)
 *  - Flash animation on price change (green up / red down)
 *  - Percentage change badge with trend arrow
 *  - Embedded SparkLine SVG chart
 *  - Glassmorphism panel styling
 *
 * Props:
 *   card {object}  — one entry from marketCards array in mockData.js
 */

import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import SparkLine from './SparkLine';
import { simulateTick } from '../data/mockData';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const formatPrice = (price, prefix = '', decimals = 2) => {
  if (price >= 1_000_000) return `${prefix}${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000)     return `${prefix}${price.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  return `${prefix}${price.toFixed(price < 10 ? 4 : decimals)}`;
};

const CATEGORY_COLORS = {
  Forex:     '#3b82f6',
  Crypto:    '#8b5cf6',
  Index:     '#06b6d4',
  Commodity: '#d4af37',
};

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
const MetricCard = ({ card }) => {
  const [price, setPrice]         = useState(card.price);
  const [sparkData, setSparkData] = useState(card.sparkData);
  const [flashClass, setFlash]    = useState('');
  const prevPriceRef              = useRef(card.price);

  // Simulate live price tick every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const next = simulateTick(prev);
        // Determine direction for flash color
        setFlash(next > prevPriceRef.current ? 'flash-green' : 'flash-red');
        // Update sparkline data (append new point, drop oldest)
        setSparkData(sd => [...sd.slice(1), next]);
        prevPriceRef.current = next;
        // Clear flash class after animation ends
        setTimeout(() => setFlash(''), 650);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const isPositive   = card.change >= 0;
  const accentColor  = CATEGORY_COLORS[card.category] || '#3b82f6';

  return (
    <article
      id={`card-${card.id}`}
      className="glass rounded-2xl flex flex-col gap-3 relative overflow-hidden"
      style={{
        padding: '20px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.07)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: '2px', background: accentColor, opacity: 0.6 }}
      />

      {/* ── Row 1: Symbol + Category badge ────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-base font-bold tracking-wide"
            style={{ color: '#f4f4f5' }}
          >
            {card.symbol}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#52525b' }}>
            {card.label}
          </p>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-lg"
          style={{
            background: `${accentColor}18`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
        >
          {card.category}
        </span>
      </div>

      {/* ── Row 2: Price + Change badge ────────────────────── */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p
            className={`text-2xl font-bold tabular-nums ${flashClass}`}
            style={{ color: '#f4f4f5', letterSpacing: '-0.02em' }}
          >
            {formatPrice(price, card.prefix, card.decimals)}
          </p>

          {/* % Change Badge */}
          <div
            className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
              color:      isPositive ? '#10b981' : '#f43f5e',
              border:     `1px solid ${isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
            }}
          >
            {isPositive
              ? <TrendingUp  size={11} strokeWidth={2.5} />
              : <TrendingDown size={11} strokeWidth={2.5} />
            }
            {isPositive ? '+' : ''}{card.change.toFixed(2)}%
          </div>
        </div>

        {/* SparkLine */}
        <div className="flex-shrink-0">
          <SparkLine data={sparkData} positive={isPositive} width={110} height={44} />
        </div>
      </div>

      {/* ── Row 3: Footer info ─────────────────────────────── */}
      <div
        className="flex items-center justify-between pt-2 border-t text-xs"
        style={{ borderColor: 'rgba(255,255,255,0.05)', color: '#52525b' }}
      >
        <span>24h Range</span>
        <span className="tabular-nums">
          {formatPrice(price * 0.988, card.prefix, card.decimals)}
          {' — '}
          {formatPrice(price * 1.012, card.prefix, card.decimals)}
        </span>
      </div>
    </article>
  );
};

export default MetricCard;
