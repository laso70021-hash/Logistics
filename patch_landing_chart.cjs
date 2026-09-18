const fs = require('fs');
let content = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf8');

const importTarget = "import { supabase } from '../../lib/supabase';";
const importReplacement = `import { supabase } from '../../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', deliveries: 400, active: 240 },
  { name: 'Feb', deliveries: 300, active: 139 },
  { name: 'Mar', deliveries: 200, active: 980 },
  { name: 'Apr', deliveries: 278, active: 390 },
  { name: 'May', deliveries: 189, active: 480 },
  { name: 'Jun', deliveries: 239, active: 380 },
  { name: 'Jul', deliveries: 349, active: 430 },
];`;

if (!content.includes('AreaChart')) {
  content = content.replace(importTarget, importReplacement);
}

const targetSectionStart = `<div className="max-w-6xl mx-auto px-4 relative">`;
const targetSectionEnd = `</section>`;

const targetBlock = content.substring(content.indexOf(targetSectionStart), content.indexOf(targetSectionEnd));

const newBlock = `<div className="max-w-6xl mx-auto px-4 relative">
            <div className="bg-[#1e2330] rounded-t-2xl border border-gray-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] mx-auto overflow-hidden translate-y-8 h-[460px] flex flex-col">
              
              {/* Window Header */}
              <div className="flex gap-2 p-4 bg-[#141824] border-b border-gray-700/50 items-center">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"/>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"/>
                 <div className="ml-4 text-xs font-mono text-gray-500">cargoflow/analytics</div>
              </div>

              {/* Window Body */}
              <div className="flex flex-1 overflow-hidden">
                
                {/* Sidebar */}
                <div className="w-56 bg-[#141824]/50 border-r border-gray-700/50 p-4 space-y-1">
                   {['Overview', 'Real-time Tracking', 'Shipment History', 'Driver Performance', 'Fleet Analytics', 'Settings'].map((v, i) => (
                      <div key={i} className={\`px-4 py-2.5 rounded-lg text-sm transition-colors \${i === 0 ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-medium' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}\`}>
                        {v}
                      </div>
                   ))}
                </div>

                {/* Main Dashboard Area */}
                <div className="flex-1 p-8 bg-[#1e2330] flex flex-col">
                    
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                       {[
                         { label: 'Active Shipments', value: '1,248', trend: '+12%', color: 'text-blue-400' },
                         { label: 'Delivered (30d)', value: '8,432', trend: '+5.4%', color: 'text-green-400' },
                         { label: 'Exceptions', value: '24', trend: '-2.1%', color: 'text-yellow-400' },
                         { label: 'Revenue', value: '$124.5k', trend: '+18%', color: 'text-purple-400' }
                       ].map((stat, i) => (
                          <div key={i} className="bg-[#141824] p-5 rounded-xl border border-gray-700/50 shadow-inner">
                             <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{stat.label}</div>
                             <div className="flex items-baseline gap-3">
                               <div className="text-3xl font-bold text-white">{stat.value}</div>
                               <div className={\`text-sm font-medium \${stat.trend.startsWith('+') ? 'text-green-500' : 'text-yellow-500'}\`}>
                                 {stat.trend}
                               </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 bg-[#141824] rounded-xl border border-gray-700/50 p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-gray-300 font-medium">Delivery Volume vs Active Shipments</h3>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"/>
                            <span className="text-xs text-gray-400">Deliveries</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"/>
                            <span className="text-xs text-gray-400">Active</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                              itemStyle={{ color: '#f3f4f6' }}
                            />
                            <Area type="monotone" dataKey="deliveries" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDeliveries)" />
                            <Area type="monotone" dataKey="active" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                </div>
              </div>
            </div>
        </div>
      `;

content = content.replace(targetBlock, newBlock);
fs.writeFileSync('src/pages/public/LandingPage.tsx', content);
