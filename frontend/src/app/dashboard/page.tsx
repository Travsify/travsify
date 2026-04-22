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
  Globe
} from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function OverviewPage() {
  const { user, logout } = useAuth();
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
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Compiling Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            Welcome back, {user?.businessName?.split(' ')[0]}
          </h2>
          <p className="text-slate-500 font-medium">
            Your global travel operations are running smoothly today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
            Download Reports
          </button>
          <Link href="/dashboard/bookings" className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            Search Flights
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="NGN Wallet" 
          value={formatCurrency(ngnWallet.balance, 'NGN').split('.')[0]} 
          decimal={'.' + (formatCurrency(ngnWallet.balance, 'NGN').split('.')[1] || '00')}
          change="+12.5%" 
          trend="up"
          color="blue"
        />
        <StatCard 
          title="USD Wallet" 
          value={formatCurrency(usdWallet.balance, 'USD').split('.')[0]} 
          decimal={'.' + (formatCurrency(usdWallet.balance, 'USD').split('.')[1] || '00')}
          change="+5.2%" 
          trend="up"
          color="emerald"
        />
        <StatCard 
          title="Success Rate" 
          value="99.8" 
          decimal="%"
          change="Real-time" 
          trend="neutral"
          color="indigo"
        />
      </div>

      {/* Quick Actions / Verticals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <QuickAction icon={<Plane size={20} />} label="Flights" href="/dashboard/bookings" color="blue" />
        <QuickAction icon={<Hotel size={20} />} label="Hotels" href="/dashboard/hotels" color="indigo" />
        <QuickAction icon={<Car size={20} />} label="Transfers" href="/dashboard/transfers" color="emerald" />
        <QuickAction icon={<ScrollText size={20} />} label="eVisa" href="/dashboard/visa" color="orange" />
        <QuickAction icon={<ShieldCheck size={20} />} label="Insurance" href="/dashboard/insurance" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Recent Transactions
            </h3>
            <Link href="/dashboard/wallets" className="text-[13px] font-bold text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-6">
            {transactions.slice(0, 4).map((tx) => (
              <ActivityItem 
                key={tx.id}
                title={tx.metadata?.description || (tx.type === 'credit' ? 'Wallet Funding' : 'Booking Payment')} 
                subtitle={`Ref: ${tx.reference || tx.id.slice(0, 8)}`} 
                amount={`${tx.type === 'credit' ? '+' : '-'}${formatCurrency(tx.amount, tx.wallet?.currency)}`} 
                time={new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                type={tx.type}
                positive={tx.type === 'credit'}
              />
            ))}
            {transactions.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* API Metrics */}
        <div className="bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-blue-400">
              <Zap size={18} />
              API Performance
            </h3>
            <div className="space-y-8">
              <MetricBar label="Requests (24h)" value="12.8k" percent={75} />
              <MetricBar label="Latency (ms)" value="124ms" percent={30} />
              <MetricBar label="Error Rate" value="0.02%" percent={5} />
              
              <div className="pt-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Endpoint Health</p>
                  <div className="flex gap-1.5">
                    {[1,1,1,1,1,1,1,1,1,0,1,1,1].map((s, i) => (
                      <div key={i} className={`flex-1 h-8 rounded-sm ${s ? 'bg-emerald-500/40' : 'bg-orange-500/40'} animate-pulse`} style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, decimal, change, trend, color }: any) {
  const colors: any = {
    blue: 'bg-blue-600 shadow-blue-600/20',
    emerald: 'bg-emerald-600 shadow-emerald-600/20',
    indigo: 'bg-indigo-600 shadow-indigo-600/20',
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center text-white shadow-lg`}>
          {color === 'blue' ? '₦' : color === 'emerald' ? '$' : <TrendingUp size={20} />}
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : null}
          {change}
        </div>
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
          <span className="text-lg font-bold text-slate-400">{decimal}</span>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, href, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
    red: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
  };

  return (
    <Link href={href} className="group p-6 rounded-3xl bg-white border border-slate-100 hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-3">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${colors[color]} group-hover:text-white group-hover:scale-110 group-hover:shadow-lg`}>
        {icon}
      </div>
      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{label}</span>
    </Link>
  );
}

function MetricBar({ label, value, percent }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[13px] font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="text-blue-400">{value}</span>
      </div>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  );
}

function ActivityItem({ title, subtitle, amount, time, positive, type }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'} group-hover:scale-110 transition-transform`}>
          {positive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900">{title}</h4>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[14px] font-black tracking-tight ${positive ? 'text-emerald-600' : 'text-slate-900'}`}>
          {amount}
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}
