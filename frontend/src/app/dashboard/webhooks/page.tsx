'use client';

import { useState } from 'react';
import { Zap, Plus, Search, MoreHorizontal, CheckCircle2, AlertCircle, Loader2, Copy, Trash2, Globe } from 'lucide-react';

export default function WebhooksPage() {
  const [loading, setLoading] = useState(false);
  const [webhooks] = useState([
    { id: 'wh_1', url: 'https://api.youragency.com/webhooks/skylink', events: ['booking.confirmed', 'wallet.funded'], status: 'Active', lastUsed: '2m ago' },
    { id: 'wh_2', url: 'https://backend.travel.io/hooks', events: ['flight.ticketed'], status: 'Active', lastUsed: '15m ago' }
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Automation (Webhooks)</h1>
          <p className="text-sm text-slate-400 font-medium">Configure real-time event notifications for your endpoints.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl text-xs font-black hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95">
          <Plus size={16} /> Create Endpoint
        </button>
      </div>

      {/* Webhook Endpoints */}
      <div className="grid grid-cols-1 gap-6">
        {webhooks.map((wh) => (
          <div key={wh.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-black text-slate-900 leading-tight truncate max-w-md">{wh.url}</span>
                    <button className="text-slate-300 hover:text-blue-600 transition-colors"><Copy size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wh.events.map(ev => (
                      <span key={ev} className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg">{ev}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{wh.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last delivery: {wh.lastUsed}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
                    <MoreHorizontal size={18} />
                  </button>
                  <button className="w-12 h-12 bg-rose-50 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-all border border-rose-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {webhooks.length === 0 && (
          <div className="py-24 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Globe size={32} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Add your first webhook</h3>
            <p className="text-sm text-slate-400 font-medium">Subscribe to real-time events to automate your business logic.</p>
          </div>
        )}
      </div>

      {/* Webhook Events Documentation */}
      <div className="bg-[#0A1629] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Zap size={160} />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-black mb-4">Supported Events</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Our platform sends JSON payloads to your endpoint whenever an event occurs in your account. Use these to trigger automated tickets, updates, or balance synchronization.</p>
            <div className="space-y-3">
              <EventDoc label="booking.confirmed" sub="Triggered when a flight or hotel booking is finalized." />
              <EventDoc label="wallet.funded" sub="Triggered when a settlement top-up is successful." />
              <EventDoc label="visa.approved" sub="Triggered when an e-visa application is approved by the immigration network." />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-[11px] text-slate-400 overflow-hidden">
            <p className="text-white font-black mb-4 tracking-widest text-[10px]">PAYLOAD EXAMPLE (booking.confirmed)</p>
            <pre className="whitespace-pre-wrap">
{`{
  "event": "booking.confirmed",
  "created_at": "2024-05-27T12:00:00Z",
  "data": {
    "booking_id": "BK-739291",
    "pnr": "XY789P",
    "amount": 450000,
    "currency": "NGN",
    "customer": "John Doe"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDoc({ label, sub }: any) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
      <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5" />
      <div>
        <p className="text-[13px] font-black text-white">{label}</p>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}
