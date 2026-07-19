import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold animate-slide-down transition-all
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={15} />
      </button>
    </div>
  );
}
