'use client';

import { 
  Car, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

export default function TransfersPage() {
  const transfers = [
    {
      id: '1',
      type: 'Standard Sedan',
      provider: 'Mozio',
      capacity: '3 Passengers',
      luggage: '2 Bags',
      price: '$45.00',
      eta: '8 mins',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000'
    },
    {
      id: '2',
      type: 'Executive SUV',
      provider: 'Mozio Elite',
      capacity: '5 Passengers',
      luggage: '4 Bags',
      price: '$120.00',
      eta: '12 mins',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000'
    },
    {
      id: '3',
      type: 'Luxury Van',
      provider: 'Mozio Group',
      capacity: '7 Passengers',
      luggage: '6 Bags',
      price: '$180.00',
      eta: '15 mins',
      image: 'https://images.unsplash.com/photo-1559297434-2d8a134e042e?q=80&w=1000'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Ground Transfers</h2>
          <p className="text-slate-500 font-medium text-sm">Airport pickups and inter-city rides in 500+ global cities.</p>
        </div>
        <div className="flex bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 items-center gap-2">
          <Zap size={14} className="fill-emerald-600" />
          <span className="text-[11px] font-black uppercase tracking-tight">Instant Confirmation</span>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="LHR Airport, Terminal 5" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Drop-off Point</label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="The Shard, London" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Now / Scheduled" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="flex items-end">
            <Link href="/demo?tab=transfers" className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-center active:scale-95">
              Check Availability
            </Link>
          </div>
        </div>
      </div>

      {/* Transfer Options */}
      <div className="space-y-4">
        {transfers.map((ride) => (
          <div key={ride.id} className="group bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-8">
              <div className="w-40 h-28 rounded-2xl overflow-hidden bg-slate-50">
                <img src={ride.image} alt={ride.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">{ride.type}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Provided by {ride.provider}</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users size={14} className="text-slate-300" />
                    {ride.capacity}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Briefcase size={14} className="text-slate-300" />
                    {ride.luggage}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 px-8 border-l border-slate-50">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Price</p>
                <p className="text-2xl font-black text-blue-600 tracking-tight">{ride.price}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</p>
                <p className="text-[13px] font-black text-emerald-600">{ride.eta} away</p>
              </div>
              <Link href="/demo?tab=transfers" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-2 group active:scale-95">
                Book Ride
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-[32px] p-8 border border-blue-100 flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-blue-900 mb-1">Bank-grade Security</h4>
          <p className="text-xs text-blue-600/70 font-medium">All rides are insured and monitored in real-time for passenger safety.</p>
        </div>
      </div>
    </div>
  );
}
