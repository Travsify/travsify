'use client';

import { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  MessageSquare, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Send
} from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'Technical',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/support/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTickets(await res.json());
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/support/tickets`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ subject: '', message: '', category: 'Technical', priority: 'medium' });
        fetchTickets();
      }
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Support Center</h1>
          <p className="text-slate-500 font-bold text-lg">Direct access to our engineering & success teams.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[22px] font-black text-sm hover:bg-orange-600 transition-all shadow-xl active:scale-95"
        >
          {isCreating ? 'View Tickets' : <><Plus size={20} /> Create Ticket</>}
        </button>
      </div>

      {isCreating ? (
        <div className="bg-white rounded-[40px] border border-slate-200 p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
              <input 
                type="text" 
                required
                placeholder="Brief description of the issue"
                className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 outline-none"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Technical</option>
                  <option>Billing</option>
                  <option>API Integration</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                <select 
                  className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
              <textarea 
                required
                rows={6}
                placeholder="Explain the issue in detail. Include IDs or error codes if applicable."
                className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full py-6 bg-orange-600 text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-orange-600/30 hover:bg-slate-900 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
               <Send size={18} />
               Submit Ticket
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <SupportStat icon={<Clock className="text-orange-600" />} label="Average Response" value="4h 12m" />
            <SupportStat icon={<MessageSquare className="text-blue-600" />} label="Active Tickets" value={tickets.filter(t => t.status !== 'resolved').length.toString()} />
            <div className="p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full" />
               <h4 className="font-black text-sm mb-2 tracking-tight">Enterprise Support</h4>
               <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-6">Access priority support and dedicated success manager.</p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Upgrade Plan</button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="p-32 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching your tickets...</p>
              </div>
            ) : tickets.length > 0 ? (
              tickets.map((ticket, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-orange-500/20 hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          ticket.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {ticket.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-orange-600 transition-colors">{ticket.subject}</h3>
                   <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-8">{ticket.message}</p>
                   <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                          {ticket.priority.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority: {ticket.priority}</span>
                      </div>
                      <button className="flex items-center gap-2 text-[11px] font-black text-orange-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                        View Details <ChevronRight size={14} />
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="p-32 text-center bg-white rounded-[40px] border border-slate-200 border-dashed">
                <LifeBuoy className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900 mb-2">No active tickets</h3>
                <p className="text-slate-400 font-bold mb-10">You haven't created any support tickets yet.</p>
                <button onClick={() => setIsCreating(true)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all">Submit First Ticket</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SupportStat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
    </div>
  );
}
