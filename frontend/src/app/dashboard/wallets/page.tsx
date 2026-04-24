'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/utils/api';

export default function WalletPage() {
  const [activeWallet, setActiveWallet] = useState<'NGN' | 'USD'>('NGN');
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [conversionRate, setConversionRate] = useState<number>(1500);

  useEffect(() => {
    fetchData();
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(data => { if (data?.rates?.NGN) setConversionRate(data.rates.NGN); })
      .catch(() => {});

    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'success') {
      setToast('✅ Card linked successfully via Travsify Pay!');
      setTimeout(() => setToast(''), 5000);
    }
    if (params.get('status') === 'success') {
      setToast('✅ Wallet funded successfully!');
      setTimeout(() => setToast(''), 5000);
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

  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [resolvingAccount, setResolvingAccount] = useState(false);

  const banks = [
    { name: 'Access Bank', code: '044' },
    { name: 'Guaranty Trust Bank', code: '058' },
    { name: 'Zenith Bank', code: '057' },
    { name: 'United Bank for Africa', code: '033' },
    { name: 'First Bank of Nigeria', code: '011' },
    { name: 'Kuda Bank', code: '50211' },
    { name: 'Moniepoint', code: '50515' },
    { name: 'OPay', code: '999992' },
  ];

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode && activeWallet === 'NGN') {
      resolveAccount();
    }
  }, [accountNumber, bankCode]);

  const resolveAccount = async () => {
    setResolvingAccount(true);
    setResolvedAccountName('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/wallet/resolve-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bankCode, accountNumber })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setResolvedAccountName(data.data.accountName || data.data.account_name);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingAccount(false);
    }
  };

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
          window.location.href = data.link;
          return;
        }
        setShowFundModal(false);
        setAmount('');
        fetchData();
        setToast('✅ Funding request initiated successfully!');
        setTimeout(() => setToast(''), 5000);
      }
    } catch (err) {
      console.error(err);
      setError('Funding initiation failed. Please try again.');
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
    if (activeWallet === 'NGN' && (!bankCode || accountNumber.length !== 10)) {
      alert('Please provide valid bank details');
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          currency: activeWallet,
          bankCode,
          accountNumber,
          accountName: resolvedAccountName
        })
      });
      const data = await res.json();
      if (res.ok) {
        setShowWithdrawModal(false);
        setAmount('');
        setAccountNumber('');
        setResolvedAccountName('');
        fetchData();
        setToast('✅ Withdrawal initiated! Funds will arrive shortly.');
        setTimeout(() => setToast(''), 5000);
      } else {
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
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-[#FF6B00] rounded-full animate-spin shadow-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <WalletIcon className="w-8 h-8 text-slate-200" />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Initializing Financial Node</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-10 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-emerald-600/30"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#0A1629] mb-4">Treasury Control</h2>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
             <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Multi-Vertical Liquidity Active</p>
          </div>
        </div>
        <div className="flex bg-white/50 backdrop-blur-xl p-1.5 rounded-[24px] border border-slate-200/60 shadow-xl shadow-slate-200/10">
          {['NGN', 'USD'].map((curr) => (
            <button 
              key={curr}
              onClick={() => setActiveWallet(curr as any)}
              className={`flex items-center gap-3 px-10 py-4 rounded-[18px] text-xs font-black transition-all duration-300 ${activeWallet === curr ? 'bg-[#0A1629] text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-[#0A1629] hover:bg-white/50'}`}
            >
              <span className="text-lg">{curr === 'NGN' ? '🇳🇬' : '🇺🇸'}</span>
              <span className="tracking-widest">{curr} SETTLEMENT</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 p-6 bg-rose-50 border border-rose-100 rounded-[24px]"
        >
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <p className="text-sm font-bold text-rose-600">{error}</p>
          <button onClick={fetchData} className="ml-auto text-xs font-black uppercase tracking-widest bg-white text-rose-600 px-6 py-3 rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all">Retry Sync</button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* ─── MAIN BALANCE CARD (PREMIUM) ─── */}
          {/* ─── MAIN BALANCE CARD (ELITE) ─── */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="relative overflow-hidden bg-[#0A1629] rounded-[48px] p-16 text-white shadow-[0_50px_100px_-20px_rgba(10,22,41,0.4)] group border border-white/5"
          >
            <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-1000">
              <WalletIcon size={300} />
            </div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF6B00]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#FF6B00] border border-white/10 shadow-inner">
                    <TrendingUp size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Financial Velocity</span>
                    <span className="text-xs font-bold text-[#FF6B00] mt-1">Live Settlement Active</span>
                  </div>
                </div>
                <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                   NODE_0483_ONLINE
                </div>
              </div>
              
              <div className="mb-20">
                <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-6">Available {activeWallet} Liquidity</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-8xl font-black tracking-tighter leading-none">
                    {formatAmount(currentWallet.balance, activeWallet).split('.')[0]}
                  </span>
                  <span className="text-4xl font-bold text-white/20">
                    .{formatAmount(currentWallet.balance, activeWallet).split('.')[1] || '00'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Plus size={20} />, label: "Add Funds", color: "bg-[#FF6B00]", shadow: "shadow-orange-600/30", onClick: () => setShowFundModal(true) },
                  { icon: <ArrowUpRight size={20} />, label: "Withdraw", color: "bg-white/10 hover:bg-white/20 border border-white/10", shadow: "", onClick: () => setShowWithdrawModal(true) },
                  { icon: <History size={20} />, label: "Currency Swap", color: "bg-blue-600 hover:bg-blue-700", shadow: "shadow-blue-600/30", onClick: () => setShowConvertModal(true) }
                ].map((btn, i) => (
                  <button 
                    key={i}
                    onClick={btn.onClick}
                    className={`flex items-center justify-center gap-4 py-6 rounded-[28px] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${btn.color} ${btn.shadow} group/btn`}
                  >
                    <span className="group-hover:scale-125 transition-transform">{btn.icon}</span>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── TRANSACTIONS (PREMIUM LIST) ─── */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-xl font-black text-[#0A2540] flex items-center gap-3">
                <History className="text-[#FF7A00]" />
                Transaction Stream
              </h3>
              <button className="flex items-center gap-2 px-6 py-3 text-xs font-black text-slate-500 hover:text-[#0A2540] hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                <Download size={14} />
                GENERATE REPORT
              </button>
            </div>
            
            <div className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx, i) => (
                    <motion.div 
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <TransactionRow 
                        title={tx.metadata?.description || (tx.type === 'credit' ? (tx.metadata?.type === 'conversion' ? 'Currency Conversion' : 'Wallet Funding') : 'Booking Payment')}
                        subtitle={`TXID: ${tx.reference || tx.id.slice(0, 10)}`}
                        date={new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        amount={`${tx.type === 'credit' ? '+' : '-'}${formatAmount(tx.amount, activeWallet)}`}
                        positive={tx.type === 'credit'}
                        status={tx.status}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <History size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Zero Activity Logged</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ─── SIDEBAR: FUNDING & INTEL ─── */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-0" />
            <h3 className="text-xl font-black text-[#0A2540] mb-8 relative z-10">Sync Methods</h3>
            
            <div className="space-y-10 relative z-10">
              <div className="group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#0A2540] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
                    <Banknote size={24} />
                  </div>
                  <h4 className="font-black text-[#0A2540]">Wire Transfer (NGN)</h4>
                </div>
                <div className="bg-slate-50/50 rounded-[28px] p-6 border border-slate-100 space-y-5">
                  {[
                    { label: "Partner Bank", val: "Sterling Bank" },
                    { label: "Account No", val: "9744446383", copy: true },
                    { label: "Beneficiary", val: "Ehomes Global Inclusive Limited" }
                  ].map((field, idx) => (
                    <div key={idx}>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{field.label}</p>
                      <p className="text-sm font-bold text-[#0A2540] flex justify-between items-center">
                        {field.val}
                        {field.copy && <Copy size={12} className="text-slate-300 hover:text-[#FF7A00] cursor-pointer" />}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase leading-relaxed text-center px-4">
                  SYNC RECEIPTS TO: <span className="text-[#FF7A00]">PAY@TRAVSIFY.COM</span>
                </p>
              </div>

              <div className="pt-8 border-t border-slate-50 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#0A2540] flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all duration-300">
                    <CreditCard size={24} />
                  </div>
                  <h4 className="font-black text-[#0A2540]">Card Interface</h4>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Connect global cards via Travsify Settle for instant USD liquidity.</p>
                <button 
                  onClick={handleLinkCard}
                  disabled={processing}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="animate-spin" size={16} /> : 'Link New Card'}
                  {!processing && <ArrowRight size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Premium Help Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-[#0A2540] to-[#0D345D] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <ShieldCheck size={80} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00] mb-4">Regulatory Notice</h4>
            <p className="text-base font-medium leading-relaxed opacity-80 mb-8">
              All transactions are secured by bank-grade encryption and audited by Travsify Compliance.
            </p>
            <Link href="/dashboard/docs" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#FF7A00] transition-colors">
              Security Protocol <ExternalLink size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── MODALS (PREMIUM FRAMER) ─── */}
      <AnimatePresence>
        {(showFundModal || showWithdrawModal || showConvertModal) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A2540]/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[48px] p-12 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => { setShowFundModal(false); setShowWithdrawModal(false); setShowConvertModal(false); }}
                className="absolute top-8 right-8 text-slate-300 hover:text-[#0A2540] transition-colors"
              >
                <Plus size={32} className="rotate-45" />
              </button>

              <h3 className="text-3xl font-black text-[#0A2540] mb-4">
                {showFundModal ? `Fund ${activeWallet}` : showWithdrawModal ? `Withdraw ${activeWallet}` : `Swap ${activeWallet}`}
              </h3>
              <p className="text-slate-500 font-medium mb-10 text-lg">
                {showFundModal ? 'Securely increase your settlement capacity.' : showWithdrawModal ? 'Transfer funds to your designated bank.' : `Convert your ${activeWallet} liquidity instantly.`}
              </p>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Transaction Amount</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-[#0A2540] text-xl">{activeWallet === 'USD' ? '$' : '₦'}</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-16 pr-8 py-7 bg-slate-50 border-2 border-transparent rounded-[28px] font-black text-[#0A2540] text-2xl outline-none focus:border-[#FF7A00]/20 focus:bg-white transition-all placeholder:text-slate-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {showWithdrawModal && activeWallet === 'NGN' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Receiving Institution</label>
                      <select 
                        value={bankCode}
                        onChange={(e) => setBankCode(e.target.value)}
                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[28px] font-black text-[#0A2540] outline-none focus:border-[#FF7A00]/20 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Target Bank</option>
                        {banks.map(bank => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Beneficiary Account</label>
                      <input 
                        type="text" 
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[28px] font-black text-[#0A2540] outline-none focus:border-[#FF7A00]/20 focus:bg-white transition-all"
                        placeholder="10-digit number"
                      />
                    </div>

                    {resolvingAccount && <div className="text-xs font-bold text-blue-600 animate-pulse px-4">Synchronizing with Interswitch NIP...</div>}
                    {resolvedAccountName && (
                      <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="text-sm font-black text-emerald-700">{resolvedAccountName}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {showConvertModal && amount && (
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 text-center">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Estimated Output</p>
                    <p className="text-2xl font-black text-blue-600">
                      {activeWallet === 'NGN' ? '$' : '₦'}{(parseFloat(amount) * (activeWallet === 'NGN' ? 1/conversionRate : conversionRate)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                  </div>
                )}

                <button 
                  onClick={showFundModal ? handleFund : showWithdrawModal ? handleWithdraw : handleConvert}
                  disabled={processing || !amount}
                  className="w-full py-7 bg-[#0A2540] text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#0A2540]/30"
                >
                  {processing ? <Loader2 className="animate-spin" /> : 'Authorize Transaction'}
                  {!processing && <ArrowRight size={20} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TransactionRow({ title, subtitle, date, amount, positive, status }: any) {
  return (
    <div className="flex items-center justify-between p-8 hover:bg-slate-50/80 transition-all group cursor-pointer border-l-4 border-transparent hover:border-[#FF7A00]">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 group-hover:rotate-6`}>
          {positive ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
        </div>
        <div>
          <h4 className="text-base font-black text-[#0A2540] mb-1">{title}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle} • {date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-black tracking-tight ${positive ? 'text-emerald-600' : 'text-[#0A2540]'}`}>
          {amount}
        </p>
        <div className="flex items-center justify-end gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : status === 'pending' ? 'bg-orange-500 animate-pulse' : 'bg-rose-500'}`} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
        </div>
      </div>
    </div>
  );
}

