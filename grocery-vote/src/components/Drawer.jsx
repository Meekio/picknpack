import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { publicFetch } from '../lib/api';

export default function Drawer({ open, onClose, selectedItems, allItems, onRemove, onSubmitSuccess }) {
  const [fruitSuggestion, setFruitSuggestion] = useState('');
  const [vegSuggestion, setVegSuggestion] = useState('');
  const [greenSuggestion, setGreenSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedFruits = selectedItems.filter((item) => item.category === 'fruit');
  const selectedVegs = selectedItems.filter((item) => item.category === 'vegetable');
  const selectedGreens = selectedItems.filter((item) => item.category === 'green');

  const handleSubmit = async () => {
    if (selectedItems.length === 0 && !fruitSuggestion && !vegSuggestion && !greenSuggestion) return;
    setLoading(true);
    try {
      const res = await publicFetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems.map(({ id }) => id),
          fruitSuggestion: fruitSuggestion.trim() || null,
          vegetableSuggestion: vegSuggestion.trim() || null,
          greenSuggestion: greenSuggestion.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Vote error:', err);
        throw new Error(err.detail || 'Submission failed');
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFruitSuggestion('');
        setVegSuggestion('');
        setGreenSuggestion('');
        onSubmitSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[90vh] flex flex-col
          ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Your Selections</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* success screen */}
        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
            <p className="text-xl font-bold text-green-600">Vote Submitted!</p>
            <p className="text-sm text-gray-400">Thank you for your feedback 🎉</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

            {/* selected fruits */}
            {selectedFruits.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">🍎 Fruits</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFruits.map((item) => (
                    <SelectedChip key={item.id} item={item} onRemove={onRemove} />
                  ))}
                </div>
              </section>
            )}

            {/* selected vegetables */}
            {selectedVegs.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">🥦 Vegetables</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVegs.map((item) => (
                    <SelectedChip key={item.id} item={item} onRemove={onRemove} />
                  ))}
                </div>
              </section>
            )}

            {/* selected greens */}
            {selectedGreens.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">🥬 Greens</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGreens.map((item) => (
                    <SelectedChip key={item.id} item={item} onRemove={onRemove} />
                  ))}
                </div>
              </section>
            )}

            {/* empty state */}
            {selectedItems.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">🧺</p>
                <p className="font-semibold">Nothing selected yet</p>
                <p className="text-sm">Go back and pick some items!</p>
              </div>
            )}

            {/* suggestions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">💡 Suggestions</h3>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Fruit Suggestion</label>
                <input
                  type="text"
                  placeholder="e.g. Dragon Fruit, Jackfruit..."
                  value={fruitSuggestion}
                  onChange={(e) => setFruitSuggestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Vegetable Suggestion</label>
                <input
                  type="text"
                  placeholder="e.g. Artichoke, Zucchini..."
                  value={vegSuggestion}
                  onChange={(e) => setVegSuggestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Greens Suggestion</label>
                <input
                  type="text"
                  placeholder="e.g. Thandu Keerai, Vallarai Keerai..."
                  value={greenSuggestion}
                  onChange={(e) => setGreenSuggestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* submit button */}
        {!submitted && (
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={loading || (selectedItems.length === 0 && !fruitSuggestion && !vegSuggestion && !greenSuggestion)}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Submitting...</>
              ) : (
                <><Send size={18} /> Submit Vote</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function SelectedChip({ item, onRemove }) {
  return (
    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
      <span>{item.emoji}</span>
      <span>{item.name}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-1 text-green-400 hover:text-red-400 transition"
      >
        <X size={14} />
      </button>
    </div>
  );
}
