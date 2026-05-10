/**
 * Sidebar.jsx
 * Collapsible navigation sidebar for the Money Market Dashboard.
 *
 * Features:
 *  - Smooth expand/collapse animation (240px ↔ 68px)
 *  - Active route highlighting with electric-blue accent
 *  - Lucide React icons for each nav item
 *  - Bottom user mini-profile section
 */

import { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Bitcoin,
  BarChart2,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Wallet,
} from 'lucide-react';

// Navigation items definition
const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',   icon: LayoutDashboard, badge: null },
  { id: 'forex',     label: 'Forex',      icon: TrendingUp,      badge: null },
  { id: 'crypto',    label: 'Crypto',     icon: Bitcoin,         badge: '3'  },
  { id: 'indices',   label: 'Indices',    icon: BarChart2,       badge: null },
  { id: 'watchlist', label: 'Watchlist',  icon: Bookmark,        badge: '12' },
];

const BOTTOM_ITEMS = [
  { id: 'portfolio', label: 'Portfolio',  icon: Wallet },
  { id: 'settings',  label: 'Settings',   icon: Settings },
];

const Sidebar = ({ activeNav, onNavChange, mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside
        className={`fixed md:relative flex flex-col h-screen flex-shrink-0 overflow-hidden z-50 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          width: collapsed ? '68px' : '240px',
          background: 'rgba(9, 9, 11, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
      {/* ── Logo / Brand ──────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            boxShadow: '0 0 16px rgba(59,130,246,0.35)',
          }}
        >
          <Activity size={18} color="white" strokeWidth={2.5} />
        </div>

        <div
          className="overflow-hidden whitespace-nowrap"
          style={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity 0.2s ease, width 0.2s ease',
          }}
        >
          <p className="text-sm font-bold tracking-wide" style={{ color: '#f4f4f5' }}>
            MarketPulse
          </p>
          <p className="text-xs" style={{ color: '#52525b' }}>
            Live Dashboard
          </p>
        </div>
      </div>

      {/* ── Main Navigation ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => onNavChange(id)}
              className="relative w-full flex items-center gap-3 rounded-xl text-left"
              style={{
                padding: '10px 12px',
                background: isActive
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'transparent',
                color: isActive ? '#3b82f6' : '#71717a',
                transition: 'background 0.15s ease, color 0.15s ease',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#a1a1aa';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#71717a';
                }
              }}
            >
              {/* Icon */}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />

              {/* Label */}
              <span
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                style={{
                  opacity: collapsed ? 0 : 1,
                  maxWidth: collapsed ? '0px' : '140px',
                  transition: 'opacity 0.18s ease, max-width 0.18s ease',
                }}
              >
                {label}
              </span>

              {/* Badge */}
              {badge && !collapsed && (
                <span
                  className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.07)',
                    color: isActive ? '#3b82f6' : '#71717a',
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}

        {/* ── Divider ──────────────────────────────────── */}
        <div
          className="my-3 mx-2"
          style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}
        />

        {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => onNavChange(id)}
              className="w-full flex items-center gap-3 rounded-xl text-left"
              style={{
                padding: '10px 12px',
                background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                color: isActive ? '#3b82f6' : '#71717a',
                transition: 'background 0.15s ease, color 0.15s ease',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#a1a1aa';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#71717a';
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
              <span
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                style={{
                  opacity: collapsed ? 0 : 1,
                  maxWidth: collapsed ? '0px' : '140px',
                  transition: 'opacity 0.18s ease, max-width 0.18s ease',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── User Mini-Profile ────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-3 py-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            width: '34px',
            height: '34px',
            background: 'linear-gradient(135deg, #d4af37, #f59e0b)',
            color: '#09090b',
          }}
        >
          AB
        </div>
        <div
          className="overflow-hidden"
          style={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity 0.18s ease, width 0.18s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: '#f4f4f5' }}>
            anak baik
          </p>
          <p className="text-xs" style={{ color: '#52525b' }}>
            Pro Trader
          </p>
        </div>
      </div>

      {/* ── Collapse Toggle Button ───────────────────────── */}
      <button
        id="sidebar-toggle"
        onClick={() => setCollapsed(c => !c)}
        className="absolute top-16 -right-3 flex items-center justify-center rounded-full z-50"
        style={{
          width: '24px',
          height: '24px',
          background: '#27272a',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#71717a',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#3f3f46';
          e.currentTarget.style.color = '#f4f4f5';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#27272a';
          e.currentTarget.style.color = '#71717a';
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={13} strokeWidth={2.5} />
          : <ChevronLeft  size={13} strokeWidth={2.5} />
        }
      </button>
    </aside>
    </>
  );
};

export default Sidebar;
