'use client';

import { useState } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Terminal, 
  Info, 
  Code2, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function ApiKeysPage() {
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production Main', type: 'Live', public: 'pk_live_823hf9283sh92k', secret: 'sk_live_928shf0293hsg91', created: '2026-04-10' },
    { id: '2', name: 'Test Environment', type: 'Sandbox', public: 'pk_test_192hf0129sh01p', secret: 'sk_test_102shf9102hsg82', created: '2026-04-20' },
  ]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">API Infrastructure</h2>
          <p className="text-slate-500 font-medium text-sm">Manage your authentication tokens and secure your integration pipes.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
          <Plus size={18} />
          Create API Key
        </button>
      </div>

      {/* Keys Table Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Environment</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Public Key (Client)</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Secret Key (Server)</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Created</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {keys.map((key) => (
                <tr key={key.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-slate-900">{key.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-tight mt-1 ${key.type === 'Live' ? 'text-emerald-500' : 'text-blue-500'}`}>
                        {key.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 w-fit group-hover:bg-white transition-colors">
                      <code className="text-[12px] font-mono text-slate-500">{key.public}</code>
                      <Copy size={12} className="text-slate-300 hover:text-blue-600 cursor-pointer transition-colors" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 w-fit group-hover:bg-white transition-colors">
                      <code className="text-[12px] font-mono text-slate-500">
                        {showSecret === key.id ? key.secret : 'sk_••••••••••••••••'}
                      </code>
                      <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-2">
                        {showSecret === key.id ? (
                          <EyeOff size={14} className="text-slate-400 hover:text-slate-900 cursor-pointer" onClick={() => setShowSecret(null)} />
                        ) : (
                          <Eye size={14} className="text-slate-400 hover:text-slate-900 cursor-pointer" onClick={() => setShowSecret(key.id)} />
                        )}
                        <Copy size={12} className="text-slate-300 hover:text-blue-600 cursor-pointer" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[13px] font-medium text-slate-500">
                    {key.created}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Guide */}
        <div className="lg:col-span-2 bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <Terminal size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                <Code2 size={20} />
              </div>
              <h3 className="text-lg font-bold">Authentication Implementation</h3>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xl">
              To authenticate your requests, include the <code className="text-blue-400 font-bold px-1.5 py-0.5 bg-white/5 rounded">x-api-key</code> and <code className="text-blue-400 font-bold px-1.5 py-0.5 bg-white/5 rounded">x-api-secret</code> headers. For client-side requests, only the public key is required.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-t-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">NodeJS / cURL</span>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 hover:text-white transition-colors">
                  <Copy size={12} /> COPY SNIPPET
                </button>
              </div>
              <div className="bg-black/40 rounded-b-2xl p-6 font-mono text-[13px] text-blue-300 border border-white/5 border-t-0 overflow-x-auto whitespace-pre">
                {`curl -X POST https://api.travsify.com/v1/flights/search \\
  -H "x-api-key: pk_live_..." \\
  -H "x-api-secret: sk_live_..." \\
  -d '{ "origin": "LOS", "destination": "LHR" }'`}
              </div>
            </div>
          </div>
        </div>

        {/* Security Alert */}
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8 text-orange-900 shadow-sm shadow-orange-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <ShieldAlert size={20} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Security Advisory</h4>
            </div>
            <p className="text-[13px] font-medium leading-relaxed opacity-80 mb-6">
              Your Secret Key is extremely sensitive. Never commit it to GitHub, expose it in frontend code, or share it via email.
            </p>
            <Link href="/dashboard/docs" className="flex items-center gap-2 text-xs font-black hover:gap-3 transition-all">
              Best Practices <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <ExternalLink size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">SDKs & Libraries</h4>
            </div>
            <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-6">
              Accelerate your integration with our official SDKs for Node, Python, and PHP.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Node.js', 'Python', 'PHP', 'Go'].map((sdk) => (
                <div key={sdk} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-900 text-center hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer">
                  {sdk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
