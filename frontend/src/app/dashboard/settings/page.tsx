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

import { API_URL } from '@/utils/api';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: user?.businessName || '',
    email: user?.email || ''
  });
  const [markups, setMarkups] = useState({
    flightMarkup: 0,
    hotelMarkup: 0,
    transferMarkup: 0,
    tourMarkup: 0,
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
          transferMarkup: data.transferMarkup || 0,
          tourMarkup: data.tourMarkup || 0,
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditingProfile(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
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
      {/* Business Profile Section */}
      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-orange-50 transition-colors duration-1000 -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="w-32 h-32 rounded-[40px] bg-[#0A1629] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-900/30 shrink-0">
            {user?.businessName ? user.businessName.substring(0, 2) : 'TR'}
          </div>
          
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                  <input 
                    type="text" 
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                  <Save size={14} /> Save Profile
                </button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4 justify-center lg:justify-start">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{user?.businessName || 'Travsify HQ'}</h3>
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100 w-fit mx-auto lg:mx-0">
                    Verified Enterprise
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator Email</p>
                    <p className="text-sm font-bold text-slate-700">{user?.email || 'admin@travsify.com'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Role</p>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{user?.role || 'admin'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                    <p className="text-sm font-bold text-emerald-500 flex items-center gap-2 justify-center lg:justify-start">
                      <CheckCircle2 size={14} /> Active & Secured
                    </p>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Inventory Markup Control</h2>
        <p className="text-slate-500 text-sm font-medium">Define your profit margins for each travel vertical across the global network.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MarkupCard 
            icon={<Plane className="text-blue-600" size={20} />}
            title="Flight Markup"
            value={markups.flightMarkup}
            onChange={(val: string) => setMarkups({...markups, flightMarkup: parseFloat(val)})}
            desc="Percentage added to base flight fares."
          />
          <MarkupCard 
            icon={<Hotel className="text-orange-600" size={20} />}
            title="Hotel Markup"
            value={markups.hotelMarkup}
            onChange={(val: string) => setMarkups({...markups, hotelMarkup: parseFloat(val)})}
            desc="Flat fee or percentage for hotel bookings."
          />
          <MarkupCard 
            icon={<ShieldCheck className="text-emerald-600" size={20} />}
            title="Insurance Markup"
            value={markups.insuranceMarkup}
            onChange={(val: string) => setMarkups({...markups, insuranceMarkup: parseFloat(val)})}
            desc="Platform fee for travel protection."
          />
          <MarkupCard 
            icon={<Settings className="text-purple-600" size={20} />}
            title="Transfer Markup"
            value={markups.transferMarkup}
            onChange={(val: string) => setMarkups({...markups, transferMarkup: parseFloat(val)})}
            desc="Margin for airport transfers."
          />
          <MarkupCard 
            icon={<ShieldCheck className="text-rose-600" size={20} />}
            title="Tour Markup"
            value={markups.tourMarkup}
            onChange={(val: string) => setMarkups({...markups, tourMarkup: parseFloat(val)})}
            desc="Fee for holiday packages & tours."
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
          Pro-Tip: Smart Margins
        </h4>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Travsify NDC is a free infrastructure. We recommend a flight markup of 3-5% for competitive global pricing. Our engine automatically combines your markup with the Travsify base fee to provide a seamless checkout for your end-users. No hidden costs, way simpler and cheaper than standard payment orchestration.
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
