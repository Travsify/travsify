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
  CreditCard
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      // 1. Fetch Tenants
      const tRes = await fetch(`${API_URL}/admin/tenants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (tRes.ok) setTenants(await tRes.json());

      // 2. Fetch Summary Stats
      const sRes = await fetch(`${API_URL}/admin/analytics/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sRes.ok) setStats(await sRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Entering Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Ecosystem Overview</h2>
          <p className="text-slate-500 font-medium text-lg">Manage platform tenants, global liquidity, and service health.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Filter size={18} />
            Export Data
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Create New Tenant
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard icon={<Users className="text-blue-600" />} label="Total Tenants" value={tenants.length.toString()} trend="+12% this month" />
        <AdminStatCard icon={<CreditCard className="text-emerald-600" />} label="Total Volume" value="$42,400" trend="+24% volume" />
        <AdminStatCard icon={<Zap className="text-orange-600" />} label="API Requests" value="1.2M" trend="Normal Load" />
        <AdminStatCard icon={<Activity className="text-indigo-600" />} label="Avg Margin" value="6.5%" trend="Across all verticals" />
      </div>

      {/* Tenant Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-900">Active Tenants</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold w-72 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Business Name</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Markups (F/H/I)</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Created At</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-blue-600">
                        {tenant.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{tenant.name}</p>
                        <p className="text-xs font-medium text-slate-400">{tenant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tenant.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {tenant.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{tenant.flightMarkup}%</span>
                      <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{tenant.hotelMarkup}%</span>
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{tenant.insuranceMarkup}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[13px] font-bold text-slate-500">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900">Service Bridge Health</h3>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">All Systems Operational</span>
          </div>
          <div className="space-y-4">
            <HealthItem label="Duffel (Flights)" status="online" latency="124ms" />
            <HealthItem label="LiteAPI (Hotels)" status="online" latency="89ms" />
            <HealthItem label="Atlys (eVisas)" status="online" latency="240ms" />
            <HealthItem label="Mozio (Transfers)" status="online" latency="156ms" />
          </div>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
          <h3 className="font-black mb-8">Platform Governance</h3>
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <h4 className="text-sm font-black mb-2">Platform Revenue Model</h4>
              <p className="text-slate-400 text-[13px] leading-relaxed">
                You are currently earning a 1% base fee on all volume processed through the Unified Gateway.
              </p>
            </div>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
              Manage Billing Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-900 mb-2">{value}</h4>
      <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
        <ArrowUpRight size={14} />
        {trend}
      </p>
    </div>
  );
}

function HealthItem({ label, status, latency }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-sm font-bold text-slate-900">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{latency}</span>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100/50 px-2 py-1 rounded-md">Live</span>
      </div>
    </div>
  );
}
