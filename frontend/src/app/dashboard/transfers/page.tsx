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
  Navigation,
  ChevronRight,
  X,
  CheckCircle2,
  Info
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';

export default function TransfersPage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
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
        body: JSON.stringify({
          ...search,
          currency: currency
        })
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Car size={24} className="text-[#FF6B00]" />
            </div>
            Transfers
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2">Airport pickups and car rental logistics via Mozio API.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 flex items-center gap-2">
            <Zap size={14} className="fill-emerald-600 animate-pulse" /> Instant Confirmation
          </span>
          <span className="px-4 py-2 bg-orange-50 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> {currency} Pricing
          </span>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 group-hover:bg-blue-50 transition-colors duration-1000 -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Airport or Address" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50" 
                value={search.pickup}
                onChange={(e) => setSearch({...search, pickup: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Drop-off Point</label>
            <div className="relative">
              <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Hotel or Address" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50" 
                value={search.dropoff}
                onChange={(e) => setSearch({...search, dropoff: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Time</label>
            <div className="relative">
              <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="datetime-local" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 text-slate-600 cursor-pointer" 
                value={search.time}
                onChange={(e) => setSearch({...search, time: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-5 bg-[#0A1629] text-white rounded-2xl font-black text-sm hover:bg-[#FF6B00] transition-all duration-500 shadow-2xl shadow-blue-900/30 text-center active:scale-95 flex items-center justify-center gap-3 group/btn"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} className="group-hover/btn:rotate-12 transition-transform" />}
              {loading ? 'Searching Mozio...' : 'Check Availability'}
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Options */}
      <div className="space-y-8 pb-20">
        {transfers.map((ride, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedRide(ride)}
            className="group bg-white rounded-[40px] border border-slate-200 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 shadow-xl relative overflow-hidden cursor-pointer"
          >
             {/* Side Accent */}
             <div className={`absolute left-0 top-0 bottom-0 w-2 ${i % 2 === 0 ? 'bg-[#0A1629]' : 'bg-[#FF6B00]'}`} />
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-64 h-44 rounded-3xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 relative group-hover:border-blue-100 transition-colors">
                <img src={ride.image || `https://images.unsplash.com/photo-${1549317661 + i}-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000`} alt={ride.type || 'Vehicle'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-full text-center md:text-left space-y-4">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{ride.type || 'Standard Executive'}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Provided by Mozio Direct Connect</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-xs font-black text-slate-600 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <Users size={16} className="text-[#FF6B00]" />
                    {ride.capacity || '4 Passengers'}
                  </div>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-xs font-black text-slate-600 border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                    <Briefcase size={16} className="text-[#FF6B00]" />
                    {ride.luggage || '2 Large Bags'}
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 text-xs font-black text-emerald-600 border border-emerald-100">
                    <Zap size={16} className="fill-emerald-600" />
                    Instant Confirmation
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-12" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between w-full md:w-auto md:gap-12">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fixed Price</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-sm font-black text-slate-900">{currency === 'USD' ? '$' : '₦'}</span>
                     <p className="text-4xl font-black text-slate-900 tracking-tighter">{(ride.price || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ETA Availability</p>
                  <p className="text-[13px] font-black text-[#FF6B00] mt-1 flex items-center justify-end gap-2 group-hover:scale-110 transition-transform origin-right">
                    <Clock size={14} className="animate-pulse" /> {ride.eta || '12 mins'} away
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/dashboard/transfers/checkout?id=${ride.id}&price=${ride.price}&currency=${currency}`;
                }}
                className="w-full md:w-auto px-12 py-5 bg-[#0A1629] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF6B00] transition-all duration-500 shadow-2xl hover:shadow-orange-600/30 active:scale-95 shrink-0 group/btn"
              >
                Book Now <ChevronRight size={14} className="inline-block ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {!loading && transfers.length === 0 && (
          <div className="py-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50/50 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 group hover:scale-110 transition-transform duration-700">
                <Car size={56} className="text-slate-200 group-hover:text-[#FF6B00] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Luxury Ground Transport</h3>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-4 leading-relaxed px-6">
                Enter your pickup and drop-off locations to fetch live vehicle availability and dynamic {currency} pricing via Mozio.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ride Details Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0A1629]/90 backdrop-blur-sm" onClick={() => setSelectedRide(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <Car size={28} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedRide.type || 'Standard Executive'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mozio Direct Connect Partner</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRide(null)}
                className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-10 bg-slate-50/50 border-r border-slate-100">
                  <div className="rounded-[40px] overflow-hidden bg-white shadow-xl border border-slate-100 mb-10 aspect-video">
                    <img src={selectedRide.image || `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000`} className="w-full h-full object-cover" alt="Vehicle" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3">
                      <Users size={24} className="text-blue-500" />
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                        <p className="text-sm font-black text-slate-900">{selectedRide.capacity || '4 Passengers'}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3">
                      <Briefcase size={24} className="text-orange-500" />
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Luggage</p>
                        <p className="text-sm font-black text-slate-900">{selectedRide.luggage || '2 Large Bags'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-10">
                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <MapPin size={20} className="text-[#FF6B00]" />
                      Meeting Instructions
                    </h4>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-wide">
                         {selectedRide.meetingInfo || 'Meet & Greet service included. The driver will be waiting in the arrival hall holding a sign with your name. Contact details will be provided 2 hours before pickup.'}
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Info size={20} className="text-blue-600" />
                      Wait Time & Policy
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Airport Wait Time</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">60 minutes free wait time included for airport pickups from flight arrival.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Address Wait Time</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">15 minutes free wait time included for hotel or address pickups.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fixed Fare:</span>
                      <span className="text-sm font-black text-[#FF6B00]">{currency === 'USD' ? '$' : '₦'}</span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{(selectedRide.price || 0).toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/dashboard/transfers/checkout?id=${selectedRide.id}&price=${selectedRide.price}&currency=${currency}`}
                      className="w-full py-5 bg-[#0A1629] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FF6B00] shadow-xl hover:shadow-orange-600/30 transition-all active:scale-95"
                    >
                      Confirm Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0A1629] rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
          <ShieldCheck size={200} />
        </div>
        <div className="w-20 h-20 rounded-3xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shadow-sm shrink-0 border border-[#FF6B00]/20 group-hover:scale-110 transition-transform duration-700">
          <ShieldCheck size={40} />
        </div>
        <div className="relative z-10 text-center md:text-left flex-1">
          <h4 className="text-2xl font-black text-white mb-3 tracking-tight">Global Logistics Shield</h4>
          <p className="text-slate-400 font-medium leading-relaxed">
            All rides are comprehensively insured and monitored in real-time for passenger safety via our Mozio integration. 24/7 support available for all active transfers.
          </p>
        </div>
        <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-95">
           Learn More
        </button>
      </div>
    </div>
  );
}
