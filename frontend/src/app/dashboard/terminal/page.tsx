'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plane, 
  Hotel, 
  Car, 
  Globe, 
  ShieldCheck, 
  Loader2, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Sparkles, 
  Zap, 
  ChevronRight,
  ArrowRight,
  RefreshCcw,
  LayoutGrid,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';

type Vertical = 'flights' | 'hotels' | 'transfers' | 'visa' | 'insurance';

export default function TerminalPage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [tab, setTab] = useState<Vertical>('flights');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState('LHR');
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState({ providers: 12, uptime: '99.98%', latency: '240ms' });

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    try {
      const endpoint = tab === 'flights' ? 'flights' : tab === 'hotels' ? 'hotels' : 'visa';
      const body = tab === 'flights' ? { 
        origin: query.toUpperCase(), 
        destination: destination.toUpperCase(), 
        departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
        adults: 1 
      } : {};
      
      const searchParams = tab === 'hotels' ? `?city=${query}&currency=${currency}` : tab === 'visa' ? `?nationality=NG&destination=${query}` : '';
      
      const res = await fetch(`${API_URL}/api/v1/search/${endpoint}${searchParams}`, {
        method: tab === 'flights' ? 'POST' : 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': apiKey || '' 
        },
        ...(tab === 'flights' ? { body: JSON.stringify(body) } : {})
      });
      
      const data = await res.json();
      const resultsArray = Array.isArray(data) ? data : data.offers ? data.offers : [data];
      setResults(resultsArray);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40">
      {/* ─── ELITE HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full animate-pulse shadow-[0_0_12px_#FF6B00]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Node_Global_Distribution_Terminal</span>
          </div>
          <h1 className="text-6xl font-black text-[#0A1629] tracking-tighter leading-none">Global Terminal<span className="text-[#FF6B00]">.</span></h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">Unified distribution interface for high-velocity travel inventory orchestration across our global provider network.</p>
        </div>
        
        <div className="flex items-center gap-8 bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/60 shadow-2xl shadow-slate-200/20 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Network Latency</span>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-emerald-500 group-hover:scale-110 transition-transform">{stats.latency}</span>
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </div>
          </div>
          <div className="w-px h-12 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Connected Nodes</span>
            <span className="text-2xl font-black text-[#0A1629] tracking-tighter">{stats.providers} ADAPTERS</span>
          </div>
        </div>
      </div>

      {/* ─── TERMINAL TABS ─── */}
      <div className="flex bg-slate-200/40 backdrop-blur-md p-2 rounded-[28px] border border-slate-200/60 w-fit">
        {[
          { id: 'flights', icon: <Plane size={20} />, label: 'FLIGHTS' },
          { id: 'hotels', icon: <Hotel size={20} />, label: 'HOTELS' },
          { id: 'transfers', icon: <Car size={20} />, label: 'TRANSFERS' },
          { id: 'visa', icon: <Globe size={20} />, label: 'E-VISAS' },
          { id: 'insurance', icon: <ShieldCheck size={20} />, label: 'INSURANCE' }
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id as Vertical)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[22px] text-[11px] font-black tracking-[0.2em] transition-all duration-300 relative ${
              tab === t.id ? 'bg-[#0A1629] text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-[#0A1629] hover:bg-white/50'
            }`}
          >
            <span className={`${tab === t.id ? 'text-[#FF6B00]' : 'text-slate-400'}`}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── SEARCH CONSOLE (ELITE) ─── */}
      <div className="bg-[#0A1629] p-16 rounded-[60px] text-white shadow-[0_50px_100px_-20px_rgba(10,22,41,0.5)] relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF6B00]/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-end">
          <div className="space-y-4 lg:col-span-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
              <MapPin size={12} className="text-[#FF6B00]" /> {tab === 'flights' ? 'Departure Node' : 'Operational Locale'}
            </p>
            <div className="relative group/input">
              <input 
                type="text" 
                placeholder={tab === 'flights' ? 'Origin Code' : 'Target City/Country'} 
                className="w-full pl-8 pr-8 py-6 bg-white/5 border border-white/10 rounded-[28px] text-white font-black text-lg placeholder:text-slate-700 outline-none focus:bg-white/10 focus:border-[#FF6B00]/50 transition-all uppercase tracking-widest"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {tab === 'flights' && (
            <div className="space-y-4 lg:col-span-1">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                <MapPin size={12} className="text-blue-500" /> Arrival Terminal
              </p>
              <div className="relative group/input">
                <input 
                  type="text" 
                  placeholder="Target Code" 
                  className="w-full pl-8 pr-8 py-6 bg-white/5 border border-white/10 rounded-[28px] text-white font-black text-lg placeholder:text-slate-700 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all uppercase tracking-widest"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={`space-y-4 ${tab === 'flights' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
              <Calendar size={12} className="text-[#FF6B00]" /> Operational Schedule
            </p>
            <div className="w-full pl-8 pr-8 py-6 bg-white/5 border border-white/10 rounded-[28px] text-white/40 font-black text-sm uppercase tracking-[0.2em]">
               System Auto-Optimized Date
            </div>
          </div>

          <div className="lg:col-span-1 flex gap-4">
             <button 
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-[#FF6B00] text-white h-[84px] rounded-[32px] font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-600 transition-all active:scale-95 shadow-2xl shadow-orange-600/30 flex items-center justify-center gap-4 disabled:opacity-50 group/btn"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} className="group-hover:scale-125 transition-transform" />}
              {loading ? 'POLLING...' : 'EXECUTE'}
            </button>
            <button className="w-[84px] h-[84px] bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
              <Filter size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── RESULTS FEED ─── */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
               <LayoutGrid size={18} />
             </div>
             <div>
               <h3 className="text-lg font-black text-[#0A1629]">Available Inventory</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Affiliate Consumption</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sort by:</span>
            <select className="bg-transparent text-[11px] font-black text-slate-900 uppercase tracking-widest outline-none cursor-pointer">
              <option>Price: Low to High</option>
              <option>Provider Rank</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {results.map((res, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden"
              >
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <img 
                    src={res.image || `https://images.unsplash.com/photo-${1506744038136 + i}-46273834b3fb?auto=format&fit=crop&q=80&w=800&h=600`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt="Inventory"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white/50">
                    <Sparkles size={10} className="inline text-[#FF6B00] mr-2" fill="currentColor" />
                    Direct Connect
                  </div>
                  {res.price && (
                    <div className="absolute bottom-6 right-6 px-5 py-3 bg-[#0A1629]/90 backdrop-blur-md text-white rounded-2xl text-xl font-black shadow-xl border border-white/10">
                      {currency === 'USD' ? '$' : '₦'}{(res.price.totalAmount || res.price).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 flex items-center gap-1.5">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Instantly Ticketable</span>
                  </div>
                  
                  <h4 className="text-xl font-black text-slate-900 mb-8 leading-tight line-clamp-1">
                    {res.name || res.airline || res.destination || 'Inventory Result'}
                  </h4>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-[#0A1629] text-white rounded-[18px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#FF6B00] transition-all shadow-xl shadow-blue-900/10 active:scale-95">
                      Confirm Order
                    </button>
                    <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[18px] flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
                      <Star size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && results.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3 py-40 text-center bg-slate-50/30 rounded-[60px] border-2 border-dashed border-slate-200/60 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-200/50">
                  <Search size={32} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Inventory Hub</h3>
                <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto mt-4 leading-relaxed">
                  Initiate a query to fetch real-time availability across our global provider network.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
