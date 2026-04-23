'use client';

import { useState } from 'react';
import { 
  Globe, 
  Search, 
  Loader2, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Ticket,
  X,
  Info,
  Zap,
  Waves,
  Image as ImageIcon
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';
import LocationInput from '@/components/LocationInput';

export default function ToursPage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [search, setSearch] = useState({
    city: 'Dubai',
    date: ''
  });

  const handleSearch = async () => {
    if (!search.city) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/search/tours?location=${encodeURIComponent(search.city)}&currency=${currency}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' }
      });
      const data = await res.json();
      
      // If the backend returns an array of tours, we'll just show the first one as the 'featured' result 
      // since the UI is currently designed to show one featured result. 
      // If no data, we throw an error to show the empty state.
      if (Array.isArray(data) && data.length > 0) {
        const topTour = data[0];
        setResults({
          id: topTour.id,
          tourName: topTour.name || `${search.city} Premium Sightseeing Experience`,
          duration: topTour.duration || '6 Hours (Full-Day)',
          estimatedFee: topTour.price?.totalAmount || topTour.price || 0,
          availability: 'Instant Confirmation Available',
          message: topTour.description || 'Explore the world\'s most iconic landmarks with priority access and professional guides.',
          image: topTour.image || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600`
        });
      } else {
        throw new Error('No tours found');
      }
    } catch (err) {
      console.error('Search failed', err);
      // We no longer set fake results here, letting the UI show the empty/error state
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Ticket size={24} className="text-[#FF6B00]" />
            </div>
            Tours & Experiences
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2">Global curated experiences, activities, and sightseeing tours.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-orange-50 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> {currency} Pricing Enabled
          </span>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row gap-8 items-end relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-orange-50 transition-colors duration-1000 -z-10" />
        
        <LocationInput 
          label="Destination City"
          placeholder="e.g. Dubai"
          value={search.city}
          onChange={(val) => setSearch({...search, city: val})}
        />
        <div className="flex-1 space-y-3 w-full relative z-10">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preferred Date</label>
          <div className="relative">
            <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="date" 
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 text-slate-600 cursor-pointer"
              value={search.date}
              onChange={(e) => setSearch({...search, date: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#0A1629] text-white px-16 py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-blue-900/30 hover:bg-[#FF6B00] hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center gap-4 w-full md:w-auto justify-center group/btn relative z-10"
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} className="group-hover/btn:rotate-12 transition-transform" />}
          {loading ? 'Searching Inventory...' : 'Explore Tours'}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
          <div className="lg:col-span-2 space-y-10">
            <div 
      {/* Tours Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 pb-20">
        {results ? (
          <div 
            onClick={() => setSelectedTour(results)}
            className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(10,22,41,0.12)] hover:-translate-y-2 transition-all duration-700 flex flex-col relative cursor-pointer"
          >
            {/* Live Badge */}
            <div className="absolute top-8 left-8 z-20">
              <div className="px-4 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center gap-2 shadow-xl border border-white/50">
                <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Live Experience</span>
              </div>
            </div>

            {/* Provider Badge */}
            <div className="absolute top-8 right-8 z-20">
              <div className="px-4 py-2.5 bg-[#0A1629]/80 backdrop-blur-xl rounded-2xl flex items-center gap-2 shadow-xl border border-white/10">
                <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">GETYOURGUIDE</span>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative h-80 shrink-0 overflow-hidden">
              <img 
                src={results.image || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600`} 
                alt={results.tourName} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 flex items-end p-8">
                 <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                   <MapPin size={16} className="text-[#FF6B00]" />
                   {search.city}
                 </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-10 flex flex-col flex-1 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  {results.duration}
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  Instant Confirmation
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 leading-[1.2] group-hover:text-[#FF6B00] transition-colors duration-300 tracking-tight mb-4 line-clamp-2">
                {results.tourName}
              </h3>
              
              <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 line-clamp-2">
                {results.message}
              </p>

              {/* Price Section */}
              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Exclusive Rate</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-bold text-slate-300 line-through">
                      {currency} {(results.estimatedFee * 1.12).toLocaleString()}
                    </span>
                    <span className="text-3xl font-black text-[#0A1629]">
                      {currency} {results.estimatedFee.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-green-500 uppercase tracking-tighter mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Best Price Guaranteed
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(results.bookingUrl || '#', '_blank');
                  }}
                  className="w-14 h-14 bg-[#0A1629] text-white rounded-2xl flex items-center justify-center group-hover:bg-[#FF6B00] transition-all duration-500 shadow-2xl shadow-blue-900/20 active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        ) : !loading && (
          <div className="lg:col-span-2 2xl:col-span-3 py-40 text-center bg-white rounded-[60px] border-2 border-dashed border-slate-100 relative overflow-hidden shadow-sm">
             <div className="relative z-10">
              <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 group hover:scale-110 transition-transform duration-700">
                <Ticket size={64} className="text-slate-200 group-hover:text-[#FF6B00] transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Discover Curated Tours</h3>
              <p className="text-base text-slate-400 font-medium max-w-lg mx-auto mt-4 leading-relaxed px-10">
                Enter your destination city to fetch live sightseeing tours and experiences directly from GetYourGuide.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tour Details Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0A1629]/90 backdrop-blur-sm" onClick={() => setSelectedTour(null)} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <Ticket size={28} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedTour.tourName}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{search.city} • {selectedTour.duration}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTour(null)}
                className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="relative h-[450px]">
                <img src={selectedTour.image} className="w-full h-full object-cover" alt="Tour Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex flex-wrap gap-4">
                  <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    <span className="text-sm font-black uppercase tracking-widest">Certified Operator</span>
                  </div>
                </div>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Info size={20} className="text-[#FF6B00]" />
                      About this Experience
                    </h4>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {selectedTour.message} Our premium tours are designed for global travelers seeking authenticity and comfort. Enjoy a curated itinerary that balances iconic sights with hidden gems, led by experts who share the soul of the city.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <FileText size={20} className="text-blue-600" />
                      What's Included
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        'Luxury Transportation',
                        'Expert Guided Commentary',
                        'Priority Access Passes',
                        'Gourmet Lunch & Drinks',
                        'Private Driver',
                        'All Entry Fees Paid'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Zap size={20} className="text-orange-600" />
                      Experience Timeline
                    </h4>
                    <div className="space-y-6 relative ml-4 border-l-2 border-slate-100 pl-8">
                      {[
                        { time: '09:00 AM', title: 'Hotel Pickup', desc: 'Luxury vehicle pickup from your destination accommodation.' },
                        { time: '10:30 AM', title: 'Iconic Landmarks', desc: 'VIP guided access to the city\'s most famous sites.' },
                        { time: '01:00 PM', title: 'Gourmet Lunch', desc: 'Authentic 3-course meal at a top-rated local venue.' },
                        { time: '03:30 PM', title: 'Hidden Gems', desc: 'Explore exclusive locations off the standard tourist path.' }
                      ].map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-4 border-[#FF6B00]" />
                          <p className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest mb-1">{step.time}</p>
                          <h5 className="font-black text-slate-900 mb-1">{step.title}</h5>
                          <p className="text-xs font-medium text-slate-400">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <div className="bg-[#0A1629] p-8 rounded-[40px] text-white shadow-2xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Package</p>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-xl font-black text-[#FF6B00]">{currency === 'USD' ? '$' : '₦'}</span>
                      <span className="text-5xl font-black tracking-tighter">{selectedTour.estimatedFee.toLocaleString()}</span>
                    </div>
                    
                    <button className="w-full py-5 bg-[#FF6B00] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-600/30">
                      Book This Tour
                    </button>
                    <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-6">Instant Confirmation Guaranteed</p>
                  </div>

                  <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100">
                    <h5 className="font-black text-blue-900 mb-4 flex items-center gap-2">
                      <Waves size={16} className="text-blue-600" />
                      Cancellation Policy
                    </h5>
                    <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                      Cancel up to 24 hours in advance for a full refund. No questions asked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !results && (
        <div className="py-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200/60 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-50" />
           <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 group hover:scale-110 transition-transform duration-700">
                <Globe size={56} className="text-slate-200 group-hover:text-[#FF6B00] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explore the World</h3>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-4 leading-relaxed px-6">
                Enter a destination city and date to explore available sightseeing activities and curated tours with live {currency} rates.
              </p>
           </div>
        </div>
      )}
    </div>
  );
}

function PrepStep({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300 shrink-0 border border-transparent group-hover:border-emerald-100">
        <CheckCircle2 size={16} />
      </div>
      <span className="text-sm font-black text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
  );
}
