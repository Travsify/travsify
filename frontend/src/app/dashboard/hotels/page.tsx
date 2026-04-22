'use client';

import { 
  Hotel, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight,
  Wifi,
  Coffee,
  Waves
} from 'lucide-react';
import Link from 'next/link';

export default function HotelsPage() {
  const hotels = [
    {
      id: '1',
      name: 'The Ritz-Carlton, Dubai',
      location: 'Dubai Marina, UAE',
      price: '$450',
      rating: 4.9,
      reviews: 1284,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000',
      amenities: ['wifi', 'pool', 'breakfast']
    },
    {
      id: '2',
      name: 'Hilton Lagos Airport',
      location: 'Ikeja, Lagos, Nigeria',
      price: '₦185,000',
      rating: 4.7,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000',
      amenities: ['wifi', 'pool', 'gym']
    },
    {
      id: '3',
      name: 'Radisson Blu Anchorage',
      location: 'Victoria Island, Lagos',
      price: '₦145,000',
      rating: 4.5,
      reviews: 642,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?q=80&w=1000',
      amenities: ['pool', 'spa', 'bar']
    }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Hotel Inventory</h2>
          <p className="text-slate-500 font-medium text-sm">Access 1.2M+ properties worldwide with live B2B rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Where are you going?" 
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium w-64 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
            />
          </div>
          <Link href="/demo?tab=hotels" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            Search Hotels
          </Link>
        </div>
      </div>

      {/* Search Refinement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Calendar className="text-blue-600" size={20} />
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Check-in</p>
            <p className="text-sm font-bold text-slate-900">May 15, 2026</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Calendar className="text-blue-600" size={20} />
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Check-out</p>
            <p className="text-sm font-bold text-slate-900">May 20, 2026</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Users className="text-blue-600" size={20} />
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Guests</p>
            <p className="text-sm font-bold text-slate-900">2 Adults, 1 Room</p>
          </div>
        </div>
        <Link href="/demo?tab=hotels" className="bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95">
          <Filter size={18} />
          Advanced Filters
        </Link>
      </div>

      {/* Hotel Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 shadow-sm">
            <div className="relative h-64">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl flex items-center gap-1 shadow-lg">
                <Star size={14} className="text-orange-500 fill-orange-500" />
                <span className="text-xs font-black text-slate-900">{hotel.rating}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white/80 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} />
                  {hotel.location}
                </p>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-black text-slate-900 mb-4">{hotel.name}</h3>
              
              <div className="flex items-center gap-4 mb-8">
                {hotel.amenities.includes('wifi') && <Wifi size={18} className="text-slate-300" />}
                {hotel.amenities.includes('pool') && <Waves size={18} className="text-slate-300" />}
                {hotel.amenities.includes('breakfast') && <Coffee size={18} className="text-slate-300" />}
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-auto">Free cancellation</span>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting from</p>
                  <p className="text-2xl font-black text-blue-600 tracking-tight">{hotel.price}<span className="text-sm text-slate-400 font-bold ml-1">/ night</span></p>
                </div>
                <Link href={`/demo?tab=hotels&id=${hotel.id}`} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
