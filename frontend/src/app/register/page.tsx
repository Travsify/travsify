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
  CheckCircle2,
  Zap,
  ShieldCheck
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
    <div className="min-h-screen flex bg-slate-950 font-sans selection:bg-blue-500/30 selection:text-white overflow-hidden">
      {/* ─── LEFT: INTERACTIVE BRAND SIDE ─── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
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
            <Zap className="text-blue-400" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Production Ready Infrastructure</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Build the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-200">future of travel</span><br/>
            distribution.
          </h2>
          
          <div className="space-y-6">
            <FeatureItem 
              icon={<ShieldCheck className="text-emerald-400" size={20} />}
              title="Bank-Grade Security"
              desc="PCI-DSS compliant, HMAC-SHA256 signed webhooks."
            />
            <FeatureItem 
              icon={<Zap className="text-blue-400" size={20} />}
              title="Instant Provisioning"
              desc="Get your API keys and start building in seconds."
            />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
          <span>© 2026 Travsify Global</span>
          <div className="flex gap-4">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: GLASSMORPHIC FORM SIDE ─── */}
      <div className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="w-full max-w-lg relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />
          
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-black/50 animate-fade-up">
            <div className="mb-12">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
              <p className="text-slate-400 font-medium">Join 500+ developers building on Travsify.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-8 animate-shake">
                <AlertCircle size={18} className="text-orange-500 shrink-0" />
                <p className="text-xs font-bold text-orange-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputGroup 
                label="Business Name" 
                icon={<Building2 size={18} />} 
                value={businessName}
                onChange={(e: any) => setBusinessName(e.target.value)}
                placeholder="Acme Travel Ltd"
                required
              />
              
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
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Get Started Now'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-bold text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-400/30">Sign in here</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale">
            {['GDPR', 'SOC2', 'PCI-DSS'].map(tag => (
              <span key={tag} className="text-[10px] font-black text-white tracking-widest uppercase">{tag} COMPLIANT</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
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
