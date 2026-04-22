'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Globe, 
  Loader2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Building2,
  Key
} from 'lucide-react';

import { API_URL } from '@/utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans selection:bg-blue-500/30 selection:text-white overflow-hidden">
      {/* ─── LEFT: GLASSMORPHIC FORM SIDE ─── */}
      <div className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="w-full max-w-lg relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />
          
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-black/50 animate-fade-up">
            <div className="mb-12">
              <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Globe size={20} />
                </div>
                <span className="text-xl font-black text-white">Travsify<span className="text-blue-500">.</span></span>
              </Link>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
              <p className="text-slate-400 font-medium">Continue your global travel distribution.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-8 animate-shake">
                <AlertCircle size={18} className="text-orange-500 shrink-0" />
                <p className="text-xs font-bold text-orange-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputGroup 
                label="Email Address" 
                icon={<Mail size={18} />} 
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />

              <InputGroup 
                label="Password" 
                icon={<Lock size={18} />} 
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-bold text-sm">
                New to the platform?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-400/30">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: INTERACTIVE BRAND SIDE ─── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 overflow-hidden border-l border-white/5 bg-[#0f172a]">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform duration-500">
              <Globe size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Travsify<span className="text-blue-500">.</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-xl">
            <Key className="text-blue-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Secure Developer Access</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-12 tracking-tight">
            Managing <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-200">global travel</span><br/>
            at scale.
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-black text-white">Operational</span>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">API Latency</p>
              <span className="text-lg font-black text-white">124ms</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
          <span>© 2026 Travsify Global</span>
          <div className="flex gap-4">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
          {icon}
        </div>
        <input 
          {...props}
          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all group-hover:bg-white/10"
        />
      </div>
    </div>
  );
}
