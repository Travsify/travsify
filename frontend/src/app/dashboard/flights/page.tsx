'use client';

import { useState } from 'react';
import { 
  Plane, 
  Search, 
  Calendar, 
  MapPin, 
  Loader2, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X,
  ChevronRight as ChevronIcon,
  Luggage,
  ShieldCheck,
  Info,
  ArrowRight
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';
import { AIRPORTS, Airport } from '@/utils/locations';

export default function FlightsPage() {
  const apiKey = useApiKey();
  const { currency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any | null>(null);
  const [tripType, setTripType] = useState('one_way');
  const [directOnly, setDirectOnly] = useState(false);
  const [cabinClass, setCabinClass] = useState('economy');
  
  const [segments, setSegments] = useState([
    { origin: '', destination: '', date: '' }
  ]);
  const [returnDate, setReturnDate] = useState('');
  
  // Autocomplete state
  const [activeInput, setActiveInput] = useState<{ index: number, field: 'origin' | 'destination' } | null>(null);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);

  const handleAirportSearch = (index: number, field: 'origin' | 'destination', value: string) => {
    updateSegment(index, field, value);
    if (value.length >= 2) {
      const filtered = AIRPORTS.filter(a => 
        a.city.toLowerCase().includes(value.toLowerCase()) ||
        a.iata.toLowerCase().includes(value.toLowerCase()) ||
        a.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setActiveInput({ index, field });
    } else {
      setSuggestions([]);
    }
  };

  const selectAirport = (index: number, field: 'origin' | 'destination', airport: Airport) => {
    updateSegment(index, field, airport.iata);
    setSuggestions([]);
    setActiveInput(null);
  };

  const handleAddSegment = () => {
    setSegments([...segments, { origin: '', destination: '', date: '' }]);
  };

  const handleRemoveSegment = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const updateSegment = (index: number, field: string, value: string) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setSegments(newSegments);
  };

  const handleSearch = async () => {
    if (!segments[0].origin || !segments[0].destination) return;
    setLoading(true);
    try {
      const payload = {
        tripType,
        directFlightsOnly: directOnly,
        currency,
        segments: segments.map(seg => ({
          origin: seg.origin.toUpperCase(),
          destination: seg.destination.toUpperCase(),
          departureDate: seg.date || new Date(Date.now() + 86400000).toISOString().split('T')[0]
        })),
        ...(tripType === 'round_trip' ? { returnDate } : {}),
        adults: 1,
        cabinClass,
      };

      const res = await fetch(`${API_URL}/api/v1/search/flights`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': apiKey || '' 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setFlights(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Plane size={24} className="text-[#FF6B00]" />
            </div>
            Flights
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2">Direct connection to over 400+ airlines for real-time inventory and instant ticketing.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-orange-50 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" /> Live {currency} Inventory
          </span>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-8 relative group overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-orange-50 transition-colors duration-1000 -z-10" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-30 group-hover:bg-blue-50 transition-colors duration-1000 -z-10" />
        
        {/* Trip Type & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8 relative z-10">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/50">
            {[
              { id: 'one_way', label: 'One Way' },
              { id: 'round_trip', label: 'Round Trip' },
              { id: 'multi_city', label: 'Multi-City' }
            ].map((t) => (
              <button 
                key={t.id}
                onClick={() => { 
                  setTripType(t.id); 
                  if (t.id !== 'multi_city') setSegments([segments[0]]); 
                }}
                className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${tripType === t.id ? 'bg-[#0A1629] text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setDirectOnly(!directOnly)}
              className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${directOnly ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'border-slate-300 bg-white'}`}>
                {directOnly && <CheckCircle2 size={12} strokeWidth={4} />}
              </div>
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Direct Only</span>
            </button>
            
            <div className="h-8 w-px bg-slate-100 hidden lg:block" />
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Cabin:</span>
              <select 
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="bg-transparent text-[11px] font-black text-slate-900 uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Segments */}
        <div className="space-y-6 relative z-20">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row gap-6 items-end group/seg">
              <div className="flex-[1.2] space-y-3 w-full relative z-30">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/seg:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Lagos (LOS)" 
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white uppercase transition-all shadow-inner shadow-slate-100/50"
                    value={seg.origin}
                    onChange={(e) => handleAirportSearch(idx, 'origin', e.target.value)}
                    onFocus={() => seg.origin.length >= 2 && handleAirportSearch(idx, 'origin', seg.origin)}
                  />
                  {activeInput?.index === idx && activeInput?.field === 'origin' && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 min-w-[300px]">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Origin</p>
                        <Plane size={12} className="text-slate-300" />
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {suggestions.map((airport) => (
                          <button
                            key={airport.iata}
                            onClick={() => selectAirport(idx, 'origin', airport)}
                            className="w-full px-6 py-5 text-left hover:bg-[#0A1629] group transition-all border-b border-slate-50 last:border-0 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <span className="text-xs font-black">{airport.iata}</span>
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors leading-tight">{airport.city}</p>
                                <p className="text-[10px] font-medium text-slate-400 group-hover:text-white/70 transition-colors mt-0.5">{airport.name}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 group-hover:text-white/50 tracking-widest uppercase">{airport.country}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-[1.2] space-y-3 w-full relative z-20">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full" /> To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/seg:text-orange-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="London (LHR)" 
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-orange-500/20 focus:bg-white uppercase transition-all shadow-inner shadow-slate-100/50"
                    value={seg.destination}
                    onChange={(e) => handleAirportSearch(idx, 'destination', e.target.value)}
                    onFocus={() => seg.destination.length >= 2 && handleAirportSearch(idx, 'destination', seg.destination)}
                  />
                  {activeInput?.index === idx && activeInput?.field === 'destination' && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 min-w-[300px]">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Destination</p>
                        <Plane size={12} className="text-slate-300 rotate-90" />
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {suggestions.map((airport) => (
                          <button
                            key={airport.iata}
                            onClick={() => selectAirport(idx, 'destination', airport)}
                            className="w-full px-6 py-5 text-left hover:bg-[#FF6B00] group transition-all border-b border-slate-50 last:border-0 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <span className="text-xs font-black">{airport.iata}</span>
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors leading-tight">{airport.city}</p>
                                <p className="text-[10px] font-medium text-slate-400 group-hover:text-white/70 transition-colors mt-0.5">{airport.name}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 group-hover:text-white/50 tracking-widest uppercase">{airport.country}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Calendar size={12} className="text-blue-500" /> Departure
                </label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="date" 
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 cursor-pointer"
                    value={seg.date}
                    onChange={(e) => updateSegment(idx, 'date', e.target.value)}
                  />
                </div>
              </div>

              {tripType === 'round_trip' && idx === 0 && (
                <div className="flex-1 space-y-3 w-full">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Calendar size={12} className="text-indigo-500" /> Return
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="date" 
                      className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-indigo-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 cursor-pointer"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {tripType === 'multi_city' && segments.length > 1 && (
                <button 
                  onClick={() => handleRemoveSegment(idx)}
                  className="w-16 h-[64px] bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm border border-rose-100"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}

          {tripType === 'multi_city' && (
            <button 
              onClick={handleAddSegment}
              className="flex items-center gap-3 px-6 py-4 text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 hover:bg-[#0A1629] hover:text-white rounded-2xl transition-all duration-300 w-fit shadow-sm"
            >
              <Plus size={16} /> Add Another Destination
            </button>
          )}
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100 relative z-10">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#0A1629] text-white px-16 py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-blue-900/30 hover:bg-[#FF6B00] hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center gap-4 w-full md:w-auto justify-center group"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} className="group-hover:rotate-12 transition-transform" />}
            {loading ? 'Analyzing Global Routes...' : 'Search Flights'}
          </button>
        </div>
      </div>

      {/* Results Filters (Quick Actions) */}
      {flights.length > 0 && (
        <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-[#FF6B00] transition-all flex items-center gap-2 group">
            <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:bg-[#FF6B00]" /> Cheapest
          </button>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-[#FF6B00] transition-all flex items-center gap-2 group">
            <div className="w-2 h-2 bg-[#0A1629] rounded-full group-hover:bg-[#FF6B00]" /> Fastest
          </button>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 gap-8">
        {flights.map((flight, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedFlight(flight)}
            className="bg-white p-1 rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700 group overflow-hidden relative cursor-pointer"
          >
             {/* Left Accent Bar */}
             <div className={`absolute top-0 left-0 bottom-0 w-2 ${i % 2 === 0 ? 'bg-[#0A1629]' : 'bg-[#FF6B00]'}`} />
             
             <div className="p-8 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1 space-y-8 w-full">
                {(flight.segments || []).length > 0 ? (
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex flex-col items-center justify-center text-[#0A1629] shrink-0 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                      <Plane size={36} className="group-hover:rotate-12 transition-transform text-[#FF6B00]" />
                      <span className="text-[8px] font-black uppercase tracking-widest mt-1">
                        {flight.segments.length > 1 ? `${flight.segments.length - 1} Stop(s)` : 'Direct'}
                      </span>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-4 mb-5">
                        <span className={`px-4 py-1.5 ${i % 2 === 0 ? 'bg-blue-50 text-[#0A1629]' : 'bg-orange-50 text-[#FF6B00]'} text-[10px] font-black rounded-xl uppercase tracking-widest border border-current/10`}>
                          {flight.segments[0].airline || 'Direct Connect'}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{flight.segments[0].flightNumber}</span>
                          <div className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[9px] font-black text-[#FF6B00] uppercase tracking-widest">{flight.cabin || 'Economy'}</span>
                          {flight.totalDuration && <><div className="w-1 h-1 bg-slate-200 rounded-full" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={9} />{flight.totalDuration}</span></>}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
                        <div className="text-center sm:text-left">
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">
                            {flight.segments[0].departureTime ? new Date(flight.segments[0].departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:45'}
                          </p>
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">{flight.segments[0].departure}</p>
                        </div>
                        
                        <div className="flex-1 w-full max-w-[200px] flex flex-col items-center gap-2">
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <div className="flex-1 h-0.5 bg-slate-100 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-[#FF6B00]/50 to-blue-600/0 animate-shimmer" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            {flight.segments.length > 1 ? 'Via ' + flight.segments[0].arrival : 'Non-stop'}
                          </span>
                        </div>
                        
                        <div className="text-center sm:text-right">
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">
                            {flight.segments[flight.segments.length - 1].arrivalTime ? new Date(flight.segments[flight.segments.length - 1].arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:20'}
                          </p>
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">{flight.segments[flight.segments.length - 1].arrival}</p>
                        </div>
                      </div>

                      {/* Fare Rules, Baggage & Refundability */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${flight.isRefundable ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                          {flight.isRefundable ? 'Refundable' : 'Non-Refundable'}
                        </span>
                        {flight.baggageAllowance && (
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Luggage size={10} /> {flight.baggageAllowance}
                          </span>
                        )}
                        {flight.segments[0]?.aircraft && (
                          <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                            {flight.segments[0].aircraft}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-help">
                          Click for Details
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-xs font-medium text-slate-400">Flight route details unavailable</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto shrink-0 pt-10 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-10" onClick={(e) => e.stopPropagation()}>
                <div className="text-center lg:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Grand Total</p>
                  <div className="flex items-baseline gap-1 justify-center lg:justify-end">
                    <span className="text-sm font-black text-slate-900">{currency === 'USD' ? '$' : '₦'}</span>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                      {(flight.price?.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col items-center lg:items-end gap-2">
                    <div className="px-3 py-1 bg-[#0A1629] text-white rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-900/20">
                      <CheckCircle2 size={10} strokeWidth={4} className="text-[#FF6B00]" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{flight.provider} Network Verified</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/dashboard/flights/checkout?id=${flight.id}&price=${flight.price?.totalAmount}&currency=${currency}`;
                  }}
                  className="w-full bg-[#0A1629] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#FF6B00] hover:shadow-2xl hover:shadow-orange-600/30 transition-all duration-500 active:scale-95 group"
                >
                  Select Offer <ChevronIcon size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && flights.length === 0 && (
          <div className="py-32 text-center bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 group hover:scale-110 transition-transform duration-700">
                <Plane size={56} className="text-slate-200 group-hover:text-[#FF6B00] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explore the World</h3>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-4 leading-relaxed px-6">
                Use our comprehensive terminal to search one-way, round-trip, or multi-city flights across our global direct-connect network.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Itinerary Details Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0A1629]/90 backdrop-blur-sm" onClick={() => setSelectedFlight(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <Plane size={24} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Itinerary Details</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedFlight.provider} • {selectedFlight.cabin || 'Economy'} Class{selectedFlight.totalDuration ? ` • ${selectedFlight.totalDuration}` : ''}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFlight(null)}
                className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              {(selectedFlight.segments || []).map((seg: any, idx: number) => {
                const departureDate = new Date(seg.departureTime);
                const arrivalDate = new Date(seg.arrivalTime);
                const nextSeg = selectedFlight.segments[idx + 1];
                let layover: string | null = null;

                if (nextSeg) {
                  const nextDepTime = new Date(nextSeg.departureTime).getTime();
                  const currentArrTime = arrivalDate.getTime();
                  const diff = nextDepTime - currentArrTime;
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  layover = `${hours}h ${minutes}m Layover in ${seg.arrival}`;
                }

                return (
                  <div key={idx} className="relative">
                    <div className="flex gap-10">
                      {/* Timeline Column */}
                      <div className="w-16 flex flex-col items-center shrink-0">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Depart</div>
                        <div className="w-4 h-4 rounded-full bg-[#FF6B00] border-4 border-orange-100 relative z-10" />
                        <div className="flex-1 w-0.5 bg-slate-100 my-2" />
                        <div className="w-4 h-4 rounded-full bg-[#0A1629] border-4 border-blue-100 relative z-10" />
                        <div className="text-[10px] font-black text-slate-400 uppercase mt-2">Arrive</div>
                      </div>

                      {/* Info Column */}
                      <div className="flex-1 space-y-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm font-black text-[#0A1629]">
                              {seg.departure}
                            </div>
                            <div>
                              <p className="text-xl font-black text-slate-900 tracking-tight">{departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">{departureDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-1">
                             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-lg border border-blue-100">{seg.airline}</span>
                             <p className="text-[11px] font-black text-slate-900 tracking-widest">{seg.flightNumber}</p>
                             {seg.aircraft && <p className="text-[9px] font-bold text-slate-400">{seg.aircraft}</p>}
                             {seg.operatingAirline && seg.operatingAirline !== seg.airline && <p className="text-[8px] font-bold text-orange-500 uppercase">Op. by {seg.operatingAirline}</p>}
                          </div>
                          
                          <div className="flex items-center gap-6 lg:flex-row-reverse">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm font-black text-[#FF6B00]">
                              {seg.arrival}
                            </div>
                            <div className="text-right lg:text-left">
                              <p className="text-xl font-black text-slate-900 tracking-tight">{arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">{arrivalDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        {layover && (
                          <div className="flex items-center gap-4 py-4 px-8 bg-orange-50 border border-dashed border-orange-200 rounded-3xl mx-10">
                            <Clock size={16} className="text-[#FF6B00]" />
                            <p className="text-xs font-black text-orange-600 uppercase tracking-widest">{layover}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Fare Rules & Baggage Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Fare Conditions</h4>
                  <div className="space-y-3">
                    {(selectedFlight.fareRules || []).map((rule: string, ri: number) => (
                      <div key={ri} className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${rule.toLowerCase().includes('non-') ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                        <span className="text-[11px] font-bold text-slate-600">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Luggage size={14} className="text-indigo-500" /> Baggage & Cabin</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-slate-500">Cabin Class</span><span className="text-[11px] font-black text-slate-900">{selectedFlight.cabin || 'Economy'}</span></div>
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-slate-500">Baggage</span><span className="text-[11px] font-black text-slate-900">{selectedFlight.baggageAllowance || 'Check with airline'}</span></div>
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-slate-500">Duration</span><span className="text-[11px] font-black text-slate-900">{selectedFlight.totalDuration || 'N/A'}</span></div>
                    {selectedFlight.segments?.[0]?.aircraft && <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-slate-500">Aircraft</span><span className="text-[11px] font-black text-slate-900">{selectedFlight.segments[0].aircraft}</span></div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grand Total:</span>
                <span className="text-sm font-black text-slate-900">{currency === 'USD' ? '$' : '₦'}</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {(selectedFlight.price?.totalAmount || 0).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => window.location.href = `/dashboard/flights/checkout?id=${selectedFlight.id}&price=${selectedFlight.price?.totalAmount}&currency=${currency}`}
                className="w-full md:w-auto bg-[#0A1629] text-white px-16 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#FF6B00] shadow-xl hover:shadow-orange-600/30 transition-all duration-500"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
