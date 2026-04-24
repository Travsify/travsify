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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function BookingsPage() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-up">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Accessing Operations...</p>
      </div>
    );
  }

  const [selectedBooking, setSelectedBooking] = useState<any>(null);

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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Global Operations</h2>
          <p className="text-slate-500 font-medium text-[13px]">Monitor and manage all bookings across your unified travel network.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Reference or Service..." 
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium w-64 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
            />
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            <Plus size={18} />
            New Search
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

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
        <div className="flex gap-1">
          {['All', 'Ticketed', 'Fulfilled', 'Pending', 'Fulfillment_Pending', 'Failed'].map((t) => (
            <button 
              key={t}
              onClick={() => setFilter(t.toLowerCase())}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === t.toLowerCase() ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Vertical / Reference</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Service & Provider</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Date & Amount</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                          {getVerticalIcon(booking.vertical)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] font-black text-blue-600 tracking-wider font-mono">{booking.id.substring(0, 8).toUpperCase()}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.vertical || 'FLIGHT'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                          {booking.flightDetails?.itemName || booking.itemName || 'Unified Service'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase">
                          {booking.flightDetails?.provider || 'Global Partner'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-bold text-slate-900">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency || 'USD' }).format(booking.totalPrice || booking.totalAmount)}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <Calendar size={12} className="text-slate-300" />
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                       >
                          <ChevronRight size={18} />
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
