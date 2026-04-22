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
  BookOpen
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-up">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Developer Keys...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Developer Tools</h2>
        <p className="text-slate-500 font-medium">Manage your API keys and integrate our travel infrastructure into your own applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* API Key Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Production API Key</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active & Ready</p>
                </div>
              </div>
              <button 
                onClick={rotateKey}
                disabled={rotating}
                className="flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-orange-600 transition-colors"
              >
                {rotating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                Rotate Key
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all rounded-3xl" />
              <div className="relative flex items-center gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-sm text-blue-400 overflow-hidden">
                <Terminal size={18} className="text-slate-600 shrink-0" />
                <span className="flex-1 truncate tracking-wider">{tenant?.apiKey || '••••••••••••••••••••••••••••••'}</span>
                <button 
                  onClick={() => copyToClipboard(tenant?.apiKey)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
              <ShieldAlert className="text-orange-600 shrink-0 mt-0.5" size={18} />
              <p className="text-[13px] font-medium text-orange-800 leading-relaxed">
                <span className="font-black">Security Warning:</span> Do not share your API key in public repositories or client-side code. Use environment variables to keep it secure.
              </p>
            </div>
          </div>

          {/* Quick Start Code */}
          <div className="bg-[#0f172a] rounded-[32px] p-8 text-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Code2 className="text-blue-400" size={20} />
                <h3 className="font-bold">Quick Integration</h3>
              </div>
              <div className="flex gap-2">
                {['cURL', 'Node.js', 'Python'].map(lang => (
                  <span key={lang} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/10 text-slate-400 cursor-pointer hover:bg-white/10">{lang}</span>
                ))}
              </div>
            </div>
            
            <div className="bg-black/50 rounded-2xl p-6 font-mono text-[13px] leading-relaxed text-slate-300 border border-white/5">
              <p className="text-emerald-400 mb-2"># Search for flights from London to Lagos</p>
              <p>curl -X GET "<span className="text-blue-400">{API_URL}/api/v1/search/flights</span>" \</p>
              <p className="pl-4">-H "<span className="text-orange-400">x-api-key: {tenant?.apiKey || 'YOUR_KEY'}</span>" \</p>
              <p className="pl-4">-G \</p>
              <p className="pl-4">--data-urlencode "origin=LHR" \</p>
              <p className="pl-4">--data-urlencode "destination=LOS" \</p>
              <p className="pl-4">--data-urlencode "date=2026-06-20"</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h4 className="font-black text-slate-900 mb-6">Documentation</h4>
            <div className="space-y-4">
              <DocLink title="API Reference" desc="Detailed endpoint documentation" icon={<BookOpen size={16} />} />
              <DocLink title="Authentication" desc="How to sign your requests" icon={<Terminal size={16} />} />
              <DocLink title="Error Codes" desc="Handling edge cases & limits" icon={<Code2 size={16} />} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white">
            <h4 className="font-black mb-2">Need Support?</h4>
            <p className="text-sm text-blue-100 mb-6">Our engineering team is ready to help you integrate Travsify.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all">
              Join Developer Slack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocLink({ title, desc, icon }: any) {
  return (
    <a href="#" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all">
        {icon}
      </div>
      <div>
        <h5 className="text-sm font-black text-slate-900">{title}</h5>
        <p className="text-[11px] font-medium text-slate-400">{desc}</p>
      </div>
    </a>
  );
}
