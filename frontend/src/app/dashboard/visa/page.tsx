'use client';

import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Globe, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Info,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'CA', name: 'Canada' },
  { code: 'TR', name: 'Turkey' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'EG', name: 'Egypt' },
];

export default function VisaPage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [visas, setVisas] = useState<any[]>([]);
  const [search, setSearch] = useState({
    nationality: 'NG',
    destination: 'GB'
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        nationality: search.nationality,
        destination: search.destination,
      });
      
      const res = await fetch(`${API_URL}/api/v1/search/visa?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' }
      });
      const data = await res.json();
      setVisas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <FileText size={24} className="text-[#FF6B00]" />
            </div>
            Visa & e-Visa
          </h1>
          <p className="text-[13px] text-slate-400 font-medium mt-2">Automated e-Visa applications and requirement checks via our global network.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-orange-50 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> Live Verified API
          </span>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-8 relative group overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-orange-50 transition-colors duration-1000 -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Globe size={12} className="text-blue-500" /> Citizenship (Passport)
            </label>
            <select 
              value={search.nationality}
              onChange={(e) => setSearch({...search, nationality: e.target.value})}
              className="w-full px-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 appearance-none cursor-pointer"
            >
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Globe size={12} className="text-[#FF6B00]" /> Destination Country
            </label>
            <select 
              value={search.destination}
              onChange={(e) => setSearch({...search, destination: e.target.value})}
              className="w-full px-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-orange-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 appearance-none cursor-pointer"
            >
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100 relative z-10">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#0A1629] text-white px-16 py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-blue-900/30 hover:bg-[#FF6B00] hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center gap-4 w-full md:w-auto justify-center group"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} className="group-hover:rotate-12 transition-transform" />}
            {loading ? 'Consulting Global Network...' : 'Check Requirements'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-8">
        {visas.map((visa, i) => (
          <div 
            key={i} 
            className="bg-white p-1 rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700 group overflow-hidden relative"
          >
             <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#FF6B00]" />
             
             <div className="p-8 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1 space-y-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B00] shrink-0 border border-orange-100">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">e-Visa for {visa.destination}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Provider: {visa.provider || 'Verified Network'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Clock size={14} className="text-blue-500" /> Processing Time
                    </h4>
                    <p className="text-sm font-black text-slate-700">{visa.processingTime}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" /> Requirements
                    </h4>
                    <ul className="space-y-2">
                      {visa.requirements.map((r: string, ri: number) => (
                        <li key={ri} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                          <CheckCircle2 size={12} className="text-emerald-400" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto shrink-0 pt-10 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-10">
                <div className="text-center lg:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Service Fee</p>
                  <div className="flex items-baseline gap-1 justify-center lg:justify-end">
                    <span className="text-xs font-black text-slate-900">{currency === 'USD' ? '$' : '₦'}</span>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                      {(visa.price?.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = `/dashboard/visa/checkout?id=${visa.id}&destination=${visa.destination}&price=${visa.price?.totalAmount}&currency=${currency}`}
                  className="w-full bg-[#0A1629] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#FF6B00] transition-all duration-500 active:scale-95 group shadow-lg"
                >
                  Start Application <ChevronRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && visas.length === 0 && (
          <div className="py-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200/60 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50">
                <Globe size={56} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Visa Intelligence</h3>
              <p className="text-[13px] text-slate-400 font-medium max-w-md mx-auto mt-4 leading-relaxed px-6">
                Check e-Visa eligibility and requirements for any nationality in real-time. Powered by our global intelligence database.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100 flex items-start gap-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-[#0A1629] uppercase tracking-widest mb-2">Developer Note</h4>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            This vertical uses our global API for automated e-Visa applications. Once a user completes payment via Travsify Pay, the application is initiated immediately through the <code>CheckoutService</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
