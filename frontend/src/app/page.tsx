'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased overflow-x-hidden selection:bg-orange-500/30">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-1.5 hover:scale-[0.98] transition-transform">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs rotate-3 shadow-lg shadow-blue-600/20">T</div>
            <span className="text-slate-900">Travsify<span className="text-orange-600">.</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            <Link href="/demo" className="text-blue-600 hover:text-orange-600 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              Live Demo
            </Link>
            <Link href="/docs" className="hover:text-blue-600 transition-colors">Docs</Link>
            <Link href="#platform" className="hover:text-blue-600 transition-colors">Platform</Link>
            <Link href="#use-cases" className="hover:text-blue-600 transition-colors">Solutions</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Sign in</Link>
            <Link href="/register" className="text-[13px] font-black bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all active:scale-[0.97] shadow-xl shadow-slate-900/10 uppercase tracking-widest">
              Build Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-48 px-6 overflow-hidden">
        {/* Lovable-style Mesh Background */}
        <div className="absolute inset-0 z-0 mesh-gradient opacity-60" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-reveal">
            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/50 shadow-sm mb-10 lo-density-text">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              Direct NDC Connection • v4.2.0-Live
            </div>
            
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.05em] mb-8 text-slate-900">
              The world's most <br/>
              <span className="text-blue-600">powerful</span> travel API<span className="text-orange-600">.</span>
            </h1>
            
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
              Transform your business with enterprise-grade travel infrastructure. Integrate global flights, 2.5M+ hotels, and insurance instantly.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Link href="/demo" className="bg-blue-600 text-white text-[15px] font-black px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.97] shadow-2xl shadow-blue-600/30 uppercase tracking-widest">
                Explore Demo Platform
              </Link>
              <Link href="/docs" className="text-[15px] font-black text-slate-700 bg-white border border-slate-200 px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-widest">
                Developer Docs
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-10 border-t border-slate-200/50">
              <MiniStat value="99.99%" label="Uptime" color="text-blue-600" />
              <MiniStat value="142ms" label="Latency" color="text-orange-500" />
              <MiniStat value="200+" label="Airlines" color="text-blue-600" />
              <MiniStat value="2.5M" label="Hotels" color="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Stats Cards - Additional Visuals */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 relative z-10">
          <StatCard label="Global Airlines" value="All major" change="Real-time" delay="0" />
          <StatCard label="Hotel Properties" value="Worldwide" change="Live" delay="1" />
          <StatCard label="API requests/sec" value="High-scale" change="Robust" delay="2" />
        </div>
      </section>

      {/* ─── PLATFORM SECTION ─── */}
      <section id="platform" className="relative py-32 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white overflow-hidden rounded-t-[3rem] -mt-10 z-20">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-orbit">
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="animate-fade-up">
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4">Infrastructure</p>
              <h2 className="text-4xl md:text-[3rem] font-black tracking-tight leading-[1.1] mb-6">
                The Ultimate <span className="text-blue-400">Travel Infrastructure</span> Platform.
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg font-medium">Consolidate your global operations. Access flights, hotels, travel insurance, eVisa, and premium transfers through the industry's most advanced unified API.</p>
            </div>
            <div className="animate-slide-in-right">
              <div className="animate-float-slow rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/50">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200" alt="API Platform" className="w-full h-auto object-cover opacity-90" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PlatformCard icon="✈️" title="Flights Engine" desc="Search, price, book and ticket flights globally. We handle the complex GDS/NDC handshakes." />
            <PlatformCard icon="🏨" title="Global Hotels" desc="Access millions of hotel rooms worldwide with real-time availability and dynamic pricing." />
            <PlatformCard icon="🛡️" title="Travel Insurance" desc="Automatically quote and issue comprehensive travel insurance policies alongside bookings." />
            <PlatformCard icon="🛂" title="eVisa Processing" desc="Streamline visa applications with our automated eVisa processing endpoints." />
            <PlatformCard icon="🚘" title="Transfers & Tours" desc="Book airport pickups, rental cars, and curated local experiences worldwide." />
            <PlatformCard icon="💰" title="Unified Wallet" desc="Pay for every vertical from a single multi-currency ledger with auto-reconciliation." />
          </div>
        </div>
      </section>

      {/* ─── DEVELOPER EXPERIENCE ─── */}
      <section id="developer" className="py-32 px-6 bg-white relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 animate-fade-up">Developer Experience</p>
          <h2 className="text-4xl md:text-[3rem] font-black tracking-tight leading-[1.1] mb-16 max-w-3xl animate-fade-up">
            Built by developers, <span className="text-orange-500">engineered for global scale.</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="animate-fade-up">
              <ul className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium mb-12">
                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px] font-bold shrink-0 mt-1">✓</span> Auto-retried ticketing with wallet-safe refunds</li>
                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px] font-bold shrink-0 mt-1">✓</span> Per-key rate limits and dynamic usage analytics</li>
                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[12px] font-bold shrink-0 mt-1">✓</span> Signed webhooks with HMAC-SHA256 replay protection</li>
                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[12px] font-bold shrink-0 mt-1">✓</span> Instant multi-currency settlement (USD/NGN/Crypto)</li>
                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px] font-bold shrink-0 mt-1">✓</span> Sandbox & Live environment toggles with zero downtime</li>
                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px] font-bold shrink-0 mt-1">✓</span> Global travel compliance and automated KYC flow</li>
              </ul>
            </div>

            {/* Right - Code Block */}
            <div className="animate-slide-in-right">
              <div className="bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-slate-900/30">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
                  <span className="w-3 h-3 rounded-full bg-orange-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-[12px] font-bold tracking-wider text-slate-500 font-mono ml-4">POST /v1/flights/book</span>
                </div>
                <pre className="p-8 text-[13px] font-mono leading-[2] overflow-x-auto text-slate-300">
<span className="text-slate-500">$</span> <span className="text-blue-400">curl</span>{` https://api.travsify.com/v1/flights/book \\
  `}<span className="text-slate-500">-H</span> <span className="text-orange-400">{`\"Authorization: Bearer sk_live_••••9aF2\"`}</span>{` \\
  `}<span className="text-slate-500">-H</span> <span className="text-orange-400">{`\"Idempotency-Key: bk_2026_04_19_001\"`}</span>{` \\
  `}<span className="text-slate-500">-d</span> <span className="text-emerald-400">{`'{
    "offer_id": "off_01HX9...",
    "passenger": {
      "name": "Adaeze Okafor",
      "dob": "1992-03-14"
    },
    "wallet": "USD"
  }'`}</span>
                </pre>
                <div className="border-t border-white/[0.05] p-8 bg-black/20 animate-shimmer">
                  <p className="text-[12px] font-bold text-slate-500 font-mono mb-4"># → 201 Created</p>
                  <pre className="text-[13px] font-mono leading-[2] text-emerald-400">{`{
  "booking_id": "bk_9241",
  "pnr": "X7H2QP",
  "status": "ticketed",
  "ticket_number": "125-7842910432",
  "amount": 840.50,
  "currency": "USD"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── USE CASES ─── */}
      <section id="use-cases" className="py-32 px-6 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-slate-900">
              Powering the Next Generation of Global Travel
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard
              tag="For OTA Startups"
              title="Launch Your OTA in a Weekend."
              desc="Get instant sandbox access, comprehensive mock data, and robust webhooks to validate your product immediately."
              gradient="from-blue-600 to-blue-800"
              emoji="🚀"
            />
            <UseCaseCard
              tag="For Enterprise Travel"
              title="Modernize Legacy Systems."
              desc="Migrate from outdated GDS infrastructure. Retain full brand control while gaining multi-currency automation."
              gradient="from-orange-500 to-orange-700"
              emoji="✈️"
            />
            <UseCaseCard
              tag="For Global Fintechs"
              title="Embed Travel into Your App."
              desc="Deploy white-label portals and dynamic markups to instantly add high-margin travel offerings to your platform."
              gradient="from-blue-600 via-purple-600 to-orange-500"
              emoji="📱"
            />
          </div>
        </div>
      </section>

      {/* ─── WHITE-LABEL PORTALS ─── */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left">
            <div className="animate-float relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200">
              <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200" alt="White-label Portal" className="w-full h-[400px] object-cover" />
              <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 px-6 py-5 animate-float-slow">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">🎨</span>
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Custom Brand</p>
                    <p className="text-base font-bold text-slate-800">Your logo & domain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-fade-up">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4">B2B Portals</p>
            <h2 className="text-4xl md:text-[3rem] font-black tracking-tight leading-[1.1] mb-6">
              Launch Your <span className="text-blue-600">Travel Empire.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-10">Deploy fully-featured, white-labeled booking engines for your B2B clients in minutes. Capture market share globally with zero development overhead.</p>
            <div className="space-y-5 mb-12">
              <WhitelabelFeature icon="🌐" text="Custom domain mapping with SSL" />
              <WhitelabelFeature icon="🎨" text="Full brand kit — logo, colors, typography" />
              <WhitelabelFeature icon="💳" text="Embedded payment with your merchant ID" />
              <WhitelabelFeature icon="📊" text="Per-portal analytics and booking reports" />
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 bg-orange-600 text-white text-[15px] font-bold px-8 py-4 rounded-full hover:bg-orange-700 transition-all active:scale-[0.97] shadow-xl shadow-orange-600/25">
              Launch your portal →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MULTI-CURRENCY WALLET ─── */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden rounded-3xl mx-4 lg:mx-8 mb-20 shadow-2xl">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Global Treasury</p>
            <h2 className="text-4xl md:text-[3rem] font-black tracking-tight leading-[1.1] mb-6">
              Automated <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Multi-Currency</span> Settlement.
            </h2>
            <p className="text-slate-400 leading-relaxed font-medium text-lg mb-10">Operate seamlessly across borders. Auto-lock funds, process instant cross-border refunds, and monitor your global operations via an enterprise-grade ledger.</p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              <WalletStat icon="🇳🇬" currency="NGN" rate="Active" label="Local Settlement" />
              <WalletStat icon="🇺🇸" currency="USD" rate="Active" label="Global Settlement" />
            </div>
            <div className="flex flex-wrap items-center gap-8 text-[14px] font-bold text-slate-300">
              <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Auto-refunds</div>
              <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Pessimistic locking</div>
              <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Real-time ledger</div>
            </div>
          </div>
          <div className="animate-slide-in-right relative">
            <div className="animate-float-slow rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200" alt="Multi-currency Wallet" className="w-full h-[400px] object-cover opacity-80" />
            </div>
            <div className="absolute -top-6 -left-6 bg-[#0f172a] rounded-2xl shadow-xl border border-white/10 px-6 py-5 animate-bounce-subtle">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 text-xl font-bold">↓</span>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Funded</p>
                  <p className="text-base font-bold text-emerald-400">+ $5,000.00</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#0f172a] rounded-2xl shadow-xl border border-white/10 px-6 py-5 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 text-xl font-bold">🔒</span>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Locked</p>
                  <p className="text-base font-bold text-white">$840.50 for PNR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECURITY & COMPLIANCE ─── */}
      <section className="relative py-32 px-6 bg-[#f8fafc] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left relative order-2 lg:order-1">
            <div className="animate-float rounded-3xl overflow-hidden shadow-2xl border-[8px] border-white">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" alt="Security Shield" className="w-full h-[450px] object-cover" />
            </div>
          </div>
          <div className="animate-fade-up order-1 lg:order-2">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Trust & Safety</p>
            <h2 className="text-4xl md:text-[3rem] font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              Bank-Grade Security. <span className="text-orange-600">Global Compliance.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">Protect your business and your customers. Our infrastructure utilizes advanced encryption, verified KYC protocols, and signed webhooks to guarantee uncompromised data integrity worldwide.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SecurityCard icon="🔐" title="End-to-end encryption" desc="TLS 1.3 on all endpoints. PII never stored in plain text." />
              <SecurityCard icon="📝" title="KYC verification" desc="Global business identity verification before live access." />
              <SecurityCard icon="🔑" title="API key scoping" desc="Separate sandbox and live keys with granular permissions." />
              <SecurityCard icon="🛡️" title="Signed webhooks" desc="HMAC-SHA256 signatures with replay protection." />
            </div>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL COVERAGE ─── */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20 animate-fade-up">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4">Market Reach</p>
            <h2 className="text-4xl md:text-[3rem] font-black tracking-tight leading-[1.1] mb-6">
              Unrivaled Global Inventory. <span className="text-blue-400">Instant Access.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">From New York to Tokyo, London to Dubai — instantly connect your business to the most comprehensive travel inventory available worldwide.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-6 animate-fade-up">
              <RouteCard from="JFK" to="LHR" airline="British Airways" price="$650" />
              <RouteCard from="DXB" to="SIN" airline="Emirates" price="$890" />
              <RouteCard from="LOS" to="ATL" airline="Delta Airlines" price="$1,200" />
            </div>
            <div className="flex justify-center animate-scale-in my-12 lg:my-0">
              <div className="relative">
                <div className="globe-container w-[320px] h-[320px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10" />
                </div>
                {/* Orbiting elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="animate-orbit"><div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" /></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="animate-orbit-small"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" /></div>
                </div>
                {/* Ping effect */}
                <div className="absolute top-[35%] left-[30%] w-5 h-5 rounded-full bg-orange-500/40 animate-ping-slow" />
                <div className="absolute top-[25%] right-[25%] w-4 h-4 rounded-full bg-blue-400/40 animate-ping-slow" style={{ animationDelay: '1s' }} />
              </div>
            </div>
            <div className="space-y-6 animate-fade-up-delay-2">
              <RouteCard from="NRT" to="SYD" airline="Japan Airlines" price="$920" />
              <RouteCard from="CDG" to="JNB" airline="Air France" price="$850" />
              <RouteCard from="FRA" to="GRU" airline="Lufthansa" price="$1,100" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-6 bg-gradient-to-r from-blue-700 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        {/* Floating dots */}
        <div className="absolute top-12 left-20 w-4 h-4 rounded-full bg-white/40 animate-float" />
        <div className="absolute top-24 right-32 w-3 h-3 rounded-full bg-white/30 animate-float-slow" />
        <div className="absolute bottom-16 left-1/3 w-5 h-5 rounded-full bg-white/20 animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-[4rem] font-black tracking-tight mb-6 text-white leading-tight">
            Scale Your Travel Business <br/> Globally Today.
          </h2>
          <p className="text-white/90 mb-12 text-xl font-medium max-w-2xl mx-auto">Join industry leaders using our infrastructure to power millions of global bookings. Get started in minutes.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="bg-white text-blue-700 text-[16px] font-black px-12 py-5 rounded-full hover:scale-105 transition-all active:scale-[0.97] shadow-2xl shadow-black/20">
              Create Your Free Account
            </Link>
            <Link href="/dashboard/docs" className="text-[16px] font-bold text-white border-2 border-white/40 px-12 py-5 rounded-full hover:bg-white/10 transition-all">
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="col-span-2 md:col-span-1">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-blue-600">Travs</span><span className="text-orange-600">ify.</span>
              </span>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">The unified global travel API. Complexity abstracted.</p>
            </div>
            <FooterCol title="Product" links={['Flights API', 'Hotels API', 'Wallet', 'White-label']} />
            <FooterCol title="Developers" links={['Documentation', 'API reference', 'Changelog', 'Status']} />
            <FooterCol title="Company" links={['About', 'Customers', 'Pricing', 'Contact']} />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-20 pt-8 border-t border-slate-200 text-sm text-slate-500 font-medium">
            <span>© 2026 Travsify Travel API. All rights reserved.</span>
            <span className="mt-4 md:mt-0">Global API Coverage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── COMPONENTS ─── */

function StatCard({ label, value, change, delay }: { label: string; value: string; change: string; delay: string }) {
  const animClass = delay === '0' ? 'animate-fade-up' : delay === '1' ? 'animate-fade-up-delay-1' : 'animate-fade-up-delay-2';
  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group ${animClass}`}>
      <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-4xl font-black tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">{value}</span>
        <span className="text-[11px] font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">{change}</span>
      </div>
    </div>
  );
}

function PlatformCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-10 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all duration-500 group premium-border">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-black mb-4 text-white tracking-tight">{title}</h3>
      <p className="text-[14px] text-slate-400 leading-relaxed font-bold">{desc}</p>
    </div>
  );
}

function MiniStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
      <p className="lo-density-text mt-2">{label}</p>
    </div>
  );
}

function UseCaseCard({ tag, title, desc, gradient, emoji }: { tag: string; title: string; desc: string; gradient: string; emoji: string }) {
  return (
    <div className="group relative rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 bg-white">
      <div className={`bg-gradient-to-br ${gradient} p-10 pb-20 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <span className="text-6xl block mb-8 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">{emoji}</span>
        <span className="lo-density-text bg-white/20 px-4 py-2 rounded-xl text-white border border-white/20 backdrop-blur-md">{tag}</span>
      </div>
      <div className="p-10 -mt-10 rounded-t-[40px] relative bg-white">
        <h3 className="text-2xl font-black tracking-tight mb-4 text-slate-900 leading-tight">{title}</h3>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-10 font-medium">{desc}</p>
        <Link href="/register" className="inline-flex items-center gap-3 text-[13px] font-black text-blue-600 group-hover:text-orange-600 transition-colors uppercase tracking-[0.2em]">
          Start building <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-6">{title}</h4>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-[14px] font-medium text-slate-500 hover:text-blue-600 transition-colors">{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhitelabelFeature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-4 text-[15px] font-medium">
      <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg shadow-sm border border-slate-200">{icon}</span>
      <span className="text-slate-700">{text}</span>
    </div>
  );
}

function WalletStat({ icon, currency, rate, label }: { icon: string; currency: string; rate: string; label: string }) {
  return (
    <div className="bg-white/10 rounded-2xl border border-white/10 p-5 shadow-inner">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-black text-slate-300 uppercase tracking-wider">{currency}</span>
      </div>
      <p className="text-2xl font-black tracking-tight text-white">{rate}</p>
      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function SecurityCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md shadow-slate-200/50 hover:border-blue-300 transition-all group hover:-translate-y-1 duration-300">
      <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{icon}</span>
      <h4 className="text-base font-black mb-2 text-slate-800">{title}</h4>
      <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function RouteCard({ from, to, airline, price }: { from: string; to: string; airline: string; price: string }) {
  return (
    <div className="bg-white/[0.05] backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/[0.1] transition-all group shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black text-white tracking-wider">{from}</span>
          <span className="text-slate-500 text-sm">✈️</span>
          <span className="text-lg font-black text-white tracking-wider">{to}</span>
        </div>
        <span className="text-sm font-black text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">{price}</span>
      </div>
      <p className="text-[13px] font-bold text-slate-400">{airline}</p>
    </div>
  );
}
