'use client';

import { useState } from 'react';
import { Activity, Search, Filter, Terminal, ChevronRight, ChevronDown, CheckCircle2, AlertCircle, Loader2, Clock, Globe } from 'lucide-react';

export default function LogsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logs] = useState([
    { id: 'log_1', method: 'POST', endpoint: '/v1/flights/search', status: 200, latency: '142ms', time: 'Just now', provider: 'Direct Connect' },
    { id: 'log_2', method: 'GET', endpoint: '/v1/wallet/balance', status: 200, latency: '12ms', time: '12s ago', provider: 'System' },
    { id: 'log_3', method: 'POST', endpoint: '/v1/visa/requirements', status: 403, latency: '84ms', time: '2m ago', provider: 'International' },
    { id: 'log_4', method: 'GET', endpoint: '/v1/hotels/search', status: 200, latency: '312ms', time: '5m ago', provider: 'Global Network' },
    { id: 'log_5', method: 'POST', endpoint: '/v1/bookings/confirm', status: 200, latency: '842ms', time: '10m ago', provider: 'System' }
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Logs</h1>
          <p className="text-sm text-slate-400 font-medium">Detailed HTTP request and response history for API debugging.</p>
        </div>
        <div className="flex bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live Stream Active</span>
        </div>
      </div>

      {/* Log Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by endpoint, status or provider..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600">
            <Filter size={16} /> All Status
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600">
            <Terminal size={16} /> Export
          </button>
        </div>
      </div>

      {/* Logs Stream */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div 
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer group"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === 200 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {log.status === 200 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-black text-slate-900 leading-tight">
                    <span className={`text-[10px] uppercase mr-3 px-2 py-0.5 rounded ${log.method === 'POST' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{log.method}</span>
                    {log.endpoint}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> {log.latency}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{log.provider}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-[13px] font-black ${log.status === 200 ? 'text-emerald-500' : 'text-rose-500'}`}>{log.status} {log.status === 200 ? 'OK' : 'Error'}</span>
                <ChevronRight size={18} className={`text-slate-300 transition-transform ${expanded === log.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {expanded === log.id && (
              <div className="bg-slate-50 p-8 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Request Body</h4>
                    <pre className="bg-[#0A1629] text-blue-400 p-6 rounded-xl font-mono text-[11px] overflow-x-auto">
                      {JSON.stringify({
                        origin: 'LOS',
                        destination: 'LHR',
                        departure_date: '2024-06-20',
                        passengers: 1
                      }, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Response Payload</h4>
                    <pre className="bg-[#0A1629] text-emerald-400 p-6 rounded-xl font-mono text-[11px] overflow-x-auto">
                      {JSON.stringify({
                        status: 'success',
                        data: {
                          results_count: 42,
                          provider: log.provider,
                          request_id: `req_${Math.random().toString(36).substring(7)}`
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
