'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  ArrowLeft,
  ChevronRight,
  FileText,
  User,
  Mail,
  MapPin,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';
import { useAuth } from '@/context/AuthContext';

function VisaCheckoutContent() {
  const searchParams = useSearchParams();
  const apiKey = useApiKey();
  const { currency: userCurrency } = useAuth();
  
  const id = searchParams.get('id');
  const destination = searchParams.get('destination');
  const price = searchParams.get('price');
  const currency = searchParams.get('currency') || userCurrency || 'USD';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    passportNumber: '',
    arrivalDate: '',
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': apiKey || '' 
        },
        body: JSON.stringify({
          amount: parseFloat(price || '0'),
          currency,
          email: formData.email,
          vertical: 'visa',
          providerData: {
            visaId: id,
            destination,
            passengers: [{
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               passportNumber: formData.passportNumber
            }],
            arrivalDate: formData.arrivalDate,
            baseAmount: parseFloat(price || '0')
          }
        })
      });

      const data = await res.json();
      if (data.status === 'pending_payment' && data.paymentDetails?.link) {
        window.location.href = data.paymentDetails.link;
      } else if (data.status === 'success') {
        window.location.href = '/dashboard/bookings';
      } else {
        alert(data.message || 'Payment initiation failed');
      }
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-[#0A1629] transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Requirements</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#0A1629] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                <User size={28} className="text-[#FF6B00]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Applicant Details</h2>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Information as shown on passport</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. John"
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-[#FF6B00]/20 focus:bg-white transition-all shadow-inner"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Doe"
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-[#FF6B00]/20 focus:bg-white transition-all shadow-inner"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    placeholder="e.g. john.doe@example.com"
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-[#FF6B00]/20 focus:bg-white transition-all shadow-inner"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Passport Number</label>
                <div className="relative">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. A12345678"
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-[#FF6B00]/20 focus:bg-white transition-all shadow-inner uppercase"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expected Arrival Date</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="date" 
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-[#FF6B00]/20 focus:bg-white transition-all shadow-inner"
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0A1629] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
               <FileText size={160} />
             </div>
             
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                 <MapPin size={24} className="text-[#FF6B00]" />
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">e-Visa Application</p>
                 <p className="text-lg font-black">{destination}</p>
               </div>
             </div>

             <div className="space-y-4 mb-10 border-t border-white/5 pt-8">
               <div className="flex items-center justify-between">
                 <span className="text-[11px] font-bold text-slate-400">Visa Service Fee</span>
                 <span className="text-sm font-black">{currency} {price}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[11px] font-bold text-slate-400">Travsify Settle Fee</span>
                 <span className="text-sm font-black text-emerald-400">INCLUDED</span>
               </div>
               <div className="h-px bg-white/10 my-4" />
               <div className="flex items-center justify-between">
                 <span className="text-xs font-black uppercase tracking-widest">Grand Total</span>
                 <span className="text-3xl font-black text-[#FF6B00]">{currency} {price}</span>
               </div>
             </div>

             <button 
               onClick={handleCheckout}
               disabled={loading || !formData.email}
               className="w-full py-5 bg-[#FF6B00] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#0A1629] transition-all duration-500 shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
             >
               {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
               {loading ? 'Initiating Travsify Pay...' : 'Pay with Travsify Pay'}
             </button>
             
             <div className="mt-8 flex flex-col gap-4">
               <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/5">
                 <ShieldCheck size={14} className="text-emerald-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">SSL Encrypted Payment</span>
               </div>
               <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/5">
                 <Lock size={14} className="text-[#FF6B00]" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Direct Connect</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisaCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#FF6B00]" size={40} />
      </div>
    }>
      <VisaCheckoutContent />
    </Suspense>
  );
}
