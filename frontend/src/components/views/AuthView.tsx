import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../services/api';
import { Spinner } from '../ui';
import { Globe2, Lock, Mail, ShieldCheck } from 'lucide-react';

export function AuthView() {
  const { login, setView } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      login(res.user);
      setView('dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-600/30 mb-4">
            <Globe2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-surface-900">Climate Digital Twin</h1>
          <p className="text-sm text-surface-600">AI-Powered Digital Twin of India's Climate</p>
        </div>

        <div className="card p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-surface-900">Sign In</h2>
            <p className="text-xs text-surface-600 mt-0.5">Access the climate intelligence platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-9" placeholder="you@imd.gov.in" required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-9" placeholder="••••••••" required />
              </div>
            </div>

            {error && <div className="text-xs text-error-400 bg-error-500/10 border border-error-500/30 rounded-md px-3 py-2">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full !py-2">
              {loading ? <Spinner size={16} /> : <ShieldCheck className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-xs text-surface-600 text-center">
            Enter any email and a password of 4+ characters to sign in.
          </div>

          <div className="flex items-center gap-2 text-xs text-surface-600 pt-3 border-t border-surface-300/40">
            <ShieldCheck className="w-3.5 h-3.5 text-success-400" />
            JWT-secured · Role-based access control
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-surface-600">
          Need access? Contact your administrator.
        </div>
      </div>
    </div>
  );
}
