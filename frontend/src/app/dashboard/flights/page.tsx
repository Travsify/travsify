'use client';

import { useState } from 'react';
import { Plane, Search, Calendar, MapPin, Loader2, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function FlightsPage() {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [tripType, setTripType] = useState('one_way');
  const [directOnly, setDirectOnly] = useState(false);
  
  const [segments, setSegments] = useState([
    { origin: '', destination: '', date: '' }
  ]);
  const [returnDate, setReturnDate] = useState('');

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
        segments: segments.map(seg => ({
          origin: seg.origin.toUpperCase(),
          destination: seg.destination.toUpperCase(),
          departureDate: seg.date || new Date(Date.now() + 86400000).toISOString().split('T')[0]
        })),
        ...(tripType === 'round_trip' ? { returnDate } : {}),
        adults: 1
      };

      const res = await fetch(`${API_URL}/demo/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Flights (NDC)</h1>
        <p className="text-sm text-slate-400 font-medium">Manage SML/Aviation bookings and real-time inventory.</p>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-6">
        
        {/* Trip Type & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button 
              onClick={() => { setTripType('one_way'); setSegments([segments[0]]); }}
              className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${tripType === 'one_way' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}
            >
              One Way
            </button>
            <button 
              onClick={() => { setTripType('round_trip'); setSegments([segments[0]]); }}
              className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${tripType === 'round_trip' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Round Trip
            </button>
            <button 
              onClick={() => { setTripType('multi_city'); }}
              className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${tripType === 'multi_city' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Multi-City
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDirectOnly(!directOnly)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${directOnly ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                {directOnly && <CheckCircle2 size={12} />}
              </div>
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Direct Flights Only</span>
            </button>
          </div>
        </div>

        {/* Segments */}
        <div className="space-y-4">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 items-end relative">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Origin {tripType === 'multi_city' ? idx + 1 : ''}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="LOS" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 uppercase"
                    value={seg.origin}
                    onChange={(e) => updateSegment(idx, 'origin', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination {tripType === 'multi_city' ? idx + 1 : ''}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="LHR" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 uppercase"
                    value={seg.destination}
                    onChange={(e) => updateSegment(idx, 'destination', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-600"
                    value={seg.date}
                    onChange={(e) => updateSegment(idx, 'date', e.target.value)}
                  />
                </div>
              </div>

              {tripType === 'round_trip' && idx === 0 && (
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="date" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-600"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {tripType === 'multi_city' && segments.length > 1 && (
                <button 
                  onClick={() => handleRemoveSegment(idx)}
                  className="w-14 h-[52px] bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          {tripType === 'multi_city' && (
            <button 
              onClick={handleAddSegment}
              className="flex items-center gap-2 px-4 py-3 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 rounded-xl transition-colors w-fit"
            >
              <Plus size={14} /> Add Another Flight
            </button>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-orange-600 text-white px-12 py-4 rounded-xl font-black text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Searching SML...' : 'Search Inventory'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-6">
        {flights.map((flight, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6 w-full">
              {(flight.itineraries || [{}]).map((itin: any, itIdx: number) => (
                <div key={itIdx} className="flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <Plane size={32} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest">{flight.airline || 'SML NDC'}</span>
                      {tripType === 'round_trip' && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-widest">
                          {itIdx === 0 ? 'Outbound' : 'Return'}
                        </span>
                      )}
                      {tripType === 'multi_city' && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-widest">
                          Flight {itIdx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                      <div className="text-center sm:text-left">
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{itin.segments?.[0]?.departure?.time || '10:45'}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{itin.segments?.[0]?.departure?.iataCode || segments[0].origin || 'LOS'}</p>
                      </div>
                      <div className="flex-1 w-full flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="flex-1 h-px bg-slate-200 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-full border border-slate-100 shadow-sm">
                            {directOnly ? 'Direct' : (itin.segments?.length > 1 ? `${itin.segments.length - 1} Stop(s)` : 'Non-stop')}
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{itin.segments?.[itin.segments.length - 1]?.arrival?.time || '18:20'}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{itin.segments?.[itin.segments.length - 1]?.arrival?.iataCode || segments[0].destination || 'LHR'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
              <div className="text-center lg:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fare</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">₦{(flight.price?.total || 1240000).toLocaleString()}</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 flex items-center justify-center lg:justify-end gap-1"><Clock size={10} /> Instantly Ticketable</p>
              </div>
              <button className="w-full bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20 active:scale-95">
                Select Fare
              </button>
            </div>
          </div>
        ))}

        {!loading && flights.length === 0 && (
          <div className="py-24 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Plane size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Search SML Inventory</h3>
            <p className="text-sm text-slate-400 font-medium max-w-md mx-auto mt-2">Use the comprehensive search above to find one-way, round-trip, or multi-city flights across our global NDC network.</p>
          </div>
        )}
      </div>
    </div>
  );
}
