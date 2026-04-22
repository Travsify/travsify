'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  Search, 
  ArrowUpRight, 
  Filter, 
  MoreVertical,
  Loader2,
  AlertCircle,
  Globe,
  Zap,
  CreditCard,
  Server,
  ArrowRight,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';

import { API_URL } from '@/utils/api';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [tRes, sRes] = await Promise.all([
        fetch(`${API_URL}/admin/tenants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/admin/analytics/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      if (tRes.ok) setTenants(await tRes.json());
      if (sRes.ok) setStats(await sRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-fade-up">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck size={32} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-12 pb-20">
      {/* Dynamic Background Elements */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[20%] -right-40 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] -z-10" />

      {/* Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 animate-fade-up">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
              Master Admin
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Infrastructure: Nominal
            </div>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4 leading-none">
            Ecosystem <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 bg-clip-text text-transparent">Command</span>
          </h2>
          <p className="text-slate-500 font-bold text-lg max-w-2xl">
            Real-time governance, multi-tenant orchestration, and global vertical health monitoring.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex-1 lg:flex-none px-8 py-4 bg-white border border-slate-200 rounded-[28px] font-black text-[13px] text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3 group">
            <Filter size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Global Filters
          </button>
          <button className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-[28px] font-black text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3">
            <PlusIcon />
            Provision Tenant
          </button>
        </div>
      </div>

      {/* Stats Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <GlassStatCard 
          icon={<Users size={24} />} 
          label="Total Tenants" 
          value={tenants.length.toString()} 
          trend="+4 today" 
          color="blue"
        />
        <GlassStatCard 
          icon={<Activity size={24} />} 
          label="Active API Vol." 
          value="$1.2M" 
          trend="+18.5%" 
          color="indigo"
        />
        <GlassStatCard 
          icon={<Zap size={24} />} 
          label="Bridge Latency" 
          value="124ms" 
          trend="Optimized" 
          color="orange"
        />
        <GlassStatCard 
          icon={<ShieldCheck size={24} />} 
          label="Security Pulse" 
          value="100%" 
          trend="Live Guard" 
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Tenant Table Container */}
        <div className="xl:col-span-2 bg-white rounded-[48px] border border-slate-200/60 p-12 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:bg-blue-50/50 transition-colors duration-700" />
          
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Active Ecosystem</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Tenant Orchestration</p>
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search infrastructure..." 
                className="pl-14 pr-8 py-4 bg-slate-50 border-none rounded-[22px] text-sm font-bold w-80 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Business Unit</th>
                  <th className="pb-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Pulse</th>
                  <th className="pb-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Markups (F/H/I)</th>
                  <th className="pb-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                          {tenant.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg mb-0.5">{tenant.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tenant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        tenant.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tenant.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {tenant.isActive ? 'Active' : 'Offline'}
                      </div>
                    </td>
                    <td className="py-8 px-4">
                      <div className="flex gap-2">
                        <MarkupBadge value={tenant.flightMarkup} label="F" color="blue" />
                        <MarkupBadge value={tenant.hotelMarkup} label="H" color="orange" />
                        <MarkupBadge value={tenant.insuranceMarkup} label="I" color="indigo" />
                      </div>
                    </td>
                    <td className="py-8 px-4 text-right">
                      <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center ml-auto">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Infrastructure & Governance */}
        <div className="space-y-10">
          {/* Health Pulse */}
          <div className="bg-[#0f172a] rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-black/20">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Server size={120} />
            </div>
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-blue-400">
              <Activity size={24} className="animate-pulse" />
              Service Bridge Health
            </h3>
            <div className="space-y-6 relative z-10">
              <HealthPulseItem label="Aviation (Duffel)" status="Optimal" latency="124ms" />
              <HealthPulseItem label="Hospitality (LiteAPI)" status="Optimal" latency="89ms" />
              <HealthPulseItem label="Logistics (Mozio)" status="Stable" latency="156ms" />
              <HealthPulseItem label="Fintech (Fincra)" status="Stable" latency="45ms" />
            </div>
          </div>

          {/* Revenue Governance */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[48px] p-10 text-white shadow-2xl shadow-orange-500/20">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight leading-none">Global Yield Rules</h3>
            <p className="text-orange-100/80 text-sm font-bold leading-relaxed mb-8">
              Currently processing with a 1.25% platform service fee. Yield optimization is active across all currency bridges.
            </p>
            <button className="w-full py-5 bg-white text-orange-600 rounded-[22px] font-black text-[13px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-black/5">
              Adjust Global Margins
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassStatCard({ icon, label, value, trend, color }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  };

  return (
    <div className="group bg-white rounded-[40px] p-10 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full translate-x-20 -translate-y-20 transition-transform duration-700 opacity-5 ${
        color === 'blue' ? 'bg-blue-600' : color === 'orange' ? 'bg-orange-600' : 'bg-indigo-600'
      }`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 ${colors[color]}`}>
            {icon}
          </div>
          <div className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-tight">
            Live Pulse
          </div>
        </div>
        
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</h4>
        <p className={`text-[11px] font-black uppercase tracking-widest ${color === 'orange' ? 'text-orange-600' : 'text-emerald-600'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}

function MarkupBadge({ value, label, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-black ${colors[color]}`}>
      <span className="opacity-50">{label}:</span>
      {value}%
    </div>
  );
}

function HealthPulseItem({ label, status, latency }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
        <span className="text-sm font-bold text-slate-200">{label}</span>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{latency}</span>
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">{status}</span>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center mr-1">
      <div className="w-3 h-0.5 bg-slate-900 rounded-full absolute rotate-90" />
      <div className="w-3 h-0.5 bg-slate-900 rounded-full absolute" />
    </div>
  );
}
