'use client';

import { useState, useEffect } from 'react';
import { Plane, Search, Filter, Calendar, MapPin, Loader2, ArrowUpRight, Clock, ShieldCheck, Database } from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function FlightsPage() {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [search, setSearch] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  const handleSearch = async () => {
    if (!search.origin || !search.destination) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/demo/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: search.origin.toUpperCase(),
          destination: search.destination.toUpperCase(),
          departureDate: search.date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
          adults: 1
        })
      });
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Flights (NDC)</h1>
        <p className="text-sm text-slate-400 font-medium">Manage SML/Aviation bookings and real-time inventory.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Origin</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="LOS" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20"
              value={search.origin}
              onChange={(e) => setSearch({...search, origin: e.target.value})}
            />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="LHR" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20"
              value={search.destination}
              onChange={(e) => setSearch({...search, destination: e.target.value})}
            />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="date" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20"
              value={search.date}
              onChange={(e) => setSearch({...search, date: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-orange-600 text-white px-10 py-3.5 rounded-xl font-black text-sm shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          Search
        </button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-6">
        {flights.map((flight, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8 flex-1">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Plane size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">{flight.airline || 'SML NDC'}</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Live Rate</span>
                </div>
                <div className="flex items-center gap-10">
                  <div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">10:45</p>
                    <p className="text-sm font-black text-slate-400">{flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || search.origin || 'LOS'}</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-black text-slate-300 uppercase">Non-stop</div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">18:20</p>
                    <p className="text-sm font-black text-slate-400">{flight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode || search.destination || 'LHR'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900 tracking-tight">₦{(flight.price?.total || 1240000).toLocaleString()}</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Available</p>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20">
                Confirm Booking
              </button>
            </div>
          </div>
        ))}

        {!loading && flights.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Plane size={32} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Search for flights</h3>
            <p className="text-sm text-slate-400 font-medium">Enter your origin and destination to fetch live NDC rates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
