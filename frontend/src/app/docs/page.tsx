'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Book, 
  Code, 
  Terminal, 
  Shield, 
  Zap, 
  Globe, 
  Key, 
  Settings, 
  Cpu, 
  ChevronRight, 
  Search,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-500/30">
      {/* ─── SIDEBAR ─── */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 border-r border-slate-100 bg-slate-50/50 backdrop-blur-xl z-50 hidden lg:block overflow-y-auto">
        <div className="p-8">
          <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-2 mb-12">
            <span className="text-blue-600">Travs</span><span className="text-orange-600">ify.</span>
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">v1.0</span>
          </Link>

          <nav className="space-y-10">
            <NavSection title="Getting Started">
              <NavItem active={activeSection === 'introduction'} onClick={() => setActiveSection('introduction')} label="Introduction" icon={<Book size={16} />} />
              <NavItem active={activeSection === 'authentication'} onClick={() => setActiveSection('authentication')} label="Authentication" icon={<Key size={16} />} />
              <NavItem active={activeSection === 'environments'} onClick={() => setActiveSection('environments')} label="Environments" icon={<Globe size={16} />} />
            </NavSection>

            <NavSection title="API Reference">
              <NavItem active={activeSection === 'flights'} onClick={() => setActiveSection('flights')} label="Flights" icon={<Code size={16} />} />
              <NavItem active={activeSection === 'hotels'} onClick={() => setActiveSection('hotels')} label="Hotels" icon={<Code size={16} />} />
              <NavItem active={activeSection === 'wallets'} onClick={() => setActiveSection('wallets')} label="Wallets" icon={<Code size={16} />} />
            </NavSection>

            <NavSection title="Guides">
              <NavItem active={activeSection === 'error-handling'} onClick={() => setActiveSection('error-handling')} label="Error Handling" icon={<AlertCircle size={16} />} />
              <NavItem active={activeSection === 'webhooks'} onClick={() => setActiveSection('webhooks')} label="Webhooks" icon={<Zap size={16} />} />
              <NavItem active={activeSection === 'best-practices'} onClick={() => setActiveSection('best-practices')} label="Best Practices" icon={<CheckCircle2 size={16} />} />
            </NavSection>
          </nav>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="lg:ml-80 pt-10 pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/demo" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Live Demo</Link>
              <Link href="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Console</Link>
            </div>
          </div>

          {/* Dynamic Content */}
          <article className="animate-fade-up">
            {activeSection === 'introduction' && (
              <section className="space-y-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tight mb-6">API Introduction</h1>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    Welcome to the Travsify API documentation. Our API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeatureBox title="Unified Interface" desc="Access flights, hotels, and more through a single schema." icon={<Cpu className="text-blue-600" />} />
                  <FeatureBox title="Real-time Data" desc="Direct NDC and GDS connections for sub-second latency." icon={<Zap className="text-orange-600" />} />
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Terminal size={120} />
                  </div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Terminal size={20} className="text-blue-400" />
                    Quick Start
                  </h3>
                  <div className="bg-black/40 rounded-2xl p-6 font-mono text-[13px] leading-relaxed relative">
                    <button 
                      onClick={() => copyToClipboard('curl -X GET https://api.travsify.com/v1/ping', 'ping')}
                      className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      {copied === 'ping' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-500" />}
                    </button>
                    <span className="text-slate-500">$</span> <span className="text-blue-400">curl</span> -X GET https://api.travsify.com/v1/ping
                    <br/>
                    <br/>
                    <span className="text-slate-500"># → Response</span>
                    <br/>
                    <span className="text-emerald-400">{`{ \"status\": \"operational\", \"timestamp\": \"2026-04-19T...\" }`}</span>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'authentication' && (
              <section className="space-y-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tight mb-6">Authentication</h1>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    The Travsify API uses API keys to authenticate requests. You can view and manage your API keys in the Travsify Dashboard.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex gap-4">
                  <Shield className="text-orange-600 shrink-0" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-orange-900 mb-1">Protect your keys</h4>
                    <p className="text-sm text-orange-700 font-medium">Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Header Format</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 font-mono text-sm">
                    Authorization: Bearer <span className="text-blue-600">sk_live_••••••••</span>
                  </div>
                </div>
              </section>
            )}

            {/* Placeholder for other sections */}
            {!['introduction', 'authentication'].includes(activeSection) && (
              <div className="py-40 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Code size={40} className="text-slate-200" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} reference coming soon</h2>
                <p className="text-slate-400 font-medium max-w-sm">We are currently documenting this module. Check back in a few hours for the full interactive reference.</p>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}

function NavSection({ title, children }: any) {
  return (
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">{title}</h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function NavItem({ active, onClick, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function FeatureBox({ title, desc, icon }: any) {
  return (
    <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent transition-all group">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-lg font-black mb-2 text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
