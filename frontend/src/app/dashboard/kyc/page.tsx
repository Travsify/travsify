'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function KycPage() {
  const { user } = useAuth();
  
  const steps = [
    { label: 'Business Profile', status: 'completed' },
    { label: 'KYB Document Review', status: user?.status === 'approved' ? 'completed' : 'active' },
    { label: 'Manual Admin Audit', status: user?.status === 'approved' ? 'completed' : 'pending' },
    { label: 'Full Access Granted', status: user?.status === 'approved' ? 'completed' : 'pending' },
  ];

  return (
    <div className="max-w-4xl space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Thorough Business Verification (KYB)</h2>
          <p className="text-slate-500 font-medium text-sm">Our compliance team conducts a thorough manual audit before granting dashboard access. Verification is mandatory and free.</p>
        </div>
        {user?.status === 'approved' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
            <CheckCircle2 size={16} />
            <span className="text-[12px] font-black uppercase tracking-tight">Verified Merchant</span>
          </div>
        )}
      </header>

      {/* Progress Stepper */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-50 -z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                step.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                step.status === 'active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' :
                'bg-slate-50 text-slate-300'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 size={18} /> : <span className="text-xs font-black">{idx + 1}</span>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                step.status === 'completed' ? 'text-emerald-600' :
                step.status === 'active' ? 'text-blue-600' :
                'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {user?.status === 'approved' ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[40px] flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
            <ShieldCheck size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Verification Complete</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">
            Your business profile has been fully verified. You can now issue live tickets and access premium global inventory.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/api-keys" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              Get Production Keys
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Side */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-slate-900">Upload Documents</h3>
            
            <div className="space-y-6">
              <div className="group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">Certificate of Incorporation (CAC)</label>
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 mb-1">Click to upload file</p>
                  <p className="text-[10px] font-medium text-slate-400">PDF, JPG or PNG (Max. 10MB)</p>
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">Government Issued ID</label>
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center hover:border-indigo-500/50 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={24} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 mb-1">Upload Director ID</p>
                  <p className="text-[10px] font-medium text-slate-400">Passport or Driver License</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-900/10">
                Submit for Verification
              </button>
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-lg shadow-blue-600/20">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Info size={24} />
              </div>
              <h4 className="text-lg font-bold mb-4">Manual KYB Process</h4>
              <p className="text-sm font-medium leading-relaxed opacity-90 mb-6">
                Travsify NDC is a secure infrastructure. We conduct a thorough manual verification of all businesses to maintain network integrity. This process is completely free of charge.
              </p>
              <ul className="space-y-3">
                {[
                  'Free Lifetime Access',
                  'No Subscription Fees',
                  'Manual Admin Audit',
                  'Direct IATA Pipeline Access'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={14} className="text-blue-200" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-orange-500">
                <Clock size={20} />
                <h4 className="text-[13px] font-black uppercase tracking-widest">Review Time</h4>
              </div>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                Our compliance team typically reviews business submissions within <span className="text-slate-900 font-bold">24-48 business hours</span>. You'll receive an email notification once your status is updated.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
