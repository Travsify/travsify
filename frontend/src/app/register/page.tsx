'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  Rocket, 
  Globe, 
  Wallet, 
  Palette, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, businessName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
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
              <h1 className="text-3xl font-black tracking-tight mb-3 text-slate-900">Create account</h1>
              <p className="text-[15px] font-medium text-slate-500">Sandbox keys are free, forever. Start building today.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl mb-8 animate-shake">
                <AlertCircle size={18} className="text-orange-600 shrink-0" />
                <p className="text-xs font-bold text-orange-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm group-hover:bg-white"
                    placeholder="Acme Travel Ltd" 
                    required 
                  />
                </div>
              </div>

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
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
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
                className="w-full bg-blue-600 text-white text-sm font-black py-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-6 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Get your API Keys'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[14px] font-bold text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-black hover:text-blue-700 underline underline-offset-4">Sign in</Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="p-8 lg:p-12 text-center lg:text-left relative z-10">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center lg:justify-start gap-4">
              {['GDPR', 'SOC2', 'PCI-DSS'].map((label) => (
                <div key={label} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  <span className="text-[9px] font-black uppercase text-slate-400">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">© 2026 Travsify Global Platform.</p>
          </div>
        </footer>
      </div>

      {/* Right Info Side */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white items-center justify-center p-20 relative overflow-hidden">
        {/* Abstract Mesh Gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-12 animate-float">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200" alt="Global Infrastructure" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
            <Rocket className="text-blue-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Launch your travel brand</span>
          </div>
          
          <h2 className="text-5xl font-black mb-12 leading-[1.1]">The future of <br/>travel distribution <span className="text-orange-500">starts here.</span></h2>
          
          <div className="space-y-10">
            {[
              { 
                icon: <Rocket className="text-blue-400" />, 
                title: "Instant Sandbox Access", 
                desc: "Start building immediately. Get your API keys instantly without needing to wait for approval." 
              },
              { 
                icon: <Globe className="text-emerald-400" />, 
                title: "Global Travel Ecosystem", 
                desc: "Unlock flights, hotels, transfers, insurance, and eVisa processing in one single API." 
              },
              { 
                icon: <Wallet className="text-indigo-400" />, 
                title: "Multi-Currency Wallet", 
                desc: "Fund your account in local and global currencies. We handle the complex reconciliations." 
              },
              { 
                icon: <Palette className="text-orange-400" />, 
                title: "White-label Portals", 
                desc: "Launch branded booking sites for your B2B clients in minutes with zero coding required." 
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
