'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  BarChart3, 
  ChevronLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    <div className="min-h-screen flex bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-hidden">
        {/* Decorative Background for Mobile */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl lg:hidden" />
        
        <header className="p-8 lg:p-12 relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Globe size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Travsify<span className="text-blue-600">.</span></span>
          </Link>
        </header>
        
        <main className="flex-1 flex items-center justify-center p-8 lg:p-12 relative z-10">
          <div className="w-full max-w-sm animate-fade-up">
            <div className="mb-10">
              <h1 className="text-3xl font-black tracking-tight mb-3 text-slate-900">Welcome back</h1>
              <p className="text-[15px] font-medium text-slate-500">Sign in to manage your global travel operations.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl mb-8 animate-shake">
                <AlertCircle size={18} className="text-orange-600 shrink-0" />
                <p className="text-xs font-bold text-orange-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm group-hover:bg-white"
                    placeholder="you@company.com" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Password</label>
                  <Link href="/forgot-password" title="Coming soon" className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm group-hover:bg-white"
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white text-sm font-black py-4 rounded-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in to Dashboard'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[14px] font-bold text-slate-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 font-black hover:text-blue-700 underline underline-offset-4">Create one</Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="p-8 lg:p-12 text-center lg:text-left relative z-10">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">© 2026 Travsify Global Platform. All rights reserved.</p>
        </footer>
      </div>

      {/* Right Info Side */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white items-center justify-center p-20 relative overflow-hidden">
        {/* Abstract Mesh Gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-12 animate-float">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200" alt="Global Infrastructure" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Systems Operational</span>
          </div>
          
          <h2 className="text-5xl font-black mb-12 leading-[1.1]">Modern travel <br/>infrastructure for <span className="text-blue-500">global teams.</span></h2>
          
          <div className="space-y-10">
            {[
              { 
                icon: <Globe className="text-blue-400" />, 
                title: "Live Global Inventory", 
                desc: "Real-time availability across thousands of airlines, hotels, and transfers worldwide." 
              },
              { 
                icon: <ShieldCheck className="text-emerald-400" />, 
                title: "Enterprise Security", 
                desc: "Bank-grade encryption and advanced fraud protection for every transaction." 
              },
              { 
                icon: <BarChart3 className="text-indigo-400" />, 
                title: "Deep Analytics", 
                desc: "Comprehensive insights into your booking volumes, revenue, and performance." 
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-14 h-14 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-black text-lg mb-2 text-white">{item.title}</h3>
                  <p className="text-slate-400 text-[14px] leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
