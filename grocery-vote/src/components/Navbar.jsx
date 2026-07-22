import { ShoppingBasket } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-red-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-500 text-white p-2 rounded-xl">
            <ShoppingBasket size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-red-700 leading-tight">Pick N Pack</h1>
            <p className="text-xs text-gray-400 leading-tight">Vote your favourites</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full">
            🗳️ Community Vote
          </span>
        </div>
      </div>
    </nav>
  );
}
