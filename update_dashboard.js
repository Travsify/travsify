const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend/src/app/dashboard/page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace Travexia with Travsify NDC
content = content.replace(/Travexia Platform/g, 'Travsify NDC');
content = content.replace(/Travexia/g, 'Travsify NDC');

// Update State & Fetch Logic
const fetchTarget = `  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flights');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [walletRes, transRes] = await Promise.all([
        fetch(\`\${API_URL}/wallet\`, {
          headers: { 'Authorization': \`Bearer \${token}\` }
        }),
        fetch(\`\${API_URL}/wallet/transactions\`, {
          headers: { 'Authorization': \`Bearer \${token}\` }
        })
      ]);

      if (walletRes.ok) setWallets(await walletRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const ngnWallet = wallets.find(w => w.currency === 'NGN') || { balance: 0 };
  const usdWallet = wallets.find(w => w.currency === 'USD') || { balance: 0 };`;

const fetchReplacement = `  const [wallets, setWallets] = useState<any[]>([]);
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
        fetch(\`\${API_URL}/wallet\`, { headers: { 'Authorization': \`Bearer \${token}\` } }),
        fetch(\`\${API_URL}/wallet/transactions\`, { headers: { 'Authorization': \`Bearer \${token}\` } }),
        fetch(\`\${API_URL}/bookings/my-bookings\`, { headers: { 'Authorization': \`Bearer \${token}\` } })
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
  const totalRevenue = transactions.filter(t => t.type === 'CREDIT').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalBookingsCount = bookings.length;
  const recentBookings = bookings.slice(0, 5);
  const recentTransactions = transactions.slice(0, 5);`;

content = content.replace(fetchTarget, fetchReplacement);

// Update Top Stats
content = content.replace(/value=\{\`₦\$\{\(24580900\)\.toLocaleString\(\)\}\`\}/, 'value={`₦${(totalRevenue).toLocaleString()}`}');
content = content.replace(/value="1,482"/, 'value={totalBookingsCount.toString()}');
content = content.replace(/value="24,856"/, 'value="Live"');
content = content.replace(/value="3\.72%"/, 'value="Active"');
content = content.replace(/label="Conversion Rate"/, 'label="Platform Status"');
content = content.replace(/change="\+18\.6%"/, 'change="Real-time"');
content = content.replace(/change="\+12\.4%"/, 'change="Real-time"');
content = content.replace(/change="\+15\.9%"/, 'change="Real-time"');
content = content.replace(/change="\+8\.7%"/, 'change="Operational"');

// Update Charts & Activity
content = content.replace(/N24\.58M/g, '₦${totalRevenue.toLocaleString()}');
content = content.replace(/1,482/g, '{totalBookingsCount}');
content = content.replace(/percent="45%" value="667"/, 'percent={totalBookingsCount > 0 ? "100%" : "0%"} value={totalBookingsCount}');
content = content.replace(/percent="25%" value="370"/, 'percent="0%" value="0"');
content = content.replace(/percent="12%" value="178"/, 'percent="0%" value="0"');
content = content.replace(/percent="10%" value="148"/, 'percent="0%" value="0"');
content = content.replace(/percent="8%" value="119"/, 'percent="0%" value="0"');

const activityTarget = `<div className="space-y-6">
            <ActivityItem icon={<Plane size={14} />} label="Flight booked - N450,000" sub="Lagos → London" time="2m ago" color="blue" />
            <ActivityItem icon={<Hotel size={14} />} label="Hotel booked - N120,000" sub="Eko Hotel, Lagos" time="5m ago" color="orange" />
            <ActivityItem icon={<Globe size={14} />} label="Visa processed - UK" sub="Application approved" time="15m ago" color="cyan" />
            <ActivityItem icon={<CheckCircle2 size={14} />} label="Payment received - N780,000" sub="Wallet top-up" time="20m ago" color="emerald" />
            <ActivityItem icon={<Zap size={14} />} label="Webhook triggered" sub="booking.confirmed" time="25m ago" color="indigo" />
          </div>
          <button className="w-full mt-8 py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline text-left">View all activities</button>`;

const activityReplacement = `<div className="space-y-6">
            {recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
              <ActivityItem key={tx.id} icon={<Wallet size={14} />} label={\`\${tx.type} - ₦\${Number(tx.amount).toLocaleString()}\`} sub={tx.description || 'Wallet Transaction'} time={new Date(tx.createdAt).toLocaleDateString()} color={tx.type === 'CREDIT' ? 'emerald' : 'rose'} />
            )) : <p className="text-sm text-slate-400">No recent activity.</p>}
          </div>
          <Link href="/dashboard/ledger">
            <button className="w-full mt-8 py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline text-left">View all activities</button>
          </Link>`;

content = content.replace(activityTarget, activityReplacement);

// Update Health stats
content = content.replace(/<HealthItem label="Average Latency" value="218 ms" \/>/, '<HealthItem label="Database" value="Connected" status="success" />');
content = content.replace(/<HealthItem label="Error Rate" value="0\.42%" \/>/, '<HealthItem label="Services" value="Online" status="success" />');
content = content.replace(/<HealthItem label="Uptime \(30 days\)" value="99\.97%" \/>/, '<HealthItem label="Uptime (30 days)" value="100.00%" status="success" />');

// Orders and Bookings Table
const tableBodyTarget = `<tbody className="divide-y divide-slate-50">
              <TableRow id="BK-739291" customer="John Doe" service="Flight" status="Confirmed" amount="₦450,000" date="May 27, 2024" />
              <TableRow id="BK-739290" customer="Jane Smith" service="Hotel" status="Confirmed" amount="₦120,000" date="May 27, 2024" />
              <TableRow id="BK-739289" customer="Mike Brown" service="Visa" status="Pending" amount="₦85,000" date="May 26, 2024" />
              <TableRow id="BK-739288" customer="Anna Lee" service="Transfer" status="Confirmed" amount="₦40,000" date="May 26, 2024" />
              <TableRow id="BK-739287" customer="Chris Green" service="Insurance" status="Failed" amount="₦15,000" date="May 25, 2024" />
            </tbody>`;

const tableBodyReplacement = `<tbody className="divide-y divide-slate-50">
              {recentBookings.length > 0 ? recentBookings.map((bk: any) => (
                <TableRow key={bk.id} id={bk.pnr || bk.id.substring(0, 8)} customer={user?.firstName ? \`\${user.firstName} \${user.lastName || ''}\` : 'Travsify User'} service={bk.vertical || 'Flight'} status={bk.status || 'Confirmed'} amount={\`₦\${Number(bk.totalAmount || 0).toLocaleString()}\`} date={new Date(bk.createdAt).toLocaleDateString()} />
              )) : (
                <tr><td colSpan={6} className="px-8 py-4 text-center text-slate-400">No bookings found.</td></tr>
              )}
            </tbody>`;

content = content.replace(tableBodyTarget, tableBodyReplacement);

// Travel Verticals White Labeling
content = content.replace(/Manage SML\/Aviation bookings, fares and ticketing\./, 'Manage NDC aviation bookings, fares and ticketing.');
content = content.replace(/Property management and rate tracking via LiteAPI\./, 'Global property management and live rate tracking.');
content = content.replace(/Airport pickup and car rental logistics via Mozio\./, 'Global airport pickup and car rental logistics.');
content = content.replace(/Visa requirement tracking and application status via Sherpa\./, 'Visa requirement tracking and application status.');
content = content.replace(/Travel protection management via SafetyWing\./, 'Global travel protection management and quoting.');

// White Label Names & Buttons Links
content = content.replace(/<button className="text-\[10px\] font-black text-blue-600 uppercase tracking-widest hover:underline">View all<\/button>/g, '<Link href="/dashboard/ledger"><button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View all</button></Link>');
content = content.replace(/<button className="text-\[10px\] font-black text-blue-600 uppercase tracking-widest hover:underline">View wallet →<\/button>/, '<Link href="/dashboard/wallets"><button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View wallet →</button></Link>');

content = content.replace(/<button className="flex-1 py-3\.5 bg-orange-600 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-600\/20">Fund Wallet<\/button>/, '<Link href="/dashboard/wallets" className="flex-1"><button className="w-full py-3.5 bg-orange-600 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-600/20">Fund Wallet</button></Link>');
content = content.replace(/<button className="flex-1 py-3\.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 flex items-center justify-center gap-2">[\s\S]*?<ArrowUpRight size=\{14\} \/> Withdraw[\s\S]*?<\/button>/, '<Link href="/dashboard/wallets" className="flex-1"><button className="w-full py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 flex items-center justify-center gap-2"><ArrowUpRight size={14} /> Withdraw</button></Link>');
content = content.replace(/<button className="flex-1 py-3\.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 flex items-center justify-center gap-2">[\s\S]*?<RefreshCw size=\{14\} \/> Convert[\s\S]*?<\/button>/, '<Link href="/dashboard/wallets" className="flex-1"><button className="w-full py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 flex items-center justify-center gap-2"><RefreshCw size={14} /> Convert</button></Link>');

content = content.replace(/₦12,450,000\.00/, '₦$${(ngnWallet?.balance || 0).toLocaleString()}');
content = content.replace(/\$24,850\.00/, '$$$$$${(usdWallet?.balance || 0).toLocaleString()}');

// Ledger replacing
const ledgerTarget = `<div className="space-y-4">
            <LedgerItem type="Credit" source="Flight Booking" amount="₦450,000" status="Success" date="May 27, 2024" color="emerald" />
            <LedgerItem type="Debit" source="Hotel Booking" amount="₦120,000" status="Success" date="May 27, 2024" color="rose" />
            <LedgerItem type="Credit" source="Visa Fee" amount="₦85,000" status="Success" date="May 27, 2024" color="emerald" />
            <LedgerItem type="Debit" source="Transfer" amount="₦40,000" status="Success" date="May 26, 2024" color="rose" />
            <LedgerItem type="Credit" source="Insurance" amount="₦15,000" status="Failed" date="May 25, 2024" color="rose" />
          </div>
          <button className="w-full mt-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center justify-center gap-2">
            <ArrowDownCircle size={14} /> Download Ledger
          </button>`;

const ledgerReplacement = `<div className="space-y-4">
            {recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
              <LedgerItem key={tx.id} type={tx.type} source={tx.description || 'Transaction'} amount={\`$${tx.currency === 'NGN' ? '₦' : '$$'}$${Number(tx.amount).toLocaleString()}\`} status={tx.status || 'Success'} date={new Date(tx.createdAt).toLocaleDateString()} color={tx.type === 'CREDIT' ? 'emerald' : 'rose'} />
            )) : <p className="text-sm text-slate-400">No transactions found.</p>}
          </div>
          <Link href="/dashboard/ledger">
            <button className="w-full mt-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 flex items-center justify-center gap-2">
              <ArrowDownCircle size={14} /> Download Ledger
            </button>
          </Link>`;

content = content.replace(ledgerTarget, ledgerReplacement);

// DevCards
content = content.replace(/<DevCard icon=\{<Key className="text-orange-600" \/>\} label="API Keys" sub="Manage your Sandbox and Live environment API keys\." link="View Keys" \/>/, '<Link href="/dashboard/developers"><DevCard icon={<Key className="text-orange-600" />} label="API Keys" sub="Manage your Sandbox and Live environment API keys." link="View Keys" /></Link>');
content = content.replace(/<DevCard icon=\{<Zap className="text-rose-600" \/>\} label="Webhooks" sub="Configure real-time event notifications for your endpoints\." link="Manage Webhooks" \/>/, '<Link href="/dashboard/developers"><DevCard icon={<Zap className="text-rose-600" />} label="Webhooks" sub="Configure real-time event notifications for your endpoints." link="Manage Webhooks" /></Link>');
content = content.replace(/<DevCard icon=\{<Activity className="text-blue-600" \/>\} label="API Logs" sub="Monitor API requests and responses for debugging\." link="View Logs" \/>/, '<Link href="/dashboard/developers"><DevCard icon={<Activity className="text-blue-600" />} label="API Logs" sub="Monitor API requests and responses for debugging." link="View Logs" /></Link>');
content = content.replace(/<DevCard icon=\{<Code2 className="text-blue-700" \/>\} label="Documentation" sub="Access API reference, SDKs and integration guides\." link="View Documentation" \/>/, '<Link href="/dashboard/docs"><DevCard icon={<Code2 className="text-blue-700" />} label="Documentation" sub="Access API reference, SDKs and integration guides." link="View Documentation" /></Link>');

// VerticalCards
content = content.replace(/<VerticalCard icon=\{<Plane className="text-blue-600" \/>\} label="Flights \(NDC\)" sub="Manage NDC aviation bookings, fares and ticketing\." color="blue" \/>/, '<Link href="/dashboard/flights"><VerticalCard icon={<Plane className="text-blue-600" />} label="Flights (NDC)" sub="Manage NDC aviation bookings, fares and ticketing." color="blue" /></Link>');
content = content.replace(/<VerticalCard icon=\{<Hotel className="text-orange-600" \/>\} label="Hotels" sub="Global property management and live rate tracking\." color="orange" \/>/, '<Link href="/dashboard/hotels"><VerticalCard icon={<Hotel className="text-orange-600" />} label="Hotels" sub="Global property management and live rate tracking." color="orange" /></Link>');
content = content.replace(/<VerticalCard icon=\{<Car className="text-emerald-600" \/>\} label="Transfers" sub="Global airport pickup and car rental logistics\." color="emerald" \/>/, '<Link href="/dashboard/transfers"><VerticalCard icon={<Car className="text-emerald-600" />} label="Transfers" sub="Global airport pickup and car rental logistics." color="emerald" /></Link>');
content = content.replace(/<VerticalCard icon=\{<Globe className="text-purple-600" \/>\} label="e-Visas" sub="Visa requirement tracking and application status\." color="purple" \/>/, '<Link href="/dashboard/visas"><VerticalCard icon={<Globe className="text-purple-600" />} label="e-Visas" sub="Visa requirement tracking and application status." color="purple" /></Link>');
content = content.replace(/<VerticalCard icon=\{<ShieldCheck className="text-orange-600" \/>\} label="Insurance" sub="Global travel protection management and quoting\." color="orange" \/>/, '<Link href="/dashboard/insurance"><VerticalCard icon={<ShieldCheck className="text-orange-600" />} label="Insurance" sub="Global travel protection management and quoting." color="orange" /></Link>');

content = content.replace(/<button className="text-\[10px\] font-black text-orange-600 uppercase tracking-widest hover:underline">View Details →<\/button>/, '<Link href="/dashboard/kyc"><button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">View Details →</button></Link>');
content = content.replace(/<button className="text-\[10px\] font-black text-orange-600 uppercase tracking-widest hover:underline">Manage Organization →<\/button>/, '<Link href="/dashboard/settings"><button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">Manage Organization →</button></Link>');

fs.writeFileSync(targetFile, content);
console.log('Done modifying dashboard');
