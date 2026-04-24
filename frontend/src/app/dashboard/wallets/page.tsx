'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Download, 
  Banknote, 
  CreditCard, 
  History,
  Copy,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function WalletPage() {
  const [activeWallet, setActiveWallet] = useState<'NGN' | 'USD'>('NGN');
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'success') {
      alert('Card linked successfully via Travsify Pay!');
    }
    if (params.get('status') === 'success') {
      alert('Wallet funded successfully!');
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const [walletRes, transRes] = await Promise.all([
        fetch(`${API_URL}/wallet`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/wallet/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!walletRes.ok || !transRes.ok) throw new Error('Failed to fetch financial data');

      const walletData = await walletRes.json();
      const transData = await transRes.json();

      setWallets(walletData);
      setTransactions(transData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFund = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/wallet/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount), currency: activeWallet })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.link) {
          // Redirect to Stripe/Payment Gateway
          window.location.href = data.link;
          return;
        }
        setShowFundModal(false);
        setAmount('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleLinkCard = async () => {
    setProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/wallet/link-card`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.link) {
        window.location.href = data.link;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount), currency: activeWallet })
      });
      if (res.ok) {
        setShowWithdrawModal(false);
        setAmount('');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Withdrawal failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    const token = localStorage.getItem('token');
    const toCurrency = activeWallet === 'NGN' ? 'USD' : 'NGN';
    try {
      const res = await fetch(`${API_URL}/wallet/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ from: activeWallet, to: toCurrency, amount: parseFloat(amount) })
      });
      if (res.ok) {
        setShowConvertModal(false);
        setAmount('');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || 'Conversion failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const currentWallet = wallets.find(w => w.currency === activeWallet) || { balance: 0 };
  const filteredTransactions = transactions.filter(t => t.wallet?.currency === activeWallet);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-up">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Treasury...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header with Currency Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Wallets & Treasury</h2>
          <p className="text-slate-500 font-medium text-sm">Manage your multi-currency balances and settlement records.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveWallet('NGN')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeWallet === 'NGN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            🇳🇬 NGN
          </button>
          <button 
            onClick={() => setActiveWallet('USD')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeWallet === 'USD' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            🇺🇸 USD
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl animate-shake">
          <AlertCircle size={18} className="text-orange-600 shrink-0" />
          <p className="text-xs font-bold text-orange-600">{error}</p>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="ml-auto text-[10px] font-black uppercase tracking-widest bg-white px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Retry Now'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Balance Card */}
          <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl shadow-blue-900/20 group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <WalletIcon size={160} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest">Active Ledger</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Available Balance ({activeWallet})</h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black tracking-tighter">
                  {formatAmount(currentWallet.balance, activeWallet).split('.')[0]}
                </span>
                <span className="text-2xl font-bold text-slate-500">
                  .{formatAmount(currentWallet.balance, activeWallet).split('.')[1] || '00'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowFundModal(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  Top Up Wallet
                </button>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-sm border border-white/10 transition-all backdrop-blur-md active:scale-[0.98]"
                >
                  <ArrowUpRight size={18} />
                  Withdraw
                </button>
                <button 
                  onClick={() => setShowConvertModal(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-[#FF6B00] text-white rounded-2xl font-black text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98]"
                >
                  <History size={18} />
                  Swap Currency
                </button>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History size={20} className="text-blue-600" />
                Transaction History
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 text-[12px] font-black text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <Download size={14} />
                EXPORT CSV
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx: any) => (
                  <TransactionRow 
                    key={tx.id}
                    title={tx.metadata?.description || (tx.type === 'credit' ? (tx.metadata?.type === 'conversion' ? 'Currency Conversion' : 'Wallet Funding') : 'Booking Payment')}
                    subtitle={`Ref: ${tx.reference || tx.id.slice(0, 8)}`}
                    date={new Date(tx.createdAt).toLocaleString()}
                    amount={`${tx.type === 'credit' ? '+' : '-'}${formatAmount(tx.amount, activeWallet)}`}
                    positive={tx.type === 'credit'}
                    status={tx.status}
                  />
                ))
              ) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No transactions found</p>
                </div>
              )}
            </div>
            {filteredTransactions.length > 5 && (
              <div className="p-6 bg-slate-50/50 flex justify-center">
                <button className="text-sm font-bold text-blue-600 hover:underline">View all transactions</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Funding Instructions */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Funding Methods</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Banknote size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">Direct Bank Funding (NGN)</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Transfer funds directly to our settlement account. Your wallet will be credited upon verification.</p>
                  
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Bank Name</p>
                      <p className="text-[13px] font-bold text-slate-900">Sterling Bank</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Account Number</p>
                      <p className="text-[13px] font-bold text-slate-900 flex items-center justify-between">
                        9744446383
                        <Copy size={12} className="text-slate-300 hover:text-blue-600 cursor-pointer" />
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Account Name</p>
                      <p className="text-[13px] font-bold text-slate-900">Ehomes Global Inclusive Limited</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">* Ehomes Global is a subsidiary & owner of Travsify.</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                      Note: Kindly send your payment receipt to <span className="underline select-all">Pay@travsify.com</span> for instant settlement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">Card Payment</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">Instant top-up via Stripe for global USD accounts.</p>
                  <button 
                    onClick={handleLinkCard}
                    disabled={processing}
                    className="text-[12px] font-black text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all disabled:opacity-50"
                  >
                    {processing ? 'Connecting...' : 'Link Card'} <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[32px] p-8 text-white shadow-lg shadow-emerald-600/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Pricing Update</h4>
            </div>
            <p className="text-[13px] font-medium leading-relaxed mb-6 opacity-90">
              USD settlement fees have been reduced to 0.5% for all transactions above $10,000.
            </p>
            <Link href="/dashboard/docs" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-all border border-white/10">
              Read More <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(showFundModal || showWithdrawModal || showConvertModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setShowFundModal(false); setShowWithdrawModal(false); setShowConvertModal(false); }} />
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {showFundModal ? `Top Up ${activeWallet}` : showWithdrawModal ? `Withdraw ${activeWallet}` : `Convert ${activeWallet}`}
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              {showFundModal ? 'Add funds to your secure Travsify wallet.' : showWithdrawModal ? 'Transfer funds to your verified bank account.' : `Swap your ${activeWallet} for ${activeWallet === 'NGN' ? 'USD' : 'NGN'}.`}
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount to {showFundModal ? 'Add' : showWithdrawModal ? 'Withdraw' : 'Swap'}</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">{activeWallet === 'USD' ? '$' : '₦'}</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl font-black text-slate-900 outline-none focus:border-blue-600/20 focus:bg-white transition-all"
                    placeholder="0.00"
                  />
                </div>
                {showConvertModal && amount && (
                  <p className="text-[11px] font-bold text-blue-600 mt-2 px-2 uppercase tracking-wider">
                    You will receive: {activeWallet === 'NGN' ? '$' : '₦'}{(parseFloat(amount) * (activeWallet === 'NGN' ? 1/1500 : 1500)).toLocaleString()}
                  </p>
                )}
              </div>

              <button 
                onClick={showFundModal ? handleFund : showWithdrawModal ? handleWithdraw : handleConvert}
                disabled={processing || !amount}
                className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {processing ? <Loader2 className="animate-spin" /> : 'Confirm Transaction'}
                {!processing && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({ title, subtitle, date, amount, positive, status }: any) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all group">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'} group-hover:scale-110 transition-transform`}>
          {positive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">{title}</h4>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{subtitle} • {date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[15px] font-black tracking-tight ${positive ? 'text-emerald-600' : 'text-slate-900'}`}>
          {amount}
        </p>
        <div className="flex items-center justify-end gap-1.5 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-emerald-500' : status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
        </div>
      </div>
    </div>
  );
}
