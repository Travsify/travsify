'use client';

import Link from 'next/link';
import { 
  Plane, Hotel, Car, ShieldCheck, Globe, 
  Code2, Wallet, Search, PieChart, Lock, 
  Key, Zap, Play, CheckCircle2, ArrowRight,
  CreditCard, BarChart3, Settings, Users,
  Briefcase, Rocket, Smartphone, Building2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500/30">
      
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0A1629] rounded flex items-center justify-center text-white">
              <Plane size={18} className="rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#0A1629]">TRAVSIFY <span className="text-orange-600">NDC</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <Link href="#products" className="hover:text-[#0A1629] transition-colors">Products</Link>
            <Link href="#developers" className="hover:text-[#0A1629] transition-colors">Developers</Link>
            <Link href="#pricing" className="hover:text-[#0A1629] transition-colors">Pricing</Link>
            <Link href="#company" className="hover:text-[#0A1629] transition-colors">Company</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] font-bold text-slate-500 hover:text-[#0A1629] transition-colors">Log in</Link>
            <Link href="/register" className="text-[13px] font-bold bg-orange-600 text-white px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
              Get API Access
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* 1. HERO SECTION */}
        <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-[#0A1629]">
              Build. Launch.<br/>
              Scale Your Travel<br/>
              Business — <span className="text-orange-600">Instantly.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              One API. Global Inventory.<br/>
              Built for Africa & the World.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="/register" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
                Get API Access
              </Link>
              <Link href="/docs" className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                View Docs
              </Link>
            </div>
          </div>
          <div className="flex-1 relative perspective-1000">
            {/* Animated Hero Image */}
            <div className="relative z-10 w-full max-w-[600px] ml-auto animate-[bounce_6s_infinite]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-orange-500/30 blur-3xl -z-10 rounded-full" />
              <img src="/hero_dashboard.png" alt="Travel API Dashboard" className="w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] border border-white/20 object-cover" />
            </div>
            {/* Mobile Mockup Overlay */}
            <div className="absolute -bottom-12 -left-12 w-64 rounded-3xl p-2 shadow-2xl z-20 hidden md:block animate-[bounce_8s_infinite] bg-white/10 backdrop-blur-md border border-white/30">
              <img src="/flight_search.png" alt="Mobile Flight Search" className="w-full h-auto rounded-2xl object-cover shadow-lg" />
            </div>
            <Plane className="absolute -top-12 right-20 text-blue-500 w-32 h-32 opacity-20 rotate-45 animate-pulse" />
          </div>
        </section>

        {/* 2. TRUST STRIP */}
        <section className="border-y border-slate-100 bg-slate-50/50 py-8">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Powering the next generation of travel companies</p>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale">
              <span className="text-xl font-black font-serif">IATA</span>
              <span className="text-xl font-black">Emirates</span>
              <span className="text-2xl font-black italic text-blue-800">VISA</span>
              <span className="text-lg font-black flex items-center gap-1"><Zap size={18}/> Flutterwave</span>
              <span className="text-lg font-black flex items-center gap-1"><div className="w-4 h-4 bg-blue-600 rounded-sm"/> paystack</span>
              <span className="text-xl font-black tracking-tighter">aMaDEUS</span>
            </div>
          </div>
        </section>

        {/* 3. VALUE PROPOSITION */}
        <section className="py-24 max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Code2 size={20} /></div>
                <h3 className="text-xl font-black text-slate-900">Infrastructure</h3>
              </div>
              <p className="text-slate-500 pl-14 text-sm font-medium">Scalable APIs & reliable systems built for global scale.</p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Globe size={20} /></div>
                <h3 className="text-xl font-black text-slate-900">Inventory</h3>
              </div>
              <p className="text-slate-500 pl-14 text-sm font-medium">Access 500+ airlines, 1M+ hotels, and more.</p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Wallet size={20} /></div>
                <h3 className="text-xl font-black text-slate-900">Payments</h3>
              </div>
              <p className="text-slate-500 pl-14 text-sm font-medium">Global payouts, multi-currency wallets & instant settlements.</p>
            </div>
          </div>
          <div className="relative h-[400px] flex items-center justify-center hidden md:flex animate-[pulse_4s_ease-in-out_infinite]">
            {/* Diagram node graph UI */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-full blur-3xl -z-10" />
            <div className="w-32 h-32 rounded-full bg-[#0A1629] text-white flex items-center justify-center font-black text-center leading-tight shadow-xl z-10">
              TRAVSIFY<br/>NDC
            </div>
            {/* Connecting Lines & Nodes */}
            <div className="absolute inset-0 border border-dashed border-slate-200 rounded-full m-12 animate-spin-slow" style={{ animationDuration: '30s' }} />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-blue-600"><Plane size={20}/></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Airlines</span>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tours</span>
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-purple-600"><Globe size={20}/></div>
            </div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-orange-600"><Hotel size={20}/></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hotels</span>
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-emerald-600"><Car size={20}/></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transfers</span>
            </div>
          </div>
        </section>

        {/* 4. TRAVEL VERTICALS */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Everything you need.</h2>
            <p className="text-lg text-slate-500 font-medium mb-12">One integration.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { icon: <Plane size={24} className="text-blue-600" />, label: "Flights", color: "blue" },
                { icon: <Hotel size={24} className="text-orange-600" />, label: "Hotels", color: "orange" },
                { icon: <Car size={24} className="text-emerald-600" />, label: "Transfers", color: "emerald" },
                { icon: <Globe size={24} className="text-purple-600" />, label: "Tours", color: "purple" },
                { icon: <ShieldCheck size={24} className="text-teal-600" />, label: "Insurance", color: "teal" }
              ].map((v, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className={`w-14 h-14 rounded-full bg-${v.color}-50 flex items-center justify-center`}>
                    {v.icon}
                  </div>
                  <span className="font-bold text-slate-900">{v.label}</span>
                  <ArrowRight size={16} className={`text-${v.color}-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. DEVELOPER ECOSYSTEM & 6. FINTECH INFRASTRUCTURE */}
        <section className="py-24 max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Developer */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Built for developers.</h2>
              <p className="text-lg text-slate-500 font-medium">Loved by businesses.</p>
            </div>
            <ul className="space-y-3 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Clean, well-documented APIs</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Sandbox & live environments</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Real-time logs & webhooks</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> SDKs in multiple languages</li>
            </ul>
            <div className="bg-[#0A1629] rounded-2xl p-4 text-[13px] text-slate-300 font-mono overflow-hidden shadow-xl">
              <div className="flex gap-4 border-b border-slate-700 pb-3 mb-3 text-xs">
                <span className="text-white border-b-2 border-orange-500 pb-3 -mb-3">Request</span>
                <span>Response</span>
                <span>Python</span>
                <span>cURL</span>
              </div>
              <p className="text-emerald-400">GET /v1/flights/search</p>
              <br/>
              <p>Headers</p>
              <p>Authorization: Bearer sk_live_*********</p>
              <br/>
              <p className="text-slate-400">{"{"}</p>
              <p className="pl-4">"status": <span className="text-yellow-300">"success"</span>,</p>
              <p className="pl-4">"data": {"{"}</p>
              <p className="pl-8">"flights": [</p>
              <p className="pl-12">{"{"}</p>
              <p className="pl-16">"id": <span className="text-yellow-300">"FL123"</span>,</p>
              <p className="pl-16">"airline": <span className="text-yellow-300">"Emirates"</span>,</p>
              <p className="pl-16">"price": <span className="text-blue-400">450.00</span></p>
              <p className="pl-12">{"}"}</p>
              <p className="pl-8">]</p>
              <p className="pl-4">{"}"}</p>
              <p className="text-slate-400">{"}"}</p>
            </div>
          </div>

          {/* Fintech */}
          <div className="space-y-8 lg:mt-0 mt-12">
            <div>
              <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Get paid globally.</h2>
              <p className="text-lg text-slate-500 font-medium">Instantly.</p>
            </div>
            <ul className="space-y-3 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Multi-currency wallets</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Instant settlements</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Low fees. High success rate</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Payouts to 120+ countries</li>
            </ul>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-[#0A1629] text-white p-4 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">USD</p>
                  <p className="font-black text-xl">$45,680.50</p>
                </div>
                <div className="flex-1 bg-emerald-600 text-white p-4 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-200 mb-1">NGN</p>
                  <p className="font-black text-xl">₦32,560,000.00</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 text-sm font-bold text-slate-900">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center"><Plane size={14}/></div> Booking Payment</div>
                  <div className="flex items-center gap-4">+$1,250.00 <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase">Completed</span></div>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 text-sm font-bold text-slate-900">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center"><Wallet size={14}/></div> Payout to Bank</div>
                  <div className="flex items-center gap-4">-$850.00 <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase">Completed</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. GLOBAL TERMINAL & 8. ANALYTICS */}
        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Terminal */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Control your entire</h2>
                <p className="text-lg text-slate-500 font-medium">travel operation in one place.</p>
              </div>
              <ul className="space-y-3 text-sm font-bold text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Smart search</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Live availability</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Real-time pricing</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Book & issue instantly</li>
              </ul>
              <div className="relative animate-[bounce_7s_infinite]">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 rounded-full" />
                <img src="/flight_search.png" alt="Flight Search Terminal" className="w-full rounded-2xl shadow-2xl border border-white/20" />
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-8 lg:mt-0 mt-12">
              <div>
                <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Make smarter decisions</h2>
                <p className="text-lg text-slate-500 font-medium">with real-time data.</p>
              </div>
              <ul className="space-y-3 text-sm font-bold text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-600" /> Revenue analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-600" /> Booking trends</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-600" /> Customer insights</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-600" /> Performance monitoring</li>
              </ul>
              <div className="relative animate-[bounce_6s_infinite_reverse]">
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl -z-10 rounded-full" />
                <img src="/analytics_chart.png" alt="Revenue Analytics Dashboard" className="w-full rounded-2xl shadow-2xl border border-white/20" />
              </div>
            </div>
          </div>
        </section>

        {/* 9. COMPLIANCE & 10. HOW IT WORKS */}
        <section className="py-24 max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
             <div>
              <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Enterprise-grade</h2>
              <p className="text-lg text-slate-500 font-medium">security & KYC verification</p>
            </div>
            <ul className="space-y-3 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400" /> KYC & KYB verification</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400" /> Fraud detection</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400" /> Data encryption</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400" /> GDPR compliant</li>
            </ul>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#0A1629] flex items-center justify-center text-white shrink-0 shadow-lg">
                <Lock size={24} />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700">Identity Document</span>
                  <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Verified</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700">Address Proof</span>
                  <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Verified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Wallet Check</span>
                  <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Simple steps.</h2>
              <p className="text-lg text-slate-500 font-medium">Infinite possibilities.</p>
            </div>
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0 text-lg">1</div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Get API Key</h4>
                  <p className="text-sm font-medium text-slate-500">Sign up and get your API credentials.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-black shrink-0 text-lg">2</div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Integrate</h4>
                  <p className="text-sm font-medium text-slate-500">Integrate our APIs in minutes.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0 text-lg">3</div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Start Selling</h4>
                  <p className="text-sm font-medium text-slate-500">Go live and start selling instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. TESTIMONIALS & 12. GLOBAL COVERAGE */}
        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
              <div>
                <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Trusted by innovative</h2>
                <p className="text-lg text-slate-500 font-medium mb-10">travel businesses.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">"Travsify NDC helped us scale our platform globally with just one integration."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div>
                        <p className="text-xs font-black text-slate-900">Adebayo O.</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CEO, TravelWings</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">"Best API platform we've used. Reliable, fast and amazing support."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div>
                        <p className="text-xs font-black text-slate-900">Sarah K.</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CTO, TripWay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Access travel inventory</h2>
                <p className="text-lg text-slate-500 font-medium mb-8">across 100+ countries</p>
                <ul className="space-y-4 text-sm font-bold text-slate-600 mb-8">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> 500+ Airlines</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-orange-600 rounded-full" /> 1M+ Hotels</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /> Thousands of routes</li>
                </ul>
                <div className="h-40 w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-transparent opacity-80 rounded-3xl" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
              </div>
            </div>
          </div>
        </section>

        {/* 13. USE CASES */}
        <section className="py-24 max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A1629] mb-4 tracking-tight">Built for every kind of<br/>travel business.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-8 border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Briefcase size={28}/></div>
              <h3 className="font-black text-slate-900 mb-2">Travel Agencies</h3>
              <p className="text-sm font-medium text-slate-500">Scale your business with global inventory</p>
            </div>
            <div className="text-center p-8 border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 mx-auto bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6"><Rocket size={28}/></div>
              <h3 className="font-black text-slate-900 mb-2">Startups</h3>
              <p className="text-sm font-medium text-slate-500">Launch fast with powerful APIs</p>
            </div>
            <div className="text-center p-8 border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Smartphone size={28}/></div>
              <h3 className="font-black text-slate-900 mb-2">Fintech Apps</h3>
              <p className="text-sm font-medium text-slate-500">Embed travel into your financial apps</p>
            </div>
            <div className="text-center p-8 border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><Building2 size={28}/></div>
              <h3 className="font-black text-slate-900 mb-2">Corporate Travel</h3>
              <p className="text-sm font-medium text-slate-500">Streamline bookings for your team</p>
            </div>
          </div>
        </section>

        {/* 14. AUTOMATION & MARKUPS */}
        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-[#0A1629] mb-2 tracking-tight">Set your profit.</h2>
                <p className="text-lg text-slate-500 font-medium">We handle the rest.</p>
              </div>
              <ul className="space-y-3 text-sm font-bold text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Flexible markup rules</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Auto pricing engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-600" /> Maximize your margins</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Markup Rule</p>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-900 flex items-center gap-2"><Plane size={14} className="text-blue-600"/> Flights</span>
                    <span className="text-slate-500">12%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[12%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-900 flex items-center gap-2"><Hotel size={14} className="text-orange-600"/> Hotels</span>
                    <span className="text-slate-500">18%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[18%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-900 flex items-center gap-2"><Car size={14} className="text-emerald-600"/> Transfers</span>
                    <span className="text-slate-500">15%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 15. PRICING */}
        <section className="py-24 max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A1629] mb-4 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500 font-medium">— built to scale globally</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 border border-slate-200 rounded-3xl bg-white flex flex-col">
              <p className="text-sm font-black text-slate-900 mb-2">Starter</p>
              <p className="text-4xl font-black text-[#0A1629] mb-6 tracking-tight">Free</p>
              <ul className="space-y-3 text-[13px] font-medium text-slate-500 mb-8 flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Sandbox API</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Limited requests</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Basic support</li>
              </ul>
              <Link href="/register" className="block text-center w-full py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Get Started</Link>
            </div>
            <div className="p-8 border-2 border-orange-500 rounded-3xl bg-white flex flex-col relative shadow-xl shadow-orange-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
              <p className="text-sm font-black text-slate-900 mb-2">Growth</p>
              <p className="text-4xl font-black text-[#0A1629] mb-6 tracking-tight">$49<span className="text-sm font-medium text-slate-400">/mo</span></p>
              <ul className="space-y-3 text-[13px] font-medium text-slate-500 mb-8 flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-600"/> Live API access</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-600"/> All travel verticals</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-600"/> Webhooks</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-600"/> Wallet access</li>
              </ul>
              <Link href="/register" className="block text-center w-full py-3 rounded-xl bg-orange-600 font-bold text-sm text-white hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20">Get Started</Link>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-white flex flex-col">
              <p className="text-sm font-black text-slate-900 mb-2">Scale</p>
              <p className="text-4xl font-black text-[#0A1629] mb-6 tracking-tight">$199<span className="text-sm font-medium text-slate-400">/mo</span></p>
              <ul className="space-y-3 text-[13px] font-medium text-slate-500 mb-8 flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Higher API limits</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Advanced analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Priority support</li>
              </ul>
              <Link href="/register" className="block text-center w-full py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Get Started</Link>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-white flex flex-col">
              <p className="text-sm font-black text-slate-900 mb-2">Enterprise</p>
              <p className="text-4xl font-black text-[#0A1629] mb-6 tracking-tight">Custom</p>
              <ul className="space-y-3 text-[13px] font-medium text-slate-500 mb-8 flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-slate-600"/> Dedicated infra</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-slate-600"/> SLA guarantee</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-slate-600"/> Custom integrations</li>
              </ul>
              <Link href="/contact" className="block text-center w-full py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Contact Sales</Link>
            </div>
          </div>
        </section>

        {/* 16. FINAL CTA & FOOTER */}
        <section className="bg-[#0A1629] text-white pt-24">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Start building your<br/>travel business today.</h2>
              <ul className="space-y-3 text-sm font-medium text-slate-400 mb-10">
                <li className="flex items-center gap-2">• Powerful APIs</li>
                <li className="flex items-center gap-2">• Global reach</li>
                <li className="flex items-center gap-2">• Infinite possibilities</li>
              </ul>
              <Link href="/register" className="inline-block bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-colors">
                Get API Access
              </Link>
            </div>
            <div className="relative">
              <div className="bg-slate-800 rounded-t-3xl rounded-bl-3xl p-6 border-t border-l border-r border-slate-700 h-[300px] overflow-hidden flex items-end justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0A1629] via-transparent to-transparent z-10" />
                 {/* Decorative users working mockup */}
                 <div className="w-full h-full relative z-0 animate-[bounce_5s_infinite]">
                   <img src="/analytics_chart.png" alt="Revenue Analytics" className="w-full h-full object-cover rounded-xl border border-slate-700 shadow-2xl" />
                 </div>
              </div>
            </div>
          </div>
          
          <footer className="border-t border-slate-800 py-12">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 space-y-4">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#0A1629]">
                    <Plane size={18} className="rotate-45" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-white">TRAVSIFY <span className="text-orange-600">NDC</span></span>
                </Link>
                <p className="text-[13px] text-slate-400 font-medium max-w-xs leading-relaxed">The complete travel infrastructure for the world.</p>
                <div className="flex gap-4 text-slate-500 pt-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white cursor-pointer transition-colors"><Globe size={14}/></div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white cursor-pointer transition-colors"><Search size={14}/></div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white cursor-pointer transition-colors"><Code2 size={14}/></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-100 mb-6">Product</p>
                <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
                  <li><Link href="/docs" className="hover:text-white transition-colors">APIs</Link></li>
                  <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-100 mb-6">Company</p>
                <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
                  <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-100 mb-6">Legal</p>
                <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
                  <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Data Protection</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-[1200px] mx-auto px-6 border-t border-slate-800 pt-8 text-center text-xs text-slate-500 font-medium">
              &copy; 2024 Travsify NDC. All rights reserved.
            </div>
          </footer>
        </section>

      </main>
    </div>
  );
}
