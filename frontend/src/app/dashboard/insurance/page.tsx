'use client';

import { useState } from 'react';
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
  Users,
  ChevronRight,
  ShieldAlert,
  X,
  Info,
  Check,
  AlertTriangle
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';
import LocationInput from '@/components/LocationInput';

export default function InsurancePage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [search, setSearch] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1
  });
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const allBookings = await res.json();
        setPolicies(allBookings.filter((b: any) => b.vertical === 'insurance'));
      }
    } catch (err) {
      console.error('Failed to fetch policies', err);
    }
  };

  const handleSearch = async () => {
    if (!search.destination || !search.startDate || !search.endDate) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/search/insurance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' },
        body: JSON.stringify({
          ...search,
          currency: currency
        })
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <ShieldCheck size={24} className="text-[#FF6B00]" />
            </div>
            Travel Insurance
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2">Protect your travelers with comprehensive global coverage via our Verified Network.</p>
        </div>
        <div className="flex gap-2">
           <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 flex items-center gap-2">
            <Zap size={14} className="fill-emerald-600 animate-pulse" /> Active Shield
          </span>
          <span className="px-4 py-2 bg-orange-50 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> {currency} Quotes
          </span>
        </div>
      </div>

      {/* Quote Generation Form */}
      <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-2xl shadow-slate-200/50 flex flex-col gap-8 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-orange-50 transition-colors duration-1000 -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <LocationInput 
            label="Destination"
            placeholder="Country (e.g. USA)"
            value={search.destination}
            onChange={(val) => setSearch({...search, destination: val})}
          />
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 text-slate-600 cursor-pointer"
                value={search.startDate}
                onChange={(e) => setSearch({...search, startDate: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 text-slate-600 cursor-pointer"
                value={search.endDate}
                onChange={(e) => setSearch({...search, endDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-5 bg-[#0A1629] text-white rounded-[24px] font-black text-sm hover:bg-[#FF6B00] transition-all duration-500 shadow-2xl shadow-blue-900/30 text-center active:scale-95 flex items-center justify-center gap-3 group/btn"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} className="group-hover/btn:rotate-12 transition-transform" />}
              {loading ? 'Fetching Quotes...' : 'Generate Quotes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        <div className="lg:col-span-2 space-y-10">
          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedPlan(plan)}
                className="bg-white p-10 rounded-[48px] border border-slate-200 relative group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 shadow-xl flex flex-col cursor-pointer"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${i === 0 ? 'bg-[#FF6B00]' : 'bg-[#0A1629]'}`} />
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                  <ShieldCheck size={160} />
                </div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A1629] flex items-center justify-center text-[#FF6B00] shadow-xl shadow-blue-900/20">
                    <ShieldCheck size={28} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg ${i === 0 ? 'bg-[#FF6B00] text-white shadow-orange-600/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                    {plan.tag || (i === 0 ? 'Best Value' : 'Platinum')}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 relative z-10 tracking-tight">{plan.planName || 'Global Direct'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">Underwritten by Verified Network</p>

                <div className="space-y-5 mb-10 relative z-10 flex-1">
                  {(plan.benefits || ['Medical Emergencies up to $250k', 'Trip Interruption Coverage', 'Lost Checked Luggage Protection', 'Emergency Evacuation']).map((benefit: string, j: number) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-black text-slate-600 group-hover:text-slate-900 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                         <CheckCircle2 size={14} />
                      </div>
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between relative z-10 mt-auto">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coverage Limit</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{plan.coverage || '$250,000'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Premium</p>
                    <div className="flex items-baseline gap-1 justify-end">
                       <span className="text-sm font-black text-[#FF6B00]">{currency === 'USD' ? '$' : '₦'}</span>
                       <p className="text-3xl font-black text-[#FF6B00] tracking-tighter">{(plan.price?.totalAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `/dashboard/checkout?vertical=insurance&provider=VerifiedNetwork&id=${plan.id}&name=${encodeURIComponent(plan.planName)}&price=${plan.price?.totalAmount}&currency=${currency}`;
                    window.location.href = url;
                  }}
                  className="w-full mt-10 py-5 bg-[#0A1629] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF6B00] transition-all duration-500 flex items-center justify-center gap-3 relative z-10 active:scale-95 shadow-2xl hover:shadow-orange-600/30 group/btn"
                >
                  Issue Policy
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}

            {!loading && plans.length === 0 && (
              <div className="col-span-1 md:col-span-2 py-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-50" />
                <div className="relative z-10">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 group hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={56} className="text-slate-200 group-hover:text-[#FF6B00] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Protect Your Journey</h3>
                  <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-4 leading-relaxed px-6">
                    Enter destination and travel dates to fetch live availability and dynamic {currency} quotes from our global network.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Active Policies Table */}
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-100 overflow-hidden group">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-[0.2em] flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <FileText size={20} className="text-[#FF6B00]" />
                </div>
                Active Policies
              </h3>
              <button className="text-[10px] font-black uppercase text-[#FF6B00] hover:underline transition-all">View All Policies</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-50">
                  {policies.map((policy) => (
                    <tr key={policy.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-[#FF6B00] tracking-widest">{policy.pnr || policy.id.substring(0,8).toUpperCase()}</span>
                          <span className="text-base font-black text-slate-900">{policy.passengerDetails?.[0]?.firstName || 'User'}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{policy.flightDetails?.itemName || 'Global Shield'}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Date Issued</span>
                          <span className="text-sm font-bold text-slate-900">{new Date(policy.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${policy.status === 'TICKETED' || policy.status === 'FULFILLED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-[#0A1629] hover:bg-white hover:shadow-xl transition-all flex items-center justify-center border border-transparent hover:border-slate-100" title="Download Policy">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {policies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center text-slate-400 text-sm font-black uppercase tracking-widest">No active policies found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Claims Overview */}
          <div className="bg-[#0A1629] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/40">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
              <Activity size={180} />
            </div>
            <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-white tracking-tight relative z-10">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                 <Activity size={24} className="text-[#FF6B00]" />
              </div>
              Claims Center
            </h3>
            <div className="space-y-8 relative z-10">
              <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Open Claims</p>
                <p className="text-4xl font-black tracking-tighter text-white">00</p>
              </div>
              <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Total Payouts (YTD)</p>
                <div className="flex items-baseline gap-1">
                   <span className="text-sm font-black text-slate-400">{currency === 'NGN' ? '₦' : '$'}</span>
                   <p className="text-4xl font-black tracking-tighter text-white">0</p>
                </div>
              </div>
              <button className="w-full py-5 bg-[#FF6B00] text-white rounded-[20px] font-black text-sm hover:scale-[1.02] transition-all shadow-2xl shadow-orange-600/40 active:scale-95 group/btn">
                File a New Claim <ArrowRight size={18} className="inline-block ml-2 group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-100 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-center gap-4 mb-6 text-rose-600 relative z-10">
               <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 group-hover:rotate-12 transition-transform">
                <ShieldAlert size={24} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">Emergency Assistance</h4>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 relative z-10">
              Need immediate global help? Access the 24/7 Verified emergency line for medical evacuation, urgent care, or coordination support.
            </p>
            <div className="p-6 bg-[#0A1629] rounded-[24px] border border-blue-900/30 font-mono text-lg font-black text-center text-white shadow-2xl shadow-blue-900/20 group-hover:scale-105 transition-transform relative z-10 cursor-pointer active:scale-95">
              +1 (800) 555-0199
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0A1629]/90 backdrop-blur-sm" onClick={() => setSelectedPlan(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <ShieldCheck size={28} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedPlan.planName || 'Global Direct'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Direct Coverage</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className="lg:col-span-2 p-10 space-y-12">
                   <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Info size={20} className="text-[#FF6B00]" />
                      Comprehensive Coverage Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'Emergency Medical', desc: 'Up to $250,000 for accidents & illness' },
                        { title: 'Emergency Dental', desc: 'Up to $1,000 for acute pain relief' },
                        { title: 'Emergency Evacuation', desc: 'Up to $100,000 lifetime maximum' },
                        { title: 'Trip Interruption', desc: 'Up to $5,000 for return flights' },
                        { title: 'Travel Delay', desc: 'Up to $100/day (max 2 days)' },
                        { title: 'Lost Luggage', desc: 'Up to $500/item ($3,000 max)' }
                      ].map((benefit, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-[#0A1629] hover:text-white transition-all">
                          <div className="flex items-center gap-3 mb-2">
                             <Check size={18} className="text-emerald-500 group-hover:text-white" />
                             <h5 className="font-black uppercase tracking-widest text-[11px]">{benefit.title}</h5>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300 ml-7">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="p-8 bg-orange-50 rounded-[40px] border border-orange-100">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#FF6B00] shadow-sm shrink-0">
                         <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 tracking-tight">Important Exclusions</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                          Pre-existing conditions, high-risk sports without add-on, and incidents involving drugs/alcohol are typically excluded. Please review the full policy document for details.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="p-10 bg-slate-50/50 border-l border-slate-100 space-y-10">
                   <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quote for {search.travelers} Traveler(s)</p>
                    <div className="flex items-baseline gap-2 mb-8">
                       <span className="text-sm font-black text-[#FF6B00]">{currency === 'USD' ? '$' : '₦'}</span>
                       <span className="text-5xl font-black text-slate-900 tracking-tighter">{(selectedPlan.price?.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductible</span>
                      <span className="text-sm font-black text-slate-900">$250.00</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area</span>
                      <span className="text-sm font-black text-slate-900 uppercase">{search.destination || 'Global'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                      <span className="text-sm font-black text-slate-900">30 Days</span>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-[#0A1629] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF6B00] shadow-xl hover:shadow-orange-600/30 transition-all active:scale-95">
                    Issue Policy Now
                  </button>
                  <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6">Instant Issuance via Verified Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
