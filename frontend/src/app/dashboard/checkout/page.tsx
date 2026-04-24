'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Globe,
  Info
} from 'lucide-react';
import { API_URL } from '@/utils/api';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, currency } = useAuth();
  
  // Params from the search results
  const vertical = searchParams.get('vertical') || 'hotel';
  const provider = searchParams.get('provider') || 'Direct Connect';
  const itemId = searchParams.get('id');
  const itemName = searchParams.get('name') || 'Travel Service';
  const basePrice = parseFloat(searchParams.get('price') || '0');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  const [pax, setPax] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    passportNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');

  const [error, setError] = useState<any>(null);

  const handleBooking = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/bookings/create-managed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vertical,
          provider,
          itemId,
          itemName,
          pax,
          amount: basePrice,
          currency,
          paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        setBookingId(data.id);
        setSuccess(true);
      } else {
        if (data.message?.code === 'INSUFFICIENT_FUNDS') {
          setError(data.message);
        } else {
          setError({ message: data.message || 'Booking failed. Please try again later.' });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError({ message: 'A network error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Booking Received!</h2>
        <p className="text-slate-500 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Your payment was successful. Our operations team is now fulfilling your <span className="font-bold text-slate-900 uppercase">{vertical}</span> booking via our Verified Network.
        </p>
        
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl mb-12 text-left">
           <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-50">
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking Reference</p>
               <p className="text-xl font-black text-[#FF6B00]">{bookingId.substring(0, 8).toUpperCase()}</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full uppercase">Pending Fulfillment</span>
             </div>
           </div>
           <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
             "You will receive your official voucher and confirmation via email as soon as the manual fulfillment is complete (typically within 15-30 minutes)."
           </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push('/dashboard')} className="px-10 py-5 bg-[#0A1629] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-2xl shadow-blue-900/20">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-10">
          <section className="bg-white p-10 lg:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
               <Globe size={200} />
             </div>
             
             <div className="flex items-center gap-6 mb-12">
               <div className="w-16 h-16 bg-[#0A1629] text-[#FF6B00] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                 <User size={32} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Passenger Details</h2>
                 <p className="text-sm text-slate-400 font-medium">Please ensure details match your travel documents.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <InputGroup label="First Name" value={pax.firstName} onChange={(val: string) => setPax({...pax, firstName: val})} icon={<User size={18} />} />
               <InputGroup label="Last Name" value={pax.lastName} onChange={(val: string) => setPax({...pax, lastName: val})} icon={<User size={18} />} />
               <InputGroup label="Email Address" value={pax.email} onChange={(val: string) => setPax({...pax, email: val})} icon={<Mail size={18} />} />
               <InputGroup label="Phone Number" value={pax.phone} onChange={(val: string) => setPax({...pax, phone: val})} icon={<Phone size={18} />} />
               <div className="md:col-span-2">
                 <InputGroup label="Passport Number (Optional)" value={pax.passportNumber} onChange={(val: string) => setPax({...pax, passportNumber: val})} icon={<ShieldCheck size={18} />} />
               </div>
             </div>
          </section>

          <section className="bg-white p-10 lg:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50">
             <div className="flex items-center gap-6 mb-12">
               <div className="w-16 h-16 bg-[#0A1629] text-[#FF6B00] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                 <CreditCard size={32} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Orchestration</h2>
                 <p className="text-sm text-slate-400 font-medium">Select your preferred payment channel.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentCard 
                  active={paymentMethod === 'wallet'} 
                  onClick={() => setPaymentMethod('wallet')}
                  icon={<Wallet size={24} />} 
                  label="Travsify Wallet" 
                  sub={`Pay via your ${currency} balance`} 
                />
                <PaymentCard 
                  active={paymentMethod === 'card'} 
                  onClick={() => setPaymentMethod('card')}
                  icon={<CreditCard size={24} />} 
                  label="Debit/Credit Card" 
                  sub="Visa, Mastercard, Verve" 
                />
             </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[450px]">
          <div className="sticky top-12 space-y-8">
            <div className="bg-[#0A1629] p-10 rounded-[48px] text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <ShieldCheck size={120} />
               </div>
               
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Order Summary</p>
               <h3 className="text-2xl font-black mb-8 leading-tight">{itemName}</h3>
               
               <div className="space-y-6 mb-12 relative z-10">
                 <SummaryRow label="Vertical" value={vertical.toUpperCase()} />
                 <SummaryRow label="Network" value="Verified Direct" />
                 <SummaryRow label="Fulfillment" value="Manual (Secure)" color="text-[#FF6B00]" />
               </div>

                <div className="pt-10 border-t border-white/10 relative z-10">
                   {error && (
                     <div className="mb-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-[24px] flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                       <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                       <div>
                         <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">{error.code === 'INSUFFICIENT_FUNDS' ? 'Insufficient Balance' : 'Payment Error'}</p>
                         <p className="text-xs font-bold text-slate-400 leading-relaxed">{error.message}</p>
                         {error.code === 'INSUFFICIENT_FUNDS' && (
                           <button 
                             onClick={() => router.push('/dashboard/wallet')}
                             className="mt-4 text-[10px] font-black text-[#FF6B00] uppercase tracking-[0.2em] hover:underline flex items-center gap-2"
                           >
                             Fund your {error.currency || 'NGN'} wallet now <ChevronRight size={12} />
                           </button>
                         )}
                       </div>
                     </div>
                   )}

                   <div className="flex justify-between items-end mb-10">
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Amount</p>
                       <p className="text-5xl font-black tracking-tighter">{currency === 'USD' ? '$' : '₦'}{basePrice.toLocaleString()}</p>
                     </div>
                   </div>
                   
                   <button 
                     onClick={handleBooking}
                     disabled={loading}
                     className={`w-full py-6 rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 ${
                       error?.code === 'INSUFFICIENT_FUNDS' 
                         ? 'bg-slate-700 text-white cursor-not-allowed opacity-50' 
                         : 'bg-[#FF6B00] text-white shadow-orange-600/40'
                     }`}
                   >
                     {loading ? <Loader2 className="animate-spin" /> : 'Confirm & Pay'}
                     {!loading && <ChevronRight size={20} />}
                   </button>
                   <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
                     <Lock size={12} /> SSL Secure Encrypted Transaction
                   </p>
                </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <Info size={20} />
              </div>
              <p className="text-xs font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                Managed Fulfillment: As a Merchant of Record, we manually secure your booking with the provider immediately after payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlobalCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Initializing Secure Checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function InputGroup({ label, value, onChange, icon }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF6B00] transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl font-black text-slate-900 outline-none focus:border-[#FF6B00]/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50"
        />
      </div>
    </div>
  );
}

function PaymentCard({ active, onClick, icon, label, sub }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all duration-500 flex items-center gap-6 ${active ? 'bg-[#0A1629] border-[#0A1629] text-white shadow-2xl shadow-blue-900/30' : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${active ? 'bg-white/10 text-[#FF6B00]' : 'bg-slate-50 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-black tracking-tight leading-none mb-1">{label}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className={color || 'text-white'}>{value}</span>
    </div>
  );
}



