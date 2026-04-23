'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  Plane, 
  Key, 
  ShieldCheck, 
  Code2, 
  Hotel, 
  Car, 
  Globe2, 
  ScrollText,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Share2,
  Search,
  Layers,
  Calendar,
  Database,
  Zap,
  Activity,
  Globe,
  ChevronDown,
  Wallet
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, currency, setCurrency } = useAuth();
  const pathname = usePathname();

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateRange = `${formatDate(today)} - ${formatDate(nextWeek)}`;

  const menuGroups = [
    {
      label: 'OPERATIONS',
      items: [
        { name: 'Control Center', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Global Terminal', path: '/dashboard/terminal', icon: <Search size={18} /> },
        { name: 'Orders & Bookings', path: '/dashboard/bookings', icon: <ScrollText size={18} /> },
      ]
    },
    {
      label: 'TRAVEL VERTICALS',
      items: [
        { name: 'Flights', path: '/dashboard/flights', icon: <Plane size={18} /> },
        { name: 'Hotels', path: '/dashboard/hotels', icon: <Hotel size={18} /> },
        { name: 'Transfers', path: '/dashboard/transfers', icon: <Car size={18} /> },
        { name: 'Tours', path: '/dashboard/tours', icon: <Globe size={18} /> },
        { name: 'Insurance', path: '/dashboard/insurance', icon: <ShieldCheck size={18} /> },
      ]
    },
    {
      label: 'FINANCE & SETTLEMENT',
      items: [
        { name: 'Settlement Wallet', path: '/dashboard/wallets', icon: <Wallet size={18} /> },
        { name: 'Financial Ledger', path: '/dashboard/ledger', icon: <Database size={18} /> },
      ]
    },
    {
      label: 'DEVELOPER SUITE',
      items: [
        { name: 'API Keys', path: '/dashboard/developers', icon: <Key size={18} /> },
        { name: 'Webhooks', path: '/dashboard/webhooks', icon: <Zap size={18} /> },
        { name: 'API Logs', path: '/dashboard/logs', icon: <Activity size={18} /> },
        { name: 'Documentation', path: '/dashboard/docs', icon: <Code2 size={18} /> },
      ]
    },
    {
      label: 'COMPLIANCE & SETTINGS',
      items: [
        { name: 'KYC Verification', path: '/dashboard/kyc', icon: <ShieldCheck size={18} /> },
        { name: 'Organization', path: '/dashboard/settings', icon: <Settings size={18} /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar - Travsify Dark Navy */}
      <aside className="w-64 bg-[#0A1629] flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
            <Globe size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white leading-none">Travsify</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">API Platform</span>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <h3 className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">{group.label}</h3>
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-[13px] transition-all group ${
                      isActive 
                        ? 'bg-[#FF6B00] text-white' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 m-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[11px] font-black text-white">Need Help?</p>
              <p className="text-[10px] text-slate-500 font-medium">Visit support center</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top Header - Travsify Premium White */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-[#0A1629] tracking-tighter">Control Center</h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Live System Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Global Controls */}
            <div className="flex items-center gap-4">
              {/* Currency Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-[#0A1629] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  {currency}
                  <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50">
                  {['NGN', 'USD'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`w-full text-left px-4 py-2 text-xs font-black hover:bg-slate-50 transition-colors ${currency === c ? 'text-[#FF6B00]' : 'text-slate-600'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range - Premium Display */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2.5 text-xs font-black text-slate-700 shadow-inner shadow-slate-100/50">
                <Calendar size={15} className="text-[#FF6B00]" />
                <span>{dateRange}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 border-l border-slate-200 pl-8">
              {/* Notifications */}
              <div className="relative group">
                <button className="relative p-2.5 text-slate-400 hover:text-[#0A1629] bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                  <Bell size={22} />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B00] rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center shadow-lg shadow-orange-600/30">3</div>
                </button>
                
                {/* Notification Dropdown */}
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="text-sm font-black text-[#0A1629] uppercase tracking-widest">Recent Alerts</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      { title: 'New Flight Booking', time: '2 mins ago', icon: <Plane size={14} />, color: 'bg-blue-50 text-blue-600' },
                      { title: 'Wallet Threshold Alert', time: '1 hour ago', icon: <Wallet size={14} />, color: 'bg-orange-50 text-[#FF6B00]' },
                      { title: 'System Maintenance', time: '5 hours ago', icon: <Activity size={14} />, color: 'bg-slate-50 text-slate-600' },
                    ].map((n, i) => (
                      <div key={i} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 group/item">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                            {n.icon}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-[#0A1629] mb-1">{n.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-50 text-center">
                    <button className="text-[11px] font-black text-[#FF6B00] uppercase tracking-widest hover:underline">View All Notifications</button>
                  </div>
                </div>
              </div>

              {/* User Identity Menu */}
              <div className="relative group">
                <div className="flex items-center gap-4 cursor-pointer p-1 rounded-2xl transition-all">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-black text-[#0A1629] leading-tight">{user?.businessName || 'Travsify HQ'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Platform Admin</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1629] flex items-center justify-center text-white font-black text-sm uppercase shadow-xl shadow-blue-900/20 relative group-hover:scale-105 transition-transform duration-300">
                    {user?.businessName ? user.businessName.substring(0, 2) : 'TR'}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                  </div>
                  <ChevronDown size={14} className="text-slate-300 group-hover:rotate-180 transition-transform duration-300" />
                </div>

                {/* Profile Dropdown */}
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-[32px] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden py-2">
                  <Link href="/dashboard/settings">
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group/link">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                        <Settings size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-[#0A1629]">Organization Profile</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Business Info</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/dashboard/settings">
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group/link">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center group-hover/link:bg-[#FF6B00] group-hover/link:text-white transition-all">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-[#0A1629]">Platform Settings</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">API & Security</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/dashboard/docs">
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group/link">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/link:bg-emerald-600 group-hover/link:text-white transition-all">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-[#0A1629]">Help & Support</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">24/7 Assistance</p>
                      </div>
                    </div>
                  </Link>
                  <div className="mx-6 my-2 border-t border-slate-50" />
                  <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-rose-50 transition-colors group/link text-rose-600">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover/link:bg-rose-600 group-hover/link:text-white transition-all">
                      <LogOut size={18} />
                    </div>
                    <p className="text-[13px] font-black uppercase tracking-widest">Terminate Session</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
