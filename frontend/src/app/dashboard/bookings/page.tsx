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
  Loader2
} from 'lucide-react';

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

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-up">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Accessing Operations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Flight Operations</h2>
          <p className="text-slate-500 font-medium text-sm">Monitor and manage all issued tickets across the global network.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search PNR, Airline or Route..." 
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium w-64 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
            />
          </div>
          <Link href="/demo?tab=flights" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            <Plus size={18} />
            New Booking
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl animate-shake">
          <AlertCircle size={18} className="text-orange-600 shrink-0" />
          <p className="text-xs font-bold text-orange-600">{error}</p>
          <button onClick={fetchBookings} className="ml-auto text-xs font-black uppercase text-blue-600">Retry</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
        <div className="flex gap-1">
          {['All', 'Ticketed', 'Pending', 'Failed', 'Cancelled'].map((t) => (
            <button 
              key={t}
              onClick={() => setFilter(t.toLowerCase())}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === t.toLowerCase() ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
          <Filter size={14} />
          More Filters
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">PNR / Airline</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Route & Date</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Pax / Amount</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-black text-blue-600 tracking-wider font-mono">{booking.pnr || 'RESERVED'}</span>
                        <span className="text-[12px] font-bold text-slate-900">{booking.airline || 'Domestic Carrier'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                          <MapPin size={12} className="text-slate-300" />
                          {booking.origin} → {booking.destination}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <Calendar size={12} className="text-slate-300" />
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-bold text-slate-900">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency || 'USD' }).format(booking.totalAmount)}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                          {booking.metadata?.passengers?.length || 1} Passenger(s)
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        {booking.status === 'ticketed' && (
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Download Ticket">
                            <Download size={18} />
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plane size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No operations recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredBookings.length > 0 && (
          <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredBookings.length} results</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-900 disabled:opacity-30" disabled>Previous</button>
              <button className="px-4 py-2 text-xs font-black text-slate-900 hover:text-blue-600" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    ticketed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    failed: 'bg-orange-50 text-orange-600 border-orange-100',
    cancelled: 'bg-slate-50 text-slate-400 border-slate-200',
  };

  const icons: any = {
    ticketed: <CheckCircle2 size={12} />,
    pending: <Clock size={12} />,
    failed: <AlertCircle size={12} />,
    cancelled: <AlertCircle size={12} />,
  };

  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status.toLowerCase()] || styles.pending}`}>
      {icons[status.toLowerCase()] || icons.pending}
      {displayStatus}
    </span>
  );
}
