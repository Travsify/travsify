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
  Calendar
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuGroups = [
    {
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Packages', path: '/dashboard/packages', icon: <Layers size={20} /> },
        { name: 'Bookings', path: '/dashboard/bookings', icon: <ScrollText size={20} /> },
        { name: 'Calendar', path: '/dashboard/calendar', icon: <Calendar size={20} /> },
        { name: 'Wallet', path: '/dashboard/wallets', icon: <Wallet size={20} /> },
        { name: 'Developers', path: '/dashboard/developers', icon: <Code2 size={20} /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3f6ff] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white flex flex-col fixed h-full z-50 shadow-sm border-r border-slate-100">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
            <Share2 size={20} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">Travelie<span className="text-blue-500 text-[10px] ml-1 bg-blue-50 px-2 py-0.5 rounded-full align-middle">V 1.0</span></span>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-2">
          {menuGroups[0].items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8">
          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sandbox Active</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">You are currently in test mode. Live booking requires KYC.</p>
            <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-blue-600 shadow-sm hover:shadow-md transition-all">
              Verify Account
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        {/* Top Header */}
        <header className="h-24 sticky top-0 z-40 flex items-center justify-between px-12 bg-[#f3f6ff]/80 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          </div>

          <div className="flex-1 max-w-xl mx-12 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search anything" 
              className="w-full pl-14 pr-6 py-3.5 bg-white border-transparent focus:border-blue-200 rounded-2xl text-sm font-medium shadow-sm focus:shadow-xl focus:shadow-blue-600/5 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm hover:shadow-md transition-all relative">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-white hover:border-blue-200 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">TR</div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-none">Travsify Admin</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">B2B Controller</p>
              </div>
              <ChevronRight size={14} className="ml-2 text-slate-300 group-hover:text-blue-600 transition-all rotate-90" />
            </div>
            <button 
              onClick={logout}
              className="p-3 bg-white text-slate-400 hover:text-rose-600 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
