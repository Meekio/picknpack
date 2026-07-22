const tabs = [
  { key: 'all', label: '🛒 All' },
  { key: 'fruit', label: '🍎 Fruits' },
  { key: 'vegetable', label: '🥦 Vegetables' },
  { key: 'green', label: '🥬 Greens' },
];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            active === tab.key
              ? 'bg-red-500 text-white shadow-md shadow-red-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
