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
  BarChart3,
  Terminal,
  Cpu,
  Layers,
  Network,
  Share2,
  Lock,
  Code2,
  Key,
  Eye,
  ArrowDownCircle,
  ArrowUpCircle
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
      <div className="h-[80vh] flex flex-col items-center justify-center bg-[#020617] rounded-[32px] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05),transparent)] pointer-events-none" />
        <div className="w-8 h-8 border-t-2 border-orange-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Syncing Distributed Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ─── SYSTEM STATUS BAR ─── */}
      <div className="flex items-center justify-between px-8 py-3 bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-8">
          <StatusIndicator label="Network" status="Optimal" color="text-emerald-500" />
          <StatusIndicator label="Gateway" status="v4.2.0-Live" color="text-orange-500" />
          <StatusIndicator label="Security" status="Shield Active" color="text-blue-400" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Terminal Active</span>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date().toLocaleTimeString()} UTC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ─── LEFT: MAIN IDENTITY & ASSETS ─── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Identity Header */}
          <div className="relative group overflow-hidden bg-gradient-to-br from-slate-900 to-[#020617] border border-white/5 p-10 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl transition-all hover:border-orange-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
              <Code2 size={180} />
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase tracking-[0.2em] border border-orange-500/20 rounded-lg">Enterprise Console</span>
                <span className="text-[10px] font-bold text-slate-600">ID: SLATE-{user?.id?.slice(0, 8).toUpperCase()}</span>
              </div>
              <h2 className="text-[14px] font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Executive Node: <span className="text-orange-500">{user?.businessName}</span>
              </h2>
              <p className="text-[12px] text-slate-400 font-medium max-w-md leading-relaxed">
                Automated travel distribution hub. Real-time access to global NDC inventory, hotel aggregators, and financial rails.
              </p>
            </div>
            <div className="flex gap-4 relative z-10">
              <Link href="/dashboard/developers" className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-[12px] transition-all flex items-center gap-2">
                <Terminal size={14} className="text-orange-500" />
                Metrics
              </Link>
              <Link href="/dashboard/bookings" className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[12px] transition-all flex items-center gap-2 shadow-xl shadow-orange-600/30 active:scale-95">
                <Plus size={14} />
                Deploy New Inventory
              </Link>
            </div>
          </div>

          {/* Balance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernBalanceCard 
              label="Naira Settlement Wallet" 
              amount={ngnWallet.balance} 
              currency="NGN" 
              trend="+3.1%" 
              color="emerald" 
              icon={<Database size={20} />}
              path="/dashboard/wallets"
            />
            <ModernBalanceCard 
              label="Dollar Settlement Wallet" 
              amount={usdWallet.balance} 
              currency="USD" 
              trend="+1.2%" 
              color="blue" 
              icon={<Globe size={20} />}
              path="/dashboard/wallets"
            />
          </div>

          {/* Quick Access Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <ServiceChip icon={<Plane size={14} />} label="Flights" path="/dashboard/bookings" active />
            <ServiceChip icon={<Hotel size={14} />} label="Hotels" path="/dashboard/hotels" />
            <ServiceChip icon={<Car size={14} />} label="Transfers" path="/dashboard/transfers" />
            <ServiceChip icon={<ScrollText size={14} />} label="e-Visas" path="/dashboard/visa" />
            <ServiceChip icon={<ShieldCheck size={14} />} label="Insurance" path="/dashboard/insurance" />
          </div>

          {/* Activity Ledger */}
          <div className="bg-slate-900 border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-orange-500" />
                <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em]">Live Transaction Stream</h3>
              </div>
              <Link href="/dashboard/wallets" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
                View Full Ledger
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.01] border-b border-white/5">
                    <th className="px-10 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Signature</th>
                    <th className="px-10 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Resource Distribution</th>
                    <th className="px-10 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="px-10 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] font-black text-slate-200 group-hover:text-orange-500 transition-colors">#{tx.reference?.slice(0, 10).toUpperCase() || tx.id.slice(0, 10).toUpperCase()}</span>
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Verified • {new Date(tx.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-orange-500/30 transition-colors shadow-lg">
                            {tx.type === 'credit' ? <ArrowDownCircle size={16} className="text-emerald-500" /> : <Plane size={16} className="text-orange-500" />}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-slate-300 group-hover:text-white transition-colors">{tx.metadata?.description || (tx.type === 'credit' ? 'Wallet Funding' : 'Inventory Order')}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tx.wallet?.currency} Channel</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-10 py-6 text-[14px] font-black text-right ${tx.type === 'credit' ? 'text-emerald-500' : 'text-white'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.wallet?.currency)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-10 py-24 text-center">
                        <Loader2 size={32} className="mx-auto text-slate-800 animate-spin mb-6" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Synchronizing Activity Stream...</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: SYSTEM DIRECTIVES & METRICS ─── */}
        <div className="space-y-6">
          {/* Performance Node */}
          <Link href="/dashboard/developers" className="block">
            <div className="bg-[#0a0f1e] border border-blue-500/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 size={24} className="text-blue-400" />
                </div>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">Operational</div>
              </div>
              <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em] mb-8 relative z-10">Interface Analysis</h3>
              <div className="space-y-6 relative z-10">
                <HighDensityMetric label="Success Rate" value="99.98%" sub="Last 24h" trend="+0.02%" positive />
                <HighDensityMetric label="Request Volume" value="48.2k" sub="Scaled" trend="+14%" positive />
                <HighDensityMetric label="Avg Latency" value="142ms" sub="Global" trend="-8ms" positive />
              </div>
              <div className="mt-10 w-full py-4 bg-blue-600/10 border border-blue-600/30 text-blue-400 rounded-2xl font-black text-[11px] flex items-center justify-center gap-3 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase tracking-widest">
                API Reference <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Quick Directive Actions */}
          <div className="bg-slate-900 border border-white/5 rounded-[32px] p-8">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Lock size={12} />
              Security Directives
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DirectiveButton icon={<Key size={18} />} label="API Keys" path="/dashboard/developers" />
              <DirectiveButton icon={<Share2 size={18} />} label="Webhooks" path="/dashboard/settings" />
              <DirectiveButton icon={<Cpu size={18} />} label="Marginalia" path="/dashboard/settings" />
              <DirectiveButton icon={<ShieldCheck size={18} />} label="KYC Status" path="/dashboard/kyc" />
            </div>
          </div>

          {/* Global Status Widget */}
          <Link href="/dashboard/settings" className="block group">
            <div className="bg-orange-600 rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden active:scale-[0.98] transition-transform">
              <div className="absolute -bottom-16 -right-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000 group-hover:scale-110">
                <Globe size={240} />
              </div>
              <h3 className="text-[14px] font-black mb-3 uppercase tracking-tighter relative z-10">Engineering Support</h3>
              <p className="text-[11px] font-bold text-orange-100 opacity-90 leading-relaxed mb-8 relative z-10">
                Live terminal is active. Custom webhooks and enterprise integrations available.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest relative z-10">
                Configure Systems <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusIndicator({ label, status, color }: any) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${color}`} />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}:</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{status}</span>
    </div>
  );
}

function ModernBalanceCard({ label, amount, currency, trend, color, icon, path }: any) {
  const formatted = new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);

  return (
    <Link href={path} className="block group">
      <div className="bg-slate-900 border border-white/5 p-8 rounded-[32px] group-hover:border-orange-500/30 transition-all shadow-2xl relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-white group-hover:scale-125 transition-transform">
          {icon}
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 group-hover:text-slate-300 transition-colors">{label}</p>
        <div className="flex items-end justify-between">
          <h4 className="text-[14px] font-black text-white tracking-tight">
            {formatted}
          </h4>
          <div className={`px-2 py-1 rounded-lg bg-${color}-500/10 flex items-center gap-1 text-[10px] font-black ${color === 'emerald' ? 'text-emerald-500' : 'text-blue-400'}`}>
            <TrendingUp size={12} />
            {trend}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ServiceChip({ icon, label, path, active }: any) {
  return (
    <Link href={path} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all duration-300 group ${
      active 
        ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/30' 
        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10 hover:text-white'
    }`}>
      <span className={active ? 'text-white' : 'text-orange-500 group-hover:scale-110 transition-transform'}>{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
    </Link>
  );
}

function HighDensityMetric({ label, value, sub, trend, positive }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/5 transition-colors">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-black text-white">{value}</span>
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{sub}</span>
        </div>
      </div>
      <div className={`px-2 py-1 rounded-lg bg-${positive ? 'emerald' : 'blue'}-500/10 text-[10px] font-black ${positive ? 'text-emerald-500' : trend === 'Stable' ? 'text-slate-500' : 'text-emerald-500'}`}>
        {trend}
      </div>
    </div>
  );
}

function DirectiveButton({ icon, label, path }: any) {
  return (
    <Link href={path} className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/20 hover:bg-orange-500/5 text-slate-500 hover:text-orange-500 transition-all gap-3 group">
      <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 group-hover:border-orange-500/20 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}
