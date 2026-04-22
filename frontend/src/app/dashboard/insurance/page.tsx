'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  ArrowRight, 
  Activity, 
  Plane, 
  AlertCircle,
  FileText,
  Download,
  Zap,
  CheckCircle2,
  Loader2,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function InsurancePage() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [search, setSearch] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1
  });

  const handleSearch = async () => {
    if (!search.destination || !search.startDate || !search.endDate) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/demo/insurance/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(search)
      });
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Travel Insurance (SafetyWing)</h1>
          <p className="text-sm text-slate-400 font-medium">Protect your travelers with comprehensive global coverage from SafetyWing.</p>
        </div>
        <div className="flex bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 items-center gap-2">
          <Zap size={14} className="fill-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-tight">Active Integration</span>
        </div>
      </div>

      {/* Quote Generation Form */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Country (e.g. USA)" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all uppercase"
                value={search.destination}
                onChange={(e) => setSearch({...search, destination: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-600"
                value={search.startDate}
                onChange={(e) => setSearch({...search, startDate: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-600"
                value={search.endDate}
                onChange={(e) => setSearch({...search, endDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-4 bg-orange-600 text-white rounded-xl font-black text-sm hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 text-center active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? 'Fetching Quotes...' : 'Get Live Quotes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 relative group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={120} />
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20">
                    {plan.tag || (i === 0 ? 'Best Value' : 'Premium')}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1 relative z-10">{plan.name || 'SafetyWing Global'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Underwritten by {plan.provider || 'SafetyWing'}</p>

                <div className="space-y-4 mb-8 relative z-10">
                  {(plan.benefits || ['Medical Emergencies up to $250k', 'Trip Interruption', 'Lost Checked Luggage']).map((benefit: string, j: number) => (
                    <div key={j} className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coverage Limit</p>
                    <p className="text-xl font-black text-slate-900">{plan.coverage || '$250,000'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Premium</p>
                    <p className="text-xl font-black text-blue-600">₦{(plan.premium || 14500).toLocaleString()}</p>
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-black text-[13px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2 relative z-10 active:scale-95 shadow-xl hover:shadow-orange-600/20">
                  Issue Policy
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}

            {!loading && plans.length === 0 && (
              <div className="col-span-1 md:col-span-2 py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShieldCheck size={32} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Fetch SafetyWing Quotes</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">Enter destination and travel dates to see available plans.</p>
              </div>
            )}
          </div>

          {/* Active Policies Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest flex items-center gap-2">
                <FileText size={18} className="text-orange-600" />
                Active Policies
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 'POL-SW-9283', pax: 'John Doe', plan: 'SafetyWing Global', expiry: 'May 20, 2026', status: 'Active' },
                    { id: 'POL-SW-1102', pax: 'Jane Smith', plan: 'SafetyWing Nomad', expiry: 'Apr 25, 2026', status: 'Expiring Soon' },
                  ].map((policy) => (
                    <tr key={policy.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-blue-600 hover:underline">{policy.id}</span>
                          <span className="text-[13px] font-bold text-slate-900">{policy.pax}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{policy.plan}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Expires</span>
                          <span className="text-[12px] font-bold text-slate-900">{policy.expiry}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${policy.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors" title="Download Policy">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Claims Overview */}
          <div className="bg-[#0A1629] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl shadow-[#0A1629]/20">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <Activity size={100} />
            </div>
            <h3 className="text-lg font-black mb-8 flex items-center gap-2 text-white tracking-tight">
              <Activity size={20} className="text-orange-500" />
              Claims Center
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Open Claims</p>
                <p className="text-3xl font-black">2</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Payouts (YTD)</p>
                <p className="text-3xl font-black">₦2,450,000</p>
              </div>
              <button className="w-full py-4 bg-orange-600 rounded-xl font-black text-sm hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95">
                File a Claim
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertCircle size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Emergency Line</h4>
            </div>
            <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-6">
              Need immediate help? Call the SafetyWing global emergency line for medical evacuation or support.
            </p>
            <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-[13px] font-bold text-center text-slate-900 shadow-sm">
              +1 (800) 555-0199
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
