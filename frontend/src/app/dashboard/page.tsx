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
  MoreHorizontal
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
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Skylink...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[32px] font-black text-slate-900 tracking-tight">Welcome back, {user?.businessName?.split(' ')[0] || 'Adaeze'}</h2>
          <p className="text-slate-500 font-medium mt-1">Here's what's happening with your bookings today.</p>
        </div>
        <Link href="/dashboard/bookings" className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
          <Plane size={18} />
          New booking
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardV2 
          label="NGN BALANCE" 
          value={formatCurrency(ngnWallet.balance, 'NGN')} 
          change="+14.2%" 
          subLabel="Locked ₦120,000" 
        />
        <StatCardV2 
          label="USD BALANCE" 
          value={formatCurrency(usdWallet.balance, 'USD')} 
          change="+8.1%" 
          subLabel="Locked $320.00" 
        />
        <StatCardV2 
          label="API CALLS (7D)" 
          value="184,392" 
          change="+12.4%" 
          subLabel="vs prior week" 
        />
        <StatCardV2 
          label="TICKET SUCCESS RATE" 
          value="98.4%" 
          change="+0.6%" 
          subLabel="rolling 30 days" 
        />
      </div>

      {/* Main Stats & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Usage Chart Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">API usage</h3>
              <p className="text-sm text-slate-500 font-medium">Requests in the last 7 days</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none cursor-pointer">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-4 pb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-4 group cursor-pointer">
                <div 
                  className="w-12 bg-slate-50 rounded-t-lg transition-all group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-600/20" 
                  style={{ height: `${Math.random() * 100 + 60}px` }} 
                />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight ml-2">Quick actions</h3>
          <div className="space-y-3">
            <QuickAction icon={<Wallet size={18} />} label="Fund wallet" href="/dashboard/wallets" />
            <QuickAction icon={<Key size={18} />} label="Generate API key" href="/dashboard/developers" />
            <QuickAction icon={<Code2 size={18} />} label="Read documentation" href="/dashboard/docs" />
            <QuickAction icon={<Globe size={18} />} label="Complete KYC" href="/dashboard/kyc" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent bookings</h3>
            <p className="text-sm text-slate-500 font-medium">Last 5 across all wallets</p>
          </div>
          <Link href="/dashboard/bookings" className="text-sm font-black text-blue-600 hover:underline flex items-center gap-2 group">
            View all <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
    </div>
  );
}

function StatCardV2({ label, value, change, subLabel }: { label: string; value: string; change: string; subLabel: string }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[24px] shadow-sm hover:border-blue-500/20 transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{value}</span>
        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
          <ArrowUpRight size={12} />
          {change}
        </span>
      </div>
      <p className="text-[12px] text-slate-500 font-medium">{subLabel}</p>
    </div>
  );
}

function QuickAction({ icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          {icon}
        </div>
        <span className="text-[15px] font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
      </div>
      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}

function BookingRow({ id, route, name, amount, status }: { id: string; route: string; name: string; amount: string; status: string }) {
  const isTicketed = status === 'Ticketed';
  const isPending = status === 'Pending';
  
  const statusStyles = isTicketed 
    ? 'text-emerald-600 bg-emerald-50' 
    : isPending 
    ? 'text-orange-600 bg-orange-50' 
    : 'text-rose-600 bg-rose-50';

  const dotColor = isTicketed ? 'bg-emerald-500' : isPending ? 'bg-orange-500' : 'bg-rose-500';

  return (
    <tr className="hover:bg-slate-50/50 transition-all group">
      <td className="px-8 py-6 text-sm font-bold text-slate-400 font-mono tracking-tight">{id}</td>
      <td className="px-8 py-6 text-[15px] font-black text-slate-900 tracking-tight">{route}</td>
      <td className="px-8 py-6 text-[15px] font-medium text-slate-600">{name}</td>
      <td className="px-8 py-6 text-[15px] font-black text-slate-900 text-right tabular-nums">{amount}</td>
      <td className="px-8 py-6 text-right">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {status}
        </span>
      </td>
    </tr>
  );
}
