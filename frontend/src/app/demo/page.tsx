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
  CheckCircle2,
  AlertCircle,
  Clock3,
  ExternalLink
} from 'lucide-react';

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    return `${protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
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
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      let url = '';
      let method = 'GET';
      let body = null;

      switch(activeTab) {
        case 'flights':
          url = `${API_URL}/demo/flights/search`;
          method = 'POST';
          body = JSON.stringify({ ...searchParams, adults: 1 });
          break;
        case 'hotels':
          url = `${API_URL}/demo/hotels/search?city=${searchParams.destination}`;
          break;
        case 'insurance':
          url = `${API_URL}/demo/insurance/quotes`;
          break;
        case 'transfers':
          url = `${API_URL}/demo/transfers/search`;
          method = 'POST';
          body = JSON.stringify({ pickupAddress: searchParams.origin, dropoffAddress: searchParams.destination });
          break;
        case 'visa':
          url = `${API_URL}/demo/visa/requirements?nationality=NG&destination=${searchParams.destination}`;
          break;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'Service temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <Link href="/register" className="text-[13px] font-black bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Get API Keys
          </Link>
        </div>
      </nav>

      {/* ─── HEADER ─── */}
      <header className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-50 to-[#f8fafc]">
        <div className="max-w-[1200px] mx-auto text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-blue-600/20">
            <Zap size={12} fill="currentColor" />
            Powered by Unified Travel Infrastructure
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">Unified Travel Demo.</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Test our global adapters for flights, hotels, visa, and logistics in one single dashboard.
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto bg-white p-4 rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-wrap lg:flex-nowrap items-center gap-4 animate-fade-up">
          <SearchField icon={<MapPin className="text-blue-500" size={20} />} label="From" value={searchParams.origin} onChange={(v) => setSearchParams({...searchParams, origin: v.toUpperCase()})} />
          <SearchField icon={<MapPin className="text-orange-500" size={20} />} label="To" value={searchParams.destination} onChange={(v) => setSearchParams({...searchParams, destination: v.toUpperCase()})} />
          <button onClick={handleSearch} disabled={loading} className="w-full lg:w-auto h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Search
          </button>
        </div>
      </header>

      {/* ─── RESULTS ─── */}
      <main className="max-w-[1200px] mx-auto px-6 py-20 min-h-[600px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 animate-fade-up text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Polling Global Ecosystem...</p>
          </div>
        ) : error ? (
          <div className="text-center py-40 animate-shake">
            <AlertCircle size={48} className="text-orange-500 mx-auto mb-6" />
            <h3 className="text-xl font-black mb-2">Search Interrupted</h3>
            <p className="text-slate-500 font-medium mb-8">{error}</p>
            <button onClick={handleSearch} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Retry</button>
          </div>
        ) : results ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
            {activeTab === 'flights' && results.offers?.map((offer: any, i: number) => <FlightCard key={i} offer={offer} />)}
            {activeTab === 'hotels' && results.map((hotel: any) => <HotelCard key={hotel.id} hotel={hotel} />)}
            {activeTab === 'insurance' && results.map((quote: any) => <InsuranceCard key={quote.id} quote={quote} />)}
            {activeTab === 'transfers' && results.map((transfer: any) => <TransferCard key={transfer.id} transfer={transfer} />)}
            {activeTab === 'visa' && results.map((visa: any) => <VisaCard key={visa.id} visa={visa} />)}
          </div>
        ) : null}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${active ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>
      {icon} {label}
    </button>
  );
}

function SearchField({ icon, label, value, onChange }: any) {
  return (
    <div className="flex-1 px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all">
      <div className="flex items-center gap-3 mb-1">
        {icon} <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-transparent border-none p-0 text-sm font-black focus:ring-0" />
    </div>
  );
}

function FlightCard({ offer }: any) {
  const flight = offer.segments?.[0] || offer.flights?.[0];
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">{flight?.airline?.slice(0, 2).toUpperCase() || 'TX'}</div>
        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Airline</p><p className="text-sm font-black">{flight?.airline || 'Travsify Air'}</p></div>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div><p className="text-2xl font-black">{flight?.departure || 'LOS'}</p><p className="text-[10px] font-bold text-slate-400 uppercase">DEP</p></div>
        <div className="flex-1 px-4 text-center"><Plane size={16} className="text-blue-600 mx-auto" /></div>
        <div className="text-right"><p className="text-2xl font-black">{flight?.arrival || 'LHR'}</p><p className="text-[10px] font-bold text-slate-400 uppercase">ARR</p></div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p><p className="text-2xl font-black">${offer.price?.total || offer.totalPrice}</p></div>
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black">Book</button>
      </div>
    </div>
  );
}

function HotelCard({ hotel }: any) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
      <img src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="p-6">
        <h3 className="font-black text-slate-900 mb-1">{hotel.name}</h3>
        <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-1"><MapPin size={12} /> {hotel.location}</p>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div><p className="text-2xl font-black">${hotel.price?.total || hotel.price}</p></div>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black">Details</button>
        </div>
      </div>
    </div>
  );
}

function InsuranceCard({ quote }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
      <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck size={24} /></div>
      <h3 className="font-black text-slate-900 mb-2">{quote.planName || quote.plan}</h3>
      <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Global Coverage</p>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div><p className="text-2xl font-black">${quote.price?.total || quote.price}</p></div>
        <button className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-black">Get Policy</button>
      </div>
    </div>
  );
}

function TransferCard({ transfer }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Car size={24} /></div>
      <h3 className="font-black text-slate-900 mb-1">{transfer.vehicleType}</h3>
      <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">{transfer.provider} • Max {transfer.capacity} Pax</p>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div><p className="text-2xl font-black">${transfer.price?.total}</p></div>
        <a href={transfer.bookingUrl} target="_blank" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black">Book Trip</a>
      </div>
    </div>
  );
}

function VisaCard({ visa }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><ScrollText size={24} /></div>
      <h3 className="font-black text-slate-900 mb-1">{visa.destination} eVisa</h3>
      <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">{visa.processingTime} Processing</p>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div><p className="text-2xl font-black">${visa.price?.total}</p></div>
        <a href={visa.bookingUrl} target="_blank" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-2">Apply <ExternalLink size={12} /></a>
      </div>
    </div>
  );
}
