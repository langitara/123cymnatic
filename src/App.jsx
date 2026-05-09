/**
 * App.jsx
 * Money Market Monitoring Dashboard — Root Component
 *
 * Layout:
 *   ┌──────────┬──────────────────────────────────────┐
 *   │          │  Header (sticky top bar)             │
 *   │ Sidebar  ├──────────────────────────────────────┤
 *   │ (fixed)  │  Dashboard Content (scrollable)      │
 *   │          │    ┌──── 4 Metric Cards ────────┐   │
 *   │          │    └────────────────────────────┘   │
 *   │          │    ┌──── Main Chart Panel ──────┐   │
 *   │          │    └────────────────────────────┘   │
 *   │          │    ┌──── Top Movers Table ──────┐   │
 *   │          │    └────────────────────────────┘   │
 *   └──────────┴──────────────────────────────────────┘
 */

import { useState } from 'react';
import Sidebar        from './components/Sidebar';
import Header         from './components/Header';
import MetricCard     from './components/MetricCard';
import ChartPanel     from './components/ChartPanel';
import TopMoversTable from './components/TopMoversTable';
import ProfileView from './components/ProfileView';
import { marketCards } from './data/mockData';

// ------------------------------------------------------------------
// Market Status Banner — shown on overview page
// ------------------------------------------------------------------
const MarketStatusBanner = () => (
  <div
    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl px-4 py-3"
    style={{
      background: 'linear-gradient(90deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 100%)',
      border: '1px solid rgba(59,130,246,0.15)',
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{
          background: 'rgba(16,185,129,0.12)',
          color: '#10b981',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10b981',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        Markets Open
      </div>
      <span className="text-xs" style={{ color: '#71717a' }}>
        NYSE · NASDAQ · LSE · SGX · IDX — All sessions active
      </span>
    </div>
    <span className="text-xs tabular-nums" style={{ color: '#52525b' }}>
      Next close: NYSE in 6h 14m
    </span>
  </div>
);

// ------------------------------------------------------------------
// Section Header helper
// ------------------------------------------------------------------
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-3">
    <h2 className="text-sm font-semibold" style={{ color: '#a1a1aa' }}>
      {title}
    </h2>
    {subtitle && (
      <p className="text-xs mt-0.5" style={{ color: '#3f3f46' }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ------------------------------------------------------------------
// Page Views
// ------------------------------------------------------------------
const OverviewView = ({ searchQuery }) => (
  <>
    <MarketStatusBanner />
    <section>
      <SectionHeader
        title="Market Overview"
        subtitle="Key instruments · updated every 2s"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {marketCards.map(card => (
          <MetricCard key={card.id} card={card} />
        ))}
      </div>
    </section>
    <section>
      <SectionHeader
        title="Price Chart"
        subtitle="Interactive · D3.js integration ready"
      />
      <ChartPanel />
    </section>
    <section>
      <SectionHeader
        title="Top Movers"
        subtitle="Sorted by absolute 24h change"
      />
      <TopMoversTable searchQuery={searchQuery} />
    </section>
  </>
);

const FilteredTableView = ({ title, subtitle, category, searchQuery }) => (
  <>
    <section>
      <SectionHeader title={title} subtitle={subtitle} />
      <ChartPanel category={category} />
    </section>
    <section>
      <SectionHeader title="Market Movers" subtitle={`Top assets in ${category}`} />
      <TopMoversTable searchQuery={searchQuery || category} />
    </section>
  </>
);

const PlaceholderView = ({ title, icon }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 glass rounded-2xl" style={{ minHeight: '60vh' }}>
    <div className="mb-4 text-6xl">{icon}</div>
    <h2 className="text-xl font-bold mb-2" style={{ color: '#f4f4f5' }}>{title}</h2>
    <p className="text-sm max-w-md mx-auto" style={{ color: '#a1a1aa' }}>
      This page is under construction. It will feature specialized components and data tailored to this section.
    </p>
  </div>
);

// ------------------------------------------------------------------
// Root App
// ------------------------------------------------------------------
function App() {
  const [activeNav,   setActiveNav]   = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen,  setMobileOpen]  = useState(false);

  // Render view based on active navigation
  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
        return <OverviewView searchQuery={searchQuery} />;
      case 'forex':
        return <FilteredTableView title="Forex Markets" subtitle="Global currency pairs" category="Forex" searchQuery={searchQuery} />;
      case 'crypto':
        return <FilteredTableView title="Cryptocurrency" subtitle="Digital assets and tokens" category="Crypto" searchQuery={searchQuery} />;
      case 'indices':
        return <FilteredTableView title="Global Indices" subtitle="Major stock market indices" category="Index" searchQuery={searchQuery} />;
      case 'watchlist':
        return <PlaceholderView title="Your Watchlist" icon="⭐" />;
      case 'portfolio':
        return <PlaceholderView title="Portfolio Management" icon="💼" />;
      case 'settings':
        return <PlaceholderView title="Account Settings" icon="⚙️" />;
      case 'profile':
        return <ProfileView />;
      default:
        return <OverviewView searchQuery={searchQuery} />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#09090b' }}
    >
      {/* ── Sidebar ─────────────────────────────────────── */}
      <Sidebar 
        activeNav={activeNav} 
        onNavChange={(id) => { setActiveNav(id); setMobileOpen(false); }} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* ── Main Area ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Header ────────────────────────────────────── */}
        <Header
          activeNav={activeNav}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          setMobileOpen={setMobileOpen}
          setActiveNav={setActiveNav}
        />

        {/* ── Scrollable Dashboard Content ──────────────── */}
        <main
          id="dashboard-content"
          className="flex-1 overflow-y-auto"
          style={{ padding: '24px', gap: '24px', display: 'flex', flexDirection: 'column' }}
        >
          {renderContent()}

          {/* ── Footer ───────────────────────────────── */}
          <footer
            className="text-center text-xs pb-2 mt-auto pt-8"
            style={{ color: '#3f3f46' }}
          >
            MarketPulse Dashboard · Data is simulated for demonstration purposes ·{' '}
            {new Date().getFullYear()}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
