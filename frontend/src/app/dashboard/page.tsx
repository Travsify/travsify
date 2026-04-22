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
  ArrowRight
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
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-up">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-10 pb-20">
      {/* Background Decor */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
      <div className="absolute top-[40%] -left-40 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
            <Zap size={12} className="fill-blue-600" />
            System Operational
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2 leading-none">
            Hello, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.businessName?.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 font-bold">
            Here's what's happening with your travel empire today.
          </p>
        </div>
        <div className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <button className="flex-1 lg:flex-none px-8 py-4 bg-white border border-slate-200 rounded-[24px] font-black text-[13px] text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
            Settings
          </button>
          <Link href="/dashboard/bookings" className="flex-1 lg:flex-none px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[24px] font-black text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group">
            <Plus size={18} />
            New Booking
            <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Wallet / Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PremiumStatCard 
          title="Naira Wallet" 
          value={formatCurrency(ngnWallet.balance, 'NGN').split('.')[0]} 
          decimal={'.' + (formatCurrency(ngnWallet.balance, 'NGN').split('.')[1] || '00')}
          currency="NGN"
          color="blue"
          icon="₦"
        />
        <PremiumStatCard 
          title="Dollar Wallet" 
          value={formatCurrency(usdWallet.balance, 'USD').split('.')[0]} 
          decimal={'.' + (formatCurrency(usdWallet.balance, 'USD').split('.')[1] || '00')}
          currency="USD"
          color="indigo"
          icon="$"
        />
        <div className="bg-[#0f172a] rounded-[40px] p-8 border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/20 flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Platform Performance</p>
              <div className="space-y-6">
                <MetricLine label="API Uptime" value="100%" color="blue" />
                <MetricLine label="Success Rate" value="99.9%" color="indigo" />
                <MetricLine label="Avg. Response" value="124ms" color="emerald" />
              </div>
           </div>
           <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Global Status</span>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                STABLE
              </div>
           </div>
        </div>
      </div>

      {/* Vertical Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <ModernQuickAction icon={<Plane size={24} />} label="Flights" href="/dashboard/bookings" active />
        <ModernQuickAction icon={<Hotel size={24} />} label="Hotels" href="/dashboard/hotels" />
        <ModernQuickAction icon={<Car size={24} />} label="Transfers" href="/dashboard/transfers" />
        <ModernQuickAction icon={<ScrollText size={24} />} label="eVisa" href="/dashboard/visa" />
        <ModernQuickAction icon={<ShieldCheck size={24} />} label="Insurance" href="/dashboard/insurance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200/60 p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Recent Activity</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction History</p>
            </div>
            <Link href="/dashboard/wallets" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <ActivityRow 
                key={tx.id}
                title={tx.metadata?.description || (tx.type === 'credit' ? 'Wallet Funding' : 'Booking Payment')} 
                refNo={tx.reference || tx.id.slice(0, 8)} 
                amount={formatCurrency(tx.amount, tx.wallet?.currency)} 
                time={new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} 
                type={tx.type}
              />
            ))}
            {transactions.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Activity size={32} />
                </div>
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No recent records</p>
              </div>
            )}
          </div>
        </div>

        {/* Developer Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-600/20 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
              <Globe size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">Ready to integrate?</h3>
            <p className="text-blue-100/70 text-sm font-medium leading-relaxed mb-8">
              Use our robust API to scale your travel offerings. Access the full documentation and sandbox keys.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/developers" className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                API Settings
              </Link>
              <a href="#" className="w-full py-4 bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                Read Docs
              </a>
            </div>
          </div>
          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-slate-200" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-blue-100">Joined by 500+ Devs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumStatCard({ title, value, decimal, color, icon }: any) {
  return (
    <div className="group bg-white rounded-[40px] p-10 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-40 h-40 ${color === 'blue' ? 'bg-blue-600/5' : 'bg-indigo-600/5'} rounded-full translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center text-xl font-black shadow-xl transition-transform group-hover:scale-110 duration-500 ${
            color === 'blue' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-indigo-600 text-white shadow-indigo-600/30'
          }`}>
            {icon}
          </div>
          <div className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-tight group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            Live Balance
          </div>
        </div>
        
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
          <span className="text-xl font-black text-slate-300">{decimal}</span>
        </div>
      </div>
    </div>
  );
}

function MetricLine({ label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-bold text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
          <div className={`h-full rounded-full ${color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'}`} style={{ width: '85%' }} />
        </div>
        <span className="text-[13px] font-black text-white">{value}</span>
      </div>
    </div>
  );
}

function ModernQuickAction({ icon, label, href, active }: any) {
  return (
    <Link href={href} className={`group p-8 rounded-[32px] border flex flex-col items-center justify-center gap-4 transition-all duration-500 ${
      active 
        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' 
        : 'bg-white border-slate-200/60 text-slate-900 hover:border-blue-600/30 hover:shadow-xl hover:-translate-y-1'
    }`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        active ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
      }`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}

function ActivityRow({ title, refNo, amount, time, type }: any) {
  const isCredit = type === 'credit';
  return (
    <div className="flex items-center justify-between p-5 rounded-[24px] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 ${
          isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
        }`}>
          {isCredit ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
        </div>
        <div>
          <h4 className="text-[15px] font-black text-slate-900 mb-0.5">{title}</h4>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">REF: {refNo}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[16px] font-black tracking-tight ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
          {isCredit ? '+' : '-'}{amount}
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{time}</p>
      </div>
    </div>
  );
}
