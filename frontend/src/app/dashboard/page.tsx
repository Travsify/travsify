'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plane, 
  Hotel, 
  Car, 
  ShieldCheck, 
  ScrollText, 
  TrendingUp,
  Activity,
  Zap,
  MoreHorizontal,
  LogOut,
  Loader2,
  Globe,
  Plus,
  ArrowRight,
  ChevronRight,
  Database,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/utils/api';

export default function OverviewPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const ngnWallet = wallets.find(w => w.currency === 'NGN') || { balance: 0 };
  const usdWallet = wallets.find(w => w.currency === 'USD') || { balance: 0 };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-[#0a0f18] rounded-[32px] border border-white/5">
        <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Initializing Slate...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-slate-900 border border-white/5 p-10 rounded-[32px] shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Terminal Live</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">
            Welcome back, <span className="text-orange-500">{user?.businessName?.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-400 font-bold text-sm max-w-lg">
            Institutional management for {user?.businessName}. Access global inventory across 5 verticals.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-8 lg:mt-0">
          <Link href="/dashboard/bookings" className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[13px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20">
            <Plus size={18} />
            Quick Booking
          </Link>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SlateAssetCard 
          label="Naira Liquidity" 
          value={formatCurrency(ngnWallet.balance, 'NGN')} 
          symbol="₦"
          status="Available"
          trend="+1.2%"
        />
        <SlateAssetCard 
          label="Dollar Liquidity" 
          value={formatCurrency(usdWallet.balance, 'USD')} 
          symbol="$"
          status="Available"
          trend="+0.5%"
        />
        <div className="bg-slate-900 rounded-[32px] border border-white/5 p-8 flex flex-col justify-between">
           <div className="flex items-center justify-between mb-8">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Infrastructure</p>
             <Database size={16} className="text-blue-500" />
           </div>
           <div className="space-y-4">
             <MetricRow label="Sync Status" value="Online" active />
             <MetricRow label="API Latency" value="124ms" />
             <MetricRow label="Cache Hit" value="98.2%" />
           </div>
           <div className="mt-8 pt-6 border-t border-white/5">
             <Link href="/dashboard/developers" className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 transition-colors">
               Terminal Settings <ArrowRight size={12} />
             </Link>
           </div>
        </div>
      </div>

      {/* Service Vertical Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <VerticalButton icon={<Plane size={20} />} label="Aviation" path="/dashboard/bookings" active />
        <VerticalButton icon={<Hotel size={20} />} label="Hospitality" path="/dashboard/hotels" />
        <VerticalButton icon={<Car size={20} />} label="Logistics" path="/dashboard/transfers" />
        <VerticalButton icon={<ScrollText size={20} />} label="eVisa" path="/dashboard/visa" />
        <VerticalButton icon={<ShieldCheck size={20} />} label="Insurance" path="/dashboard/insurance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ledger - High Density Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Transaction Ledger</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time settlement history</p>
            </div>
            <Link href="/dashboard/wallets" className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black transition-all">
              Full Statement
            </Link>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                   <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                   <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settlement</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {transactions.slice(0, 6).map((tx) => (
                   <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-8 py-5 text-[13px] font-bold text-slate-900">#{tx.reference?.slice(0, 8) || tx.id.slice(0, 8)}</td>
                     <td className="px-8 py-5">
                       <p className="text-[13px] font-bold text-slate-600 truncate max-w-md">{tx.metadata?.description || (tx.type === 'credit' ? 'Account Funding' : 'Inventory Purchase')}</p>
                       <p className="text-[10px] text-slate-400 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                     </td>
                     <td className={`px-8 py-5 text-[14px] font-black text-right ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                       {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.wallet?.currency)}
                     </td>
                   </tr>
                 ))}
                 {transactions.length === 0 && (
                   <tr>
                     <td colSpan={3} className="px-8 py-20 text-center">
                        <Activity size={32} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No active transactions found</p>
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>

        {/* Global Performance Slate */}
        <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
           <div>
             <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8">
               <BarChart3 size={24} className="text-orange-500" />
             </div>
             <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Yield Optimization</h3>
             <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
               Automated markup engine is currently active. Average gross yield across vertical inventory is <span className="text-orange-500 font-black">6.4%</span>.
             </p>
             
             <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Connected Channels</h4>
                   <div className="flex -space-x-3">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                           CH
                        </div>
                      ))}
                   </div>
                </div>
                <Link href="/dashboard/settings" className="w-full py-4.5 bg-white text-slate-900 rounded-2xl font-black text-[13px] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all">
                   Manage Margins
                   <ChevronRight size={18} />
                </Link>
             </div>
           </div>
           
           <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gateway v4.2</span>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Operational
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SlateAssetCard({ label, value, symbol, status, trend }: any) {
  return (
    <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm hover:border-orange-500/30 transition-all group">
      <div className="flex items-center justify-between mb-10">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-lg group-hover:scale-110 transition-transform">
          {symbol}
        </div>
        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          {status}
        </div>
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value.split('.')[0]}</h4>
        <span className="text-xl font-black text-slate-300">.{value.split('.')[1]}</span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-emerald-600">
        <ArrowUpRight size={14} />
        {trend} <span className="text-slate-400 font-bold ml-1">vs yesterday</span>
      </div>
    </div>
  );
}

function MetricRow({ label, value, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
      <span className="text-[13px] font-bold text-slate-400">{label}</span>
      <span className={`text-[13px] font-black ${active ? 'text-emerald-500' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function VerticalButton({ icon, label, path, active }: any) {
  return (
    <Link href={path} className={`flex flex-col items-center justify-center p-8 rounded-[32px] border transition-all duration-300 gap-4 group ${
      active 
        ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/20' 
        : 'bg-white border-slate-200 text-slate-900 hover:border-slate-900 hover:bg-slate-50'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        active ? 'bg-white/10 text-white' : 'bg-slate-900 text-white group-hover:bg-orange-600'
      }`}>
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}
}
