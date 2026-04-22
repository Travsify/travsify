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

export default function ToursPage() {
  const apiKey = useApiKey();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [search, setSearch] = useState({
    city: 'Dubai',
    date: ''
  });

  const handleSearch = async () => {
    if (!search.city) return;
    setLoading(true);
    setResults(null);
    try {
      // Mocking a successful response for the UI demonstration
      setTimeout(() => {
        setResults({
          tourName: `${search.city} City Sightseeing Tour`,
          duration: 'Half-Day (4 Hours)',
          estimatedFee: 150000,
          availability: 'Available',
          message: 'Experience the best attractions with a guided tour.'
        });
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Search failed', err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tours & Experiences</h1>
          <p className="text-sm text-slate-400 font-medium">Global curated experiences, activities, and sightseeing tours.</p>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination City</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="e.g. Dubai" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20"
              value={search.city}
              onChange={(e) => setSearch({...search, city: e.target.value})}
            />
          </div>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="date" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold text-slate-600 border-none outline-none focus:ring-2 focus:ring-orange-500/20"
              value={search.date}
              onChange={(e) => setSearch({...search, date: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-orange-600 text-white px-12 py-4 rounded-xl font-black text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          {loading ? 'Searching...' : 'Search Tours'}
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
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Live Availability
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{results.tourName}</h3>
              <p className="text-sm font-bold text-slate-500 mb-10">{search.city} {search.date && `• ${search.date}`}</p>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                <p className="text-lg font-black text-slate-900 mb-2">
                  {results.availability}
                </p>
                <p className="text-[13px] text-slate-500 font-medium">
                  {results.message}
                </p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between p-4 border-b border-slate-50">
                  <span className="text-[13px] font-bold text-slate-500">Duration</span>
                  <span className="text-[13px] font-black text-slate-900 flex items-center gap-2">
                    <Clock size={16} className="text-orange-600" />
                    {results.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-slate-50">
                  <span className="text-[13px] font-bold text-slate-500">Price (Starting from)</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {results.estimatedFee ? `₦${results.estimatedFee.toLocaleString()}` : 'Check API'}
                  </span>
                </div>
              </div>

              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[13px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20 active:scale-95">
                Book Experience
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0A1629] rounded-[32px] p-8 text-white shadow-xl shadow-[#0A1629]/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Globe size={100} />
               </div>
               <Globe size={32} className="mb-6 text-orange-500" />
               <h4 className="text-xl font-black mb-3 tracking-tight">Global Inventory</h4>
               <p className="text-slate-400 text-[13px] font-medium leading-relaxed">
                 Access thousands of tours, attractions, and sightseeing experiences globally with real-time pricing and availability.
               </p>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
                <FileText size={20} className="text-orange-600" />
                Inclusions
              </h3>
              <div className="space-y-4">
                <PrepStep label="Professional Guide" />
                <PrepStep label="Hotel Pickup & Drop-off" />
                <PrepStep label="Skip-the-line Tickets" />
                <PrepStep label="Flexible Cancellation" />
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
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Search Tours & Experiences</h3>
          <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-2">Enter a destination city and date to explore available sightseeing activities and curated tours.</p>
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
