/**
 * TopMoversTable.jsx
 * Polished data table showing top market movers.
 *
 * Features:
 *  - Live price tick simulation (every 1.8s per row, staggered)
 *  - Trend badges (% change pill — green/red)
 *  - Category filter tabs (All, Forex, Crypto, Index, Commodity)
 *  - Search filter integration from global search state
 *  - Smooth row hover effects
 *  - Sortable column header design (visual only — extend for full sort)
 */

import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  ArrowUp,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { topMovers, simulateTick } from '../data/mockData';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const formatPrice = (price) => {
  if (price >= 10_000)
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 100)
    return price.toFixed(2);
  if (price >= 1)
    return price.toFixed(4);
  return price.toFixed(5);
};

const CATEGORY_TABS = ['All', 'Forex', 'Crypto', 'Index', 'Commodity'];

const CATEGORY_COLORS = {
  Forex:     { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
  Crypto:    { bg: 'rgba(139,92,246,0.1)',   color: '#8b5cf6' },
  Index:     { bg: 'rgba(6,182,212,0.1)',    color: '#06b6d4' },
  Commodity: { bg: 'rgba(212,175,55,0.1)',   color: '#d4af37' },
};

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
const TopMoversTable = ({ searchQuery = '' }) => {
  const [rows, setRows]             = useState(topMovers);
  const [activeTab, setActiveTab]   = useState('All');
  const [flashMap, setFlashMap]     = useState({}); // { id: 'green' | 'red' }
  const prevPricesRef               = useRef({});

  // Initialise previous prices ref
  useEffect(() => {
    topMovers.forEach(r => { prevPricesRef.current[r.id] = r.price; });
  }, []);

  // Staggered price tick per row
  useEffect(() => {
    const timers = rows.map((row, idx) =>
      setInterval(() => {
        const next = simulateTick(prevPricesRef.current[row.id] || row.price);
        const dir  = next > prevPricesRef.current[row.id] ? 'green' : 'red';
        prevPricesRef.current[row.id] = next;

        // Flash the cell
        setFlashMap(m => ({ ...m, [row.id]: dir }));
        setTimeout(() => setFlashMap(m => ({ ...m, [row.id]: null })), 600);

        // Update price in rows state
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, price: next } : r));
      }, 1800 + idx * 200) // stagger each row
    );

    return () => timers.forEach(clearInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply category + search filters
  const filtered = rows.filter(r => {
    const matchTab    = activeTab === 'All' || r.category === activeTab;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q
      || r.asset.toLowerCase().includes(q)
      || r.name.toLowerCase().includes(q)
      || r.category.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <section
      id="top-movers-table"
      className="glass rounded-2xl overflow-hidden flex flex-col"
    >
      {/* ── Panel Header ────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div>
          <h2 className="text-sm font-bold" style={{ color: '#f4f4f5' }}>
            Top Movers
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#52525b' }}>
            Live price feed · {filtered.length} assets
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-1 rounded-xl p-1 overflow-x-auto"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{
                background: activeTab === tab
                  ? 'rgba(59,130,246,0.15)'
                  : 'transparent',
                color: activeTab === tab ? '#3b82f6' : '#71717a',
                border: activeTab === tab
                  ? '1px solid rgba(59,130,246,0.25)'
                  : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          {/* Table Head */}
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {[
                { label: 'Asset',    align: 'left',   id: 'col-asset'  },
                { label: 'Price',    align: 'right',  id: 'col-price'  },
                { label: '24h Chg', align: 'right',  id: 'col-change' },
                { label: '24h Vol', align: 'right',  id: 'col-volume' },
                { label: 'Trend',   align: 'center', id: 'col-trend'  },
              ].map(col => (
                <th
                  key={col.id}
                  id={col.id}
                  className={`px-5 py-3 text-${col.align} font-medium text-xs uppercase tracking-wider select-none`}
                  style={{ color: '#52525b' }}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}
                  >
                    {col.label}
                    {col.id !== 'col-trend' && (
                      <ArrowUpDown
                        size={10}
                        style={{ color: '#3f3f46', flexShrink: 0 }}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-xs"
                  style={{ color: '#52525b' }}
                >
                  No assets match your search.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const isPos       = row.change >= 0;
                const catStyle    = CATEGORY_COLORS[row.category] || CATEGORY_COLORS.Forex;
                const flash       = flashMap[row.id];
                const priceColor  = flash === 'green' ? '#10b981'
                                  : flash === 'red'   ? '#f43f5e'
                                  : '#f4f4f5';

                return (
                  <tr
                    key={row.id}
                    className="table-row-hover border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.035)' }}
                  >
                    {/* Asset */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-xl text-base font-bold"
                          style={{
                            width: '36px',
                            height: '36px',
                            background: catStyle.bg,
                            color: catStyle.color,
                            border: `1px solid ${catStyle.color}25`,
                          }}
                        >
                          {row.icon}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: '#f4f4f5' }}>
                            {row.asset}
                          </p>
                          <p className="text-xs" style={{ color: '#52525b' }}>
                            {row.name}
                          </p>
                        </div>
                        <span
                          className="ml-1 text-xs px-1.5 py-0.5 rounded-md font-medium hidden md:inline"
                          style={{
                            background: catStyle.bg,
                            color: catStyle.color,
                          }}
                        >
                          {row.category}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td
                      className="px-5 py-3.5 text-right font-semibold tabular-nums"
                      style={{
                        color: priceColor,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {formatPrice(row.price)}
                    </td>

                    {/* 24h Change */}
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums"
                        style={{
                          background: isPos ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                          color:      isPos ? '#10b981' : '#f43f5e',
                          border: `1px solid ${isPos ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                        }}
                      >
                        {isPos
                          ? <TrendingUp  size={10} strokeWidth={2.5} />
                          : <TrendingDown size={10} strokeWidth={2.5} />
                        }
                        {isPos ? '+' : ''}{row.change.toFixed(2)}%
                      </span>
                    </td>

                    {/* Volume */}
                    <td
                      className="px-5 py-3.5 text-right text-xs tabular-nums"
                      style={{ color: '#71717a' }}
                    >
                      {row.volume}
                    </td>

                    {/* Trend bar */}
                    <td className="px-5 py-3.5 text-center">
                      <div
                        className="inline-flex items-center justify-center"
                        style={{
                          width: '60px',
                          height: '20px',
                          position: 'relative',
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: '100px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${Math.min(Math.abs(row.change) * 10, 100)}%`,
                            background: isPos
                              ? 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(16,185,129,0.2))'
                              : 'linear-gradient(90deg, rgba(244,63,94,0.5), rgba(244,63,94,0.2))',
                            borderRadius: '100px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                        <span
                          className="relative text-xs font-semibold"
                          style={{ color: isPos ? '#10b981' : '#f43f5e', fontSize: '10px' }}
                        >
                          {isPos ? '▲' : '▼'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Panel Footer ────────────────────────────────── */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between text-xs"
        style={{
          borderColor: 'rgba(255,255,255,0.05)',
          color: '#52525b',
        }}
      >
        <span className="flex items-center gap-2">
          <Filter size={11} />
          Showing {filtered.length} of {rows.length} assets
        </span>
        <button
          onClick={() => toast.success('Redirecting to full markets page...', { icon: '🔄' })}
          className="text-xs"
          style={{ color: '#3b82f6', transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          View all markets →
        </button>
      </div>
    </section>
  );
};

export default TopMoversTable;
