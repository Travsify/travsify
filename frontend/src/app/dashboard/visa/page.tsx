'use client';

import { 
  ScrollText, 
  Search, 
  Globe, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  AlertCircle,
  Zap,
  Info,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const SHERPA_LINK = "https://apply.joinsherpa.com/explore?affiliateId=pickpadiglobalinclusivelimited";

export default function VisaPage() {
  const visaTypes = [
    { id: '1', country: 'United Arab Emirates', type: '30-Day Tourist', fee: '$120.00', processing: '48-72 Hours', rating: '99% Success' },
    { id: '2', country: 'Saudi Arabia', type: 'eVisa (Multiple Entry)', fee: '$165.00', processing: '24 Hours', rating: '100% Success' },
    { id: '3', country: 'United Kingdom', type: 'Standard Visitor', fee: '$155.00', processing: '15 Working Days', rating: '95% Success' },
    { id: '4', country: 'Turkey', type: 'eVisa', fee: '$60.00', processing: 'Instant', rating: '100% Success' },
  ];

  return (
    <div className="relative space-y-10 pb-20 animate-fade-up">
      {/* Background Decor */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100 shadow-sm">
            <Zap size={12} className="fill-orange-600" />
            Sherpa Intelligence Active
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2 leading-none">
            Global <span className="text-blue-600">eVisa</span> Engine
          </h2>
          <p className="text-slate-500 font-bold text-lg">
            Automated visa processing and travel requirement intelligence for 150+ destinations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={SHERPA_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-blue-600 text-white rounded-[24px] font-black text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
          >
            Open Full Portal
            <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Hero Search Card */}
      <div className="bg-[#0f172a] rounded-[48px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-black/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <Globe size={180} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl font-black mb-4 tracking-tight leading-none text-blue-400">Where are you traveling to?</h3>
          <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
            Instantly check visa requirements, health regulations, and entry restrictions for any country in the world.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
               <input 
                  type="text" 
                  placeholder="Enter destination country..." 
                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
               />
             </div>
             <a 
               href={SHERPA_LINK} 
               target="_blank" 
               rel="noopener noreferrer"
               className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
             >
               Check Requirements
               <ArrowRight size={20} />
             </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visaTypes.map((visa) => (
              <div key={visa.id} className="group bg-white p-10 rounded-[40px] border border-slate-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 -z-10" />
                
                <div className="flex justify-between items-start mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Globe size={28} />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    <CheckCircle2 size={12} />
                    {visa.rating}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{visa.country}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">{visa.type}</p>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-slate-500">Processing</span>
                    <span className="text-[13px] font-black text-slate-900 flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      {visa.processing}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-slate-500">Starting Fee</span>
                    <span className="text-2xl font-black text-blue-600 tracking-tight">{visa.fee}</span>
                  </div>
                </div>

                <a 
                  href={SHERPA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4.5 bg-slate-900 text-white rounded-[22px] font-black text-[13px] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 group/btn"
                >
                  Start Application
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Security Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-xl shadow-blue-600/20">
             <ShieldCheck size={40} className="mb-6 text-blue-200" />
             <h4 className="text-xl font-black mb-4 tracking-tight leading-tight">Secured by Sherpa</h4>
             <p className="text-blue-100/70 text-[13px] font-bold leading-relaxed">
               All applications are processed through the world's leading travel requirement intelligence network.
             </p>
          </div>

          {/* Quick Support Card */}
          <div className="bg-white rounded-[40px] border border-slate-200/60 p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <ScrollText size={22} className="text-blue-600" />
              Document Prep
            </h3>
            <div className="space-y-6">
              <PrepStep label="Passport Scan (High Res)" />
              <PrepStep label="Recent Digital Photo" />
              <PrepStep label="Flight Itinerary" />
              <PrepStep label="Proof of Accommodation" />
            </div>
            <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="flex items-center gap-3 text-orange-600 mb-2">
                 <AlertCircle size={18} />
                 <span className="text-[11px] font-black uppercase tracking-widest">Important</span>
               </div>
               <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                 Double-check your passport expiry. Most countries require at least 6 months validity.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrepStep({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        <CheckCircle2 size={16} />
      </div>
      <span className="text-[13px] font-bold text-slate-600">{label}</span>
    </div>
  );
}
