import { ShoppingBasket, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingButton({ count, onClick }) {
  const [showHint, setShowHint] = useState(false);

  // Show the hint tooltip shortly after items are first selected
  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setShowHint(true), 600);
      return () => clearTimeout(t);
    } else {
      setShowHint(false);
    }
  }, [count > 0]); // only trigger when going from 0 → 1

  // Auto-hide hint after 4 seconds
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Hint tooltip */}
      {showHint && (
        <div className="flex items-center gap-2 bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-lg animate-fade-in whitespace-nowrap">
          <ArrowUp size={13} className="animate-bounce" />
          Tap here to review &amp; submit your vote
        </div>
      )}

      {/* Main floating button with pulse ring */}
      <div className="relative">
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-2xl bg-red-400 opacity-40 animate-ping" />

        <button
          onClick={() => { onClick(); setShowHint(false); }}
          className="relative bg-red-500 hover:bg-red-600 active:scale-95 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-red-300 flex items-center gap-3 font-semibold text-sm transition-all duration-200"
        >
          <ShoppingBasket size={20} />
          <span>Selected Items</span>
          <span className="bg-white text-red-600 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {count}
          </span>
        </button>
      </div>
    </div>
  );
}
