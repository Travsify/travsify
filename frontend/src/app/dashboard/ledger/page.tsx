'use client';

import { useState, useEffect } from 'react';
import { Database, Filter, Download, ArrowUpRight, ArrowDownCircle, Loader2, Calendar, Search, MoreHorizontal } from 'lucide-react';
import { API_URL } from '@/utils/api';

import { useAuth } from '@/context/AuthContext';

export default function LedgerPage() {
  const { currency } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/wallet/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTransactions(await res.json());
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCredit = transactions
    .filter(tx => tx.type === 'CREDIT' && tx.status === 'SUCCESS')
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const totalDebit = transactions
    .filter(tx => tx.type === 'DEBIT' && tx.status === 'SUCCESS')
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const pendingSettlement = transactions
    .filter(tx => tx.status === 'PENDING')
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const filteredTransactions = transactions.filter(tx => 
    tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.metadata?.pnr?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-sm text-slate-400 font-medium">Detailed record of all platform transactions and settlements.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Ledger Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LedgerStat label="TOTAL CREDIT" value={`${currency === 'NGN' ? '₦' : '$'}${totalCredit.toLocaleString()}`} color="emerald" icon={<ArrowUpRight />} />
        <LedgerStat label="TOTAL DEBIT" value={`${currency === 'NGN' ? '₦' : '$'}${totalDebit.toLocaleString()}`} color="rose" icon={<ArrowDownCircle />} />
        <LedgerStat label="PENDING SETTLEMENT" value={`${currency === 'NGN' ? '₦' : '$'}${pendingSettlement.toLocaleString()}`} color="orange" icon={<Database />} />
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, customer or PNR..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
              <Calendar size={14} className="text-slate-400" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source / Reference</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-[12px] font-black text-blue-600 cursor-pointer hover:underline uppercase tracking-tighter">TX_{tx.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-[13px] font-black text-slate-900 leading-tight">{tx.metadata?.description || 'Inventory Purchase'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {tx.reference || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${tx.type === 'CREDIT' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 
                      tx.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className={`text-[14px] font-black ${tx.type === 'CREDIT' ? 'text-emerald-500' : 'text-slate-900'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}{currency === 'NGN' ? '₦' : '$'}{Number(tx.amount).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No financial events recorded yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LedgerStat({ label, value, color, icon }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    orange: 'bg-orange-50 text-orange-600'
  };
  return (
    <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
