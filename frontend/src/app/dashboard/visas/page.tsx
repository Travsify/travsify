'use client';

import { useState } from 'react';
import { 
  Globe, 
  Search, 
  Loader2, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';

export default function VisaPage() {
  const apiKey = useApiKey();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [search, setSearch] = useState({
    nationality: 'NG',
    destination: ''
  });

  const handleSearch = async () => {
    if (!search.nationality || !search.destination) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/search/visa?nationality=${search.nationality.toUpperCase()}&destination=${search.destination.toUpperCase()}`, {
        headers: { 'x-api-key': apiKey || '' }
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">e-Visas (Sherpa)</h1>
          <p className="text-sm text-slate-400 font-medium">Visa requirement tracking and application status via Sherpa API.</p>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nationality</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="e.g. NG" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 uppercase"
              value={search.nationality}
              onChange={(e) => setSearch({...search, nationality: e.target.value})}
            />
          </div>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="e.g. AE or GB" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 uppercase"
              value={search.destination}
              onChange={(e) => setSearch({...search, destination: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-orange-600 text-white px-12 py-4 rounded-xl font-black text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          {loading ? 'Checking Sherpa...' : 'Check Requirements'}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <Globe size={32} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Powered by Sherpa
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Visa Requirement</h3>
              <p className="text-sm font-bold text-slate-500 mb-10">{search.nationality} → {search.destination}</p>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                <p className="text-lg font-black text-slate-900 mb-2">
                  {results.requirement || (results.visaRequired ? 'Visa Required' : 'Visa Not Required')}
                </p>
                <p className="text-[13px] text-slate-500 font-medium">
                  {results.message || 'Please ensure you have all required documentation before traveling.'}
                </p>
              </div>

              {results.visaRequired !== false && (
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <span className="text-[13px] font-bold text-slate-500">Processing Time</span>
                    <span className="text-[13px] font-black text-slate-900 flex items-center gap-2">
                      <Clock size={16} className="text-orange-600" />
                      {results.processingTime || '3-5 Working Days'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <span className="text-[13px] font-bold text-slate-500">Estimated Fee</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {results.estimatedFee ? `₦${results.estimatedFee.toLocaleString()}` : 'Check API'}
                    </span>
                  </div>
                </div>
              )}

              {results.visaRequired !== false && (
                <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[13px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20 active:scale-95">
                  Start Application
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0A1629] rounded-[32px] p-8 text-white shadow-xl shadow-[#0A1629]/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck size={100} />
               </div>
               <ShieldCheck size={32} className="mb-6 text-orange-500" />
               <h4 className="text-xl font-black mb-3 tracking-tight">Sherpa Integration</h4>
               <p className="text-slate-400 text-[13px] font-medium leading-relaxed">
                 All visa rules and requirements are pulled live from the Sherpa API ensuring compliance with global travel regulations.
               </p>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
                <FileText size={20} className="text-orange-600" />
                Required Documents
              </h3>
              <div className="space-y-4">
                <PrepStep label="Passport Scan (Min 6 months validity)" />
                <PrepStep label="Recent Passport Photo" />
                <PrepStep label="Flight Itinerary" />
                <PrepStep label="Proof of Accommodation" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !results && (
        <div className="py-32 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Globe size={40} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Check Visa Requirements</h3>
          <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-2">Enter the traveler's nationality and destination country code to fetch live requirements from Sherpa.</p>
        </div>
      )}
    </div>
  );
}

function PrepStep({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
        <CheckCircle2 size={12} />
      </div>
      <span className="text-[12px] font-bold text-slate-600 leading-tight">{label}</span>
    </div>
  );
}
