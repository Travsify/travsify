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
    className={`p-10 rounded-[40px] border transition-all duration-500 group ${dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50'}`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 ${dark ? 'bg-[#FF6B00] text-white' : 'bg-[#0A2540] text-[#FF6B00]'}`}>
      {icon}
    </div>
    <h3 className={`text-2xl font-black mb-4 tracking-tight ${dark ? 'text-white' : 'text-[#0A2540]'}`}>{title}</h3>
    <p className={`text-sm font-medium leading-relaxed ${dark ? 'text-white/50' : 'text-slate-500'}`}>{desc}</p>
  </motion.div>
);

const VisualSection = ({ reverse = false, image, children, id }: { reverse?: boolean, image: string, children: React.ReactNode, id?: string }) => (
  <section id={id} className="py-20 lg:py-40 max-w-[1400px] mx-auto px-8">
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        {children}
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, x: reverse ? -40 : 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
        className={`relative ${reverse ? 'lg:order-1' : ''}`}
      >
        <div className="absolute -inset-10 bg-gradient-to-tr from-blue-100/30 to-orange-100/30 blur-[100px] rounded-full -z-10" />
        <div className="rounded-[60px] overflow-hidden border border-slate-100 shadow-[0_50px_100px_-20px_rgba(10,37,64,0.15)] bg-white p-3">
          <div className="rounded-[52px] overflow-hidden aspect-[4/3] lg:aspect-square">
            <img src={image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" alt="Feature" />
          </div>
        </div>
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
      
      {/* --- PROGRESS INDICATOR --- */}
      <motion.div 
        style={{ scaleX: smoothProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#FF6B00] origin-left z-[101]"
      />

      {/* --- STICKY NAV --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo className="w-10 h-10 md:w-12 md:h-12" />
          </Link>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[22px] border border-slate-200/50">
            {['Products', 'Developers', 'Docs', 'Pricing'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="px-6 py-2.5 text-[12px] font-black text-slate-500 hover:text-[#0A2540] hover:bg-white rounded-xl transition-all uppercase tracking-widest">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-[12px] font-black text-slate-500 hover:text-[#0A2540] px-4 uppercase tracking-widest">Login</Link>
            <Link href="/register" className="bg-[#0A2540] text-white px-8 py-4 rounded-[18px] text-[12px] font-black hover:bg-[#FF6B00] transition-all shadow-2xl shadow-[#0A2540]/10 hover:shadow-[#FF6B00]/20 hover:scale-[1.02] active:scale-95 uppercase tracking-widest">
              Get Started
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 bg-slate-100 rounded-xl text-[#0A2540] hover:bg-[#FF6B00] hover:text-white transition-all">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="p-8 flex flex-col gap-6">
                {['Products', 'Developers', 'Docs', 'Pricing'].map((item) => (
                  <Link 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-black text-[#0A2540] hover:text-[#FF6B00] transition-colors"
                  >
                    {item}
                  </Link>
                ))}
                <div className="h-px bg-slate-100 my-4" />
                <Link href="/login" className="text-xl font-black text-slate-500">Login</Link>
                <Link href="/register" className="bg-[#FF6B00] text-white text-center py-5 rounded-[20px] font-black">Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        
        {/* ─── SECTION 1: THE GRAND HERO ─── */}
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-8 pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-100/40 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-100/30 blur-[120px] rounded-full animate-pulse-glow" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-full shadow-sm mb-12"
          >
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Global Infrastructure v2.1</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
            className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] text-[#0A2540] mb-12"
          >
            ONE API FOR<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A2540] via-[#FF6B00] to-[#FF6B00]">EVERY JOURNEY.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed mb-16"
          >
            Travsify orchestrates the world's travel verticals into a single, high-performance distribution engine. Flights, Hotels, Logistics, and e-Visas—unified.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <Link href="/register" className="bg-[#FF6B00] text-white px-12 py-6 rounded-[28px] font-black text-lg hover:bg-orange-600 transition-all shadow-[0_20px_50px_-10px_rgba(255,107,0,0.4)] hover:scale-[1.05] active:scale-95 flex items-center gap-4">
              Start Building <ArrowRight size={24} />
            </Link>
            <Link href="/demo" className="bg-white border-2 border-slate-100 text-[#0A2540] px-12 py-6 rounded-[28px] font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-[#0A2540] group-hover:text-white transition-all">
                <Play size={18} fill="currentColor" />
              </div>
              Live Demo
            </Link>
          </motion.div>

          {/* Floating Grid/Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
            className="mt-32 w-full max-w-[1200px] aspect-video rounded-[60px] overflow-hidden border-8 border-slate-50 shadow-2xl relative group"
          >
             <img src="https://images.unsplash.com/photo-1436491865332-7a61a109c055?w=1600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="Travel Hero" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent flex items-end p-20 text-left">
                <div className="space-y-4">
                   <div className="flex gap-2">
                      {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" />)}
                   </div>
                   <h3 className="text-4xl font-black text-white tracking-tight">Real-time Global Sync</h3>
                   <p className="text-white/60 text-lg font-medium">Connecting 12.4M nodes across 190 countries in milliseconds.</p>
                </div>
             </div>
          </motion.div>
        </section>

        {/* ─── SECTION 2: GLOBAL FLIGHT ENGINE ─── */}
        <VisualSection image="/travsify_flight_engine_1777024535820.png" id="flights">
          <SectionTitle 
            subtitle="Vertical 01"
            title="Direct-Connect NDC Flight Engine."
            description="Access premium NDC, GDS, and LCC content from 500+ global airlines through a single normalized payload. No legacy friction. No integration delays."
          />
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-4xl font-black text-[#0A2540] tracking-tighter">500+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Carriers</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-[#FF6B00] tracking-tighter">200ms</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Response Latency</p>
            </div>
          </div>
          <Link href="/demo?tab=flights" className="mt-12 inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest text-[#0A2540] hover:text-[#FF6B00] transition-colors group">
            Explore Flight API <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </VisualSection>

        {/* ─── SECTION 3: STRATEGIC LODGING ─── */}
        <VisualSection reverse image="/travsify_hotel_hub_1777024580606.png" id="hotels">
          <SectionTitle 
            subtitle="Vertical 02"
            title="Global Lodging & Resort Network."
            description="Tap into 1.2M+ properties, from boutique retreats to enterprise hotel chains. Automated availability syncing and instant reservation fulfillment."
          />
          <div className="space-y-6">
            {['Dynamic Pricing Engine', 'Real-time Room Inventory', 'Direct Channel Connectivity'].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-black text-[#0A2540] uppercase tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </VisualSection>

        {/* ─── SECTION 4: AUTONOMOUS LOGISTICS ─── */}
        <VisualSection image="/travsify_ground_logistics_1777024982878.png" id="transfers">
          <SectionTitle 
            subtitle="Vertical 03"
            title="Intelligent Ground Mobility."
            description="The complete car rental and airport transfer stack. Managed pickup logistics in 2000+ cities globally, fully integrated with your booking flow."
          />
          <FeatureBlock 
            icon={<Car size={32} />}
            title="Airport-to-Doorstep"
            desc="Automated chauffeur dispatching via our global logistics network. High-fidelity tracking and instant confirmation."
          />
        </VisualSection>

        {/* ─── SECTION 5: COMPLIANCE GATEWAY ─── */}
        <VisualSection reverse image="/travsify_visa_automation_1777024725980.png" id="visa">
          <SectionTitle 
            subtitle="Vertical 04"
            title="Autonomous e-Visa Processing."
            description="Remove the friction of global travel. Our intelligent engine checks visa requirements and initiates applications automatically via direct embassy connects."
          />
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex items-start gap-6">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <ScrollText size={24} />
             </div>
             <div>
                <h4 className="text-lg font-black text-[#0A2540] mb-2 tracking-tight">Requirement Intelligence</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Real-time mapping of global visa policies updated every hour to ensure 100% compliance.</p>
             </div>
          </div>
        </VisualSection>

        {/* ─── SECTION 6: TREASURY & SETTLEMENT ─── */}
        <section className="bg-[#0A2540] py-20 lg:py-40 overflow-hidden relative" id="wallets">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 blur-[200px] rounded-full" />
          </div>
          
          <div className="max-w-[1400px] mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <SectionTitle 
                  dark
                  subtitle="Fintech Layer"
                  title="Multi-Currency Treasury Wallet."
                  description="A powerful financial orchestration layer. Hold balances in USD, NGN, and more. Settle travel bookings instantly without cross-border fees."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <FeatureBlock dark icon={<Wallet size={28} />} title="Instant Settlement" desc="Real-time transaction clearing for all travel verticals." />
                  <FeatureBlock dark icon={<CreditCard size={28} />} title="Virtual Cards" desc="Issue one-time use cards for secure provider payments." />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img src="/travsify_treasury_wallet_1777025071972.png" className="w-full rounded-[60px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)]" alt="Wallet" />
                <div className="absolute -bottom-10 -left-10 bg-[#FF6B00] p-10 rounded-[40px] shadow-2xl text-white">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Wallet Security</p>
                   <p className="text-2xl font-black tracking-tight">Bank-Grade Vault Encryption</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 7: API GATEWAY ─── */}
        <VisualSection image="/travsify_api_gateway_1777025085519.png" id="developers">
          <SectionTitle 
            subtitle="Developer First"
            title="Unified Travel API Gateway."
            description="Stop building dozens of integrations. Our unified API provides a single entry point for search, booking, and management across all travel verticals."
          />
          <div className="bg-[#0A1629] p-1 rounded-[40px] shadow-2xl">
             <div className="bg-[#0A2540] p-10 rounded-[38px] font-mono text-sm border border-white/5">
                <div className="flex gap-2 mb-8">
                   <div className="w-2.5 h-2.5 bg-red-500/20 rounded-full" />
                   <div className="w-2.5 h-2.5 bg-yellow-500/20 rounded-full" />
                   <div className="w-2.5 h-2.5 bg-emerald-500/20 rounded-full" />
                </div>
                <p className="text-blue-400">GET <span className="text-white">/api/v1/search/universal</span></p>
                <p className="text-slate-500 mt-2">// Unified multi-vertical search</p>
                <p className="text-white mt-4">{'{'}</p>
                <p className="pl-6 text-white">"query": <span className="text-emerald-400">"Flights + Hotels to DXB"</span>,</p>
                <p className="pl-6 text-white">"filters": <span className="text-emerald-400">"5-star, Business"</span></p>
                <p className="text-white">{'}'}</p>
             </div>
          </div>
        </VisualSection>

        {/* ─── SECTION 8: CORPORATE GOVERNANCE ─── */}
        <section className="py-40 bg-slate-50/50">
           <div className="max-w-[1400px] mx-auto px-8">
              <div className="text-center max-w-3xl mx-auto mb-24">
                 <SectionTitle 
                    subtitle="Management"
                    title="Enterprise Control Plane."
                    description="Centralized administration for corporate travel managers. Define approval workflows, manage employee wallets, and monitor global spending in real-time."
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { icon: <Users />, title: "Team Hierarchies", desc: "Manage multi-level teams." },
                   { icon: <Lock />, title: "Policy Enforcement", desc: "Define travel budgets." },
                   { icon: <Activity />, title: "Real-time Audits", desc: "Every transaction tracked." },
                   { icon: <FileText />, title: "Automated Reporting", desc: "Tax-ready travel logs." }
                 ].map((f, i) => (
                   <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#0A2540] group-hover:bg-[#0A2540] group-hover:text-white transition-all">
                        {f.icon}
                      </div>
                      <h4 className="text-xl font-black text-[#0A2540] mb-4 tracking-tight">{f.title}</h4>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ─── SECTION 9: CURATED TOURS ─── */}
        <VisualSection reverse image="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80">
          <SectionTitle 
            subtitle="Experiences"
            title="Curated Discovery Engine."
            description="Go beyond the basics. Integrate sightseeing, local tours, and exclusive destination experiences into your travel platform with zero inventory risk."
          />
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                <Ticket className="text-[#FF6B00] mb-4" />
                <p className="text-lg font-black text-[#0A2540]">VIP Access</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skip-the-line entries</p>
             </div>
             <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <Compass className="text-blue-600 mb-4" />
                <p className="text-lg font-black text-[#0A2540]">Expert Guides</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified local pros</p>
             </div>
          </div>
        </VisualSection>

        {/* ─── SECTION 10: CONCIERGE & SUPPORT ─── */}
        <section className="py-40 bg-[#0A2540] text-white">
           <div className="max-w-[1400px] mx-auto px-8 flex flex-col lg:flex-row items-center gap-24">
              <div className="flex-1">
                 <SectionTitle 
                   dark
                   subtitle="Operations"
                   title="Global Fulfillment Orchestration."
                   description="We don't just provide data. We ensure every booking is fulfilled, every ticket issued, and every passenger supported by our 24/7 global concierge team."
                 />
                 <div className="flex gap-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#FF6B00]">
                          <ShieldCheck size={24} />
                       </div>
                       <div>
                          <p className="text-lg font-black">100% Assurance</p>
                          <p className="text-xs text-white/40 font-bold uppercase">Success Guaranteed</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="flex-1 w-full relative">
                 <div className="absolute inset-0 bg-[#FF6B00]/10 blur-[120px] rounded-full" />
                 <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[60px] border border-white/10 relative z-10">
                    <div className="flex items-center gap-6 mb-12">
                       <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF6B00]">
                          <img src="https://i.pravatar.cc/150?u=concierge" className="w-full h-full object-cover" alt="Concierge" />
                       </div>
                       <div>
                          <p className="text-xl font-black">Human-in-the-loop</p>
                          <p className="text-sm text-white/50">Our ops team handles the complex edge cases so you don't have to.</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="p-4 bg-white/5 rounded-2xl text-xs font-medium border border-white/10 italic text-white/80">
                          "Confirming NDC flight NDC-EK-782 for Passenger Adebayo..."
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl text-xs font-medium border border-white/10 italic text-white/80">
                          "Syncing hotel voucher with Hilton DXB system..."
                       </div>
                       <div className="flex justify-end">
                          <div className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                             Fulfillment Secure
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-32 lg:py-60 text-center relative overflow-hidden">
           <div className="absolute inset-0 -z-10 bg-slate-50/50" />
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="max-w-4xl mx-auto px-8"
           >
              <h2 className="text-6xl md:text-8xl font-black text-[#0A2540] tracking-tighter leading-none mb-12">
                 Ready to redefine<br/>
                 travel <span className="text-[#FF6B00]">delivery?</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                 <Link href="/register" className="bg-[#0A2540] text-white px-12 py-6 rounded-[28px] font-black text-lg hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95">
                    Create Partner Account
                 </Link>
                 <Link href="/demo" className="bg-white border-2 border-slate-100 text-[#0A2540] px-12 py-6 rounded-[28px] font-black text-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                    Launch Interactive Demo
                 </Link>
              </div>
              <p className="mt-12 text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No integration fee • Standard API pricing • Global Support</p>
           </motion.div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-[#0A2540] pt-40 pb-20 text-white overflow-hidden relative">
          <div className="max-w-[1400px] mx-auto px-8">
             <div className="grid grid-cols-2 md:grid-cols-6 gap-20 mb-32">
                <div className="col-span-2 space-y-8">
                   <Link href="/" className="group">
                      <Logo className="w-14 h-14" />
                   </Link>
                   <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
                      The unified engine for the next generation of travel platforms. 
                   </p>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Infrastructure</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">Flight API</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Hotel API</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Logistics</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">e-Visa</Link></li>
                   </ul>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Developers</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">Documentation</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">SDKs</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">System Status</Link></li>
                   </ul>
                </div>
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Company</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00]">About</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Legal</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00]">Support</Link></li>
                   </ul>
                </div>
             </div>
             <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">© 2026 TRAVSIFY GLOBAL INFRASTRUCTURE INC.</p>
                <div className="flex gap-10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                   <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                   <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                </div>
             </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
