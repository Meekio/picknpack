import { Check, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ItemCard({ item, selected, onToggle }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border-2 transition-all duration-200 cursor-pointer select-none
        ${selected
          ? 'border-red-400 shadow-red-100 shadow-md scale-[1.02]'
          : 'border-transparent hover:border-red-200 hover:shadow-md'
        }`}
      onClick={onToggle}
    >
      {/* selected badge */}
      {selected && (
        <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-0.5 z-10">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      {/* image */}
      <div className={`w-full aspect-[4/3] rounded-xl overflow-hidden ${item.color} flex items-center justify-center`}>
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-5xl">{item.emoji ?? '🌿'}</span>
        )}
      </div>

      {/* name */}
      <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{item.name}</p>

      {/* toggle button */}
      <button
        className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200
          ${selected
            ? 'bg-red-500 text-white'
            : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {selected ? (
          <><Check size={13} strokeWidth={3} /> Selected</>
        ) : (
          <><Plus size={13} strokeWidth={3} /> Select</>
        )}
      </button>
    </div>
  );
}
