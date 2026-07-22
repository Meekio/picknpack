import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBasket, LogOut, Trophy, MessageSquare,
  Loader2, RefreshCw, TrendingUp, Package, Lightbulb,
} from 'lucide-react';
import { apiFetch } from '../lib/api';

// ─── helpers ────────────────────────────────────────────────────────────────

const CATEGORY_LABEL = { fruit: '🍎 Fruit', vegetable: '🥦 Vegetable', green: '🥬 Green' };
const CATEGORY_COLOR = {
  fruit:     'bg-orange-100 text-orange-700',
  vegetable: 'bg-red-100 text-red-700',
  green:     'bg-lime-100  text-lime-700',
};


// ─── main component ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [results, setResults]         = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');
  const navigate = useNavigate();

  // Redirect if no token
  useEffect(() => {
    if (!localStorage.getItem('admin_token')) navigate('/admin');
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        apiFetch('/api/admin/results'),
        apiFetch('/api/admin/suggestions'),
      ]);

      if (r1.status === 401 || r2.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin');
        return;
      }

      setResults(await r1.json());
      setSuggestions(await r2.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  // ── derived stats ──────────────────────────────────────────────────────────
  const totalVotes = results.reduce((s, r) => s + r.votes, 0);
  const topProducts = [...results].sort((a, b) => b.votes - a.votes).slice(0, 5);
  const maxVotes = results[0]?.votes || 1;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-500 text-white p-2 rounded-xl">
              <ShoppingBasket size={20} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Pick N Pack Admin</p>
              <p className="text-xs text-gray-400 leading-tight">Vote Results Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 border border-gray-200 hover:border-red-300 transition"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 border border-red-100 transition"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={40} className="animate-spin text-red-400" />
          </div>
        ) : (
          <>
            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon="🗳️"  label="Total Votes"    value={totalVotes} />
              <StatCard icon="📦"  label="Products"       value={results.length} />
              <StatCard icon="💡"  label="Suggestions"    value={suggestions.length} />
              <StatCard icon="🏆"  label="Top Product"    value={topProducts[0]?.name ?? '—'} small />
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
                { key: 'overview',    icon: <TrendingUp size={14} />,    label: 'Overview'    },
                { key: 'all',         icon: <Package size={14} />,       label: 'All Products' },
                { key: 'suggestions', icon: <Lightbulb size={14} />,     label: `Suggestions (${suggestions.length})` },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all
                    ${activeTab === t.key
                      ? 'bg-red-500 text-white shadow-md shadow-red-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'}`}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* ── Tab content ── */}
            {activeTab === 'overview'    && <OverviewTab    topProducts={topProducts} maxVotes={maxVotes} totalVotes={totalVotes} />}
            {activeTab === 'all'         && <AllProductsTab results={results} maxVotes={maxVotes} />}
            {activeTab === 'suggestions' && <SuggestionsTab suggestions={suggestions} />}
          </>
        )}
      </main>
    </div>
  );
}

// ─── Overview tab ────────────────────────────────────────────────────────────

function OverviewTab({ topProducts, maxVotes, totalVotes }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
        <Trophy size={14} /> Top 5 Most Voted
      </h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {topProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-3xl mb-2">🗳️</p>
            <p className="font-semibold">No votes recorded yet</p>
          </div>
        ) : topProducts.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 px-5 py-4 ${i !== topProducts.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            {/* Rank medal */}
            <span className={`text-lg font-black w-7 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>

            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
              onError={e => { e.target.style.display = 'none'; }}
            />

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-gray-700">{item.name}</span>
                <span className="text-sm font-extrabold text-red-600 ml-2">
                  {item.votes} <span className="text-xs font-normal text-gray-400">votes</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full transition-all duration-700"
                  style={{ width: `${(item.votes / maxVotes) * 100}%` }}
                />
              </div>
            </div>

            {/* Category badge */}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${CATEGORY_COLOR[item.category]}`}>
              {CATEGORY_LABEL[item.category]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── All products table ───────────────────────────────────────────────────────

function AllProductsTab({ results, maxVotes }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = results.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === 'all' || r.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white"
        />
        <div className="flex gap-2">
          {['all', 'fruit', 'vegetable', 'green'].map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition capitalize
                ${filterCat === c ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'}`}
            >
              {c === 'all' ? '🛒 All' : c === 'fruit' ? '🍎' : c === 'vegetable' ? '🥦' : '🥬'} {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
          <span className="col-span-1">#</span>
          <span className="col-span-5">Product</span>
          <span className="col-span-3">Category</span>
          <span className="col-span-3 text-right">Votes</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No products found</div>
        ) : filtered.map((item, i) => (
          <div
            key={item.id}
            className={`grid grid-cols-12 gap-2 items-center px-4 py-3 ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-red-50/40 transition`}
          >
            <span className="col-span-1 text-xs text-gray-300 font-bold">{i + 1}</span>

            <div className="col-span-5 flex items-center gap-2 min-w-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className="text-sm font-semibold text-gray-700 truncate">{item.name}</span>
            </div>

            <div className="col-span-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[item.category]}`}>
                {CATEGORY_LABEL[item.category]}
              </span>
            </div>

            <div className="col-span-3 flex flex-col items-end gap-1">
              <span className="text-sm font-extrabold text-red-600">{item.votes}</span>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${maxVotes > 0 ? (item.votes / maxVotes) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-right">{filtered.length} of {results.length} products</p>
    </div>
  );
}

// ─── Suggestions tab ──────────────────────────────────────────────────────────

function SuggestionsTab({ suggestions }) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm py-16 text-center text-gray-400">
        <p className="text-4xl mb-2">💡</p>
        <p className="font-semibold">No suggestions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
        <span className="col-span-3">Category</span>
        <span className="col-span-6">Suggestion</span>
        <span className="col-span-3 text-right">Date</span>
      </div>

      {suggestions.map((s, i) => (
        <div
          key={s.id}
          className={`grid grid-cols-12 gap-2 items-start px-4 py-3 ${i !== suggestions.length - 1 ? 'border-b border-gray-50' : ''}`}
        >
          <div className="col-span-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[s.category] ?? 'bg-gray-100 text-gray-600'}`}>
              {CATEGORY_LABEL[s.category] ?? s.category}
            </span>
          </div>
          <p className="col-span-6 text-sm text-gray-700 font-medium">{s.suggestion}</p>
          <p className="col-span-3 text-xs text-gray-400 text-right">
            {new Date(s.created_at).toLocaleDateString()}<br />
            <span className="text-gray-300">{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, small = false }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="min-w-0">
        <p className={`font-extrabold text-gray-800 leading-tight truncate ${small ? 'text-sm' : 'text-xl'}`}>{value}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}
