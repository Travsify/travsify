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
      items: [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Bookings', path: '/dashboard/bookings', icon: <Plane size={20} /> },
        { name: 'Wallet', path: '/dashboard/wallets', icon: <Wallet size={20} /> },
        { name: 'API keys', path: '/dashboard/developers', icon: <Key size={20} /> },
        { name: 'KYC', path: '/dashboard/kyc', icon: <Globe2 size={20} /> },
        { name: 'Developers', path: '/dashboard/docs', icon: <Code2 size={20} /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Share2 size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Skylink<span className="text-blue-600">.</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuGroups[0].items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-[15px] transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 m-4 bg-orange-50/50 rounded-2xl border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-[12px] font-black text-orange-600 uppercase tracking-widest">Sandbox mode</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-3">Complete KYC to enable live bookings.</p>
          <Link href="/dashboard/kyc" className="text-[11px] font-black text-blue-600 hover:underline">Start verification →</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-10">
          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings, PNRs, transactions..." 
              className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-xs font-bold text-slate-600">test mode</span>
              <ChevronRight size={14} className="text-slate-400 rotate-90" />
            </div>
            <button className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-full transition-all">
              <Bell size={18} />
            </button>
            <div className="h-10 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">TR</div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">Travsify Global Inclusive Llc</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">info@vedio.com</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="ml-4 p-2.5 text-slate-400 hover:text-orange-600 bg-slate-50 border border-slate-200 rounded-full transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="p-10 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
