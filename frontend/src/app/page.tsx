'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { 
  Plane, Hotel, Car, ShieldCheck, Globe, 
  Code2, Wallet, Search, PieChart, Lock, 
  Key, Zap, Play, CheckCircle2, ArrowRight,
  CreditCard, BarChart3, Settings, Users,
  Briefcase, Rocket, Smartphone, Building2, FileText,
  ScrollText, ChevronDown, X, Menu, ExternalLink,
  Sparkles, Layers, Fingerprint, MapPin, Ticket,
  Waves, Compass, Cpu, Database, Activity
} from 'lucide-react';
import { Logo } from '@/components/Logo';

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- COMPONENTS ---

const SectionTitle = ({ subtitle, title, description, dark = false }: { subtitle: string, title: string, description: string, dark?: boolean }) => (
  <div className="space-y-6 mb-20">
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${dark ? 'bg-white/5 border border-white/10 text-[#FF6B00]' : 'bg-blue-50 border border-blue-100 text-blue-600'}`}
    >
      <div className={`w-2 h-2 rounded-full animate-pulse ${dark ? 'bg-[#FF6B00]' : 'bg-blue-500'}`} />
      <span className="text-[11px] font-black uppercase tracking-[0.3em]">{subtitle}</span>
    </motion.div>
    <motion.h2 
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] ${dark ? 'text-white' : 'text-[#0A2540]'}`}
    >
      {title}
    </motion.h2>
    <motion.p 
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`text-xl font-medium max-w-2xl leading-relaxed ${dark ? 'text-white/50' : 'text-slate-500'}`}
    >
      {description}
    </motion.p>
  </div>
);

const FeatureBlock = ({ icon, title, desc, dark = false }: { icon: any, title: string, desc: string, dark?: boolean }) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ y: -10, scale: 1.02 }}
    className={`p-10 rounded-[40px] border transition-all duration-500 group relative overflow-hidden ${dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/30'}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 relative z-10 ${dark ? 'bg-[#FF6B00] text-white' : 'bg-[#0A2540] text-[#FF6B00]'}`}>
      {icon}
    </div>
    <h3 className={`text-2xl font-black mb-4 tracking-tight relative z-10 ${dark ? 'text-white' : 'text-[#0A2540]'}`}>{title}</h3>
    <p className={`text-sm font-medium leading-relaxed relative z-10 ${dark ? 'text-white/50' : 'text-slate-500'}`}>{desc}</p>
  </motion.div>
);

const TrustStrip = () => (
  <div className="py-12 border-y border-slate-100 bg-white/50 overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-8">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">Powering the next generation of travel companies</p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="text-2xl font-black tracking-tighter text-slate-900">IATA</div>
        <div className="text-2xl font-black tracking-tighter text-slate-900 italic">Emirates</div>
        <div className="text-2xl font-black tracking-tighter text-slate-900">VISA</div>
        <div className="text-2xl font-black tracking-tighter text-slate-900">Flutterwave</div>
        <div className="text-2xl font-black tracking-tighter text-slate-900">paysstack</div>
        <div className="text-2xl font-black tracking-tighter text-slate-900">AMADEUS</div>
      </div>
    </div>
  </div>
);

const ValuePropHub = () => (
  <section className="py-40 max-w-[1400px] mx-auto px-8 relative overflow-hidden">
    <div className="text-center max-w-3xl mx-auto mb-32">
      <SectionTitle 
        subtitle="Core Engine"
        title="Infrastructure built for global scale."
        description="We've abstracted the complexity of travel distribution into a single, high-performance orchestration layer."
      />
    </div>
    
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-20 items-center">
      {/* Background Connecting Lines (SVG) */}
      <div className="absolute inset-0 -z-10 hidden md:block">
        <svg className="w-full h-full" viewBox="0 0 1000 400" fill="none">
          <path d="M200 200 H800" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="500" cy="200" r="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="space-y-20">
        <div className="flex flex-col items-center md:items-end text-center md:text-right group">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0A2540] mb-6 group-hover:bg-[#FF6B00] group-hover:text-white transition-all shadow-sm">
            <Cpu size={28} />
          </div>
          <h4 className="text-xl font-black text-[#0A2540] mb-2 tracking-tight">Infrastructure</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Scalable APIs & reliable systems built for global scale.</p>
        </div>
        <div className="flex flex-col items-center md:items-end text-center md:text-right group">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0A2540] mb-6 group-hover:bg-[#FF6B00] group-hover:text-white transition-all shadow-sm">
            <Layers size={28} />
          </div>
          <h4 className="text-xl font-black text-[#0A2540] mb-2 tracking-tight">Inventory</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Access 500+ airlines, 1M+ hotels, and more.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-60 h-60 rounded-full border border-slate-100 flex items-center justify-center relative p-8 bg-white shadow-2xl"
        >
          <div className="absolute inset-4 rounded-full border border-dashed border-slate-200" />
          <Logo iconOnly className="w-24 h-24" />
        </motion.div>
      </div>

      <div className="space-y-20">
        <div className="flex flex-col items-center md:items-start text-center md:text-left group">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0A2540] mb-6 group-hover:bg-[#FF6B00] group-hover:text-white transition-all shadow-sm">
            <CreditCard size={28} />
          </div>
          <h4 className="text-xl font-black text-[#0A2540] mb-2 tracking-tight">Payments</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Global payouts, multi-currency wallets & instant settlements.</p>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left group">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0A2540] mb-6 group-hover:bg-[#FF6B00] group-hover:text-white transition-all shadow-sm">
            <Code2 size={28} />
          </div>
          <h4 className="text-xl font-black text-[#0A2540] mb-2 tracking-tight">Developers</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Built by developers, for developers. Clean APIs & SDKs.</p>
        </div>
      </div>
    </div>
  </section>
);

const BookingTerminal = () => (
  <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden group">
    <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
       <div className="flex gap-4">
          {['Flights', 'Hotels', 'Transfers', 'e-Visas', 'Insurance'].map((tab, i) => (
             <div key={tab} className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-[#FF6B00]' : 'text-slate-400'}`}>{tab}</div>
          ))}
       </div>
       <div className="w-24 h-8 bg-[#0A2540] rounded-lg flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">Search</div>
    </div>
    <div className="p-8">
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">From</p>
             <p className="text-sm font-black text-[#0A2540]">Lagos (LOS)</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">To</p>
             <p className="text-sm font-black text-[#0A2540]">Dubai (DXB)</p>
          </div>
       </div>
       <div className="space-y-4">
          {[
            { air: 'Emirates', code: 'LOS -> DXB', time: '08:45 - 19:30', price: '$450' },
            { air: 'Qatar Airways', code: 'LOS -> DXB', time: '07:20 - 17:10', price: '$470' },
            { air: 'Turkish Airlines', code: 'LOS -> DXB', time: '09:15 - 18:40', price: '$480' }
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#FF6B00] transition-colors cursor-pointer group/row">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0A2540] font-black text-[10px]">{f.air[0]}</div>
                  <div>
                     <p className="text-sm font-black text-[#0A2540]">{f.air}</p>
                     <p className="text-[10px] font-medium text-slate-400">{f.code} • {f.time}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <p className="text-sm font-black text-[#0A2540]">{f.price}</p>
                  <div className="px-4 py-2 bg-[#0A2540] text-white rounded-lg text-[10px] font-black uppercase tracking-widest group-hover/row:bg-[#FF6B00]">Book</div>
               </div>
            </div>
          ))}
       </div>
    </div>
  </div>
);

const AnalyticsDashboard = () => (
  <div className="grid grid-cols-2 gap-6 h-full">
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col justify-between">
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revenue Overview</p>
          <p className="text-4xl font-black text-[#0A2540] tracking-tighter">$245,680</p>
          <p className="text-xs font-bold text-emerald-500 mt-2">↑ 24.5% vs last month</p>
       </div>
       <div className="h-32 w-full flex items-end gap-1">
          {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              className="flex-1 bg-[#0A2540] rounded-t-sm opacity-20"
            />
          ))}
       </div>
    </div>
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Bookings by Status</p>
       <div className="relative w-32 h-32 mx-auto mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
             <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
             <circle cx="50" cy="50" r="40" stroke="#0A2540" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="60" />
             <circle cx="50" cy="50" r="40" stroke="#FF6B00" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="200" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-lg font-black text-[#0A2540]">84%</p>
          </div>
       </div>
       <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#0A2540]" /> Confirmed</span>
             <span className="text-[#0A2540]">65%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF6B00]" /> Pending</span>
             <span className="text-[#0A2540]">20%</span>
          </div>
       </div>
    </div>
  </div>
);

const InteractiveMap = () => (
  <div className="relative w-full aspect-video bg-[#0A2540] rounded-[60px] overflow-hidden group">
    {/* Dotted Map Pattern */}
    <div className="absolute inset-0 opacity-20 pointer-events-none grid-pattern" />
    
    {/* Global Nodes */}
    {[
      { x: '25%', y: '35%', label: 'North America' },
      { x: '48%', y: '30%', label: 'Europe' },
      { x: '52%', y: '65%', label: 'Africa' },
      { x: '65%', y: '40%', label: 'Middle East' },
      { x: '80%', y: '55%', label: 'Asia Pacific' }
    ].map((node, i) => (
      <div key={i} style={{ left: node.x, top: node.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
           <div className="w-4 h-4 bg-[#FF6B00] rounded-full shadow-[0_0_20px_rgba(255,107,0,0.6)] animate-pulse" />
           <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {node.label}
           </div>
        </div>
      </div>
    ))}

    <div className="absolute bottom-10 left-10 p-10 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10">
       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Network Integrity</p>
       <div className="flex gap-12">
          <div>
             <p className="text-3xl font-black text-white tracking-tighter">500+</p>
             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Airlines</p>
          </div>
          <div>
             <p className="text-3xl font-black text-[#FF6B00] tracking-tighter">1M+</p>
             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Hotels</p>
          </div>
       </div>
    </div>
  </div>
);

const PricingCard = ({ plan, price, features, recommended = false }: { plan: string, price: string, features: string[], recommended?: boolean }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`p-10 rounded-[40px] border transition-all duration-500 relative flex flex-col justify-between ${recommended ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-2xl scale-105 z-10' : 'bg-white text-[#0A2540] border-slate-100 shadow-xl'}`}
  >
    {recommended && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">Most Popular</div>}
    <div>
       <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${recommended ? 'text-white/40' : 'text-slate-400'}`}>{plan}</p>
       <p className="text-5xl font-black tracking-tighter mb-8">{price}<span className="text-lg opacity-40 font-medium">/mo</span></p>
       <div className="space-y-4 mb-12">
          {features.map((f, i) => (
             <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={16} className={recommended ? 'text-[#FF6B00]' : 'text-blue-500'} />
                <span className={`text-sm font-medium ${recommended ? 'text-white/60' : 'text-slate-500'}`}>{f}</span>
             </div>
          ))}
       </div>
    </div>
    <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${recommended ? 'bg-[#FF6B00] text-white hover:bg-orange-600 shadow-2xl shadow-orange-600/20' : 'bg-[#0A2540] text-white hover:bg-black'}`}>Get Started</button>
  </motion.div>
);

const TerminalHeader = () => (
   <div className="flex gap-2 mb-8">
      <div className="w-2.5 h-2.5 bg-red-500/20 rounded-full" />
      <div className="w-2.5 h-2.5 bg-yellow-500/20 rounded-full" />
      <div className="w-2.5 h-2.5 bg-emerald-500/20 rounded-full" />
   </div>
);

const VisualSection = ({ reverse = false, mockup, image, children, id }: { reverse?: boolean, mockup?: React.ReactNode, image?: string, children: React.ReactNode, id?: string }) => (
  <section id={id} className="py-20 lg:py-40 max-w-[1400px] mx-auto px-8 overflow-hidden">
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        {children}
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, x: reverse ? -40 : 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
        className={`relative ${reverse ? 'lg:order-1' : ''} w-full`}
      >
        <div className="absolute -inset-10 bg-gradient-to-tr from-blue-100/10 to-orange-100/10 blur-[100px] rounded-full -z-10" />
        {mockup ? mockup : (
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0A2540] to-[#FF6B00] rounded-[60px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <img src={image} className="relative rounded-[60px] shadow-2xl border border-slate-100 w-full" alt="Section Visual" />
           </div>
        )}
      </motion.div>
    </div>
  </section>
);

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-[#0B1F33] font-sans selection:bg-[#FF7A00]/20 overflow-x-hidden selection:text-white scroll-smooth">
      
      <motion.div 
        style={{ scaleX: smoothProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#FF6B00] origin-left z-[101]"
      />

      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <Logo className="w-10 h-10 md:w-12 md:h-12" />
            <span className="text-xl font-black tracking-tighter text-[#0A2540] group-hover:text-[#FF6B00] transition-colors">TRAVSIFY</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[22px] border border-slate-200/50">
            {['Products', 'Developers', 'Docs', 'Pricing'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="px-6 py-2.5 text-[10px] font-black text-slate-500 hover:text-[#0A2540] hover:bg-white rounded-xl transition-all uppercase tracking-widest">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-[#0A2540] text-white px-8 py-4 rounded-[18px] text-[10px] font-black hover:bg-[#FF6B00] transition-all shadow-2xl shadow-[#0A2540]/10 hover:shadow-[#FF6B00]/20 hover:scale-[1.02] active:scale-95 uppercase tracking-widest">
              Get API Access
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 bg-slate-100 rounded-xl text-[#0A2540] hover:bg-[#FF6B00] hover:text-white transition-all">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <main>
        
        {/* ─── SECTION 1: HERO ─── */}
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-8 pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#F8FAFC]">
             <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-40" />
             <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-100/50 blur-[180px] rounded-full animate-pulse" />
          </div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-5xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm mb-12">
               <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Infrastructure v2.1</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-[#0A2540] mb-12">
              Build. Launch.<br/>
              Scale Your Travel<br/>
              Business — <span className="text-[#FF6B00]">Instantly.</span>
            </h1>
            <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
              One API. Global Inventory. Built for Africa & The World. Orchestrate travel distribution with a single integration.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <Link href="/register" className="bg-[#FF6B00] text-white px-12 py-6 rounded-[28px] font-black text-lg hover:bg-orange-600 transition-all shadow-[0_20px_50px_-10px_rgba(255,107,0,0.4)] hover:scale-105 flex items-center gap-4">
                 Get API Access <ArrowRight size={24} />
               </Link>
               <Link href="/demo" className="bg-white border-2 border-slate-100 text-[#0A2540] px-12 py-6 rounded-[28px] font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-4">
                 View Docs
               </Link>
            </div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-32 w-full max-w-[1200px] relative"
          >
             <div className="relative z-10 bg-white rounded-[60px] shadow-2xl border-8 border-slate-50 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80" className="w-full aspect-video object-cover" alt="Dashboard Mockup" />
             </div>
             <div className="absolute -bottom-20 -right-20 w-[400px] hidden lg:block z-20">
                <div className="bg-white rounded-[40px] shadow-2xl border-8 border-slate-50 p-2">
                   <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" className="w-full rounded-[32px]" alt="Mobile Mockup" />
                </div>
             </div>
          </motion.div>
        </section>

        {/* ─── SECTION 2: TRUST STRIP ─── */}
        <TrustStrip />

        {/* ─── SECTION 3: VALUE PROP HUB ─── */}
        <ValuePropHub />

        {/* ─── SECTION 4: TRAVEL VERTICALS ─── */}
        <section className="py-40 bg-slate-50/30 overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="Verticals"
                    title="Everything you need. One integration."
                    description="From flights to insurance, we've unified the entire travel stack into a single distribution protocol."
                 />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                 {[
                   { icon: <Plane />, name: 'Flights' },
                   { icon: <Hotel />, name: 'Hotels' },
                   { icon: <Car />, name: 'Transfers' },
                   { icon: <ScrollText />, name: 'e-Visas' },
                   { icon: <ShieldCheck />, name: 'Insurance' }
                 ].map((v, i) => (
                    <motion.div 
                       key={i}
                       whileHover={{ y: -10 }}
                       className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm flex flex-col items-center gap-8 group hover:shadow-xl transition-all"
                    >
                       <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-[#0A2540] group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                          {v.icon}
                       </div>
                       <p className="text-sm font-black text-[#0A2540] uppercase tracking-[0.2em]">{v.name}</p>
                       <ArrowRight size={16} className="text-slate-300 group-hover:text-[#FF6B00] transition-colors" />
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* ─── SECTION 5: DEVELOPER ECOSYSTEM ─── */}
        <VisualSection 
           id="developers"
           mockup={
              <div className="bg-[#0A1629] p-1 rounded-[40px] shadow-2xl">
                 <div className="bg-[#0A2540] p-10 rounded-[38px] font-mono text-xs border border-white/5 h-full min-h-[400px]">
                    <TerminalHeader />
                    <p className="text-blue-400">GET <span className="text-white">/v1/flights/search</span></p>
                    <p className="text-slate-500 mt-2">// Response from our global node</p>
                    <p className="text-white mt-4">{'{'}</p>
                    <p className="pl-6 text-white">"status": <span className="text-emerald-400">"success"</span>,</p>
                    <p className="pl-6 text-white">"data": {'{'}</p>
                    <p className="pl-12 text-white">"flights": [</p>
                    <p className="pl-18 text-white">{'{'} "id": "FL123", "airline": "Emirates" {'}'}</p>
                    <p className="pl-12 text-white">]</p>
                    <p className="pl-6 text-white">{'}'}</p>
                    <p className="text-white">{'}'}</p>
                    <div className="mt-12 flex gap-4">
                       {['JS', 'TS', 'PY', 'PHP', 'GO'].map(lang => <div key={lang} className="px-3 py-1 bg-white/5 rounded-md text-[8px] font-black text-white/40">{lang}</div>)}
                    </div>
                 </div>
              </div>
           }
        >
           <SectionTitle 
              subtitle="Developer First"
              title="Built for developers. Loved by businesses."
              description="Clean, well-documented APIs. Sandbox & live environments. Real-time logs & webhooks. SDKs in multiple languages."
           />
           <div className="grid grid-cols-2 gap-8">
              {[
                { title: 'Clean APIs', desc: 'Normalized payloads' },
                { title: 'Sandbox', desc: 'Build & test fast' },
                { title: 'Webhooks', desc: 'Real-time updates' },
                { title: 'SDKs', desc: 'Integration in minutes' }
              ].map((f, i) => (
                 <div key={i}>
                    <p className="text-sm font-black text-[#0A2540] uppercase tracking-widest mb-1">{f.title}</p>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                 </div>
              ))}
           </div>
        </VisualSection>

        {/* ─── SECTION 6: FINTECH INFRASTRUCTURE ─── */}
        <section className="aurora-bg py-40 overflow-hidden relative" id="wallets">
           <div className="max-w-[1400px] mx-auto px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="order-2 lg:order-1">
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[60px] border border-white/10 shadow-2xl relative">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Wallet Balance</p>
                             <p className="text-4xl font-black text-white tracking-tighter">$45,680.50</p>
                          </div>
                          <div className="px-6 py-2 bg-[#FF6B00] rounded-full text-[10px] font-black text-white uppercase tracking-widest">NGN 32,560,000</div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recent Transactions</p>
                          {[
                            { name: 'Booking Payment', price: '+$1,250.00', status: 'Completed' },
                            { name: 'Payout to Bank', price: '-$850.00', status: 'Completed' },
                            { name: 'Refund', price: '+$150.00', status: 'Completed' }
                          ].map((t, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-medium text-white">
                                <span>{t.name}</span>
                                <div className="flex gap-4 items-center">
                                   <span className={t.price.includes('+') ? 'text-emerald-400' : 'text-red-400'}>{t.price}</span>
                                   <span className="text-[8px] uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full">{t.status}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                       <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-center">
                          <div className="flex -space-x-4">
                             {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A2540] bg-slate-400" />)}
                             <div className="w-10 h-10 rounded-full border-2 border-[#0A2540] bg-[#FF6B00] flex items-center justify-center text-[10px] font-black">+12</div>
                          </div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Payout Enabled</p>
                       </div>
                    </div>
                 </div>
                 <div className="order-1 lg:order-2">
                    <SectionTitle 
                       dark
                       subtitle="Fintech Infrastructure"
                       title="Get paid globally. Instantly."
                       description="Manage your travel treasury with multi-currency wallets. Handle instant settlements, payouts to 120+ countries, and virtual card issuance."
                    />
                    <ul className="space-y-6">
                       {['Multi-currency wallets', 'Instant settlements', 'Low fees. High success rate', 'Payouts to 120+ countries'].map((f, i) => (
                          <li key={i} className="flex items-center gap-4 text-white font-medium">
                             <div className="w-2 h-2 rounded-full bg-[#FF6B00]" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* ─── SECTION 7: GLOBAL TERMINAL ─── */}
        <VisualSection 
           mockup={<BookingTerminal />}
        >
           <SectionTitle 
              subtitle="Global Terminal"
              title="Control your entire travel operation in one place."
              description="A high-fidelity interface for searching, booking, and managing travel inventory. Direct access to our unified distribution engine with zero legacy friction."
           />
           <div className="space-y-4">
              {['Smart search', 'Live availability', 'Real-time pricing', 'Book & issue instantly'].map((f, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                       <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-black text-[#0A2540] uppercase tracking-widest">{f}</span>
                 </div>
              ))}
           </div>
        </VisualSection>

        {/* ─── SECTION 8: ANALYTICS ─── */}
        <VisualSection 
           reverse
           mockup={<AnalyticsDashboard />}
        >
           <SectionTitle 
              subtitle="Analytics & Insights"
              title="Make smarter decisions with real-time data."
              description="Gain deep visibility into your travel volume, revenue trends, and customer behavior. Automated reporting for tax-ready compliance."
           />
           <div className="grid grid-cols-2 gap-4">
              {['Revenue analytics', 'Booking trends', 'Customer insights', 'Performance monitoring'].map((f, i) => (
                 <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-[#0A2540] uppercase tracking-widest mb-1">{f.split(' ')[0]}</p>
                    <p className="text-[8px] text-slate-500 font-medium uppercase tracking-widest">{f.split(' ')[1]}</p>
                 </div>
              ))}
           </div>
        </VisualSection>

        {/* ─── SECTION 9: COMPLIANCE ─── */}
        <section className="py-40 bg-[#F8FAFC]">
           <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <SectionTitle 
                    subtitle="Compliance"
                    title="Enterprise-grade security & KYC verification."
                    description="Our intelligent compliance engine handles identity verification, document checks, and biometric validation for every passenger automatically."
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {['KYC & KYB verification', 'Fraud detection', 'Data encryption', 'GDPR compliant'].map((f, i) => (
                       <div key={i} className="flex items-center gap-4 text-sm font-black text-[#0A2540] uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-[#0A2540]" /> {f}
                       </div>
                    ))}
                 </div>
              </div>
              <div className="relative">
                 <div className="bg-white rounded-[60px] p-12 border border-slate-100 shadow-2xl relative z-10">
                    <div className="flex flex-col items-center text-center">
                       <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-[#0A2540] mb-8 border border-slate-100">
                          <Lock size={60} />
                       </div>
                       <h4 className="text-xl font-black text-[#0A2540] mb-2 tracking-tight">KYC Verification</h4>
                       <div className="space-y-4 w-full mt-8">
                          {[
                            { label: 'Identity Document', status: 'Verified' },
                            { label: 'Address Proof', status: 'Verified' },
                            { label: 'Biometric Check', status: 'Verified' }
                          ].map((s, i) => (
                             <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-xs font-black text-[#0A2540] uppercase tracking-widest">{s.label}</span>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{s.status}</span>
                             </div>
                          ))}
                       </div>
                       <div className="mt-8 px-8 py-3 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                          <CheckCircle2 size={14} /> Verified Partner
                       </div>
                    </div>
                 </div>
                 <div className="absolute -inset-10 bg-blue-100/50 blur-[120px] rounded-full -z-10" />
              </div>
           </div>
        </section>

        {/* ─── SECTION 10: HOW IT WORKS ─── */}
        <section className="py-40">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="How it works"
                    title="Simple steps. Infinite possibilities."
                    description="Get up and running with the world's most powerful travel infrastructure in minutes."
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                   { step: 1, title: 'Get API Key', desc: 'Sign up and get your API credentials.' },
                   { step: 2, title: 'Integrate', desc: 'Integrate our APIs in minutes.' },
                   { step: 3, title: 'Start Selling', desc: 'Go live and start selling instantly.' }
                 ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center group">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-[#0A2540] font-black text-2xl mb-8 group-hover:bg-[#FF6B00] group-hover:text-white transition-all shadow-sm">
                          {s.step}
                       </div>
                       <h4 className="text-2xl font-black text-[#0A2540] mb-4 tracking-tight">{s.title}</h4>
                       <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">{s.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ─── SECTION 11: TESTIMONIALS ─── */}
        <section className="py-40 bg-slate-50/50">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="Testimonials"
                    title="Trusted by innovative travel businesses."
                    description="From high-growth startups to enterprise travel agencies, Travsify is the engine of choice."
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { name: 'Adebayo O.', role: 'CEO, TravelWings', quote: "Travsify NDC helped us scale our platform globally with just one integration." },
                   { name: 'Sarah K.', role: 'CTO, TripWay', quote: "Best API platform we've used. Reliable, fast, and amazing support." },
                   { name: 'Daniel M.', role: 'Founder, FlyTour', quote: "The fintech infrastructure is a game changer for Africa." }
                 ].map((t, i) => (
                    <motion.div 
                       key={i}
                       whileHover={{ y: -10 }}
                       className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all"
                    >
                       <div className="text-[#FF6B00] mb-8">
                          {[1,2,3,4,5].map(j => <span key={j} className="text-xl">★</span>)}
                       </div>
                       <p className="text-lg font-medium text-slate-600 italic leading-relaxed mb-10">"{t.quote}"</p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                             <img src={`https://i.pravatar.cc/150?u=${t.name}`} alt={t.name} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-[#0A2540] uppercase tracking-widest">{t.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* ─── SECTION 12: GLOBAL COVERAGE ─── */}
        <section className="py-40" id="pricing">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="Global Coverage"
                    title="Access travel inventory across 100+ countries."
                    description="Unified distribution across every continent. One node to rule them all."
                 />
                 <div className="flex flex-wrap justify-center gap-12 mt-12">
                    {['500+ Airlines', '1M+ Hotels', 'Thousands of routes'].map((f, i) => (
                       <div key={i} className="flex items-center gap-3 text-sm font-black text-[#0A2540] uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-[#FF6B00]" /> {f}
                       </div>
                    ))}
                 </div>
              </div>
              <InteractiveMap />
           </div>
        </section>

        {/* ─── SECTION 13: USE CASES ─── */}
        <section className="py-40 bg-slate-50/50">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="Use Cases"
                    title="Built for every kind of travel business."
                    description="Whether you're a startup or a global enterprise, we have the infrastructure you need."
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { icon: <Briefcase />, title: 'Travel Agencies', desc: 'Scale your business with global inventory.' },
                   { icon: <Rocket />, title: 'Startups', desc: 'Launch fast with powerful APIs.' },
                   { icon: <Smartphone />, title: 'Fintech Apps', desc: 'Embed travel into your financial apps.' },
                   { icon: <Building2 />, title: 'Corporate Travel', desc: 'Streamline bookings for your team.' }
                 ].map((u, i) => (
                    <div key={i} className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm text-center group hover:shadow-xl transition-all">
                       <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-[#0A2540] group-hover:bg-[#FF6B00] group-hover:text-white mx-auto mb-8 transition-all">
                          {u.icon}
                       </div>
                       <h4 className="text-xl font-black text-[#0A2540] mb-4 tracking-tight">{u.title}</h4>
                       <p className="text-xs font-medium text-slate-500 leading-relaxed">{u.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ─── SECTION 14: AUTOMATION & MARKUPS ─── */}
        <section className="py-40">
           <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <SectionTitle 
                    subtitle="Automation"
                    title="Set your profit. We handle the rest."
                    description="Define flexible markup rules across different travel verticals. Our auto-pricing engine ensures you maximize your margins automatically."
                 />
                 <ul className="space-y-6">
                    {['Flexible markup rules', 'Auto pricing engine', 'Maximize your margins'].map((f, i) => (
                       <li key={i} className="flex items-center gap-4 font-medium text-[#0A2540]">
                          <div className="w-2 h-2 rounded-full bg-blue-500" /> {f}
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-white rounded-[60px] p-12 border border-slate-100 shadow-2xl">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Markup Rule</p>
                 <div className="space-y-12">
                    {[
                      { name: 'Flights', value: 12 },
                      { name: 'Hotels', value: 18 },
                      { name: 'Transfers', value: 15 }
                    ].map((m, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-sm font-black text-[#0A2540] uppercase tracking-widest">{m.name}</span>
                             <span className="text-lg font-black text-[#FF6B00]">{m.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${m.value * 5}%` }}
                               className="h-full bg-gradient-to-r from-[#0A2540] to-[#FF6B00]" 
                             />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* ─── SECTION 15: PRICING ─── */}
        <section className="py-40 bg-slate-50/50">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="Pricing"
                    title="Simple, transparent pricing — built to scale globally."
                    description="Choose the plan that fits your volume. No hidden fees."
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <PricingCard plan="Starter" price="Free" features={['Sandbox API', 'Limited requests', 'Basic support']} />
                 <PricingCard plan="Growth" price="$49" features={['Live API access', 'All travel verticals', 'Webhooks', 'Wallet access']} recommended />
                 <PricingCard plan="Scale" price="$199" features={['Higher API limits', 'Advanced analytics', 'Priority support']} />
                 <PricingCard plan="Enterprise" price="Custom" features={['Dedicated infra', 'SLA guarantee', 'Custom integrations']} />
              </div>
           </div>
        </section>

        {/* ─── SECTION 16: FINAL CTA ─── */}
        <section className="py-40 bg-white relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <SectionTitle 
                    subtitle="Final CTA"
                    title="Start building your travel business today."
                    description="Access global inventory, powerful APIs, and infinite possibilities."
                 />
                 <Link href="/register" className="bg-[#FF6B00] text-white px-12 py-6 rounded-[28px] font-black text-lg hover:bg-orange-600 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-4">
                    Get API Access <ArrowRight size={24} />
                 </Link>
              </div>
              <div className="relative">
                 <div className="bg-[#0A2540] rounded-[60px] p-1 overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80" className="w-full rounded-[58px]" alt="Final CTA" />
                 </div>
                 {/* Floating Element */}
                 <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 flex items-center gap-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                       <CheckCircle2 size={24} />
                    </div>
                    <div>
                       <p className="text-xl font-black text-[#0A2540]">Active Partners</p>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">1,240+ Globally</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-[#0A2540] pt-40 pb-20 text-white overflow-hidden relative">
          <div className="max-w-[1400px] mx-auto px-8">
             <div className="grid grid-cols-2 md:grid-cols-6 gap-20 mb-32">
                <div className="col-span-2 space-y-8">
                   <Link href="/" className="group flex items-center gap-3">
                      <Logo className="w-14 h-14" />
                      <span className="text-3xl font-black tracking-tighter">TRAVSIFY</span>
                   </Link>
                   <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
                      The unified travel infrastructure for the next generation of global platforms. 
                   </p>
                   <div className="flex gap-4">
                      {['tw', 'li', 'gh', 'yt'].map(s => <div key={s} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#0A2540] transition-all cursor-pointer">{s}</div>)}
                   </div>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Product</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">APIs</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Documentation</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Status</Link></li>
                   </ul>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Company</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">About Us</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Careers</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Blog</Link></li>
                   </ul>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Resources</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">Guides</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Changelog</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Support</Link></li>
                   </ul>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Legal</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">Privacy Policy</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Terms of Service</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Data Protection</Link></li>
                   </ul>
                </div>
             </div>
             <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">© 2026 TRAVSIFY GLOBAL INFRASTRUCTURE INC. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                   <Link href="#" className="hover:text-white transition-colors">Security</Link>
                   <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
                </div>
             </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
