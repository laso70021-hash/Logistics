import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, Clock, ShieldAlert } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsReports() {
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    exceptions: 0
  });
  
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from('shipments')
          .select('status');

        if (error) throw error;
        
        if (data) {
          const counts = data.reduce((acc: any, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
          }, {});

          setStats({
            total: data.length,
            delivered: counts['delivered'] || 0,
            inTransit: counts['in_transit'] || 0,
            exceptions: counts['exception'] || 0
          });

          setStatusData([
            { name: 'Pending', value: counts['pending'] || 0 },
            { name: 'In Transit', value: counts['in_transit'] || 0 },
            { name: 'Delivered', value: counts['delivered'] || 0 },
            { name: 'Exception', value: counts['exception'] || 0 }
          ].filter(item => item.value > 0));
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock trend data
  const trendData = [
    { name: 'Mon', shipments: 4000, deliveries: 2400 },
    { name: 'Tue', shipments: 3000, deliveries: 1398 },
    { name: 'Wed', shipments: 2000, deliveries: 9800 },
    { name: 'Thu', shipments: 2780, deliveries: 3908 },
    { name: 'Fri', shipments: 1890, deliveries: 4800 },
    { name: 'Sat', shipments: 2390, deliveries: 3800 },
    { name: 'Sun', shipments: 3490, deliveries: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">Key metrics and insights for global operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.delivered}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">In Transit</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.inTransit}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg mr-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Exceptions</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.exceptions}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Operations Flow</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#F3F4F6'}} />
                <Legend />
                <Bar dataKey="shipments" name="New Shipments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deliveries" name="Deliveries" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Current Status Distribution</h3>
          <div className="h-80 w-full flex justify-center items-center">
            {loading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-48 w-48 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
