'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Plane, 
  Wallet,
  Key,
  Code2,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Loader2,
  TrendingUp,
  Activity,
  Zap,
  MoreHorizontal,
  Database,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  ArrowDownCircle,
  MapPin,
  Calendar,
  Globe,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/utils/api';

export default function OverviewPage() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

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
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Skylink Ecosystem...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-black text-slate-900 tracking-tight">Welcome back, {user?.businessName?.split(' ')[0] || 'Adaeze'}</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Here's what's happening with your bookings today.</p>
        </div>
        <button 
          onClick={() => setShowTerminal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <Plane size={18} />
          New booking
        </button>
      </div>

      {/* Stats Grid - Exactly as in Skylink Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="NGN BALANCE" 
          value={formatCurrency(ngnWallet.balance, 'NGN')} 
          change="+14.2%" 
          subLabel="Locked ₦120,000" 
        />
        <StatCard 
          label="USD BALANCE" 
          value={formatCurrency(usdWallet.balance, 'USD')} 
          change="+8.1%" 
          subLabel="Locked $320.00" 
        />
        <StatCard 
          label="API CALLS (7D)" 
          value="184,392" 
          change="+12.4%" 
          subLabel="vs prior week" 
        />
        <StatCard 
          label="TICKET SUCCESS RATE" 
          value="98.4%" 
          change="+0.6%" 
          subLabel="rolling 30 days" 
        />
      </div>

      {/* Middle Grid: API Usage + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Usage Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">API usage</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Requests in the last 7 days</p>
            </div>
            <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-slate-500 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-4 pb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-4">
                <div className="w-12 bg-slate-50 rounded-t-lg transition-all hover:bg-blue-600 group cursor-pointer relative" style={{ height: `${Math.random() * 100 + 40}px` }}>
                  <div className="absolute inset-x-0 -top-8 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{Math.floor(Math.random() * 5000)}</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions List - Exactly as in Image */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Quick actions</h3>
          <div className="space-y-3">
            <ActionItem label="Fund wallet" path="/dashboard/wallets" />
            <ActionItem label="Generate API key" path="/dashboard/developers" />
            <ActionItem label="Read documentation" path="/dashboard/docs" />
            <ActionItem label="Complete KYC" path="/dashboard/kyc" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table - Exactly as in Image */}
      <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent bookings</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Last 5 across all wallets</p>
          </div>
          <Link href="/dashboard/bookings" className="text-sm font-black text-blue-600 flex items-center gap-1 hover:underline">
            View all <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto px-4 pb-8">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              <BookingRow id="BK-9241" route="LOS → LHR" name="Adaeze Okafor" amount="₦1,240,000" status="Ticketed" />
              <BookingRow id="BK-9240" route="ABV → DXB" name="Tunde Bakare" amount="₦980,500" status="Ticketed" />
              <BookingRow id="BK-9239" route="JFK → LOS" name="Sarah Mensah" amount="$1,840.00" status="Pending" />
              <BookingRow id="BK-9238" route="LOS → ACC" name="Kwame Asante" amount="₦215,000" status="Ticketed" />
              <BookingRow id="BK-9237" route="CDG → LOS" name="Marie Dubois" amount="$1,120.00" status="Failed" />
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── FULL SERVICE SUITE MODAL (GLOBAL TERMINAL) ─── */}
      {showTerminal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Inventory Terminal</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Query live NDC, LiteAPI, Mozio, Sherpa, and SafetyWing inventory.</p>
              </div>
              <button 
                onClick={() => setShowTerminal(false)}
                className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <VerticalService icon={<Plane />} label="Flights" sub="NDC/Aviation" provider="SML.agency" color="blue" />
                <VerticalService icon={<Hotel />} label="Hotels" sub="Accommodation" provider="LiteAPI" color="emerald" />
                <VerticalService icon={<MapPin />} label="Transfers" sub="Pickup/Cars" provider="Mozio" color="orange" />
                <VerticalService icon={<Globe />} label="e-Visas" sub="Border Entry" provider="Sherpa" color="cyan" />
                <VerticalService icon={<ShieldCheck />} label="Insurance" sub="Travel Safety" provider="SafetyWing" color="indigo" />
                <VerticalService icon={<Database />} label="Settlement" sub="B2B Ledger" provider="Fincra/Stripe" color="slate" />
              </div>
            </div>

            <div className="p-10 bg-slate-50 flex items-center justify-between">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select a vertical to initialize production session</p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500">Cancel</button>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20">Launch Session</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, change, subLabel }: any) {
  return (
    <div className="bg-white border border-slate-100 p-8 rounded-[24px] shadow-sm group hover:shadow-xl transition-all duration-500">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[22px] font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{value}</span>
        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
          <ArrowUpRight size={12} />
          {change}
        </span>
      </div>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{subLabel}</p>
    </div>
  );
}

function ActionItem({ label, path }: { label: string; path: string }) {
  return (
    <Link href={path} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all group">
      <span className="text-[14px] font-bold text-slate-600 group-hover:text-slate-900">{label}</span>
      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function BookingRow({ id, route, name, amount, status }: any) {
  const statusColor = status === 'Ticketed' ? 'emerald' : status === 'Pending' ? 'orange' : 'rose';
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
      <td className="py-6 text-[13px] font-black text-slate-400 font-mono">{id}</td>
      <td className="py-6 text-[14px] font-black text-slate-900 tracking-tight">{route}</td>
      <td className="py-6 text-[14px] font-medium text-slate-500">{name}</td>
      <td className="py-6 text-[14px] font-black text-slate-900 text-right">{amount}</td>
      <td className="py-6 text-right">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${statusColor}-50 text-${statusColor}-600`}>
          <div className={`w-1 h-1 rounded-full bg-${statusColor}-500`} />
          {status}
        </span>
      </td>
    </tr>
  );
}

function VerticalService({ icon, label, sub, provider, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  return (
    <div className="p-8 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorMap[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1">{label}</h4>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{sub}</p>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{provider} Live</span>
      </div>
    </div>
  );
}
