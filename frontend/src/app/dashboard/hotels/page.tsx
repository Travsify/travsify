'use client';

import { useState } from 'react';
import { 
  Hotel, 
  Search, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Wifi,
  Coffee,
  Waves,
  Loader2,
  Clock,
  ChevronRight,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';

export default function HotelsPage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [search, setSearch] = useState({
    city: 'Lagos',
    checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    guests: 2,
    rooms: 1
  });

  const handleSearch = async () => {
    if (!search.city || !search.checkIn || !search.checkOut) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        city: search.city,
        checkin: search.checkIn,
        checkout: search.checkOut,
        adults: search.guests.toString(),
        currency: currency || 'USD'
      });
      
      const res = await fetch(`${API_URL}/api/v1/search/hotels?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' }
      });
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Hotel size={24} className="text-[#FF6B00]" />
            </div>
            Hotels
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2">Access to 1.2M+ properties with live rates and instant booking.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-orange-50 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> Live {currency} Rates
          </span>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-8 relative group overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-orange-50 transition-colors duration-1000 -z-10" />
        
        <div className="flex flex-col md:flex-row gap-6 items-end relative z-10">
          <div className="flex-1 space-y-3 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="City or Airport code" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 uppercase"
                value={search.city}
                onChange={(e) => setSearch({...search, city: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-1 space-y-3 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 cursor-pointer"
                value={search.checkIn}
                onChange={(e) => setSearch({...search, checkIn: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-1 space-y-3 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 cursor-pointer"
                value={search.checkOut}
                onChange={(e) => setSearch({...search, checkOut: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-[0.5] space-y-3 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Guests</label>
            <div className="relative">
              <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="number" 
                min="1"
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
                value={search.guests}
                onChange={(e) => setSearch({...search, guests: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-8 border-t border-slate-100 relative z-10">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#0A1629] text-white px-16 py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-blue-900/30 hover:bg-[#FF6B00] hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center gap-4 w-full md:w-auto justify-center group"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} className="group-hover:rotate-12 transition-transform" />}
            {loading ? 'Analyzing Live Inventory...' : 'Search Inventory'}
          </button>
        </div>
      </div>

      {/* Hotel Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {hotels.map((hotel, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedHotel(hotel)}
            className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 shadow-xl flex flex-col relative cursor-pointer"
          >
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${i % 2 === 0 ? 'bg-[#0A1629]' : 'bg-[#FF6B00]'}`} />
            
            <div className="relative h-72 shrink-0 overflow-hidden">
              <img src={hotel.image || `https://images.unsplash.com/photo-${1506744038136 + i}-46273834b3fb?auto=format&fit=crop&q=80&w=1000`} alt={hotel.name || 'Hotel'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-6 right-6 px-4 py-2 bg-white rounded-2xl flex items-center gap-1.5 shadow-xl">
                <Star size={16} className="text-[#FF6B00] fill-[#FF6B00]" />
                <span className="text-sm font-black text-slate-900">{hotel.rating || (4 + Math.random()).toFixed(1)}</span>
              </div>
              <div className="absolute top-6 left-6 px-4 py-2 bg-[#0A1629] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> Direct Rates
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-[#FF6B00]" />
                  {hotel.location || hotel.destination || search.city || 'Global Destination'}
                </p>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-black text-slate-900 mb-6 truncate leading-tight tracking-tight">{hotel.name || 'Premium Property'}</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <Wifi size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Free Wifi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-orange-600 transition-colors">
                  <Waves size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Pool</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <Coffee size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Breakfast</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-slate-900">{currency === 'USD' ? '$' : '₦'}</span>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{(hotel.price?.totalAmount || 0).toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/dashboard/hotels/checkout?id=${hotel.id}&price=${hotel.price?.totalAmount}&currency=${currency}`;
                  }}
                  className="px-8 py-4 rounded-2xl bg-[#0A1629] text-white font-black text-[11px] uppercase tracking-widest hover:bg-[#FF6B00] transition-all shadow-xl hover:shadow-orange-600/20 active:scale-95 group/btn"
                >
                  Book Now <ChevronRight size={14} className="inline-block ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && hotels.length === 0 && (
          <div className="lg:col-span-3 py-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 group hover:scale-110 transition-transform duration-700">
                <Hotel size={56} className="text-slate-200 group-hover:text-[#FF6B00] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Luxury Accommodations</h3>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-4 leading-relaxed px-6">
                Enter a city to fetch live availability and dynamic {currency} rates across 1.2M+ global properties.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0A1629]/90 backdrop-blur-sm" onClick={() => setSelectedHotel(null)} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <Hotel size={28} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedHotel.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} className="text-[#FF6B00]" /> {selectedHotel.location || selectedHotel.destination}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHotel(null)}
                className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Hero Image & Quick Info */}
              <div className="relative h-[400px] w-full">
                <img src={selectedHotel.image || `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600`} className="w-full h-full object-cover" alt="Hotel Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex flex-wrap gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white flex items-center gap-3">
                    <Star size={18} className="text-[#FF6B00] fill-[#FF6B00]" />
                    <span className="text-lg font-black">{selectedHotel.rating || '4.8'} / 5.0</span>
                  </div>
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span className="text-sm font-black uppercase tracking-widest">Travsify Verified Property</span>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  {/* Amenities */}
                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Zap size={20} className="text-[#FF6B00]" />
                      Premium Amenities
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { icon: <Wifi size={20} />, label: 'Ultra-Fast WiFi' },
                        { icon: <Waves size={20} />, label: 'Outdoor Pool' },
                        { icon: <Coffee size={20} />, label: 'Gourmet Breakfast' },
                        { icon: <Clock size={20} />, label: '24/7 Room Service' },
                        { icon: <ShieldCheck size={20} />, label: 'Secure Parking' },
                        { icon: <Users size={20} />, label: 'Business Hub' },
                        { icon: <CheckCircle2 size={20} />, label: 'Fitness Center' },
                        { icon: <Info size={20} />, label: 'Concierge Service' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center gap-3 group hover:bg-[#0A1629] hover:text-white transition-all duration-300">
                          <div className="text-[#FF6B00] group-hover:text-white transition-colors">{item.icon}</div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Room Info Placeholder */}
                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Users size={20} className="text-blue-600" />
                      Available Room Types
                    </h4>
                    <div className="space-y-4">
                      <div className="p-6 bg-white border border-slate-200 rounded-3xl flex items-center justify-between group hover:border-blue-500/20 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Room" />
                          </div>
                          <div>
                            <h5 className="font-black text-slate-900">Deluxe Executive Room</h5>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">1 King Bed • 2 Guests • 45sqm</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Price per night</p>
                          <p className="text-xl font-black text-slate-900">{currency === 'USD' ? '$' : '₦'}{((selectedHotel.price?.totalAmount || 0) * 0.4).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Sidebar Booking Card */}
                <div className="space-y-8">
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                      <ShieldCheck size={120} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Stay Price</p>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-xl font-black text-[#FF6B00]">{currency === 'USD' ? '$' : '₦'}</span>
                      <span className="text-5xl font-black tracking-tighter">{(selectedHotel.price?.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-white/5 pb-2">
                        <span>Check-in</span>
                        <span className="text-white">{search.checkIn || 'TBD'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-white/5 pb-2">
                        <span>Check-out</span>
                        <span className="text-white">{search.checkOut || 'TBD'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Guests</span>
                        <span className="text-white">{search.guests} Adults</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => window.location.href = `/dashboard/hotels/checkout?id=${selectedHotel.id}&price=${selectedHotel.price?.totalAmount}&currency=${currency}`}
                      className="w-full py-5 bg-[#FF6B00] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-600/30"
                    >
                      Instant Booking
                    </button>
                    <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-6">Secure Checkout by Travsify Settle</p>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                    <h5 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Info size={16} className="text-[#FF6B00]" />
                      Booking Policy
                    </h5>
                    <ul className="space-y-3">
                      <li className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">• FREE CANCELLATION UNTIL 24H BEFORE</li>
                      <li className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">• NO PREPAYMENT REQUIRED AT PROPERTY</li>
                      <li className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">• ID VERIFICATION MANDATORY AT CHECK-IN</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
