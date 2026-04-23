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
        
        <div className="flex-1 space-y-3 w-full relative z-10">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination City</label>
          <div className="relative">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="e.g. Dubai" 
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 uppercase"
              value={search.city}
              onChange={(e) => setSearch({...search, city: e.target.value})}
            />
          </div>
        </div>
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
              onClick={() => setSelectedTour(results)}
              className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-2xl shadow-slate-100 relative overflow-hidden group cursor-pointer hover:shadow-blue-900/10 transition-all"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-bl-[100px] -z-0" />
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-[#0A1629] text-[#FF6B00] flex items-center justify-center shadow-xl shadow-blue-900/20 group-hover:scale-110 transition-transform duration-700">
                  <Globe size={40} />
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Availability
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{results.tourName}</h3>
                <p className="text-sm font-black text-[#FF6B00] uppercase tracking-[0.3em]">{search.city} {search.date && `• ${search.date}`}</p>
              </div>
              
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 my-12 relative z-10 group-hover:bg-blue-50/50 transition-colors">
                <p className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                  {results.availability}
                </p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {results.message}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                    <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Clock size={16} className="text-[#FF6B00]" />
                      {results.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-[#0A1629] rounded-2xl border border-blue-900/20">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Starting Price</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-sm font-black text-white">{currency === 'USD' ? '$' : '₦'}</span>
                       <p className="text-3xl font-black text-white tracking-tighter">
                        {results.estimatedFee.toLocaleString()}
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Checkout logic
                }}
                className="w-full py-6 bg-[#FF6B00] text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl shadow-orange-600/30 active:scale-95 group/btn"
              >
                Book Experience <ChevronRight size={18} className="inline-block ml-2 group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0A1629] rounded-[40px] p-10 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
                 <Globe size={200} />
               </div>
               <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#FF6B00] mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                 <Globe size={32} />
               </div>
               <h4 className="text-2xl font-black mb-4 tracking-tight">Global Inventory</h4>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Access thousands of tours, attractions, and sightseeing experiences globally with real-time {currency} pricing and direct-connect availability.
               </p>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-xl shadow-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <FileText size={22} className="text-[#FF6B00]" />
                </div>
                Inclusions
              </h3>
              <div className="space-y-6">
                <PrepStep label="Professional Multilingual Guide" />
                <PrepStep label="Private Hotel Pickup & Drop-off" />
                <PrepStep label="VIP Skip-the-line Access" />
                <PrepStep label="Refreshments & Local Delicacies" />
                <PrepStep label="100% Flexible Cancellation" />
              </div>
            </div>
          </div>
        </div>
      )}

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
