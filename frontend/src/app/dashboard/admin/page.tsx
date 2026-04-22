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
  ArrowRight,
  Database,
  Globe,
  Settings,
  ChevronRight,
  Plus
} from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function AdminConsole() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalVolume: 0,
    activeUsers: 0,
    successRate: 0,
    systemHealth: 'Stable'
  });
  const [loading, setLoading] = useState(true);

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
      console.error('Admin data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-[#0a0f18] rounded-[32px] border border-white/5 shadow-2xl">
        <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Establishing Executive Uplink...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Global Ecosystem Header */}
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-12 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                 <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em]">Infrastructure Master Control</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tight leading-none">
                Executive <span className="text-slate-400">Terminal</span>
              </h2>
              <p className="text-slate-400 font-bold text-lg max-w-xl">
                Global orchestration of the Travsify ecosystem. Managing {tenants.length} active tenants across 12 geographical regions.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
               <StatMetric label="Total Volume" value="$2.4M" trend="+14%" />
               <StatMetric label="Active Nodes" value={tenants.length.toString()} trend="Live" />
               <StatMetric label="Success Rate" value="99.98%" trend="Optimal" />
            </div>
         </div>
      </div>

      {/* Control Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Bridge Health */}
        <div className="bg-slate-900 rounded-[32px] border border-white/5 p-10 flex flex-col justify-between shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
           <div>
             <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Activity size={24} className="text-orange-500" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Systems Operational
                </div>
             </div>
             <h3 className="text-xl font-black text-white mb-6 tracking-tight">Service Bridge Health</h3>
             <div className="space-y-3">
               <PulseItem label="Flight GDS (Duffel)" status="Optimal" latency="82ms" />
               <PulseItem label="Hotel Engine" status="Optimal" latency="145ms" />
               <PulseItem label="Payment Gateway" status="Active" latency="11ms" />
               <PulseItem label="Identity Service" status="Active" latency="430ms" />
             </div>
           </div>
           <button className="mt-10 w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[13px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Deep Diagnostics <ArrowRight size={16} />
           </button>
        </div>

        {/* Tenant Orchestration */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Ecosystem</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time tenant resource allocation</p>
             </div>
             <div className="flex items-center gap-3">
               <div className="relative">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search tenants..." 
                   className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all w-64"
                 />
               </div>
               <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-all">
                 <Plus size={16} />
                 Provision
               </button>
             </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Entity</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pulse Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Channels</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                             {tenant.name?.[0]}
                           </div>
                           <div>
                             <p className="text-[14px] font-black text-slate-900">{tenant.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tenant.email}</p>
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100 uppercase tracking-tight">
                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                           Operational
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex gap-2">
                           {['Flights', 'Hotels'].map(v => (
                             <span key={v} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-tight">
                               {v}
                             </span>
                           ))}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                           <Settings size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Revenue Governance */}
      <div className="bg-slate-900 rounded-[32px] border border-white/5 p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full translate-x-1/2" />
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6 relative z-10">
               <h3 className="text-2xl font-black text-white tracking-tight">Global Yield Rules</h3>
               <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
                 Dynamic margin controller for the Travsify vertical stack. Yield optimization engine is currently maintaining a weighted platform markup of <span className="text-orange-500 font-black">4.5%</span>.
               </p>
               <div className="flex gap-4">
                  <div className="px-6 py-5 bg-white/5 border border-white/10 rounded-2xl flex-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Aviation Yield</p>
                     <p className="text-2xl font-black text-white tracking-tight">3.0%</p>
                  </div>
                  <div className="px-6 py-5 bg-white/5 border border-white/10 rounded-2xl flex-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hospitality Yield</p>
                     <p className="text-2xl font-black text-white tracking-tight">7.5%</p>
                  </div>
               </div>
            </div>
            <div className="flex-none w-full lg:w-[420px] relative z-10">
               <div className="p-10 bg-orange-600 rounded-[32px] shadow-2xl shadow-orange-600/30">
                  <h4 className="text-white font-black text-xl mb-6 tracking-tight">Enterprise Governance</h4>
                  <div className="space-y-4">
                     <button className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-black/10">
                        Update Global Rules
                        <ChevronRight size={18} />
                     </button>
                     <button className="w-full py-4.5 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                        Audit Financial Logs
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatMetric({ label, value, trend }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-white tracking-tight">{value}</h4>
        <span className="text-[10px] font-black text-orange-500 tracking-widest">{trend}</span>
      </div>
    </div>
  );
}

function PulseItem({ label, status, latency }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-colors group/pulse">
       <div className="flex items-center gap-3">
         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover/pulse:scale-150 transition-transform" />
         <span className="text-[13px] font-bold text-slate-300">{label}</span>
       </div>
       <div className="flex items-center gap-4">
         <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{status}</span>
         <span className="text-[11px] font-black text-slate-500 tracking-tight">{latency}</span>
       </div>
    </div>
  );
}
