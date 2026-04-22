'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Plane, 
  Hotel,
  Globe,
  Code2,
  Search,
  Calendar,
  Bell,
  LogOut,
  ChevronRight,
  Loader2,
  TrendingUp,
  MapPin,
  Activity,
  Zap,
  MoreHorizontal,
  Database,
  ShieldCheck,
  Layers,
  Wallet,
  Copy,
  Terminal,
  Cpu,
  RefreshCw,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/utils/api';

export default function OverviewPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [tab, setTab] = useState('flights');
  const [apiKey] = useState('sk_live_' + Math.random().toString(36).substring(7).toUpperCase());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [walletRes, transRes] = await Promise.all([
        fetch(`${API_URL}/wallet`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/wallet/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (walletRes.ok) setWallets(await walletRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRealSearch = async () => {
    if (!searchQuery) return;
    setSearching(true);
    setResults([]);
    try {
      const endpoint = tab === 'flights' ? 'flights/search' : tab === 'hotels' ? 'hotels/search' : 'visa/requirements';
      const body = tab === 'flights' ? { origin: searchQuery, destination: 'LHR', departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], adults: 1 } : {};
      const query = tab === 'hotels' ? `?city=${searchQuery}` : tab === 'visas' ? `?nationality=NG&destination=${searchQuery}` : '';
      
      const res = await fetch(`${API_URL}/demo/${endpoint}${query}`, {
        method: tab === 'flights' ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        ...(tab === 'flights' ? { body: JSON.stringify(body) } : {})
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Developer Environment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Top Stats - Travelie Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatWidget 
          label="API Usage (24H)" 
          value="48.2k" 
          change="+14.2%" 
          icon={<Cpu size={24} className="text-blue-600" />} 
          subLabel="Request Latency: 142ms"
        />
        <StatWidget 
          label="Wallet Balance" 
          value={wallets[0]?.balance ? `${wallets[0].currency} ${wallets[0].balance.toLocaleString()}` : '0.00'} 
          change="+8.1%" 
          icon={<Wallet size={24} className="text-emerald-500" />} 
          subLabel="Settlement in 24h"
        />
        <StatWidget 
          label="Live Sessions" 
          value="1,284" 
          change="+32%" 
          icon={<Activity size={24} className="text-cyan-500" />} 
          subLabel="Active Agent Terminals"
        />
      </div>

      {/* Main Developer View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Performance Chart - Travelie Style */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">System Throughput</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Real-time NDC & LITE API traffic monitoring</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Live</button>
              <button className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">History</button>
            </div>
          </div>
          <div className="h-64 relative flex items-end justify-between px-2">
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 200">
              <path d="M0 150 Q 150 120, 300 160 T 600 140 T 800 160" fill="none" stroke="#2563eb" strokeWidth="4" />
              <path d="M0 150 Q 150 120, 300 160 T 600 140 T 800 160 V 200 H 0 Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => (
              <div key={h} className="flex flex-col items-center gap-4 relative z-10 group cursor-pointer">
                <div className="w-1.5 bg-blue-100 rounded-full transition-all group-hover:bg-blue-600" style={{ height: `${Math.random() * 80 + 20}px` }} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{h}PM</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Credentials Card */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
            <Terminal size={120} />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-tight">API Infrastructure</h3>
          <p className="text-slate-400 text-sm font-medium mb-8">Direct access to your production keys.</p>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Live Secret Key</p>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-all cursor-pointer">
                <code className="text-xs font-bold text-slate-300 font-mono tracking-wider">{apiKey}</code>
                <Copy size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/developers" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                <RefreshCw size={18} className="text-blue-400 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Rotate</span>
              </Link>
              <Link href="/dashboard/docs" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                <Code2 size={18} className="text-cyan-400 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">SDKs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Inventory Terminal - Fully Functional */}
      <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-50">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Inventory Terminal</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">Real-time search across SML (Flights), LiteAPI (Hotels), and Sherpa (Visas).</p>
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-[24px] border border-slate-100 shadow-inner">
            {[
              { id: 'flights', icon: <Plane size={16} /> },
              { id: 'hotels', icon: <Hotel size={16} /> },
              { id: 'visas', icon: <Globe size={16} /> }
            ].map((t) => (
              <button 
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  tab === t.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.icon}
                {t.id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={tab === 'flights' ? 'Origin Airport Code (e.g. LOS)' : 'City or Hotel Name'} 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-200 rounded-[28px] text-base font-bold transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="date" 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-200 rounded-[28px] text-base font-bold transition-all outline-none"
            />
          </div>
          <button 
            onClick={handleRealSearch}
            disabled={searching}
            className="bg-blue-600 text-white px-12 py-5 rounded-[28px] font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {searching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {searching ? 'Querying API...' : 'Fetch Live Rates'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {results.map((item: any, i: number) => (
              <div key={item.id || i} className="group bg-white border border-slate-100 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img 
                    src={item.image || `https://images.unsplash.com/photo-${1506744038136 + i}-46273834b3fb?auto=format&fit=crop&q=80&w=600&h=400`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt="Inventory"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
                    {item.provider || 'REAL-TIME API'}
                  </div>
                  <div className="absolute bottom-6 right-6 px-5 py-3 bg-blue-600 text-white rounded-3xl text-xl font-black shadow-2xl shadow-blue-600/40">
                    {item.currency || '$'}{item.price}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Verified Inventory</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> 4ms Response</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-6 truncate leading-tight">{item.name || item.airline || item.destination || 'Global Inventory Offer'}</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20">
                      Book Now
                    </button>
                    <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Developer Logs & Real-time Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Real-time API Logs - Travelie "Messages" Style */}
        <div className="bg-white rounded-[48px] p-10 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">API Request Logs</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Live HTTP stream monitoring</p>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="space-y-8">
            <ApiLog method="POST" endpoint="/v1/flights/search" status="200 OK" time="Just now" color="blue" />
            <ApiLog method="GET" endpoint="/v1/wallet/balance" status="200 OK" time="12s ago" color="emerald" />
            <ApiLog method="POST" endpoint="/v1/visa/apply" status="403 AUTH" time="2m ago" color="rose" />
            <ApiLog method="GET" endpoint="/v1/hotels/rates" status="200 OK" time="5m ago" color="blue" />
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
            View Console Output
          </button>
        </div>

        {/* Recent Ledger Operations */}
        <div className="lg:col-span-2 bg-white rounded-[48px] p-10 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Ledger</h3>
            <Link href="/dashboard/wallets" className="text-xs font-black text-blue-600 bg-blue-50 px-6 py-2 rounded-xl uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Export Report</Link>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-6 bg-slate-50/50 border border-transparent hover:border-blue-100 hover:bg-white rounded-[32px] group transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    {tx.type === 'credit' ? <Database size={24} /> : <Plane size={24} />}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{tx.metadata?.description || (tx.type === 'credit' ? 'Wallet Top-up' : 'Inventory Purchase')}</p>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      {new Date(tx.createdAt).toLocaleString()} • <span className="text-blue-600 font-bold">TX_{tx.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black tracking-tight ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.wallet?.currency}{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settled via {tx.wallet?.currency}</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-20 text-center">
                <Loader2 size={32} className="mx-auto text-slate-200 animate-spin mb-4" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Awaiting Transaction Events...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ label, value, change, icon, subLabel }: any) {
  return (
    <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-50 flex items-center gap-8 group hover:shadow-xl transition-all duration-500">
      <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-4 mb-1">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{change}</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">{subLabel}</p>
      </div>
    </div>
  );
}

function ApiLog({ method, endpoint, status, time, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-500 text-blue-500',
    emerald: 'bg-emerald-500 text-emerald-500',
    rose: 'bg-rose-500 text-rose-500'
  };
  
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${colorMap[color].split(' ')[0]}`} />
        <div>
          <p className="text-sm font-black text-slate-900 leading-tight">
            <span className={`text-[10px] uppercase mr-2 ${colorMap[color].split(' ')[1]}`}>{method}</span>
            {endpoint}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{time} • {status}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
    </div>
  );
}
