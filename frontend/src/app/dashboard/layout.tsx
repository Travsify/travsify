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
  Settings
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Wallets', path: '/dashboard/wallets', icon: <Wallet size={18} /> },
      ]
    },
    {
      title: 'Services',
      items: [
        { name: 'Flights', path: '/dashboard/bookings', icon: <Plane size={18} /> },
        { name: 'Hotels', path: '/dashboard/hotels', icon: <Hotel size={18} /> },
        { name: 'Transfers', path: '/dashboard/transfers', icon: <Car size={18} /> },
        { name: 'eVisa', path: '/dashboard/visa', icon: <ScrollText size={18} /> },
        { name: 'Insurance', path: '/dashboard/insurance', icon: <ShieldCheck size={18} /> },
      ]
    },
    {
      title: 'Platform',
      items: [
        { name: 'API Keys', path: '/dashboard/developers', icon: <Key size={18} /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
        { name: 'KYC Status', path: '/dashboard/kyc', icon: <Globe2 size={18} /> },
        { name: 'Documentation', path: '/dashboard/developers#docs', icon: <Code2 size={18} /> },
      ]
    },
    ...(user?.role === 'admin' ? [{
      title: 'Management',
      items: [
        { name: 'Admin Console', path: '/dashboard/admin', icon: <ShieldCheck size={18} /> },
      ]
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex font-medium">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-100 flex flex-col fixed h-full bg-white z-50 transition-all duration-300">
        <div className="p-8">
          <Link href="/dashboard" className="text-2xl font-black tracking-tight flex items-center gap-1.5">
            Travsify<span className="text-blue-600">.</span>
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 relative overflow-hidden ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                      )}
                      <div className="flex items-center space-x-3">
                        <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>
                          {item.icon}
                        </span>
                        <span className="text-[14px]">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight size={14} className="opacity-50" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-4 mb-6 px-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-600/30">
                {user?.businessName?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[14px] font-bold text-slate-900 truncate">{user?.businessName}</div>
              <div className="text-[10px] text-slate-400 truncate uppercase font-black tracking-widest">{user?.role}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full group flex items-center space-x-3 px-4 py-3.5 text-[14px] font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-12">
          <div>
            <h1 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {menuGroups.flatMap(g => g.items).find(i => i.path === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12px] font-black uppercase tracking-tight">API Live</span>
            </div>
            <div className="w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer">
              <Globe2 size={18} />
            </div>
          </div>
        </header>

        <div className="p-12 animate-fade-up">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
