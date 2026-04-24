'use client';

import { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Users,
  Calendar,
  Filter,
  RefreshCcw,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/utils/api';

type Vertical = 'flights' | 'hotels' | 'transfers' | 'visa' | 'insurance';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<Vertical>('flights');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    origin: 'LOS',
    destination: 'LHR',
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    adults: 1,
    nationality: 'NG',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as Vertical;
    if (tab && ['flights', 'hotels', 'insurance', 'transfers', 'visa'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      let url = '';
      let method = 'GET';
      let body = null;

      switch(activeTab) {
        case 'flights':
          url = `${API_URL}/demo/flights/search`;
          method = 'POST';
          body = JSON.stringify({ 
            origin: searchParams.origin, 
            destination: searchParams.destination, 
            departureDate: searchParams.departureDate,
            adults: searchParams.adults 
          });
          break;
        case 'hotels':
          url = `${API_URL}/demo/hotels/search?city=${searchParams.destination}&checkin=${searchParams.departureDate}&checkout=${searchParams.returnDate}&adults=${searchParams.adults}`;
          break;
        case 'insurance':
          url = `${API_URL}/demo/insurance/quotes?destination=${searchParams.destination}&startDate=${searchParams.departureDate}&endDate=${searchParams.returnDate}&citizenship=${searchParams.nationality}`;
          break;
        case 'transfers':
          url = `${API_URL}/demo/transfers/search`;
          method = 'POST';
          body = JSON.stringify({ 
            pickupAddress: searchParams.origin, 
            dropoffAddress: searchParams.destination,
            passengers: searchParams.adults 
          });
          break;
        case 'visa':
          url = `${API_URL}/demo/visa/requirements?nationality=${searchParams.nationality}&destination=${searchParams.destination === 'LHR' ? 'GB' : searchParams.destination}`;
          break;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!res.ok) throw new Error(`Provider failed to respond (Code: ${res.status})`);
      
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Service temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50">
        <div className="max-w-[1400px] mx-auto px-8 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#0A2540] rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Globe size={22} className="group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-2xl font-black tracking-tight">Travsify<span className="text-[#FF7A00]">.</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-[24px] border border-slate-200/50">
            {(['flights', 'hotels', 'transfers', 'visa', 'insurance'] as Vertical[]).map((v) => (
              <button 
                key={v}
                onClick={() => setActiveTab(v)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === v ? 'bg-white text-[#0A2540] shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-[#0A2540]'}`}
              >
                {v === 'flights' && <Plane size={16} />}
                {v === 'hotels' && <Hotel size={16} />}
                {v === 'transfers' && <Car size={16} />}
                {v === 'visa' && <ScrollText size={16} />}
                {v === 'insurance' && <ShieldCheck size={16} />}
                {v === 'visa' ? 'eVisa' : v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-black text-[#0A2540] hover:text-[#FF7A00] transition-colors">Developer Login</Link>
            <Link href="/register" className="bg-[#0A2540] text-white px-8 py-4 rounded-[18px] text-[13px] font-black hover:bg-black transition-all shadow-2xl shadow-[#0A2540]/20 active:scale-95">
              Get API Keys
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        {/* Mesh Gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FF7A00]/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#FF7A00]/10 text-[#FF7A00] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#FF7A00]/10"
          >
            <Zap size={14} fill="currentColor" /> Live Inventory Sync
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-black tracking-tight mb-6 text-[#0A2540]"
          >
            Unified Travel <br/><span className="text-[#FF7A00]">Infrastructure.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            Interact with our live global adapters. Fetch real-time availability for flights, 
            hotels, and logistics via a single standardized payload.
          </motion.p>

          {/* SEARCH BAR (PREMIUM) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-[1100px] mx-auto bg-white p-5 rounded-[40px] border border-slate-200 shadow-[0_40px_80px_-20px_rgba(10,37,64,0.1)] flex flex-wrap lg:flex-nowrap items-center gap-4"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SearchField 
                icon={<MapPin className="text-[#FF7A00]" size={18} />} 
                label="Origin / City" 
                value={searchParams.origin} 
                onChange={(v: string) => setSearchParams({...searchParams, origin: v})} 
              />
              <SearchField 
                icon={<MapPin className="text-blue-500" size={18} />} 
                label="Destination" 
                value={searchParams.destination} 
                onChange={(v: string) => setSearchParams({...searchParams, destination: v})} 
              />
              <SearchField 
                icon={<Calendar className="text-slate-400" size={18} />} 
                label="Check In / Dep" 
                type="date"
                value={searchParams.departureDate} 
                onChange={(v: string) => setSearchParams({...searchParams, departureDate: v})} 
              />
              <SearchField 
                icon={<Users className="text-slate-400" size={18} />} 
                label="Travelers" 
                type="number"
                value={searchParams.adults.toString()} 
                onChange={(v: string) => setSearchParams({...searchParams, adults: parseInt(v)})} 
              />
            </div>
            
            <button 
              onClick={handleSearch} 
              disabled={loading}
              className="w-full lg:w-auto h-20 px-12 bg-[#0A2540] text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-[#0A2540]/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              {loading ? 'Polling...' : 'Sync Data'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── RESULTS STREAM ─── */}
      <main className="max-w-[1300px] mx-auto px-8 pb-40 min-h-[600px]">
        <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0A2540] shadow-sm border border-slate-100">
              <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0A2540]">Inventory Stream</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Affiliate Consumption</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0A2540] transition-all">
              <Filter size={14} /> Refine Logic
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 gap-6 text-center"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-100 border-t-[#FF7A00] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={24} className="text-[#FF7A00] animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#0A2540] mb-2 tracking-tight">Accessing Multi-Provider Hub</p>
                <p className="text-sm font-medium text-slate-400">Verifying available adapters for {activeTab}...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-40 max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-[#0A2540] mb-3">Sync Interrupted</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">{error}</p>
              <button onClick={handleSearch} className="w-full py-5 bg-[#0A2540] text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Attempt Re-sync
              </button>
            </motion.div>
          ) : results ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {activeTab === 'flights' && results.offers?.map((offer: any, i: number) => <FlightCard key={i} offer={offer} />)}
              {activeTab === 'hotels' && Array.isArray(results) && results.map((hotel: any) => <HotelCard key={hotel.id} hotel={hotel} />)}
              {activeTab === 'insurance' && Array.isArray(results) && results.map((quote: any) => <InsuranceCard key={quote.id} quote={quote} />)}
              {activeTab === 'transfers' && Array.isArray(results) && results.map((transfer: any) => <TransferCard key={transfer.id} transfer={transfer} />)}
              {activeTab === 'visa' && Array.isArray(results) && results.map((visa: any) => <VisaCard key={visa.id} visa={visa} />)}
              
              {(!results || (Array.isArray(results) && results.length === 0) || (activeTab === 'flights' && !results.offers)) && (
                <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No Real-time Inventory Found</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="py-40 text-center opacity-40">
              <p className="text-sm font-black uppercase tracking-widest">Query inventory to begin simulation</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0A2540] text-white py-24 px-8 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 tracking-tight">Ready to integrate?</h2>
            <p className="text-lg text-white/60 font-medium mb-10 leading-relaxed">
              Our SDKs and APIs are production-ready. Start building your travel fintech today 
              with the most powerful infrastructure in Africa.
            </p>
            <div className="flex gap-4">
              <Link href="/register" className="bg-[#FF7A00] text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#FF7A00]/20 hover:scale-105 transition-all">
                Create Live Account
              </Link>
              <Link href="/docs" className="bg-white/10 text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                Read API Docs
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
              <div className="w-10 h-10 bg-[#FF7A00] rounded-xl flex items-center justify-center mb-6"><CheckCircle2 size={20}/></div>
              <h4 className="font-black text-lg mb-2">99.9% Uptime</h4>
              <p className="text-sm text-white/50 font-medium">Global redundancy across all travel verticals.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-6"><ShieldCheck size={20}/></div>
              <h4 className="font-black text-lg mb-2">PCIDSS Compliant</h4>
              <p className="text-sm text-white/50 font-medium">Secure financial settlement for travel agents.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SearchField({ icon, label, value, onChange, type = "text" }: any) {
  return (
    <div className="flex-1 px-8 py-6 rounded-[28px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
      <div className="flex items-center gap-3 mb-2">
        {icon} <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</span>
      </div>
      <input 
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-transparent border-none p-0 text-base font-black text-[#0A2540] outline-none focus:ring-0 placeholder:text-slate-200" 
        placeholder="Enter search..."
      />
    </div>
  );
}

function FlightCard({ offer }: any) {
  const flight = offer.segments?.[0] || offer.flights?.[0];
  const price = offer.price?.total || offer.totalPrice;
  const affiliateEarnings = (parseFloat(price) * 0.03).toFixed(2);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
        <Plane size={120} />
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0A2540] text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl">
            {flight?.airline?.slice(0, 2).toUpperCase() || 'TX'}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Carrier</p>
            <p className="text-base font-black text-[#0A2540]">{flight?.airline || 'Partner Airline'}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Available</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="text-center">
          <p className="text-3xl font-black text-[#0A2540] tracking-tighter">{flight?.departure || 'LOS'}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-[0.2em]">Origin</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 px-6">
          <div className="w-full h-px bg-slate-100 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-sm">
              <Plane size={14} />
            </div>
          </div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">6h 30m • Non-stop</span>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-[#0A2540] tracking-tighter">{flight?.arrival || 'LHR'}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-[0.2em]">Dest.</p>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-[32px] p-6 mb-8 border border-slate-100/50 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Affiliate Yield</p>
          <p className="text-sm font-black text-emerald-600">+${affiliateEarnings}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Quote</p>
          <p className="text-2xl font-black text-[#0A2540]">${price}</p>
        </div>
      </div>

      <button className="w-full py-5 bg-[#0A2540] text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#0A2540]/10">
        Authorize Booking <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

function HotelCard({ hotel }: any) {
  const price = hotel.price?.total || hotel.price;
  const earnings = (parseFloat(price) * 0.05).toFixed(2);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all relative group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={hotel.image || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&h=600`} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          alt={hotel.name}
        />
        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
          {hotel.rating || '4.5'} <Star size={10} className="inline text-orange-500 ml-1" fill="currentColor" />
        </div>
        <div className="absolute bottom-6 right-6 px-5 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-xl font-black shadow-xl">
          ${price}
        </div>
      </div>
      
      <div className="p-10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={12} className="text-[#FF7A00]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hotel.location || 'Global Location'}</span>
        </div>
        <h3 className="text-2xl font-black text-[#0A2540] mb-8 leading-tight line-clamp-1">{hotel.name}</h3>
        
        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Comm. Rate</p>
            <p className="text-sm font-black text-[#FF7A00]">5% Earned</p>
          </div>
          <button className="px-8 py-4 bg-[#0A2540] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#0A2540]/10">Book Now</button>
        </div>
      </div>
    </motion.div>
  );
}

function InsuranceCard({ quote }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group"
    >
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        <ShieldCheck size={32} />
      </div>
      <p className="text-[10px] font-black text-[#FF7A00] uppercase tracking-[0.2em] mb-3">Certified Security</p>
      <h3 className="text-2xl font-black text-[#0A2540] mb-4 leading-tight">{quote.planName || quote.plan || 'Travel Shield'}</h3>
      <p className="text-sm text-slate-500 font-medium mb-12 leading-relaxed">Global medical coverage with zero deductible for business travelers.</p>
      
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Premium Rate</p>
          <p className="text-3xl font-black text-[#0A2540] tracking-tighter">${quote.price?.total || quote.price}</p>
        </div>
        <button className="px-8 py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Get Policy</button>
      </div>
    </motion.div>
  );
}

function TransferCard({ transfer }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group"
    >
      <div className="w-16 h-16 bg-[#FF7A00]/10 text-[#FF7A00] rounded-3xl flex items-center justify-center mb-10">
        <Car size={32} />
      </div>
      <h3 className="text-2xl font-black text-[#0A2540] mb-2">{transfer.vehicleType || 'Standard Sedan'}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">{transfer.provider || 'Verified Partner'} • {transfer.capacity || 4} PAX</p>
      
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Instant Booking</p>
          <p className="text-3xl font-black text-[#0A2540] tracking-tighter">${transfer.price?.total || transfer.price || '45.00'}</p>
        </div>
        <button className="px-8 py-5 bg-[#0A2540] text-white rounded-2xl text-xs font-black uppercase tracking-widest">Reserve</button>
      </div>
    </motion.div>
  );
}

function VisaCard({ visa }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative group"
    >
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-10">
        <ScrollText size={32} />
      </div>
      <h3 className="text-2xl font-black text-[#0A2540] mb-2">{visa.destination || 'UK'} eVisa</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">72H Express Processing</p>
      
      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Standard Fee</p>
          <p className="text-3xl font-black text-[#0A2540] tracking-tighter">${visa.price?.total || '145.00'}</p>
        </div>
        <button className="px-8 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">Apply <ExternalLink size={14} /></button>
      </div>
    </motion.div>
  );
}
