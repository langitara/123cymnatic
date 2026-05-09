/**
 * mockData.js
 * Simulated financial market data for the Money Market Dashboard.
 * Replace these with real WebSocket / REST API calls in production.
 */

// ------------------------------------------------------------------
// MARKET OVERVIEW CARDS  (top 4 KPI cards)
// ------------------------------------------------------------------
export const marketCards = [
  {
    id: 'usd-idr',
    symbol: 'USD/IDR',
    label: 'US Dollar · Indonesian Rupiah',
    category: 'Forex',
    price: 16_287.50,
    change: 0.42,
    decimals: 2,
    prefix: 'Rp ',
    sparkData: [16180, 16210, 16195, 16240, 16255, 16230, 16270, 16287],
  },
  {
    id: 'spx',
    symbol: 'S&P 500',
    label: 'US Equities Index',
    category: 'Index',
    price: 5_287.64,
    change: -0.31,
    decimals: 2,
    prefix: '',
    sparkData: [5310, 5295, 5320, 5305, 5280, 5270, 5285, 5287],
  },
  {
    id: 'btc-usd',
    symbol: 'BTC/USD',
    label: 'Bitcoin · US Dollar',
    category: 'Crypto',
    price: 63_412.80,
    change: 2.18,
    decimals: 2,
    prefix: '$',
    sparkData: [61500, 61800, 62300, 62100, 62700, 63000, 63200, 63412],
  },
  {
    id: 'xau-usd',
    symbol: 'XAU/USD',
    label: 'Gold · US Dollar',
    category: 'Commodity',
    price: 2_338.15,
    change: 0.87,
    decimals: 2,
    prefix: '$',
    sparkData: [2290, 2305, 2315, 2300, 2320, 2330, 2335, 2338],
  },
];

// ------------------------------------------------------------------
// TOP MOVERS TABLE
// ------------------------------------------------------------------
export const topMovers = [
  { id: 1,  asset: 'ETH/USD',  name: 'Ethereum',       category: 'Crypto',    price: 3_042.55, change: 3.45,  volume: '14.2B', icon: '◈' },
  { id: 2,  asset: 'EUR/USD',  name: 'Euro',           category: 'Forex',     price: 1.0875,   change: -0.18, volume: '82.4B', icon: '€' },
  { id: 3,  asset: 'GBP/USD',  name: 'British Pound',  category: 'Forex',     price: 1.2648,   change: 0.24,  volume: '31.7B', icon: '£' },
  { id: 4,  asset: 'NASDAQ',   name: 'Nasdaq 100',     category: 'Index',     price: 18_456.3, change: -0.54, volume: '—',     icon: '▲' },
  { id: 5,  asset: 'SOL/USD',  name: 'Solana',         category: 'Crypto',    price: 178.34,   change: 5.12,  volume: '4.1B',  icon: '◎' },
  { id: 6,  asset: 'USD/JPY',  name: 'Japanese Yen',   category: 'Forex',     price: 153.82,   change: 0.09,  volume: '96.1B', icon: '¥' },
  { id: 7,  asset: 'WTI/USD',  name: 'Crude Oil WTI',  category: 'Commodity', price: 78.24,    change: -1.33, volume: '22.5B', icon: '⬡' },
  { id: 8,  asset: 'XRP/USD',  name: 'Ripple',         category: 'Crypto',    price: 0.5241,   change: 1.97,  volume: '2.8B',  icon: '✦' },
];

// ------------------------------------------------------------------
// MAIN CHART — placeholder data series (to be replaced with D3)
// ------------------------------------------------------------------
// Each entry: { t: timestamp (ms), v: price }
export function generateChartSeries(points = 60, base = 63000, volatility = 800) {
  const now = Date.now();
  const interval = 60 * 60 * 1000; // 1 hour
  let price = base;

  return Array.from({ length: points }, (_, i) => {
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(base * 0.85, Math.min(base * 1.15, price));
    return {
      t: now - (points - 1 - i) * interval,
      v: parseFloat(price.toFixed(2)),
    };
  });
}

// ------------------------------------------------------------------
// PRICE TICK SIMULATOR
// Slightly randomises a price value within ±0.15% each tick.
// ------------------------------------------------------------------
export function simulateTick(currentPrice, volatility = 0.0015) {
  const delta = currentPrice * volatility * (Math.random() * 2 - 1);
  return parseFloat((currentPrice + delta).toFixed(currentPrice < 10 ? 4 : 2));
}
