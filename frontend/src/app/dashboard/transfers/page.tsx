'use client';

import { useState } from 'react';
import { 
  Car, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  Loader2, 
  ShieldCheck,
  Zap,
  Navigation
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';

export default function TransfersPage() {
  const apiKey = useApiKey();
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [search, setSearch] = useState({
    pickup: '',
    dropoff: '',
    time: ''
  });

  const handleSearch = async () => {
    if (!search.pickup || !search.dropoff) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/search/transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' },
        body: JSON.stringify(search)
      });
      const data = await res.json();
      setTransfers(Array.isArray(data) ? data : []);
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transfers (Mozio)</h1>
          <p className="text-sm text-slate-400 font-medium">Airport pickups and car rental logistics via Mozio API.</p>
        </div>
        <div className="flex bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 items-center gap-2">
          <Zap size={14} className="fill-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-tight">Instant Confirmation</span>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Airport or Address" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" 
                value={search.pickup}
                onChange={(e) => setSearch({...search, pickup: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Drop-off Point</label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Hotel or Address" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" 
                value={search.dropoff}
                onChange={(e) => setSearch({...search, dropoff: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="datetime-local" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-600" 
                value={search.time}
                onChange={(e) => setSearch({...search, time: e.target.value})}
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
              {loading ? 'Searching Mozio...' : 'Check Availability'}
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Options */}
      <div className="space-y-6">
        {transfers.map((ride, i) => (
          <div key={i} className="group bg-white rounded-[32px] border border-slate-200 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                <img src={ride.image || `https://images.unsplash.com/photo-${1549317661 + i}-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000`} alt={ride.type || 'Vehicle'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="w-full text-center md:text-left">
                <h3 className="text-xl font-black text-slate-900 mb-2">{ride.type || 'Standard Sedan'}</h3>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded">Provided by Mozio</span>
                </div>
                <div className="flex justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                    <Users size={16} className="text-orange-600" />
                    {ride.capacity || '3 Passengers'}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                    <Briefcase size={16} className="text-orange-600" />
                    {ride.luggage || '2 Bags'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
              <div className="flex justify-between w-full md:w-auto md:gap-8">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Price</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">₦{(ride.price || 45000).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</p>
                  <p className="text-[13px] font-black text-emerald-600 mt-2 flex items-center justify-end gap-1"><Clock size={12} /> {ride.eta || '8 mins'} away</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20 active:scale-95 shrink-0">
                Book Ride
              </button>
            </div>
          </div>
        ))}

        {!loading && transfers.length === 0 && (
          <div className="py-24 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Car size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Search Mozio Transfers</h3>
            <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-2">Enter your pickup and drop-off locations to fetch live vehicle availability and pricing.</p>
          </div>
        )}
      </div>

      <div className="bg-[#0A1629] rounded-[32px] p-8 text-white flex items-center gap-6 shadow-xl shadow-[#0A1629]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck size={100} />
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 shadow-sm shrink-0 border border-white/10">
          <ShieldCheck size={32} />
        </div>
        <div className="relative z-10">
          <h4 className="text-lg font-black text-white mb-2 tracking-tight">Bank-grade Security</h4>
          <p className="text-sm text-slate-400 font-medium">All rides are insured and monitored in real-time for passenger safety via the Mozio platform.</p>
        </div>
      </div>
    </div>
  );
}
