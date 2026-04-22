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
  Bell
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuGroups = [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'My Wallets', path: '/dashboard/wallets', icon: <Wallet size={18} /> },
      ]
    },
    {
      title: 'Services',
      items: [
        { name: 'Flights', path: '/dashboard/bookings', icon: <Plane size={18} /> },
        { name: 'Hotels', path: '/dashboard/hotels', icon: <Hotel size={18} /> },
        { name: 'Transfers', path: '/dashboard/transfers', icon: <Car size={18} /> },
        { name: 'Visas', path: '/dashboard/visa', icon: <ScrollText size={18} /> },
        { name: 'Insurance', path: '/dashboard/insurance', icon: <ShieldCheck size={18} /> },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'API Keys', path: '/dashboard/developers', icon: <Key size={18} /> },
        { name: 'Verify Business', path: '/dashboard/kyc', icon: <Globe2 size={18} /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
      ]
    },
    ...(user?.role === 'admin' ? [{
      title: 'Admin Control',
      items: [
        { name: 'Master Console', path: '/dashboard/admin', icon: <ShieldCheck size={18} /> },
      ]
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-medium">
      {/* Sidebar - Executive Slate */}
      <aside className="w-80 bg-[#0a0f18] border-r border-white/5 flex flex-col fixed h-full z-50 transition-all duration-300 shadow-2xl">
        <div className="p-10">
          <Link href="/dashboard" className="text-2xl font-black tracking-tighter flex items-center gap-1.5 text-white">
            Travsify<span className="text-orange-500">.</span>
          </Link>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">B2B Travel Engine</p>
        </div>
        
        <div className="flex-1 px-6 py-4 space-y-10 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 relative overflow-hidden ${
                        isActive 
                          ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-500'} transition-colors`}>
                          {item.icon}
                        </span>
                        <span className="text-[14px] font-bold tracking-tight">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight size={14} className="opacity-50" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center space-x-4 mb-8 px-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-black text-sm text-white shadow-lg">
                {user?.businessName?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-[#0a0f18] shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[14px] font-black text-white truncate leading-tight">{user?.businessName}</div>
              <div className="text-[9px] text-slate-500 truncate uppercase font-black tracking-widest mt-1">Status: {user?.role}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full group flex items-center space-x-3 px-5 py-4 text-[13px] font-black text-slate-500 hover:text-orange-500 hover:bg-orange-500/5 rounded-2xl transition-all duration-200 border border-transparent hover:border-orange-500/10"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 min-h-screen overflow-y-auto">
        {/* Top Header - Executive Slate */}
        <header className="h-24 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-16">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            <h1 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {menuGroups.flatMap(g => g.items).find(i => i.path === pathname)?.name || 'Command Center'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[11px] font-black uppercase tracking-widest">Global Terminal Live</span>
            </div>
            <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer bg-white shadow-sm">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="p-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
