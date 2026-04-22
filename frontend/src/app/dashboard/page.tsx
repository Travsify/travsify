'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowUpRight, 
  Plane, 
  Wallet,
  Key,
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
  Layers
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
      setResults(data);
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
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Travelie...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatWidget 
          label="Total Booking" 
          value="1,200" 
          change="+2.98%" 
          icon={<Plane size={20} className="text-blue-600" />} 
        />
        <StatWidget 
          label="Total New Customers" 
          value="2,845" 
          change="-1.45%" 
          changeColor="text-rose-500" 
          icon={<Globe size={20} className="text-cyan-500" />} 
        />
        <StatWidget 
          label="Total Earnings" 
          value="$12,890" 
          change="+3.75%" 
          icon={<Wallet size={20} className="text-emerald-500" />} 
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Overview</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Growth tracking via SML Terminal</p>
            </div>
            <select className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest outline-none">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-64 relative flex items-end justify-between px-2">
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 200">
              <path d="M0 150 Q 200 50, 400 150 T 800 100" fill="none" stroke="#2563eb" strokeWidth="4" />
            </svg>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-4 relative z-10 group cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-all shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Destinations</h3>
            <select className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest outline-none">
              <option>This Month</option>
            </select>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-[16px] border-blue-600 border-t-slate-100 border-l-cyan-400 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 leading-none">84%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Terminal */}
      <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inventory Terminal</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">Direct API queries to SML.agency, LiteAPI, and Sherpa.</p>
          </div>
          <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
            {['flights', 'hotels', 'visas'].map((t) => (
              <button 
                key={t}
                onClick={() => setTab(t)}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  tab === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={tab === 'flights' ? 'Origin Code (e.g. LOS)' : 'City or Destination'} 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-200 rounded-3xl text-base font-bold transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="date" 
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-200 rounded-3xl text-base font-bold transition-all outline-none"
            />
          </div>
          <button 
            onClick={handleRealSearch}
            disabled={searching}
            className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            {searching ? 'Querying...' : 'Fetch Live Rates'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.map((item: any) => (
              <div key={item.id} className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-2xl transition-all">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img 
                    src={item.image || `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400&h=300`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt="Destination"
                  />
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                    {item.provider}
                  </div>
                  <div className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-2xl text-lg font-black shadow-lg">
                    ${item.price}
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-slate-900 mb-4 truncate">{item.name || item.airline || 'Standard Offer'}</h4>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                    Confirm Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">System Logs</h3>
            <MoreHorizontal size={20} className="text-slate-300" />
          </div>
          <div className="space-y-6">
            <SystemLog icon={<Zap size={16} />} label="API Handshake" time="Just now" status="Successful" />
            <SystemLog icon={<ShieldCheck size={16} />} label="Auth Sync" time="2m ago" status="Stable" />
            <SystemLog icon={<Database size={16} />} label="NDC Ledger" time="15m ago" status="Synced" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Operations</h3>
            <button className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl group hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                    {tx.type === 'credit' ? <Wallet size={24} /> : <Plane size={24} />}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{tx.metadata?.description || 'Wallet Operation'}</p>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()} • ID: {tx.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">{tx.type === 'credit' ? '+' : '-'}{tx.wallet?.currency}{tx.amount}</p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ label, value, change, changeColor = 'text-emerald-500', icon }: any) {
  return (
    <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-50 flex items-center gap-8 group hover:shadow-xl transition-all">
      <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center shadow-inner group-hover:bg-blue-50 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
          <span className={`text-[11px] font-black ${changeColor} bg-slate-50 px-2 py-0.5 rounded-lg`}>{change}</span>
        </div>
      </div>
    </div>
  );
}

function SystemLog({ icon, label, time, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">{icon}</div>
        <div>
          <p className="text-sm font-black text-slate-900 leading-tight">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
        </div>
      </div>
      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{status}</span>
    </div>
  );
}
