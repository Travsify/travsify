'use client';

import { useState, useEffect } from 'react';
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
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock
} from 'lucide-react';

import { API_URL } from '@/utils/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, currency, setCurrency } = useAuth();
  const pathname = usePathname();

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateRange = `${formatDate(today)} - ${formatDate(nextWeek)}`;

  const isApproved = user?.status === 'approved';
  const isKycPage = pathname === '/dashboard/kyc';

  useEffect(() => {
    if (user && !isApproved && !isKycPage && pathname !== '/dashboard' && pathname !== '/dashboard/settings') {
      // Allow them to see home and settings, but for everything else, redirect to KYC if not approved
      // window.location.href = '/dashboard/kyc';
    }
  }, [user, isApproved, pathname]);

  const menuGroups = [
    {
      label: 'OPERATIONS',
      items: [
        { name: 'Control Center', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Global Terminal', path: '/dashboard/terminal', icon: <Search size={18} />, locked: !isApproved },
        { name: 'Orders & Bookings', path: '/dashboard/bookings', icon: <ScrollText size={18} />, locked: !isApproved },
      ]
    },
    {
      label: 'TRAVEL VERTICALS',
      items: [
        { name: 'Flights', path: '/dashboard/flights', icon: <Plane size={18} />, locked: !isApproved },
        { name: 'Hotels', path: '/dashboard/hotels', icon: <Hotel size={18} />, locked: !isApproved },
        { name: 'Visa & e-Visa', path: '/dashboard/visa', icon: <FileText size={18} />, locked: !isApproved },
        { name: 'Transfers', path: '/dashboard/transfers', icon: <Car size={18} />, locked: !isApproved },
        { name: 'Tours', path: '/dashboard/tours', icon: <Globe size={18} />, locked: !isApproved },
        { name: 'Insurance', path: '/dashboard/insurance', icon: <ShieldCheck size={18} />, locked: !isApproved },
      ]
    },
    {
      label: 'FINANCE & SETTLEMENT',
      items: [
        { name: 'Settlement Wallet', path: '/dashboard/wallets', icon: <Wallet size={18} />, locked: !isApproved },
        { name: 'Financial Ledger', path: '/dashboard/ledger', icon: <Database size={18} />, locked: !isApproved },
      ]
    },
    {
      label: 'DEVELOPER SUITE',
      items: [
        { name: 'API Keys', path: '/dashboard/developers?tab=keys', icon: <Key size={18} />, locked: !isApproved },
        { name: 'Webhooks', path: '/dashboard/developers?tab=webhooks', icon: <Zap size={18} />, locked: !isApproved },
        { name: 'API Logs', path: '/dashboard/developers?tab=logs', icon: <Activity size={18} />, locked: !isApproved },
        { name: 'Documentation', path: '/dashboard/docs', icon: <Code2 size={18} /> },
      ]
    },
    {
      label: 'COMPLIANCE & SETTINGS',
      items: [
        { name: 'Business Verification', path: '/dashboard/kyc', icon: <ShieldCheck size={18} /> },
        { name: 'Organization Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
      ]
    }
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/v1/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.isRead).length);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return { icon: <CheckCircle2 size={14} />, color: 'bg-emerald-50 text-emerald-600' };
      case 'warning': return { icon: <Wallet size={14} />, color: 'bg-orange-50 text-[#FF6B00]' };
      case 'error': return { icon: <AlertCircle size={14} />, color: 'bg-rose-50 text-rose-600' };
      default: return { icon: <Activity size={14} />, color: 'bg-blue-50 text-blue-600' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Elite Glassmorphism */}
      <aside className="w-[300px] bg-[#0A1629]/95 backdrop-blur-2xl flex flex-col fixed h-full z-50 border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.1)]">
        <div className="p-10 flex items-center gap-4 group cursor-pointer">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B00] to-[#FF8A00] rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_rgba(255,107,0,0.3)] group-hover:rotate-6 transition-transform duration-500">
            <Globe size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter text-white leading-none">Travsify</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Node Orchestration</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 opacity-50">{group.label}</h3>
              {group.items.map((item: any) => {
                const isActive = pathname === item.path;
                const isLocked = item.locked;
                return (
                  <Link 
                    key={item.path} 
                    href={isLocked ? '#' : item.path}
                    onClick={(e) => isLocked && e.preventDefault()}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-black text-[12px] transition-all duration-300 group relative ${
                      isLocked ? 'opacity-30 cursor-not-allowed grayscale' :
                      isActive 
                        ? 'bg-white/10 text-white shadow-xl shadow-black/20' 
                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? 'text-[#FF6B00]' : 'text-slate-600 group-hover:text-white'} transition-colors duration-300`}>
                        {item.icon}
                      </span>
                      <span className="tracking-tight">{item.name}</span>
                    </div>
                    {isActive && (
                       <motion.div 
                          layoutId="active-nav-dot"
                          className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]" 
                       />
                    )}
                    {isLocked && <Lock size={12} className="text-slate-700" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="p-5 bg-white/5 rounded-3xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center text-[#FF6B00] group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-wider">System Health</p>
                <p className="text-[10px] text-slate-500 font-bold">All nodes active</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[12px] text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all group"
          >
            <LogOut size={18} />
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[300px] min-h-screen relative bg-[#F8FAFC]">
        <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />
        
        {/* Top Header - Elite Premium */}
        <header className="h-24 bg-white/70 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-12">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-[#0A1629] tracking-tighter leading-none">Control Center</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Operational Protocol Active</p>
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
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B00] rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center shadow-lg shadow-orange-600/30">
                      {unreadCount}
                    </div>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#0A1629] uppercase tracking-widest">Recent Alerts</h3>
                    <span className="text-[10px] font-black text-slate-400">{notifications.length} Total</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map((n, i) => {
                      const style = getNotificationIcon(n.type);
                      return (
                        <div 
                          key={n.id} 
                          onClick={() => !n.isRead && markAsRead(n.id)}
                          className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 group/item relative ${!n.isRead ? 'bg-blue-50/20' : ''}`}
                        >
                          <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.color}`}>
                              {style.icon}
                            </div>
                            <div className="flex-1">
                              <p className={`text-[13px] font-black text-[#0A1629] mb-1 ${!n.isRead ? 'pr-3' : ''}`}>{n.title}</p>
                              <p className="text-[11px] text-slate-400 font-medium line-clamp-2">{n.message}</p>
                              <p className="text-[9px] text-slate-300 font-bold uppercase mt-2">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            {!n.isRead && (
                              <div className="absolute right-6 top-6 w-2 h-2 bg-[#FF6B00] rounded-full" />
                            )}
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell size={20} className="text-slate-300" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No new alerts</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 text-center">
                    <button className="text-[11px] font-black text-[#FF6B00] uppercase tracking-widest hover:underline">Clear All Alerts</button>
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

        <div className="px-16 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
