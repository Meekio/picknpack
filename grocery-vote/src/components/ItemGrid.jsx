import ItemCard from './ItemCard';
import { PackageSearch } from 'lucide-react';

export default function ItemGrid({ items, selectedIds, onToggle }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <PackageSearch size={48} strokeWidth={1.2} />
        <p className="text-lg font-semibold">No items found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          onToggle={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}
