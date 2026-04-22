'use client';

import { 
  ShieldCheck, 
  Search, 
  Plus, 
  ArrowRight, 
  Activity, 
  HeartPulse, 
  Plane, 
  AlertCircle,
  FileText,
  Download,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function InsurancePage() {
  const plans = [
    {
      id: '1',
      name: 'Global Traveler Plus',
      provider: 'SafetyWing',
      coverage: '$100,000',
      benefits: ['Medical Emergencies', 'Trip Cancellation', 'Lost Baggage'],
      premium: '$2.50 / day',
      tag: 'Best Seller'
    },
    {
      id: '2',
      name: 'Business Elite',
      provider: 'SafetyWing Premium',
      coverage: '$500,000',
      benefits: ['Global Evacuation', 'Tech Protection', 'Lounge Delay'],
      premium: '$8.00 / day',
      tag: 'Premium'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Travel Insurance</h2>
          <p className="text-slate-500 font-medium text-sm">Protect your travelers with comprehensive global coverage from SafetyWing.</p>
        </div>
        <Link href="/demo?tab=insurance" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
          <Plus size={18} />
          Create New Policy
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white p-8 rounded-[32px] border border-slate-100 relative group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={120} />
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/20">
                    {plan.tag}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1 relative z-10">{plan.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Underwritten by {plan.provider}</p>

                <div className="space-y-4 mb-8 relative z-10">
                  {plan.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Coverage</p>
                    <p className="text-xl font-black text-slate-900">{plan.coverage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Premium</p>
                    <p className="text-xl font-black text-blue-600">{plan.premium}</p>
                  </div>
                </div>

                <Link href="/demo?tab=insurance" className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 relative z-10 active:scale-95">
                  Select This Plan
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>

          {/* Active Policies Table */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Active Policies
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 'POL-9283', pax: 'John Doe', plan: 'Global Traveler', expiry: 'May 20, 2026', status: 'Active' },
                    { id: 'POL-1102', pax: 'Jane Smith', plan: 'Business Elite', expiry: 'Apr 25, 2026', status: 'Expiring Soon' },
                  ].map((policy) => (
                    <tr key={policy.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-mono font-bold text-blue-600">{policy.id}</span>
                          <span className="text-sm font-bold text-slate-900">{policy.pax}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{policy.plan}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Expires</span>
                          <span className="text-[13px] font-bold text-slate-900">{policy.expiry}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${policy.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90" title="Download Policy">
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
          <div className="bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Activity size={80} />
            </div>
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-blue-400">
              <Activity size={18} />
              Claims Center
            </h3>
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Open Claims</p>
                <p className="text-3xl font-black">2</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Payouts (YTD)</p>
                <p className="text-3xl font-black">$12,450</p>
              </div>
              <Link href="/dashboard/settings" className="w-full py-4 bg-blue-600 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-center active:scale-95">
                File a Claim
              </Link>
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <AlertCircle size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Emergency Assistance</h4>
            </div>
            <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-6">
              Need immediate help? Call our 24/7 global emergency line for medical evacuation or support.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 font-mono text-[13px] font-bold text-center">
              +1 (800) 555-0199
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
