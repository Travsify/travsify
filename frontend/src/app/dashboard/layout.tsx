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
  Globe
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
        {/* Top Header - Travsify White */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Control Center</h1>
            <p className="text-[11px] text-slate-400 font-medium">Real-time overview of your business</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none">
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600">
                <Calendar size={14} className="text-slate-400" />
                <span>{dateRange}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <button className="relative p-2 text-slate-400 hover:text-slate-900">
                <Bell size={20} />
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">3</div>
              </button>
              <Link href="/dashboard/settings">
                <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mr-2 rounded-xl transition-colors">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900 leading-none">{user?.businessName || 'Travsify Partner'}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{user?.role || 'Admin'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm uppercase">
                    {user?.businessName ? user.businessName.substring(0, 2) : 'TR'}
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
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
