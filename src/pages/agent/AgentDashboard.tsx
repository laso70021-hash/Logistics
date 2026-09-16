import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AgentDashboard() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    exceptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    // Subscribe to realtime changes
    const channel = supabase.channel('dashboard-metrics')
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
      const { data, error } = await supabase.from('shipments').select('status');
      if (error) throw error;
      
      if (data) {
        setMetrics({
          total: data.length,
          inTransit: data.filter(s => s.status === 'in_transit').length,
          delivered: data.filter(s => s.status === 'delivered').length,
          exceptions: data.filter(s => s.status === 'exception').length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch metrics", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Shipments', value: metrics.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'In Transit', value: metrics.inTransit, icon: Truck, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Delivered', value: metrics.delivered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Exceptions', value: metrics.exceptions, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {profile?.full_name || 'Agent'}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
         <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
         <div className="text-center py-12 text-gray-500">
             (Activity list will populate here as shipments move through the warehouse)
         </div>
      </div>
    </div>
  );
}
