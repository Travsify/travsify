'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Plane, Hotel, Car, ShieldCheck, Globe, 
  Code2, Wallet, Search, PieChart, Lock, 
  Key, Zap, Play, CheckCircle2, ArrowRight,
  CreditCard, BarChart3, Settings, Users,
  Briefcase, Rocket, Smartphone, Building2, FileText,
  ScrollText, ChevronDown, X, Menu, ExternalLink,
  Sparkles, Layers, Fingerprint
} from 'lucide-react';

export default function LandingPage() {
  const [bookMenuOpen, setBookMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const verticals = [
    { id: 'flights', label: 'Flights', desc: 'NDC & GDS content from 500+ airlines', icon: <Plane size={20} />, color: '#3B82F6' },
    { id: 'hotels', label: 'Hotels', desc: 'Over 1.2M+ properties worldwide', icon: <Hotel size={20} />, color: '#FF7A00' },
    { id: 'transfers', label: 'Transfers', desc: 'Airport pickups in 2000+ cities', icon: <Car size={20} />, color: '#10B981' },
    { id: 'visa', label: 'eVisa', desc: 'Automated visa requirement checks', icon: <ScrollText size={20} />, color: '#6366F1' },
    { id: 'insurance', label: 'Insurance', desc: 'Comprehensive travel protection', icon: <ShieldCheck size={20} />, color: '#14B8A6' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-[#0B1F33] font-sans selection:bg-[#FF7A00]/20 overflow-x-hidden">
      
      {/* ─── STICKY PREMIUM NAV ─── */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 45, scale: 1.1 }}
              className="w-11 h-11 bg-[#0A2540] rounded-[14px] flex items-center justify-center text-white shadow-2xl shadow-[#0A2540]/20"
            >
              <Plane size={22} className="rotate-45" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-[#0A2540]">TRAVSIFY <span className="text-[#FF7A00]">NDC</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-[22px] border border-slate-200/50">
            <div className="relative">
              <button 
                onMouseEnter={() => setBookMenuOpen(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-[13px] font-black transition-all ${bookMenuOpen ? 'bg-white text-[#FF7A00] shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Globe size={16} /> Travel Services <ChevronDown size={14} className={`transition-transform duration-500 ${bookMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {bookMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    onMouseLeave={() => setBookMenuOpen(false)}
                    className="absolute top-full left-0 mt-4 w-[480px] bg-white rounded-[40px] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(10,37,64,0.2)] z-50 overflow-hidden"
                  >
                    <div className="p-8">
                      <p className="px-4 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Adapters</p>
                      <div className="grid grid-cols-1 gap-2">
                        {verticals.map((v) => (
                          <Link key={v.id} href={`/demo?tab=${v.id}`} className="flex items-center gap-5 px-5 py-4 rounded-[24px] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all text-slate-400 group-hover:text-[#FF7A00]">
                              {v.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-[14px] font-black text-slate-900">{v.label}</p>
                              <p className="text-[11px] font-medium text-slate-400 leading-tight">{v.desc}</p>
                            </div>
                            <ArrowRight size={16} className="text-slate-200 group-hover:text-[#FF7A00] group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0A2540] p-6 flex items-center justify-between">
                      <span className="text-[11px] font-black text-white/40 uppercase tracking-widest px-4">Direct Connect Active</span>
                      <Link href="/demo" className="px-6 py-3 bg-[#FF7A00] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        Launch Live Demo
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="#products" className="px-6 py-3 text-[13px] font-black text-slate-500 hover:text-[#0A2540] transition-colors">Products</Link>
            <Link href="#developers" className="px-6 py-3 text-[13px] font-black text-slate-500 hover:text-[#0A2540] transition-colors">Developers</Link>
            <Link href="/docs" className="px-6 py-3 text-[13px] font-black text-slate-500 hover:text-[#0A2540] transition-colors">Docs</Link>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-[13px] font-black text-slate-500 hover:text-[#0A2540] px-4">Login</Link>
            <Link href="/register" className="bg-[#0A2540] text-white px-8 py-3.5 rounded-[18px] text-[13px] font-black hover:bg-[#FF7A00] transition-all shadow-xl shadow-[#0A2540]/10 hover:shadow-[#FF7A00]/20 hover:scale-[1.02] active:scale-95">
              Get Started
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 bg-slate-100 rounded-xl text-[#0A2540]">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* ─── IMMERSIVE HERO SECTION ─── */}
        <section className="relative max-w-[1400px] mx-auto px-8 pt-40 pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center">
          {/* Animated Background Orbs */}
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-100/30 blur-[150px] rounded-full -z-10 animate-pulse" 
          />
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-orange-100/30 blur-[120px] rounded-full -z-10 animate-pulse-glow" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10 relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full shadow-sm"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">v2.0 Infrastructure Now Live</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter text-[#0A2540]"
              >
                The Engine for<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A2540] via-[#FF7A00] to-[#FF7A00]">Managed Travel.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed"
              >
                Orchestrate global travel distribution with our unified API. 
                Flights, Hotels, and Logistics—all in one secure ecosystem.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 pt-6"
              >
                <Link href="/register" className="bg-[#FF7A00] text-white px-10 py-5 rounded-[24px] font-black text-base hover:bg-orange-600 transition-all shadow-2xl shadow-orange-600/30 hover:scale-[1.05] active:scale-95 flex items-center gap-3">
                  Start Building Free <ArrowRight size={20} />
                </Link>
                <Link href="/demo" className="bg-white border-2 border-slate-100 text-[#0A2540] px-10 py-5 rounded-[24px] font-black text-base hover:bg-slate-50 transition-all flex items-center gap-3">
                  <Play size={18} fill="currentColor" /> Watch Demo
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-12 flex items-center gap-8"
              >
                <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <motion.img 
                      key={i} 
                      whileHover={{ y: -5, zIndex: 10 }}
                      src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg" 
                      alt="user" 
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400">+2k</div>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => <Sparkles key={i} size={12} className="text-[#FF7A00]" fill="currentColor" />)}
                  </div>
                  <p className="text-sm font-black text-[#0A2540]">Rated 4.9/5 by global builders</p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#0A2540]/10 to-[#FF7A00]/10 blur-3xl rounded-[60px] -z-10" />
                
                <div className="bg-white p-2 rounded-[52px] shadow-[0_60px_100px_-20px_rgba(10,37,64,0.15)] border border-slate-100 overflow-hidden">
                   <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
                     <img 
                       src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80" 
                       className="w-full h-full object-cover" 
                       alt="Travel"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/20 to-transparent" />
                     
                     <div className="absolute bottom-10 left-10 right-10">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white">
                              <Fingerprint size={28} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Identity Secure</p>
                              <p className="text-xl font-black text-white">Verified Travel Node</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 2, delay: 1 }}
                                className="h-full bg-[#FF7A00]" 
                              />
                           </div>
                           <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '90%' }}
                                transition={{ duration: 2, delay: 1.2 }}
                                className="h-full bg-emerald-500" 
                              />
                           </div>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Floating Stats */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -right-12 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 z-20 w-64"
                >
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Uptime</p>
                   <p className="text-4xl font-black text-[#0A2540] tracking-tighter mb-4">99.98<span className="text-emerald-500 text-lg">%</span></p>
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                      <Zap size={10} fill="currentColor" /> LIVE MONITORING
                   </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-12 bg-[#FF7A00] p-8 rounded-[32px] shadow-2xl z-20 w-72 text-white"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                         <Globe size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Global Coverage</span>
                   </div>
                   <p className="text-lg font-black leading-tight">Connected to 12.4M+ Travel Nodes Globally</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── VERTICAL SHOWCASE ─── */}
        <section className="bg-[#0A2540] py-40 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-8">
             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-[#FF7A00]">
                      <Layers size={18} />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Infrastructure Modules</span>
                   </div>
                   <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                      One Integration.<br/>
                      Every Travel Vertical.
                   </h2>
                </div>
                <p className="text-xl text-white/50 font-medium max-w-md leading-relaxed">
                   Stop managing fragmented APIs. Our platform consolidates the world's travel inventory into a single developer-friendly gateway.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {verticals.map((v, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-[48px] hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 scale-150">
                        {v.icon}
                     </div>
                     <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-[#0A2540] mb-10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        {v.icon}
                     </div>
                     <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{v.label}</h3>
                     <p className="text-white/50 font-medium leading-relaxed mb-10">{v.desc}</p>
                     
                     <Link href="/demo" className="flex items-center gap-3 text-[#FF7A00] text-[12px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                        View Live API Feed <ArrowRight size={16} />
                     </Link>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* ─── DEVELOPER EXPERIENCE (CODE) ─── */}
        <section className="py-40 max-w-[1400px] mx-auto px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                 <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full">
                    <Code2 size={16} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Build with Speed</span>
                 </div>
                 <h2 className="text-5xl font-black text-[#0A2540] tracking-tighter leading-tight">
                    API-First Managed<br/>Distribution Network.
                 </h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    Integrate our SDKs and go live in hours. We handle the fulfillment, ticketing, and secure settlements behind the scenes.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-8">
                    {[
                      { icon: <Zap size={20} />, title: "Instant Search", sub: "Global Polling" },
                      { icon: <ShieldCheck size={20} />, title: "Secure Checkout", sub: "Anti-Fraud Layer" },
                      { icon: <Wallet size={20} />, title: "Local Settlement", sub: "Multi-Currency" },
                      { icon: <Users size={20} />, title: "Whitelabel UI", sub: "Full Branding" }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0A2540] shrink-0">
                            {f.icon}
                         </div>
                         <div>
                            <p className="font-black text-[#0A2540] leading-none mb-1">{f.title}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{f.sub}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#0A1629] p-2 rounded-[48px] shadow-2xl relative group">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF7A00]/10 blur-3xl rounded-full -z-10" />
                 <div className="bg-[#0A2540] p-10 lg:p-14 rounded-[44px] border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                    <div className="flex gap-2 mb-10">
                       <div className="w-3 h-3 rounded-full bg-red-500/30" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                    </div>
                    <p className="text-blue-400">const <span className="text-white">travsify</span> = <span className="text-purple-400">require</span>(<span className="text-emerald-400">'@travsify/core'</span>);</p>
                    <br/>
                    <p className="text-slate-500">// Initialize secure search</p>
                    <p className="text-white">await <span className="text-white">travsify</span>.<span className="text-blue-300">search</span>({'{'}</p>
                    <p className="pl-6 text-white">vertical: <span className="text-emerald-400">'flights'</span>,</p>
                    <p className="pl-6 text-white">itinerary: {'{'}</p>
                    <p className="pl-12 text-white">from: <span className="text-emerald-400">'LOS'</span>,</p>
                    <p className="pl-12 text-white">to: <span className="text-emerald-400">'DXB'</span>,</p>
                    <p className="pl-12 text-white">date: <span className="text-emerald-400">'2026-10-12'</span></p>
                    <p className="pl-6 text-white">{'}'}</p>
                    <p className="text-white">{'}'});</p>
                    <br/>
                    <p className="text-slate-500">// Response: Verified Inventory</p>
                    <p className="text-white">{'{'}</p>
                    <p className="pl-6 text-white">status: <span className="text-emerald-400">'live'</span>,</p>
                    <p className="pl-6 text-white">offers: [<span className="text-blue-300">"NDC-EK-782"</span>, <span className="text-blue-300">"NDC-QR-143"</span>]</p>
                    <p className="text-white">{'}'}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* ─── FINAL CALL TO ACTION ─── */}
        <section className="py-60 relative overflow-hidden text-center bg-slate-50/50">
           <div className="max-w-[1000px] mx-auto px-8 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-6xl md:text-8xl font-black text-[#0A2540] tracking-tighter leading-none mb-12"
              >
                Launch your travel<br/>
                platform <span className="text-[#FF7A00]">today.</span>
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-6"
              >
                 <Link href="/register" className="bg-[#0A2540] text-white px-12 py-6 rounded-[28px] font-black text-lg hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95">
                    Get Access Now
                 </Link>
                 <Link href="/demo" className="bg-white border-2 border-slate-100 text-[#0A2540] px-12 py-6 rounded-[28px] font-black text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                    Live Platform Demo
                 </Link>
              </motion.div>
           </div>
           
           {/* Floating Background Elements */}
           <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
              <div className="absolute top-20 left-20 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-100 rounded-full blur-3xl opacity-50" />
           </div>
        </section>

        {/* ─── PREMIUM FOOTER ─── */}
        <footer className="bg-[#0A2540] pt-40 pb-20 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
          <div className="max-w-[1400px] mx-auto px-8">
             <div className="grid grid-cols-2 md:grid-cols-6 gap-20 mb-32">
                <div className="col-span-2 space-y-10">
                   <Link href="/" className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0A2540]">
                        <Plane size={24} className="rotate-45" />
                      </div>
                      <span className="text-2xl font-black tracking-tighter">TRAVSIFY <span className="text-[#FF7A00]">NDC</span></span>
                   </Link>
                   <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
                      Consolidating global travel infrastructure for the next generation of builders and agencies.
                   </p>
                   <div className="flex gap-4">
                      {[Globe, Search, Code2, ShieldCheck].map((Icon, i) => (
                        <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#FF7A00] hover:text-white transition-all cursor-pointer">
                          <Icon size={20} />
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-8">
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Verticals</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Flights</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Hotels</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Transfers</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">e-Visas</Link></li>
                   </ul>
                </div>

                <div className="space-y-8">
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Platform</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="/docs" className="hover:text-[#FF7A00] transition-colors">Documentation</Link></li>
                      <li><Link href="/docs" className="hover:text-[#FF7A00] transition-colors">API Keys</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Managed Travel</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Settle Pay</Link></li>
                   </ul>
                </div>

                <div className="space-y-8">
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Company</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">About Us</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Press Kit</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Global Status</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Legal</Link></li>
                   </ul>
                </div>

                <div className="space-y-8">
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Support</p>
                   <ul className="space-y-4 text-sm font-black text-white/60">
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Help Center</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Contact Sales</Link></li>
                      <li><Link href="#" className="hover:text-[#FF7A00] transition-colors">Developer Forum</Link></li>
                   </ul>
                </div>
             </div>

             <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-xs font-black text-white/20 uppercase tracking-widest">© 2026 TRAVSIFY GLOBAL INFRASTRUCTURE INC.</p>
                <div className="flex gap-10 text-xs font-black text-white/40 uppercase tracking-widest">
                   <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                   <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                   <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                </div>
             </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
