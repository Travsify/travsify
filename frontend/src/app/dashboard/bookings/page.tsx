'use client';

import { useState, useEffect } from 'react';
import { 
  Plane, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Hotel,
  Car,
  ShieldCheck,
  Ticket,
  Globe,
  FileText,
  X
} from 'lucide-react';
import Link from 'next/link';
import VisaTracker from '@/components/VisaTracker';

import { API_URL } from '@/utils/api';

export default function BookingsPage() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch booking records');
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'all' || b.status.toLowerCase() === filter.toLowerCase()
  );

  const getVerticalIcon = (vertical: string) => {
    switch (vertical?.toLowerCase()) {
      case 'hotel': return <Hotel size={18} className="text-blue-500" />;
      case 'experience': return <Ticket size={18} className="text-orange-500" />;
      case 'visa': return <FileText size={18} className="text-[#FF6B00]" />;
      case 'transfer': return <Car size={18} className="text-slate-500" />;
      case 'insurance': return <ShieldCheck size={18} className="text-emerald-500" />;
      default: return <Plane size={18} className="text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-[#FF6B00] rounded-full animate-spin shadow-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-slate-200" />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Syncing Operational Ledger</p>
      </div>
    );
  }



  return (
    <div className="space-y-8 animate-fade-up">
      {/* Detail Modal Overlay */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl relative">
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-[#FF6B00] transition-colors"
            >
              Close <X className="w-4 h-4" />
            </button>
            
            {selectedBooking.vertical === 'visa' ? (
              <VisaTracker 
                applicationId={selectedBooking.pnr || selectedBooking.id}
                status={selectedBooking.status}
                destination={selectedBooking.itemName?.split(' ')[2] || 'Global'}
                applicantName="Travsify User"
                submissionDate={new Date(selectedBooking.createdAt).toLocaleDateString()}
                estimatedCompletion="3-5 Business Days"
              />
            ) : (
              <div className="bg-white p-12 rounded-[40px] text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  {getVerticalIcon(selectedBooking.vertical)}
                </div>
                <h3 className="text-2xl font-black text-slate-900">Booking Details</h3>
                <p className="text-slate-400 mt-2">Extended details for {selectedBooking.vertical} bookings are coming soon.</p>
                <button onClick={() => setSelectedBooking(null)} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Return</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── ELITE OPERATIONAL HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full animate-pulse shadow-[0_0_12px_#FF6B00]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Node_Operational_Ledger</span>
          </div>
          <h2 className="text-6xl font-black text-[#0A1629] tracking-tighter leading-none">Global Operations<span className="text-[#FF6B00]">.</span></h2>
          <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">High-fidelity orchestration of all travel inventory and fulfillment across your unified distribution network.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/60 shadow-2xl shadow-slate-200/20 group">
          <div className="relative group/search">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#FF6B00] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search Reference..." 
              className="pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-2xl text-sm font-black w-72 focus:outline-none focus:border-[#FF6B00]/20 transition-all shadow-inner placeholder:text-slate-300"
            />
          </div>
          <Link href="/dashboard/terminal" className="flex items-center gap-4 px-10 py-5 bg-[#0A1629] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FF6B00] transition-all shadow-2xl active:scale-[0.98] group/btn">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Initiate Order
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl animate-shake">
          <AlertCircle size={18} className="text-orange-600 shrink-0" />
          <p className="text-xs font-bold text-orange-600">{error}</p>
          <button 
            onClick={fetchBookings} 
            disabled={loading}
            className="ml-auto text-[10px] font-black uppercase tracking-widest bg-white px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Retry Now'}
          </button>
        </div>
      )}

      {/* ─── FILTER SUITE ─── */}
      <div className="flex items-center gap-4 bg-slate-200/40 backdrop-blur-md p-2 rounded-[28px] border border-slate-200/60 w-fit mb-12">
        {['All', 'Ticketed', 'Fulfilled', 'Pending', 'Failed'].map((t) => (
          <button 
            key={t}
            onClick={() => setFilter(t.toLowerCase())}
            className={`px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              filter === t.toLowerCase() ? 'bg-[#0A1629] text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-[#0A1629] hover:bg-white/50'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* ─── OPERATIONAL LEDGER (ELITE) ─── */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[48px] border border-slate-200/60 shadow-2xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Reference</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Service Metadata</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Settlement Amount</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Operational Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {getVerticalIcon(booking.vertical)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[14px] font-black text-[#0A1629] tracking-widest font-mono group-hover:text-[#FF6B00] transition-colors">{booking.id.substring(0, 10).toUpperCase()}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{booking.vertical || 'FLIGHT_NODE'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[14px] font-black text-[#0A1629] group-hover:translate-x-1 transition-transform">
                          {booking.flightDetails?.itemName || booking.itemName || 'Unified Travel Asset'}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          {booking.flightDetails?.provider || 'Global Infrastructure Partner'}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-lg font-black text-[#0A1629]">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency || 'USD' }).format(booking.totalPrice || booking.totalAmount)}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Calendar size={12} className="text-[#FF6B00]" />
                          {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-[#0A1629] hover:bg-white rounded-2xl transition-all shadow-inner group-hover:shadow-2xl group-hover:border group-hover:border-slate-100"
                       >
                          <ChevronRight size={20} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No operations recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();
  
  const styles: any = {
    ticketed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    fulfilled: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    fulfillment_pending: 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20',
    failed: 'bg-rose-50 text-rose-600 border-rose-100',
    cancelled: 'bg-slate-50 text-slate-400 border-slate-200',
  };

  const icons: any = {
    ticketed: <CheckCircle2 size={12} />,
    fulfilled: <CheckCircle2 size={12} />,
    confirmed: <CheckCircle2 size={12} />,
    pending: <Clock size={12} />,
    fulfillment_pending: <Loader2 size={12} className="animate-spin" />,
    failed: <AlertCircle size={12} />,
    cancelled: <AlertCircle size={12} />,
  };

  const displayStatus = status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[normalizedStatus] || styles.pending}`}>
      {icons[normalizedStatus] || icons.pending}
      {displayStatus}
    </span>
  );
}
