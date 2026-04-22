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
  Clock
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';

export default function HotelsPage() {
  const apiKey = useApiKey();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [search, setSearch] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });

  const handleSearch = async () => {
    if (!search.city) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/search/hotels?city=${encodeURIComponent(search.city)}`, {
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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hotels (LiteAPI)</h1>
        <p className="text-sm text-slate-400 font-medium">Property management and live rate tracking via LiteAPI.</p>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="City or Airport code" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20"
                value={search.city}
                onChange={(e) => setSearch({...search, city: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-600"
                value={search.checkIn}
                onChange={(e) => setSearch({...search, checkIn: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-600"
                value={search.checkOut}
                onChange={(e) => setSearch({...search, checkOut: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-[0.5] space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Guests</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="number" 
                min="1"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-600"
                value={search.guests}
                onChange={(e) => setSearch({...search, guests: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex-[0.5] space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rooms</label>
            <div className="relative">
              <Hotel className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="number" 
                min="1"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-600"
                value={search.rooms}
                onChange={(e) => setSearch({...search, rooms: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-orange-600 text-white px-12 py-4 rounded-xl font-black text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Searching LiteAPI...' : 'Search Inventory'}
          </button>
        </div>
      </div>

      {/* Hotel Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {hotels.map((hotel, i) => (
          <div key={i} className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 shadow-sm flex flex-col">
            <div className="relative h-64 shrink-0">
              <img src={hotel.image || `https://images.unsplash.com/photo-${1506744038136 + i}-46273834b3fb?auto=format&fit=crop&q=80&w=1000`} alt={hotel.name || 'Hotel'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl flex items-center gap-1 shadow-lg">
                <Star size={14} className="text-orange-500 fill-orange-500" />
                <span className="text-xs font-black text-slate-900">{hotel.rating || (4 + Math.random()).toFixed(1)}</span>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                LiteAPI
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white/90 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} />
                  {hotel.location || hotel.destination || search.city || 'City Center'}
                </p>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-xl font-black text-slate-900 mb-4 truncate">{hotel.name || 'Premium Hotel Property'}</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <Wifi size={18} className="text-slate-300" />
                <Waves size={18} className="text-slate-300" />
                <Coffee size={18} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto flex items-center gap-1">
                  <Clock size={10} /> Live Rate
                </span>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rate</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">₦{(hotel.price || 185000).toLocaleString()}</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20 active:scale-95">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && hotels.length === 0 && (
          <div className="lg:col-span-3 py-24 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Hotel size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Search LiteAPI Inventory</h3>
            <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-2">Enter a city to fetch live availability and rates across 1.2M+ global properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}
