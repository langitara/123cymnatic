/**
 * Header.jsx
 * Top navigation bar for the Money Market Dashboard.
 *
 * Sections:
 *  - Left:   Page title / breadcrumb
 *  - Center: Global search input for tickers/assets
 *  - Right:  Live clock, notification bell (with badge), user avatar
 */

import { useState, useEffect } from 'react';
import { Search, Bell, Wifi, ChevronDown, Menu } from 'lucide-react';

// ------------------------------------------------------------------
// Sub-component: Live Clock
// ------------------------------------------------------------------
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    year:    'numeric',
  });

  const timeStr = time.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="text-right hidden sm:block">
      <p
        className="text-sm font-semibold tabular-nums"
        style={{ color: '#f4f4f5', letterSpacing: '0.03em' }}
      >
        {timeStr}
      </p>
      <p className="text-xs" style={{ color: '#52525b' }}>
        {dateStr}
      </p>
    </div>
  );
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
const Header = ({ activeNav, searchQuery, onSearchChange, setMobileOpen, setActiveNav }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Derive page title from active nav
  const PAGE_TITLES = {
    overview:  'Market Overview',
    forex:     'Forex Markets',
    crypto:    'Cryptocurrency',
    indices:   'Global Indices',
    watchlist: 'My Watchlist',
    portfolio: 'Portfolio',
    settings:  'Settings',
  };
  const title = PAGE_TITLES[activeNav] || 'Market Overview';

  // Mock notifications
  const notifications = [
    { id: 1, text: 'BTC/USD broke above $63,000',  time: '2m ago',  type: 'positive' },
    { id: 2, text: 'S&P 500 down 0.3% at open',    time: '8m ago',  type: 'negative' },
    { id: 3, text: 'USD/IDR volatility alert',      time: '15m ago', type: 'neutral'  },
  ];

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 flex-shrink-0"
      style={{
        background: 'rgba(9, 9, 11, 0.80)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minHeight: '64px',
      }}
    >
      {/* ── Left: Hamburger Menu (Mobile) & Page Title ─────────────────────────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="md:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center gap-2">
          {/* Live market status indicator */}
          <span
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
            style={{
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <span
              className="inline-block rounded-full"
              style={{
                width: '6px',
                height: '6px',
                background: '#10b981',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            LIVE
          </span>
        </div>
        <h1 className="text-base font-semibold mt-0.5" style={{ color: '#f4f4f5' }}>
          {title}
        </h1>
      </div>

      {/* ── Center: Search Bar ────────────────────────────── */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#52525b' }}
          />
          <input
            id="global-search"
            type="text"
            placeholder="Search ticker, asset, or pair…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="glass-input w-full text-sm rounded-xl"
            style={{
              padding: '8px 12px 8px 34px',
              color: '#f4f4f5',
              fontSize: '13px',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs rounded-full px-1.5 py-0.5"
              style={{ color: '#52525b', background: 'rgba(255,255,255,0.06)' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Clock + Bell + Avatar ─────────────────── */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Live Clock */}
        <LiveClock />

        {/* Market Connection Status */}
        <div
          className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#52525b',
          }}
        >
          <Wifi size={12} style={{ color: '#10b981' }} />
          <span>Connected</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notification-bell"
            onClick={() => setNotifOpen(o => !o)}
            className="relative flex items-center justify-center rounded-xl"
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#71717a',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#71717a';
            }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {/* Notification badge */}
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center text-white font-bold rounded-full"
              style={{
                width: '16px',
                height: '16px',
                fontSize: '9px',
                background: '#f43f5e',
              }}
            >
              {notifications.length}
            </span>
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div
                className="absolute right-0 top-11 z-50 rounded-2xl overflow-hidden"
                style={{
                  width: '300px',
                  background: '#18181b',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#f4f4f5' }}>
                    Notifications
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
                  >
                    {notifications.length} new
                  </span>
                </div>
                <div className="py-1">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className="px-4 py-3 flex items-start gap-3 cursor-pointer"
                      style={{ transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span
                        className="mt-1 flex-shrink-0 rounded-full"
                        style={{
                          width: '7px',
                          height: '7px',
                          background: n.type === 'positive' ? '#10b981'
                                     : n.type === 'negative' ? '#f43f5e'
                                     : '#3b82f6',
                          marginTop: '6px',
                        }}
                      />
                      <div>
                        <p className="text-sm" style={{ color: '#d4d4d8' }}>{n.text}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#52525b' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            id="user-avatar"
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 rounded-xl"
            style={{
              padding: '4px 8px 4px 4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <div
              className="rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #d4af37, #f59e0b)',
                color: '#09090b',
              }}
            >
              AB
            </div>
            <span className="text-xs font-medium hidden lg:block" style={{ color: '#a1a1aa' }}>
              anak baik
            </span>
            <ChevronDown size={12} style={{ color: '#52525b' }} className="hidden lg:block" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div
                className="absolute right-0 top-11 z-50 rounded-2xl overflow-hidden"
                style={{
                  width: '200px',
                  background: '#18181b',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  className="px-4 py-3 border-b flex flex-col"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#f4f4f5' }}>
                    anak baik
                  </span>
                  <span className="text-xs" style={{ color: '#a1a1aa' }}>
                    anakbaik@marketpulse.io
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setActiveNav('profile'); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{ color: '#d4d4d8', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    My Profile
                  </button>
                  {['Billing', 'API Keys', 'Dark Mode'].map(item => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-sm"
                      style={{ color: '#d4d4d8', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item}
                    </button>
                  ))}
                  <div className="my-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{ color: '#f43f5e', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
