'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car, User, Mail, Phone, CreditCard, ChevronLeft, Loader2, CheckCircle2, ShieldCheck, Info, MapPin, Clock } from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const apiKey = useApiKey();
  const auth = useAuth();
  const globalCurrency = auth?.currency || 'NGN';
  
  const rideId = searchParams.get('id');
  const price = searchParams.get('price');
  const currency = searchParams.get('currency') || globalCurrency || 'NGN';
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const [rider, setRider] = useState({
    fullName: '',
    email: '',
    phone: '',
    pickupInstructions: ''
  });

  const handleBooking = async () => {
    if (!rider.fullName || !rider.email || !rider.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
        },
        body: JSON.stringify({
          amount: parseFloat(price || '0'),
          currency: currency,
          email: rider.email,
          vertical: 'transfer',
          providerData: {
            rideId: rideId,
            rider: rider
          }
        })
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        setMessage(data.message || 'Transfer scheduled successfully!');
        setSuccess(true);
      } else if (data.paymentDetails?.link) {
        window.location.href = data.paymentDetails.link;
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Booking failed', err);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-[#FF6B00] text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-orange-600/20">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Transfer Scheduled!</h1>
        <p className="text-slate-500 max-w-md mx-auto mt-4 text-lg">
          {message || 'Your vehicle has been successfully reserved and scheduled for pickup.'}
        </p>
        <div className="flex gap-4 mt-10">
          <button 
            onClick={() => window.location.href = '/dashboard/bookings'}
            className="px-8 py-4 bg-[#0A1629] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#FF6B00] transition-all shadow-xl shadow-blue-900/20"
          >
            View Bookings
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard/transfers'}
            className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => window.history.back()}
          className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:border-[#FF6B00] transition-all shadow-sm group"
        >
          <ChevronLeft size={24} className="text-slate-600 group-hover:text-[#FF6B00]" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transfer Checkout</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Schedule your ride and provide pickup details for your driver.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Rider Details */}
          <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-100/50 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-[100px] -z-0" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#0A1629] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <User size={24} className="text-[#FF6B00]" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Passenger Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none transition-all"
                  value={rider.fullName}
                  onChange={(e) => setRider({ ...rider, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none transition-all"
                    value={rider.email}
                    onChange={(e) => setRider({ ...rider, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="tel" 
                    placeholder="+234 ..." 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none transition-all"
                    value={rider.phone}
                    onChange={(e) => setRider({ ...rider, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pickup Instructions</label>
                <textarea 
                  placeholder="e.g. Waiting at Arrival Gate 2 with a name tag" 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none transition-all h-32 resize-none"
                  value={rider.pickupInstructions}
                  onChange={(e) => setRider({ ...rider, pickupInstructions: e.target.value })}
                />
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar / Summary */}
        <div className="space-y-6">
          <div className="bg-[#0A1629] text-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/20 space-y-8 sticky top-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Vehicle</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Car size={20} className="text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight">Executive Sedan</p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> Direct Connect</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Base Rate</span>
                <span className="text-sm font-black">{currency === 'USD' ? '$' : '₦'}{(parseFloat(price || '0') * 0.95).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Booking Fee</span>
                <span className="text-sm font-black">{currency === 'USD' ? '$' : '₦'}{(parseFloat(price || '0') * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF6B00]">Fixed Fare</span>
                <span className="text-2xl font-black tracking-tighter">{currency === 'USD' ? '$' : '₦'}{(parseFloat(price || '0')).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex flex-col gap-3 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/pay">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={24} className="text-emerald-400" />
                    <p className="text-xs font-black text-white uppercase tracking-wider">Travsify Pay</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                    Secure payment gateway supporting {currency === 'NGN' ? 'Naira (NGN) via Local Channels' : 'Global Currencies (USD/EUR)'}.
                  </p>
               </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={loading}
              className="w-full py-5 bg-[#FF6B00] rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
              {loading ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransferCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
