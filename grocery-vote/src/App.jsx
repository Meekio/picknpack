import { useState, useMemo, useCallback } from 'react';
import { fruits, vegetables, greens, allItems } from './data/items';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CategoryTabs from './components/CategoryTabs';
import ItemGrid from './components/ItemGrid';
import FloatingButton from './components/FloatingButton';
import Drawer from './components/Drawer';
import Toast from './components/Toast';

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter items based on search + category
  const filteredItems = useMemo(() => {
    const pool = category === 'all' ? allItems
      : category === 'fruit' ? fruits
      : category === 'vegetable' ? vegetables
      : greens;
    if (!search.trim()) return pool;
    return pool.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, category]);

  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedIds.has(item.id)),
    [selectedIds]
  );

  const handleToggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleRemove = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    setSelectedIds(new Set());
    setToast({ message: 'Your vote has been submitted! 🎉', type: 'success' });
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6 pb-20 space-y-5">
        {/* Hero */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            What should we stock next? 🛒
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Pick the fruits &amp; vegetables you'd love to see. Your vote matters!
          </p>
        </div>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Tabs */}
        <CategoryTabs active={category} onChange={setCategory} />

        {/* Section label */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
          </p>
          {selectedIds.size > 0 && (
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-red-400 hover:text-red-600 font-semibold transition"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Grid */}
        <ItemGrid
          items={filteredItems}
          selectedIds={selectedIds}
          onToggle={handleToggle}
        />
      </main>

      {/* Bottom hint banner — visible when items are selected */}
      {selectedIds.size > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 bg-green-600 text-white text-sm font-semibold flex items-center justify-center gap-2 py-3 px-4 cursor-pointer sm:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          <span>🎉 {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected</span>
          <span className="underline underline-offset-2">Tap to review &amp; submit →</span>
        </div>
      )}

      {/* Floating button */}
      <FloatingButton count={selectedIds.size} onClick={() => setDrawerOpen(true)} />

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedItems={selectedItems}
        onRemove={handleRemove}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
