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
  Info
} from 'lucide-react';

export default function VisaPage() {
  const visaTypes = [
    { id: '1', country: 'United Arab Emirates', type: '30-Day Tourist', fee: '$120.00', processing: '48-72 Hours', rating: '99% Success' },
    { id: '2', country: 'Saudi Arabia', type: 'eVisa (Multiple Entry)', fee: '$165.00', processing: '24 Hours', rating: '100% Success' },
    { id: '3', country: 'United Kingdom', type: 'Standard Visitor', fee: '$155.00', processing: '15 Working Days', rating: '95% Success' },
    { id: '4', country: 'Turkey', type: 'eVisa', fee: '$60.00', processing: 'Instant', rating: '100% Success' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Global eVisa Portal</h2>
          <p className="text-slate-500 font-medium text-sm">Automated visa processing for 150+ destinations worldwide.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Search destination country..." className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold w-64 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Destinations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visaTypes.map((visa) => (
              <div key={visa.id} className="bg-white p-8 rounded-[32px] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Globe size={24} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={10} />
                    {visa.rating}
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-1">{visa.country}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{visa.type}</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500 font-medium">Processing Time</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-600" />
                      {visa.processing}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500 font-medium">Application Fee</span>
                    <span className="font-black text-blue-600 text-lg">{visa.fee}</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  Start Application
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Active Applications */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Active Submissions
            </h3>
            <div className="space-y-6">
              {[
                { name: 'John Doe', destination: 'Dubai', status: 'In Review', color: 'blue' },
                { name: 'Jane Smith', destination: 'Saudi Arabia', status: 'Approved', color: 'emerald' },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {app.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{app.destination}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${app.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-[12px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl hover:border-blue-200 transition-all">
              View All Applications
            </button>
          </div>

          {/* Quick Tip */}
          <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8 text-orange-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={60} className="fill-orange-600" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} />
              Pro Tip
            </h4>
            <p className="text-[13px] font-medium leading-relaxed opacity-80">
              Ensure all passport scans are in high-resolution JPG format to avoid processing delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
