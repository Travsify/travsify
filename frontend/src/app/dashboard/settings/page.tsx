'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings, 
  Save, 
  Plane, 
  Hotel, 
  ShieldCheck, 
  Percent, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [markups, setMarkups] = useState({
    flightMarkup: 0,
    hotelMarkup: 0,
    insuranceMarkup: 0
  });

  useEffect(() => {
    fetchMarkups();
  }, []);

  const fetchMarkups = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tenant/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMarkups({
          flightMarkup: data.flightMarkup || 0,
          hotelMarkup: data.hotelMarkup || 0,
          insuranceMarkup: data.insuranceMarkup || 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch markups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tenant/markups`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(markups)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save markups:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-up">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Platform Settings</h2>
        <p className="text-slate-500 font-medium">Configure your profit margins and platform defaults.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MarkupCard 
            icon={<Plane className="text-blue-600" size={20} />}
            title="Flight Markup"
            value={markups.flightMarkup}
            onChange={(val) => setMarkups({...markups, flightMarkup: parseFloat(val)})}
            desc="Percentage added to base flight fares."
          />
          <MarkupCard 
            icon={<Hotel className="text-orange-600" size={20} />}
            title="Hotel Markup"
            value={markups.hotelMarkup}
            onChange={(val) => setMarkups({...markups, hotelMarkup: parseFloat(val)})}
            desc="Flat fee or percentage for hotel bookings."
          />
          <MarkupCard 
            icon={<ShieldCheck className="text-emerald-600" size={20} />}
            title="Insurance Markup"
            value={markups.insuranceMarkup}
            onChange={(val) => setMarkups({...markups, insuranceMarkup: parseFloat(val)})}
            desc="Platform fee for travel protection."
          />
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Save Changes</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update takes effect immediately</p>
              </div>
            </div>
            <button 
              type="submit"
              disabled={saving}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Update Markups'}
            </button>
          </div>
          
          {success && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 animate-fade-up">
              <CheckCircle2 size={20} />
              <span className="text-sm font-bold">Settings updated successfully! Your new markups are now live.</span>
            </div>
          )}
        </div>
      </form>

      <div className="p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />
        <h4 className="font-black mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-400" />
          Pro-Tip: Smart Pricing
        </h4>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          We recommend a flight markup of 3-5% for competitive pricing. Our engine automatically combines your markup with the Travsify base fee to provide a seamless checkout for your end-users.
        </p>
      </div>
    </div>
  );
}

function MarkupCard({ icon, title, value, onChange, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-100 transition-all group">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-black text-slate-900 mb-1">{title}</h3>
      <p className="text-[11px] font-medium text-slate-400 mb-6 leading-relaxed">{desc}</p>
      
      <div className="relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Percent size={16} />
        </div>
        <input 
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
    </div>
  );
}
