'use client';

import { useState } from 'react';
import { Search, Plane, Hotel, Car, Globe, ShieldCheck, Loader2, MapPin, Calendar, Clock, Star, Map } from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';

export default function TerminalPage() {
  const apiKey = useApiKey();
  const [tab, setTab] = useState('flights');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    try {
      const endpoint = tab === 'flights' ? 'flights' : tab === 'hotels' ? 'hotels' : 'visa';
      const body = tab === 'flights' ? { origin: query.toUpperCase(), destination: 'LHR', departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], adults: 1 } : {};
      const searchParams = tab === 'hotels' ? `?city=${query}` : tab === 'visas' ? `?nationality=NG&destination=${query}` : '';
      
      const res = await fetch(`${API_URL}/api/v1/search/${endpoint}${searchParams}`, {
        method: tab === 'flights' ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' },
        ...(tab === 'flights' ? { body: JSON.stringify(body) } : {})
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Terminal</h1>
        <p className="text-sm text-slate-400 font-medium">Unified search interface for all travel verticals.</p>
      </div>

      {/* Terminal Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {[
          { id: 'flights', icon: <Plane size={18} />, label: 'Flights' },
          { id: 'hotels', icon: <Hotel size={18} />, label: 'Hotels' },
          { id: 'transfers', icon: <Car size={18} />, label: 'Transfers' },
          { id: 'visas', icon: <Globe size={18} />, label: 'e-Visas' },
          { id: 'insurance', icon: <ShieldCheck size={18} />, label: 'Insurance' }
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
              tab === t.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-[#0A1629] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
          <Globe size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Global Search</p>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder={tab === 'flights' ? 'Airport code (e.g. LOS)' : 'City or Country name'} 
                className="w-full pl-16 pr-6 py-5 bg-white rounded-2xl text-slate-900 font-bold outline-none focus:ring-4 focus:ring-orange-600/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-orange-700 transition-all active:scale-95 shadow-xl shadow-orange-600/30 flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Fetching...' : 'Query Inventory'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {results.map((res, i) => (
          <div key={i} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <div className="relative h-56 bg-slate-100 overflow-hidden">
              <img 
                src={res.image || `https://images.unsplash.com/photo-${1506744038136 + i}-46273834b3fb?auto=format&fit=crop&q=80&w=600&h=400`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt="Result"
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
                {res.provider ? 'DIRECT CONNECT' : 'DIRECT CONNECT'}
              </div>
              {res.price && (
                <div className="absolute bottom-6 right-6 px-5 py-3 bg-orange-600 text-white rounded-2xl text-xl font-black shadow-xl shadow-orange-600/20">
                  ₦{res.price.toLocaleString()}
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Verified</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> Instantly Ticketable</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-6 truncate leading-tight">{res.name || res.airline || res.destination || 'Inventory Result'}</h4>
              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg">
                  Confirm Booking
                </button>
                <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
                  <Star size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && (
          <div className="lg:col-span-3 py-32 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Search size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Global Inventory Hub</h3>
            <p className="text-sm text-slate-400 font-medium">Select a service and search across our global provider network.</p>
          </div>
        )}
      </div>
    </div>
  );
}
