import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Truck, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { subDays, format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Helper to generate 30 days of mock trend data
const generateTrendData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      name: format(date, 'MMM dd'),
      shipments: Math.floor(Math.random() * 50) + 20,
      activity: Math.floor(Math.random() * 200) + 50,
    });
  }
  return data;
};

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    exceptions: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Memoize trend data so it doesn't shift on re-renders
  const trendData = useMemo(() => generateTrendData(), []);

  useEffect(() => {
    fetchMetrics();
    
    // Subscribe to realtime changes
    const channel = supabase.channel('admin-metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, () => {
         fetchMetrics();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const [shipmentsRes, usersRes] = await Promise.all([
         supabase.from('shipments').select('status'),
         supabase.from('profiles').select('id', { count: 'exact' })
      ]);
      
      const shipmentsData = shipmentsRes.data || [];
      const userCount = usersRes.count || 0;
      
      setMetrics({
        total: shipmentsData.length,
        inTransit: shipmentsData.filter(s => s.status === 'in_transit').length,
        delivered: shipmentsData.filter(s => s.status === 'delivered').length,
        exceptions: shipmentsData.filter(s => s.status === 'exception').length,
        totalUsers: userCount,
      });
    } catch (error) {
      console.error("Failed to fetch admin metrics", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Shipments', value: metrics.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'In Transit', value: metrics.inTransit, icon: Truck, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Delivered', value: metrics.delivered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Users', value: metrics.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  // Colors for PieChart
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
  const pieData = [
    { name: 'Delivered', value: metrics.delivered || 1 }, // Fallback to 1 so chart isn't empty if no data
    { name: 'In Transit', value: metrics.inTransit || 1 },
    { name: 'Exceptions', value: metrics.exceptions || 0 },
    { name: 'Other', value: Math.max(0, metrics.total - metrics.delivered - metrics.inTransit - metrics.exceptions) || 0 }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {profile?.full_name || 'Admin'}. System overview and logistics metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              {loading ? (
                 <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Shipment Volume (30 Days) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
           <h2 className="text-lg font-semibold text-gray-900 mb-6">Daily Shipment Volume (Last 30 Days)</h2>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Area type="monotone" dataKey="shipments" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorShipments)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Delivery Success Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-semibold text-gray-900 mb-6">Delivery Status Dist.</h2>
           <div className="h-[300px] w-full flex flex-col justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1f2937' }}
                 />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Agent Activity</h2>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={trendData.slice(-14)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                 <Tooltip 
                   cursor={{ fill: '#f3f4f6' }}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="activity" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Actions Logged" />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
           {metrics.exceptions > 0 ? (
             <div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-lg border border-red-100">
               <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="font-semibold">Action Required</p>
                 <p className="text-sm mt-1">There are {metrics.exceptions} shipments marked as exception. Please review them.</p>
               </div>
             </div>
           ) : (
             <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
                <p className="text-gray-900 font-medium">All Systems Nominal</p>
                <p className="text-sm mt-1">No active delivery exceptions or system alerts.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
