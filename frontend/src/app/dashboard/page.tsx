'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Plane, 
  Wallet,
  Key,
  Code2,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Loader2,
  TrendingUp,
  Activity,
  Zap,
  MoreHorizontal,
  Database,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  ArrowDownCircle,
  MapPin,
  Calendar,
  Globe,
  Plus,
  Hotel,
  Car,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LayoutDashboard,
  ScrollText,
  X
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/utils/api';
import VisaTracker from '@/components/VisaTracker';

export default function OverviewPage() {
  const { user, currency } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flights');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [walletRes, transRes, bookRes] = await Promise.all([
        fetch(`${API_URL}/wallet`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/wallet/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/bookings/my-bookings`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (walletRes.ok) setWallets(await walletRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
      if (bookRes.ok) setBookings(await bookRes.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const ngnWallet = wallets.find(w => w.currency === 'NGN') || { balance: 0 };
  const usdWallet = wallets.find(w => w.currency === 'USD') || { balance: 0 };
  const totalRevenue = transactions.filter(t => t.type === 'CREDIT' && t.currency === currency).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalBookingsCount = bookings.length;
  const recentBookings = bookings.slice(0, 5);
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Travsify...</p>
      </div>
    );
  }

  const verticalStats = {
    flight: bookings.filter(b => b.vertical === 'flight').length,
    hotel: bookings.filter(b => b.vertical === 'hotel').length,
    transfer: bookings.filter(b => b.vertical === 'transfer').length,
    visa: bookings.filter(b => b.vertical === 'visa').length,
    insurance: bookings.filter(b => b.vertical === 'insurance').length,
    experience: bookings.filter(b => b.vertical === 'experience').length,
  };

  const getPercent = (count: number) => totalBookingsCount > 0 ? `${Math.round((count / totalBookingsCount) * 100)}%` : '0%';

  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Detail Modal Overlay */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl relative">
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-[#FF6B00] transition-colors"
            >
              Close <X className="w-4 h-4" />
            </button>
            
            {selectedBooking.vertical === 'visa' ? (
              <VisaTracker 
                applicationId={selectedBooking.pnr || selectedBooking.id}
                status={selectedBooking.status}
                destination={selectedBooking.itemName?.split(' ')[2] || 'Global'}
                applicantName={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Travsify User'}
                submissionDate={new Date(selectedBooking.createdAt).toLocaleDateString()}
                estimatedCompletion="3-5 Business Days"
              />
            ) : (
              <div className="bg-white p-12 rounded-[40px] text-center shadow-2xl">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  {selectedBooking.vertical === 'flight' ? <Plane className="text-blue-600" /> : <Globe className="text-slate-400" />}
                </div>
                <h3 className="text-2xl font-black text-slate-900">Booking Record</h3>
                <p className="text-slate-400 mt-2 font-medium">Management for {selectedBooking.vertical} operations is active in the main terminal.</p>
                <div className="mt-8 flex gap-3 justify-center">
                  <button onClick={() => setSelectedBooking(null)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Dismiss</button>
                  <Link href="/dashboard/bookings" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FF6B00] transition-all">Go to Terminal</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* ─── ROW 1: TOP STATS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`${currency === 'NGN' ? '₦' : '$'}${(totalRevenue).toLocaleString()}`} 
          change="Real-time" 
          positive={true}
          icon={<div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={24} /></div>}
        />
        <StatCard 
          label="Total Bookings" 
          value={totalBookingsCount.toString()} 
          change="Real-time" 
          positive={true}
          icon={<div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Plane size={24} /></div>}
        />
        <StatCard 
          label="API Calls (Today)" 
          value="Live" 
          change="Real-time" 
          positive={true}
          icon={<div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Code2 size={24} /></div>}
        />
        <StatCard 
          label="Platform Status" 
          value="Active" 
          change="Operational" 
          positive={true}
          icon={<div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><TrendingUp size={24} /></div>}
        />
      </div>

      {/* ─── ROW 2: CHARTS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Revenue Trend</h3>
              <HelpCircle size={14} className="text-slate-300" />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-[10px] font-black text-slate-400">Daily</button>
              <button className="px-4 py-1.5 text-[10px] font-black text-white bg-blue-600 rounded-md shadow-lg shadow-blue-600/20">Weekly</button>
              <button className="px-4 py-1.5 text-[10px] font-black text-slate-400">Monthly</button>
            </div>
          </div>
          <div className="h-64 relative flex items-end justify-between px-2">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200">
              <path d="M0 150 Q 150 80, 300 120 T 600 60 T 800 50" fill="none" stroke="#2563eb" strokeWidth="3" />
              <path d="M0 150 Q 150 80, 300 120 T 600 60 T 800 50 V 200 H 0 Z" fill="url(#blue-grad)" opacity="0.1" />
              <defs>
                <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="300" cy="120" r="4" fill="#2563eb" />
              <circle cx="600" cy="60" r="4" fill="#2563eb" />
              <circle cx="800" cy="50" r="4" fill="#2563eb" />
            </svg>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">May {20 + i}</div>
            ))}
            <div className="absolute top-[40px] right-[20px] bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-black">N24.58M</div>
          </div>
        </div>

        {/* Bookings by Vertical Donut Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-8">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Bookings by Vertical</h3>
            <HelpCircle size={14} className="text-slate-300" />
          </div>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#F1F5F9" strokeWidth="3.5"></circle>
              {totalBookingsCount > 0 && (
                <>
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#2563EB" strokeWidth="3.5" strokeDasharray={`${(verticalStats.flight / totalBookingsCount) * 100} 100`} strokeDashoffset="0"></circle>
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#F97316" strokeWidth="3.5" strokeDasharray={`${(verticalStats.hotel / totalBookingsCount) * 100} 100`} strokeDashoffset={`-${(verticalStats.flight / totalBookingsCount) * 100}`}></circle>
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 leading-none">{totalBookingsCount}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            <VerticalLegend color="#2563EB" label="Flights" percent={getPercent(verticalStats.flight)} value={verticalStats.flight} />
            <VerticalLegend color="#F97316" label="Hotels" percent={getPercent(verticalStats.hotel)} value={verticalStats.hotel} />
            <VerticalLegend color="#10B981" label="Transfers" percent={getPercent(verticalStats.transfer)} value={verticalStats.transfer} />
            <VerticalLegend color="#8B5CF6" label="e-Visas" percent={getPercent(verticalStats.visa)} value={verticalStats.visa} />
            <VerticalLegend color="#6366F1" label="Insurance" percent={getPercent(verticalStats.insurance)} value={verticalStats.insurance} />
            <VerticalLegend color="#FF6B00" label="Experiences" percent={getPercent(verticalStats.experience)} value={verticalStats.experience} />
          </div>
        </div>
      </div>


      {/* ─── ROW 3: HEALTH & ACTIVITY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">System Health</h3>
              <HelpCircle size={14} className="text-slate-300" />
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View all →</button>
          </div>
          <div className="space-y-6">
            <HealthItem label="API Status" value="Operational" status="success" />
            <HealthItem label="Average Latency" value="218 ms" />
            <HealthItem label="Error Rate" value="0.42%" />
            <HealthItem label="Uptime (30 days)" value="99.97%" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <HelpCircle size={14} className="text-slate-300" />
          </div>
          <div className="space-y-6">
            {recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
              <ActivityItem key={tx.id} icon={<Wallet size={14} />} label={`${tx.type} - ₦${Number(tx.amount).toLocaleString()}`} sub={tx.description || 'Wallet Transaction'} time={new Date(tx.createdAt).toLocaleDateString()} color={tx.type === 'CREDIT' ? 'emerald' : 'rose'} />
            )) : <p className="text-sm text-slate-400">No recent activity.</p>}
          </div>
          <Link href="/dashboard/ledger">
            <button className="w-full mt-8 py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline text-left">View all activities</button>
          </Link>
        </div>
      </div>

      {/* ─── ROW 4: GLOBAL TERMINAL ─── */}
      <div className="bg-[#0A1629] p-10 rounded-2xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Globe size={200} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-1">Global Terminal</h3>
          <p className="text-slate-400 text-sm mb-10">Search and book flights, hotels, visas and more</p>
          
          <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Search flights, hotels, visas..." 
                className="w-full pl-16 pr-6 py-4 bg-white rounded-xl text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-600/20"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-all">
                <Search size={18} className="text-white" />
              </button>
            </div>
            <div className="w-full md:w-auto">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Lagos → London" />
                <Chip label="Lagos Hotels" />
                <Chip label="UK Visa" />
                <Chip label="New York Hotels" />
                <Chip label="Dubai Visa" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <TerminalTab active={activeTab === 'flights'} onClick={() => setActiveTab('flights')} icon={<Plane size={18} />} label="Flights" />
            <TerminalTab active={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} icon={<Hotel size={18} />} label="Hotels" />
            <TerminalTab active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} icon={<Car size={18} />} label="Transfers" />
            <TerminalTab active={activeTab === 'visas'} onClick={() => setActiveTab('visas')} icon={<Globe size={18} />} label="e-Visas" />
          </div>
        </div>
      </div>

      {/* ─── ROW 5: ORDERS & BOOKINGS ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Orders & Bookings</h3>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.length > 0 ? recentBookings.map((bk: any) => (
                <TableRow 
                  key={bk.id} 
                  id={bk.pnr || bk.id.substring(0, 8)} 
                  customer={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Travsify User'} 
                  service={bk.vertical || 'Flight'} 
                  status={bk.status || 'Confirmed'} 
                  amount={`${bk.currency === 'NGN' ? '₦' : '$'}${Number(bk.totalAmount || 0).toLocaleString()}`} 
                  date={new Date(bk.createdAt).toLocaleDateString()} 
                  onClick={() => setSelectedBooking(bk)}
                />
              )) : (
                <tr><td colSpan={6} className="px-8 py-4 text-center text-slate-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ROW 6: TRAVEL VERTICALS ─── */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Travel Verticals <span className="text-slate-400 font-medium">(Inventory Management)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Link href="/dashboard/flights"><VerticalCard icon={<Plane className="text-blue-600" />} label="Flights" sub="Direct airline connections and live fares." color="blue" /></Link>
          <Link href="/dashboard/hotels"><VerticalCard icon={<Hotel className="text-orange-600" />} label="Hotels" sub="Global property management and live rates." color="orange" /></Link>
          <Link href="/dashboard/transfers"><VerticalCard icon={<Car className="text-emerald-600" />} label="Transfers" sub="Global airport pickup and rental logistics." color="emerald" /></Link>
          <Link href="/dashboard/tours"><VerticalCard icon={<Globe className="text-purple-600" />} label="Tours" sub="Global curated experiences and tours." color="purple" /></Link>
          <Link href="/dashboard/insurance"><VerticalCard icon={<ShieldCheck className="text-indigo-600" />} label="Insurance" sub="Global travel protection and quoting." color="indigo" /></Link>
          <Link href="/dashboard/visa"><VerticalCard icon={<FileText className="text-[#FF6B00]" />} label="Visa & e-Visa" sub="Automated visa requirements and applications." color="orange" /></Link>
        </div>
      </div>

      {/* ─── ROW 7: FINANCE & DEVELOPER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Finance & Settlement */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Finance & Settlement</h3>
          </div>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-slate-900">Settlement Wallet</p>
                <HelpCircle size={14} className="text-slate-300" />
              </div>
              <Link href="/dashboard/wallets"><button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View wallet →</button></Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">NGN</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NGN Balance</span>
                </div>
                <p className="text-xl font-black text-slate-900">₦{(ngnWallet?.balance || 0).toLocaleString()}</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-black">USD</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">USD Balance</span>
                </div>
                <p className="text-xl font-black text-slate-900">${(usdWallet?.balance || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard/wallets" className="flex-1"><button className="w-full py-3.5 bg-orange-600 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-600/20">Fund Wallet</button></Link>
              <Link href="/dashboard/wallets" className="flex-1"><button className="w-full py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 flex items-center justify-center gap-2">
                <ArrowUpRight size={14} /> Withdraw
              </button></Link>
              <Link href="/dashboard/wallets" className="flex-1"><button className="w-full py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Convert
              </button></Link>
            </div>
          </div>
        </div>

        {/* Financial Ledger */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Financial Ledger</h3>
            <Link href="/dashboard/ledger"><button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View all</button></Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
              <LedgerItem key={tx.id} type={tx.type} source={tx.description || 'Transaction'} amount={`${tx.currency === 'NGN' ? '₦' : '$'}${Number(tx.amount).toLocaleString()}`} status={tx.status || 'Success'} date={new Date(tx.createdAt).toLocaleDateString()} color={tx.type === 'CREDIT' ? 'emerald' : 'rose'} />
            )) : <p className="text-sm text-slate-400">No transactions found.</p>}
          </div>
          <Link href="/dashboard/ledger">
            <button className="w-full mt-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center justify-center gap-2">
              <ArrowDownCircle size={14} /> Download Ledger
            </button>
          </Link>
        </div>
      </div>

      {/* ─── ROW 8: DEVELOPER & COMPLIANCE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Developer Suite */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Developer Suite</h3>
          <div className="grid grid-cols-2 gap-6">
            <Link href="/dashboard/developers"><DevCard icon={<Key className="text-orange-600" />} label="API Keys" sub="Manage your Sandbox and Live environment API keys." link="View Keys" /></Link>
            <Link href="/dashboard/developers"><DevCard icon={<Zap className="text-rose-600" />} label="Webhooks" sub="Configure real-time event notifications for your endpoints." link="Manage Webhooks" /></Link>
            <Link href="/dashboard/developers"><DevCard icon={<Activity className="text-blue-600" />} label="API Logs" sub="Monitor API requests and responses for debugging." link="View Logs" /></Link>
            <Link href="/dashboard/docs"><DevCard icon={<Code2 className="text-blue-700" />} label="Documentation" sub="Access API reference, SDKs and integration guides." link="View Documentation" /></Link>
          </div>
        </div>

        {/* Compliance & Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Compliance & Settings</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">KYC Verification</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Business identity and regulatory compliance verification.</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Approved</span>
                  </div>
                </div>
              </div>
              <Link href="/dashboard/developers"><button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">View Details →</button></Link>
            </div>
            
            <div className="p-8 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Users size={32} />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">Organization</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Manage team members, roles and platform settings.</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Members: {user?.firstName ? 'Active' : '1'}</span>
                  </div>
                </div>
              </div>
              <Link href="/dashboard/developers"><button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">Manage Organization →</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, positive, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
      {icon}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-black text-slate-900 tracking-tight">{value}</span>
          <span className={`text-[10px] font-black ${positive ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
            {positive ? <ArrowUpRight size={10} /> : <ArrowDownCircle size={10} />}
            {change}
          </span>
        </div>
        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter mt-1">vs last 7 days</p>
      </div>
    </div>
  );
}

function VerticalLegend({ color, label, percent, value }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-black text-slate-600 group-hover:text-slate-900">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-black text-slate-900">{percent}</span>
        <span className="text-[11px] font-medium text-slate-300">({value})</span>
      </div>
    </div>
  );
}

function HealthItem({ label, value, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-bold text-slate-500">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-[12px] font-black ${status === 'success' ? 'text-emerald-500' : 'text-slate-900'}`}>{value}</span>
        {status === 'success' && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
      </div>
    </div>
  );
}

function ActivityItem({ icon, label, sub, time, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[12px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">{label}</p>
          <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{time}</span>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded-lg text-[10px] font-black transition-all border border-white/5">
      {label}
    </button>
  );
}

function TerminalTab({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[12px] font-black transition-all ${
        active ? 'bg-white text-slate-900 shadow-xl' : 'bg-white/5 text-slate-500 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function TableRow({ id, customer, service, status, amount, date, onClick }: any) {
  const statusColor = status === 'Confirmed' ? 'emerald' : status === 'Pending' ? 'orange' : 'rose';
  return (
    <tr 
      onClick={onClick}
      className="hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50"
    >
      <td className="px-8 py-4 text-[12px] font-black text-blue-600 hover:underline">{id}</td>
      <td className="px-8 py-4 text-[12px] font-bold text-slate-600">{customer}</td>
      <td className="px-8 py-4 text-[12px] font-medium text-slate-500">{service}</td>
      <td className="px-8 py-4">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>
          {status}
        </span>
      </td>
      <td className="px-8 py-4 text-[12px] font-black text-slate-900">{amount}</td>
      <td className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase">{date}</td>
    </tr>
  );
}

function VerticalCard({ icon, label, sub, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-[13px] font-black text-slate-900 tracking-tight mb-2">{label}</h4>
      <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-6">{sub}</p>
      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:underline">Manage →</button>
    </div>
  );
}

function LedgerItem({ type, source, amount, status, date, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-blue-200 transition-all">
      <div className="flex items-center gap-4">
        <span className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{type}</span>
        <div>
          <p className="text-[12px] font-black text-slate-900">{source}</p>
          <p className="text-[10px] text-slate-400 font-medium">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[13px] font-black text-slate-900">{amount}</p>
        <span className={`text-[9px] font-black uppercase tracking-widest text-${status === 'Success' ? 'emerald' : 'rose'}-600`}>{status}</span>
      </div>
    </div>
  );
}

function DevCard({ icon, label, sub, link }: any) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-orange-600 transition-all cursor-pointer group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="text-[14px] font-black text-slate-900">{label}</h4>
      </div>
      <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-6">{sub}</p>
      <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">{link} →</button>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
