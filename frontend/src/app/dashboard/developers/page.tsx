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
  const [activeTab, setActiveTab] = useState<'keys' | 'logs' | 'webhooks' | 'docs'>('keys');
  const [apiStats, setApiStats] = useState<any>(null);

  useEffect(() => {
    fetchTenantData();
    fetchApiStats();
  }, []);

  const fetchApiStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/developer/logs/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setApiStats(await res.json());
    } catch (err) {
      console.error('Failed to fetch api stats:', err);
    }
  };

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
                <StatMetric label="Total Requests" value={apiStats?.total?.toLocaleString() || '0'} trend="Live" />
                <StatMetric label="Avg. Latency" value={`${apiStats?.avgLatency || 0}ms`} trend="Optimal" />
                <StatMetric label="Error Rate" value={`${apiStats?.total > 0 ? ((apiStats.error / apiStats.total) * 100).toFixed(1) : '0'}%`} trend="Stable" />
             </div>
         </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 p-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 inline-flex shadow-xl">
        <TabButton active={activeTab === 'keys'} onClick={() => setActiveTab('keys')} icon={<Zap size={14}/>} label="API Keys" />
        <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Activity size={14}/>} label="API Logs" />
        <TabButton active={activeTab === 'webhooks'} onClick={() => setActiveTab('webhooks')} icon={<Globe size={14}/>} label="Webhooks" />
        <TabButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} icon={<BookOpen size={14}/>} label="Documentation" />
      </div>
      </div>

      {activeTab === 'keys' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    onClick={() => copyToClipboard(`import travsify; travsify.apiKey = "${tenant?.apiKey || 'YOUR_KEY'}"; const results = await travsify.search({ from: 'LHR', to: 'LOS' })`)}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-white opacity-0 group-hover:opacity-100"
                  >
                    <Copy size={16} />
                  </button>
                  <span className="text-slate-500 italic"># 3-Line Integration: Search all travel verticals</span><br/>
                  <span className="text-white">import</span> travsify <span className="text-slate-500"># or use native fetch/curl</span><br/>
                  <span className="text-blue-400">travsify</span>.apiKey = "<span className="text-orange-500">{tenant?.apiKey || 'YOUR_KEY'}</span>"<br/>
                  <span className="text-emerald-400">const</span> results = <span className="text-blue-400">await</span> travsify.<span className="text-orange-400">search</span>({'{'} from: <span className="text-emerald-400">'LHR'</span>, to: <span className="text-emerald-400">'LOS'</span> {'}'})
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
               <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Support Resources</h4>
               <div className="space-y-3">
                  <ResourceItem icon={<BookOpen size={18} />} title="Full API Documentation" desc="Every endpoint explained" onClick={() => setActiveTab('docs')} />
                  <ResourceItem icon={<Terminal size={18} />} title="How to Connect" desc="Step-by-step security guide" onClick={() => setActiveTab('docs')} />
                  <ResourceItem icon={<ShieldCheck size={18} />} title="Support Center" desc="Get help from engineers" path="/dashboard/support" />
               </div>
            </div>

            {/* Expert Support */}
            <div className="bg-orange-600 rounded-[32px] p-10 text-white shadow-2xl shadow-orange-600/30 group">
               <h4 className="text-xl font-black mb-4 tracking-tight">Need Expert Help?</h4>
               <p className="text-orange-100 font-bold text-sm leading-relaxed mb-10">
                 Our engineering team is ready to help you build the perfect travel experience for your users.
               </p>
               <Link href="/dashboard/support" className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black text-[13px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                  Visit Support Center
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && <ApiLogsSection />}
      {activeTab === 'webhooks' && <WebhooksSection />}
      {activeTab === 'docs' && <DocsSection />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
        active 
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
        : 'text-slate-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
function ApiLogsSection() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/developer/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Request History</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time traffic audit</p>
        </div>
        <button onClick={fetchLogs} className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all active:rotate-180 duration-500">
          <RefreshCcw size={18} className="text-slate-400" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Method / Path</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Latency</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Environment</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-600" size={24} /></td></tr>
            ) : logs.length > 0 ? logs.map((log, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                      log.method === 'GET' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>{log.method}</span>
                    <span className="text-[12px] font-bold text-slate-600 font-mono">{log.path}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black ${
                    log.statusCode < 300 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>{log.statusCode}</span>
                </td>
                <td className="px-8 py-5 text-[12px] font-bold text-slate-500">{log.latency}ms</td>
                <td className="px-8 py-5">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    log.environment === 'live' ? 'text-orange-600' : 'text-blue-500'
                  }`}>{log.environment}</span>
                </td>
                <td className="px-8 py-5 text-[11px] font-bold text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No API traffic recorded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WebhooksSection() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/developer/webhooks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setWebhooks(await res.json());
    } catch (err) {
      console.error('Failed to fetch webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!url) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/developer/webhooks`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, events: ['*'], description: 'Default Webhook' })
      });
      if (res.ok) {
        setUrl('');
        fetchWebhooks();
      }
    } catch (err) {
      console.error('Failed to create webhook:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Add Webhook Endpoint</h3>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="https://your-api.com/webhook" 
            className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/20 outline-none transition-all font-bold text-slate-600"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={createWebhook}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95"
          >
            Add Endpoint
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Endpoints</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-600" size={24} /></div>
          ) : webhooks.length > 0 ? webhooks.map((wh, i) => (
            <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-all shadow-sm">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-[14px] font-black text-slate-900 mb-1">{wh.url}</p>
                  <div className="flex gap-2">
                    {wh.events.map((e: string) => (
                      <span key={e} className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signing Secret</p>
                    <p className="text-[11px] font-mono text-blue-500 font-bold">{wh.secret.substring(0, 10)}••••••••</p>
                 </div>
                 <button className="p-3 text-slate-300 hover:text-rose-600 transition-all">
                    <ShieldAlert size={20} />
                 </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No webhook endpoints configured</div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-1 space-y-2">
        <DocNavLink active label="Authentication" />
        <DocNavLink label="Search Flights" />
        <DocNavLink label="Book Hotels" />
        <DocNavLink label="Visa Requirements" />
        <DocNavLink label="Webhooks Guide" />
        <DocNavLink label="Error Codes" />
      </div>
      
      <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-200 p-12 shadow-sm">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Authentication</h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
            The Travsify NDC API uses API Keys to authenticate requests. You can view and manage your API keys in the Integration Terminal.
          </p>
          
          <div className="bg-slate-900 rounded-2xl p-8 mb-10 border border-white/5 shadow-xl">
            <h4 className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-4">Header Authorization</h4>
            <code className="text-blue-400 font-mono text-sm">x-api-key: YOUR_SECRET_KEY</code>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-4">Requesting Data</h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            All requests should be made to the following base URL:
          </p>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-sm text-slate-600 mb-10">
            {API_URL}/api/v1
          </div>

          <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex gap-6">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <BookOpen size={24} />
             </div>
             <div>
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-2">Detailed Postman Collection</h4>
                <p className="text-sm text-blue-700 font-medium mb-4">Download our official Postman collection to start testing all endpoints in minutes.</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Download v1.2.0</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocNavLink({ label, active }: any) {
  return (
    <button className={`w-full text-left px-6 py-4 rounded-2xl text-[12px] font-black tracking-tight transition-all ${
      active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:bg-slate-50'
    }`}>
      {label}
    </button>
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
function StatMetric({ label, value, trend }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">{trend}</p>
    </div>
  );
}
