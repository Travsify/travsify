'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plane, 
  Hotel, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Loader2, 
  ArrowRight, 
  ChevronRight,
  Star,
  Globe,
  Clock,
  Car,
  ScrollText,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    // Using 127.0.0.1 instead of localhost/hostname to avoid IPv6/v4 mapping issues
    return `${protocol}//127.0.0.1:3001`;
  }
  return 'http://127.0.0.1:3001';
};

export default function DemoPage() {
  const API_URL = getApiUrl();
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'insurance' | 'transfers' | 'visa'>('flights');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    origin: 'LOS',
    destination: 'LHR',
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSearch = async () => {
    console.log('Targeting API URL:', API_URL);
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      let res;
      if (activeTab === 'flights') {
        const fullUrl = `${API_URL}/demo/flights/search`;
        console.log('Fetching from:', fullUrl);
        res = await fetch(fullUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...searchParams, adults: 1 }),
          signal: controller.signal
        });
      } else if (activeTab === 'hotels') {
        res = await fetch(`${API_URL}/demo/hotels/search?location=${searchParams.destination}`, { signal: controller.signal });
      } else if (activeTab === 'insurance') {
        res = await fetch(`${API_URL}/demo/insurance/quotes`, { signal: controller.signal });
      }

      clearTimeout(timeoutId);

      if (!res?.ok) {
        throw new Error(`Connection error: ${res?.statusText || 'Backend unreachable'}`);
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'The demo service is temporarily unavailable. Please ensure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check connectivity first
    const checkConn = async () => {
      try {
        const res = await fetch(`${API_URL}/demo/ping`);
        if (!res.ok) throw new Error('Service offline');
      } catch (err) {
        setError('Cannot connect to the demo server. Please ensure the backend is running at ' + API_URL);
      }
    };
    checkConn();
    // Initial load for WOW factor
    handleSearch();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="text-blue-600">Travs</span><span className="text-orange-600">ify.</span>
            <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-black border border-blue-100">Live Demo</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
            <TabButton active={activeTab === 'flights'} onClick={() => setActiveTab('flights')} icon={<Plane size={18} />} label="Flights" />
            <TabButton active={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} icon={<Hotel size={18} />} label="Hotels" />
            <TabButton active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} icon={<Car size={18} />} label="Transfers" />
            <TabButton active={activeTab === 'visa'} onClick={() => setActiveTab('visa')} icon={<ScrollText size={18} />} label="eVisa" />
            <TabButton active={activeTab === 'insurance'} onClick={() => setActiveTab('insurance')} icon={<ShieldCheck size={18} />} label="Insurance" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/register" className="text-[14px] font-bold bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all active:scale-[0.97] shadow-xl shadow-slate-900/20">
              Get API Keys
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── SEARCH HEADER ─── */}
      <header className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-50 to-[#f8fafc] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="max-w-3xl mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-blue-600/20">
              <Zap size={12} fill="currentColor" />
              Direct Connection to xml.agency
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              Experience the power of <br/>
              <span className="text-blue-600">Unified Travel API.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Interact with real-time flight data, verified hotel listings, and instant travel protection. Built for high-performance OTAs and global fintechs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-wrap lg:flex-nowrap items-center gap-4 animate-fade-up-delay-1">
            <SearchField 
              icon={<MapPin className="text-blue-500" size={20} />} 
              label="From" 
              value={searchParams.origin} 
              onChange={(v) => setSearchParams({...searchParams, origin: v.toUpperCase()})}
            />
            <div className="w-px h-10 bg-slate-100 hidden lg:block" />
            <SearchField 
              icon={<MapPin className="text-orange-500" size={20} />} 
              label="To" 
              value={searchParams.destination}
              onChange={(v) => setSearchParams({...searchParams, destination: v.toUpperCase()})}
            />
            <div className="w-px h-10 bg-slate-100 hidden lg:block" />
            <SearchField 
              icon={<Clock className="text-slate-400" size={20} />} 
              label="Departure" 
              type="date"
              value={searchParams.departureDate}
              onChange={(v) => setSearchParams({...searchParams, departureDate: v})}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full lg:w-auto h-16 px-10 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Explore Deals'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── RESULTS ─── */}
      <main className="max-w-[1200px] mx-auto px-6 py-20 min-h-[600px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6 animate-fade-up">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Plane className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-slate-900 mb-2">Polling Global Inventory</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Establishing secure connection to SNMF agency...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 animate-shake">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-600">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Search Failed</h3>
            <p className="text-slate-500 font-medium max-w-md text-center mb-8">{error}</p>
            <button 
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Retry Search
            </button>
          </div>
        ) : results ? (
          <div className="space-y-12 animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Sparkles className="text-orange-500" />
                Live Results for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{results?.offers?.length || results?.length || 0} Options Found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === 'flights' && results.offers?.map((offer: any, idx: number) => (
                <FlightCard key={idx} offer={offer} />
              ))}
              {activeTab === 'hotels' && results.map((hotel: any) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
              {activeTab === 'insurance' && results.map((quote: any) => (
                <InsuranceCard key={quote.id} quote={quote} />
              ))}
              {['transfers', 'visa'].includes(activeTab) && (
                <div className="col-span-full py-32 bg-white rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Globe size={40} className="text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} API Coming Soon</h3>
                  <p className="text-slate-500 font-medium max-w-md">Our engineering team is finalizing the direct integration for this vertical. Stay tuned for the update.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center opacity-50">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Select criteria to start demo</p>
          </div>
        )}
      </main>

      {/* ─── FOOTER CTA ─── */}
      <section className="bg-slate-900 py-32 px-6 rounded-t-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to Build?</h2>
          <p className="text-slate-400 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop worrying about complex GDS/NDC handshakes. Plug into our unified API and focus on building your brand.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/register" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.97]">
              Create Developer Account
            </Link>
            <Link href="/dashboard/docs" className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-lg border border-white/10 hover:bg-white/20 transition-all">
              Read API Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${active ? 'bg-white text-blue-600 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function SearchField({ icon, label, value, onChange, type = "text" }: any) {
  return (
    <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all group">
      <div className="shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none p-0 text-sm font-black focus:ring-0 placeholder-slate-300"
          placeholder={`Enter ${label}...`}
        />
      </div>
    </div>
  );
}

function FlightCard({ offer }: any) {
  const flight = offer.flights[0];
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="text-blue-600" />
      </div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
          {flight.airline.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Airline</p>
          <p className="text-sm font-black text-slate-900">{flight.airline}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{flight.departure}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Departure</p>
        </div>
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="w-full h-px bg-slate-100 relative">
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 bg-white px-1" size={16} />
          </div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3">Economy</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-900 tracking-tight">{flight.arrival}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Arrival</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price / Person</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">
            {offer.currency === 'NGN' ? '₦' : '$'}{offer.totalPrice.toLocaleString()}
          </p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-blue-600 transition-all">Book Now</button>
      </div>
    </div>
  );
}

function HotelCard({ hotel }: any) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group">
      <div className="relative h-64">
        <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={hotel.name} />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
          <Star size={14} className="fill-orange-500 text-orange-500" />
          <span className="text-xs font-black">{hotel.rating}</span>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-black text-slate-900 mb-2">{hotel.name}</h3>
        <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-6">
          <MapPin size={14} />
          {hotel.location}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {hotel.amenities.map((a: any, i: number) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-100">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting from</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">${hotel.price}/night</p>
          </div>
          <button className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InsuranceCard({ quote }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative z-10">
        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8">
          <ShieldCheck size={28} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{quote.plan}</h3>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Coverage up to {quote.coverage}</p>
        <div className="space-y-4 mb-10">
          {['Instant Issuance', 'Global Coverage', '24/7 Support'].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-600">{f}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Premium / Trip</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">${quote.price}</p>
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-orange-600 transition-all">Get Policy</button>
        </div>
      </div>
    </div>
  );
}
