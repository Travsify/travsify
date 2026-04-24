'use client';

import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  FileText, 
  User, 
  MapPin, 
  Calendar,
  ChevronRight
} from 'lucide-react';

interface VisaTrackerProps {
  applicationId: string;
  status: string;
  destination: string;
  applicantName: string;
  submissionDate: string;
  estimatedCompletion: string;
  steps?: { label: string; status: 'completed' | 'current' | 'upcoming' | 'failed' }[];
}

export default function VisaTracker({ 
  applicationId, 
  status, 
  destination, 
  applicantName, 
  submissionDate, 
  estimatedCompletion,
  steps = [
    { label: 'Application Submitted', status: 'completed' },
    { label: 'Document Verification', status: 'current' },
    { label: 'Embassy Processing', status: 'upcoming' },
    { label: 'Visa Issued', status: 'upcoming' }
  ]
}: VisaTrackerProps) {
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'issued':
      case 'fulfilled':
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'failed':
      case 'rejected':
        return 'text-rose-500 bg-rose-50 border-rose-100';
      case 'processing':
      case 'current':
        return 'text-blue-500 bg-blue-50 border-blue-100';
      default:
        return 'text-orange-500 bg-orange-50 border-orange-100';
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="p-8 bg-[#0A1629] text-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#FF6B00] border border-white/10">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Visa Application Tracker</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {applicationId}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DetailItem icon={<MapPin size={14}/>} label="Destination" value={destination} />
          <DetailItem icon={<User size={14}/>} label="Applicant" value={applicantName} />
          <DetailItem icon={<Calendar size={14}/>} label="Submitted" value={submissionDate} />
          <DetailItem icon={<Clock size={14}/>} label="ETA" value={estimatedCompletion} />
        </div>
      </div>

      <div className="p-10 bg-white">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-100" />
          
          <div className="space-y-10">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-8 group">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${
                  step.status === 'completed' ? 'bg-emerald-500 text-white' :
                  step.status === 'current' ? 'bg-blue-500 text-white animate-pulse' :
                  step.status === 'failed' ? 'bg-rose-500 text-white' :
                  'bg-slate-100 text-slate-300'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 size={18} /> :
                   step.status === 'current' ? <Loader2 size={18} className="animate-spin" /> :
                   step.status === 'failed' ? <AlertCircle size={18} /> :
                   <div className="w-2 h-2 bg-slate-300 rounded-full" />}
                </div>
                
                <div className="pt-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-[13px] font-black uppercase tracking-widest ${
                      step.status === 'upcoming' ? 'text-slate-300' : 'text-slate-900'
                    }`}>
                      {step.label}
                    </h4>
                    {step.status === 'current' && (
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">Live Update</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    {step.status === 'completed' ? 'Verified and processed successfully.' :
                     step.status === 'current' ? 'Our global network is currently verifying documents.' :
                     step.status === 'upcoming' ? 'Awaiting previous step completion.' :
                     'Action required. Please check your email.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Download Receipt</p>
              <p className="text-[10px] text-slate-500 font-medium">Official application confirmation</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
        {icon} {label}
      </p>
      <p className="text-xs font-black text-white">{value}</p>
    </div>
  );
}
