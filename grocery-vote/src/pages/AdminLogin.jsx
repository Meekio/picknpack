import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { publicFetch } from '../lib/api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await publicFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Incorrect password. Try again.');
        return;
      }

      const { access_token } = await res.json();
      // Store in localStorage so it persists across page refreshes
      localStorage.setItem('admin_token', access_token);
      navigate('/admin/dashboard');
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-red-500 text-white p-4 rounded-2xl shadow-lg shadow-red-200">
            <ShoppingBasket size={30} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-800">Pick N Pack</h1>
            <p className="text-sm text-gray-400 mt-0.5">Admin Dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Admin Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-red-200"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              : <><Lock size={15} /> Sign In</>
            }
          </button>
        </form>

        <p className="text-center text-xs text-gray-300">Pick N Pack Admin · Restricted Access</p>
      </div>
    </div>
  );
}
