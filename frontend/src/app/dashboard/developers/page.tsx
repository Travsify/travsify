'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Zap, 
  Copy, 
  RefreshCcw, 
  Terminal, 
  CheckCircle2, 
  ShieldAlert,
  Loader2,
  Code2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Activity,
  ChevronRight,
  Database,
  Globe,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

import { API_URL } from '@/utils/api';
import Link from 'next/link';

export default function DevelopersPage() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTenantData();
  }, []);

  const fetchTenantData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tenant/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTenant(await res.json());
    } catch (err) {
      console.error('Failed to fetch tenant data:', err);
    } finally {
      setLoading(false);
    }
  };

  const rotateKey = async () => {
    if (!confirm('Are you sure? Any applications using the old key will stop working immediately.')) return;
    
    setRotating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tenant/rotate-key`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTenant(await res.json());
    } catch (err) {
      console.error('Failed to rotate key:', err);
    } finally {
      setRotating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-[#0a0f18] rounded-[32px] border border-white/5">
        <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Establishing Secure Connection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Global Ecosystem Header */}
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-12 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                 <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em]">Developer Hub: Live</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tight leading-none">
                Integration <span className="text-slate-400">Terminal</span>
              </h2>
              <p className="text-slate-400 font-bold text-lg max-w-xl">
                Build the next generation of travel tools. Connect your software directly to our global booking infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
               <StatMetric label="Monthly Requests" value="1.2M" trend="Live" />
               <StatMetric label="Avg. Latency" value="124ms" trend="Optimal" />
               <StatMetric label="Uptime" value="100%" trend="Stable" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* API Key Card */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-600" />
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-orange-500 shadow-lg group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Main API Key</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active & Authenticated</p>
                </div>
              </div>
              <button 
                onClick={rotateKey}
                disabled={rotating}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-100 transition-all active:scale-95"
              >
                {rotating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                Generate New Key
              </button>
            </div>

            <div className="relative group/key">
              <div className="absolute inset-0 bg-orange-600/5 blur-2xl group-hover/key:bg-orange-600/10 transition-all rounded-3xl" />
              <div className="relative flex items-center gap-4 p-8 bg-slate-900 rounded-3xl border border-white/5 font-mono text-sm text-blue-400 overflow-hidden shadow-xl">
                <Terminal size={20} className="text-slate-600 shrink-0" />
                <span className="flex-1 truncate tracking-[0.2em]">{tenant?.apiKey || '••••••••••••••••••••••••••••••'}</span>
                <button 
                  onClick={() => copyToClipboard(tenant?.apiKey)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white active:scale-90"
                >
                  {copied ? <CheckCircle2 size={20} className="text-emerald-400" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="mt-10 flex gap-4 items-start p-6 bg-orange-50 rounded-2xl border border-orange-100">
               <ShieldAlert className="text-orange-600 shrink-0 mt-0.5" size={20} />
               <p className="text-[13px] font-bold text-slate-600 leading-relaxed">
                 <span className="text-orange-600 font-black">IMPORTANT SECURITY:</span> Never share this key or put it in public code. Use it only on your secure server.
               </p>
            </div>
          </div>

          {/* Quick Integration Section */}
          <div className="bg-slate-900 rounded-[32px] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full translate-x-1/2 pointer-events-none" />
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <Code2 className="text-blue-400" size={24} />
                   <h3 className="text-xl font-black text-white tracking-tight">Easy Integration</h3>
                </div>
                <div className="flex gap-3">
                   {['cURL', 'Node.js', 'Python'].map(lang => (
                     <span key={lang} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                       {lang}
                     </span>
                   ))}
                </div>
             </div>
             <div className="bg-black/40 rounded-2xl p-8 font-mono text-[13px] text-slate-300 border border-white/5 leading-loose overflow-x-auto relative group">
                <button 
                  onClick={() => copyToClipboard(`curl -X GET "${API_URL}/api/v1/flights" -H "x-api-key: ${tenant?.apiKey || 'YOUR_KEY'}"`)}
                  className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-white opacity-0 group-hover:opacity-100"
                >
                  <Copy size={16} />
                </button>
                <span className="text-slate-500 italic"># Search for flights from London to Lagos</span><br/>
                <span className="text-white">curl</span> -X GET "<span className="text-blue-400">{API_URL}/api/v1/flights</span>" \<br/>
                &nbsp;&nbsp;-H "<span className="text-orange-500">x-api-key: {tenant?.apiKey || 'YOUR_KEY'}</span>" \<br/>
                &nbsp;&nbsp;-G \<br/>
                &nbsp;&nbsp;--data-urlencode "from=LHR" \<br/>
                &nbsp;&nbsp;--data-urlencode "to=LOS" \<br/>
                &nbsp;&nbsp;--data-urlencode "date=2026-06-20"
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Resource Links */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
             <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Support Resources</h4>
             <div className="space-y-3">
                <ResourceItem icon={<BookOpen size={18} />} title="Full API Documentation" desc="Every endpoint explained" path="/docs" />
                <ResourceItem icon={<Terminal size={18} />} title="How to Connect" desc="Step-by-step security guide" path="/docs" />
                <ResourceItem icon={<ShieldCheck size={18} />} title="Best Practices" desc="Build like a pro" path="/docs" />
             </div>
          </div>

          {/* Expert Support */}
          <div className="bg-orange-600 rounded-[32px] p-10 text-white shadow-2xl shadow-orange-600/30 group">
             <h4 className="text-xl font-black mb-4 tracking-tight">Need Expert Help?</h4>
             <p className="text-orange-100 font-bold text-sm leading-relaxed mb-10">
               Our engineering team is ready to help you build the perfect travel experience for your users.
             </p>
             <Link href="/dashboard/settings" className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black text-[13px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Configure Webhooks
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
          </div>
        </div>
      </div>

      {/* Integration Guide Section */}
      <div id="docs" className="pt-20 space-y-12 border-t border-slate-200">
         <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-none">Simple Connection Guide</h2>
            <p className="text-lg font-bold text-slate-500 leading-relaxed">
              We've made it extremely simple to use our power. No complex setups. Just one key, and you're connected to the world.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GuideBox 
              title="Global Flights (SME.ng)"
              desc="Book 300+ airlines worldwide with real-time pricing and instant ticketing."
              url="/api/v1/search/flights"
            />
            <GuideBox 
              title="Worldwide Hotels"
              desc="Over 2 million properties ranging from luxury resorts to budget stays."
              url="/api/v1/search/hotels"
            />
            <GuideBox 
              title="Airport Transfers"
              desc="Private cars, shuttles, and luxury transfers in 2000+ cities."
              url="/api/v1/search/transfers"
            />
            <GuideBox 
              title="Visa Services (Shepper)"
              desc="Check visa requirements and apply instantly for your passengers."
              url="/api/v1/search/visa"
            />
         </div>
      </div>
    </div>
  );
}

function StatMetric({ label, value, trend }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-white tracking-tight">{value}</h4>
        <span className="text-[10px] font-black text-orange-500 tracking-widest">{trend}</span>
      </div>
    </div>
  );
}

function ResourceItem({ icon, title, desc, path }: any) {
  return (
    <Link href={path} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-orange-500/30 hover:bg-orange-50/30 transition-all group">
       <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-md transition-all">
         {icon}
       </div>
       <div>
         <h5 className="text-[13px] font-black text-slate-900 group-hover:text-orange-600 transition-colors">{title}</h5>
         <p className="text-[11px] font-bold text-slate-400">{desc}</p>
       </div>
    </Link>
  );
}

function GuideBox({ title, desc, url }: any) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-10 rounded-[32px] border border-slate-200 group hover:shadow-xl transition-all">
       <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
         <div className="w-2 h-2 rounded-full bg-orange-500" />
         {title}
       </h4>
       <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">{desc}</p>
       <div className="bg-slate-50 rounded-2xl p-6 font-mono text-[11px] text-slate-600 border border-slate-100 flex items-center justify-between group/code">
         <span>GET {url}</span>
         <button onClick={handleCopy} className="text-slate-400 hover:text-slate-900 transition-colors">
           {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
         </button>
       </div>
    </div>
  );
}
