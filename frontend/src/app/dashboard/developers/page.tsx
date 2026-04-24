'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
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
import { useSearchParams } from 'next/navigation';

function DevelopersContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'keys' | 'logs' | 'webhooks' | 'docs'>((searchParams.get('tab') as any) || 'keys');
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
    <div className="space-y-12 pb-40">
      {/* ─── ELITE ECOSYSTEM HEADER ─── */}
      <div className="bg-[#0A1629] rounded-[48px] border border-white/5 p-16 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,22,41,0.5)] group">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50" />
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full animate-pulse shadow-[0_0_12px_#FF6B00]" />
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Integration_Protocol_Active</span>
              </div>
              <h2 className="text-7xl font-black text-white tracking-tighter leading-none">
                Integration <span className="text-white/20">Terminal</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl leading-relaxed">
                Architect the next generation of travel infrastructure. Orchestrate global inventory directly via our high-velocity API cluster.
              </p>
              
              <div className="flex gap-4 p-2 bg-white/5 backdrop-blur-2xl rounded-[24px] border border-white/10 w-fit">
                <TabButton active={activeTab === 'keys'} onClick={() => setActiveTab('keys')} icon={<Zap size={14} className={activeTab === 'keys' ? 'text-[#FF6B00]' : ''}/>} label="API KEYS" />
                <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Activity size={14} className={activeTab === 'logs' ? 'text-[#FF6B00]' : ''}/>} label="TRAFFIC LOGS" />
                <TabButton active={activeTab === 'webhooks'} onClick={() => setActiveTab('webhooks')} icon={<Globe size={14} className={activeTab === 'webhooks' ? 'text-[#FF6B00]' : ''}/>} label="WEBHOOKS" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-xl">
                  <StatMetric label="Total Requests" value={apiStats?.total?.toLocaleString() || '0'} trend="Live Consumption" />
               </div>
               <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-xl">
                  <StatMetric label="Avg. Latency" value={`${apiStats?.avgLatency || 0}ms`} trend="Optimal Node" />
               </div>
            </div>
         </div>
      </div>

      {activeTab === 'keys' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-8">
            {/* API Key Card */}
            {/* ─── API KEY MANAGEMENT ─── */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[40px] border border-slate-200/60 p-12 shadow-2xl shadow-slate-200/20 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-[#0A1629] flex items-center justify-center text-[#FF6B00] shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#0A1629] tracking-tighter">Production Credentials</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Status: Authenticated & Secure</p>
                  </div>
                </div>
                <button 
                  onClick={rotateKey}
                  disabled={rotating}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-500 hover:text-[#FF6B00] hover:bg-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-transparent hover:border-slate-200 transition-all active:scale-95 shadow-sm"
                >
                  {rotating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                  Rotate Secret
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-[#FF6B00]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                <div className="relative flex items-center gap-6 p-10 bg-[#0A1629] rounded-[32px] border border-white/5 font-mono text-sm text-blue-400 overflow-hidden shadow-2xl group/key">
                  <Terminal size={24} className="text-white/20 shrink-0" />
                  <span className="flex-1 truncate tracking-[0.3em] font-black">{tenant?.apiKey || '••••••••••••••••••••••••••••••'}</span>
                  <button 
                    onClick={() => copyToClipboard(tenant?.apiKey)}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white active:scale-90"
                  >
                    {copied ? <CheckCircle2 size={24} className="text-emerald-400" /> : <Copy size={24} />}
                  </button>
                </div>
              </div>

              <div className="mt-12 flex gap-5 items-start p-8 bg-orange-50/50 rounded-[32px] border border-orange-100/50">
                 <ShieldAlert className="text-[#FF6B00] shrink-0 mt-1" size={24} />
                 <div>
                    <p className="text-sm font-black text-[#0A1629] uppercase tracking-widest mb-1">Security Enforcement</p>
                    <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
                      This key provides full administrative access to your distribution node. Ensure it is stored in an encrypted environment and never exposed to client-side logic.
                    </p>
                 </div>
              </div>
            </div>

            {/* ─── QUICKSTART ORCHESTRATION ─── */}
            <div className="bg-[#0A1629] rounded-[40px] border border-white/5 p-12 shadow-[0_40px_80px_-20px_rgba(10,22,41,0.3)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                        <Code2 size={24} />
                     </div>
                     <h3 className="text-2xl font-black text-white tracking-tighter">SDK Integration</h3>
                  </div>
                  <div className="flex gap-3">
                     {['cURL', 'Node.js', 'Python'].map(lang => (
                       <span key={lang} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                         {lang}
                       </span>
                     ))}
                  </div>
               </div>
               <div className="bg-black/60 backdrop-blur-2xl rounded-[32px] p-10 font-mono text-[14px] text-slate-300 border border-white/5 leading-loose overflow-x-auto relative group/code shadow-inner">
                  <button 
                    onClick={() => copyToClipboard(`import travsify; travsify.apiKey = "${tenant?.apiKey || 'YOUR_KEY'}"; const results = await travsify.search({ from: 'LHR', to: 'LOS' })`)}
                    className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white opacity-0 group-hover/code:opacity-100"
                  >
                    <Copy size={18} />
                  </button>
                  <span className="text-slate-600 italic">// Orchestrate global inventory across all verticals</span><br/>
                  <span className="text-blue-500">import</span> {'{'} TravsifyClient {'}'} <span className="text-blue-500">from</span> <span className="text-emerald-400">'@travsify/core'</span>;<br/><br/>
                  <span className="text-emerald-500">const</span> client = <span className="text-blue-500">new</span> <span className="text-orange-400">TravsifyClient</span>("<span className="text-[#FF6B00]">{tenant?.apiKey || 'YOUR_SECRET_KEY'}</span>");<br/>
                  <span className="text-emerald-500">const</span> inventory = <span className="text-blue-500">await</span> client.<span className="text-orange-400">orchestrate</span>({'{'} origin: <span className="text-emerald-400">'LOS'</span>, destination: <span className="text-emerald-400">'LHR'</span> {'}'});
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
               <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Support Resources</h4>
               <div className="space-y-3">
                  <ResourceItem icon={<BookOpen size={18} />} title="Full API Documentation" desc="Every endpoint explained" path="/dashboard/docs" />
                  <ResourceItem icon={<Terminal size={18} />} title="How to Connect" desc="Step-by-step security guide" path="/dashboard/docs" />
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
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center"><Loader2 className="w-10 h-10 text-orange-600 animate-spin mx-auto" /></div>}>
      <DevelopersContent />
    </Suspense>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-3.5 rounded-[18px] text-[10px] font-black tracking-[0.2em] transition-all duration-300 relative overflow-hidden group ${
        active 
        ? 'bg-white text-[#0A1629] shadow-2xl' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`${active ? 'text-[#FF6B00]' : 'group-hover:text-white'} transition-colors`}>{icon}</span>
      {label}
      {active && (
        <motion.div layoutId="dev-tab-glow" className="absolute inset-0 bg-white/10 blur-xl -z-10" />
      )}
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

  const triggerTest = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/developer/webhooks/${id}/test`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) alert('Test webhook sent successfully!');
    } catch (err) {
      console.error('Failed to test webhook:', err);
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
              <div className="flex items-center gap-6">
                 <button 
                   onClick={() => triggerTest(wh.id)}
                   className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-orange-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100"
                 >
                   Test Trigger
                 </button>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signing Secret</p>
                    <p className="text-[11px] font-mono text-blue-500 font-bold">{wh.secret.substring(0, 10)}••••••••</p>
                 </div>
                 <button 
                   onClick={async () => {
                     if (confirm('Delete this webhook?')) {
                        const token = localStorage.getItem('token');
                        await fetch(`${API_URL}/developer/webhooks/${wh.id}`, { 
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        fetchWebhooks();
                     }
                   }}
                   className="p-3 text-slate-300 hover:text-rose-600 transition-all"
                 >
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
    <div className="space-y-2">
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-4xl font-black text-white tracking-tighter leading-none">{value}</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse shadow-[0_0_8px_#FF6B00]" />
        <p className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">{trend}</p>
      </div>
    </div>
  );
}
