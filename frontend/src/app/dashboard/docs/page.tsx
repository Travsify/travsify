'use client';

import { useState } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Zap, 
  Shield, 
  Code2, 
  Globe, 
  Server, 
  ChevronRight, 
  Copy,
  ExternalLink,
  Plane,
  Hotel,
  Car,
  ScrollText,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function DocsPage() {
  const [activeVertical, setActiveVertical] = useState('flights');

  const verticals = [
    { id: 'flights', label: 'Flights', icon: <Plane size={18} />, color: 'blue' },
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={18} />, color: 'indigo' },
    { id: 'transfers', label: 'Transfers', icon: <Car size={18} />, color: 'emerald' },
    { id: 'visa', label: 'eVisa', icon: <ScrollText size={18} />, color: 'orange' },
    { id: 'insurance', label: 'Insurance', icon: <ShieldCheck size={18} />, color: 'orange' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Developer Resources</h2>
          <p className="text-slate-500 font-medium text-sm">Everything you need to integrate global travel services into your application.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-black text-sm text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
            <Terminal size={18} />
            Postman Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-6">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4">Introduction</h4>
            <nav className="space-y-1">
              {['Authentication', 'Rate Limits', 'Errors', 'Webhooks'].map((item) => (
                <button key={item} className="w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-between">
                  {item}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4">Core Verticals</h4>
            <nav className="space-y-1">
              {verticals.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setActiveVertical(v.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center gap-3 ${
                    activeVertical === v.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={activeVertical === v.id ? 'text-white' : 'text-slate-400'}>{v.icon}</span>
                  {v.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Documentation Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Base URL & Auth Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <Server size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">API Infrastructure</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Base Endpoint</p>
                <div className="flex items-center justify-between">
                  <code className="text-[13px] font-mono font-bold text-blue-600 tracking-tight">https://api.travsify.com/v1</code>
                  <Copy size={14} className="text-slate-300 hover:text-blue-600 cursor-pointer" />
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Auth Headers</p>
                <div className="flex flex-col gap-1 text-[11px] font-mono font-bold text-slate-600">
                  <p>x-api-key: <span className="text-slate-400">YOUR_PUBLIC_KEY</span></p>
                  <p>x-api-secret: <span className="text-slate-400">YOUR_SECRET_KEY</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {/* Endpoint Documentation */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full border border-emerald-100 tracking-widest">POST</span>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">/flights/search</h4>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                  The flight search endpoint allows you to query multiple NDC pipes and GDS providers simultaneously. It returns standardized flight offers with live pricing and rules.
                </p>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Request Schema</h5>
                    <div className="bg-[#0f172a] rounded-2xl p-6 relative group">
                      <button className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                        <Copy size={14} />
                      </button>
                      <pre className="font-mono text-[13px] text-blue-300 leading-relaxed overflow-x-auto whitespace-pre">
{`{
  "origin": "LOS",
  "destination": "LHR",
  "departureDate": "2026-05-15",
  "cabinClass": "ECONOMY",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-blue-600" />
                        <h6 className="text-xs font-black uppercase tracking-widest">Low Latency</h6>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                        Results are cached for 15 minutes to ensure rapid response times for redundant queries.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={14} className="text-emerald-600" />
                        <h6 className="text-xs font-black uppercase tracking-widest">Multi-Source</h6>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                        Query results aggregated from 400+ airlines across NDC and GDS networks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Error Handling</h4>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-6">
                All error responses follow the RFC 7807 standard. Common status codes include <code className="text-orange-500">401</code> for auth errors and <code className="text-blue-500">402</code> for insufficient wallet balance.
              </p>
              <button className="text-xs font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                View Error Codes <ChevronRight size={14} />
              </button>
            </div>
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-lg shadow-slate-900/20">
              <h4 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">Official SDKs</h4>
              <p className="text-[13px] font-medium opacity-70 leading-relaxed mb-6">
                Launch your integration in minutes with our high-level language wrappers.
              </p>
              <div className="flex gap-2">
                {['Node', 'Python', 'Go'].map((sdk) => (
                  <div key={sdk} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    {sdk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
