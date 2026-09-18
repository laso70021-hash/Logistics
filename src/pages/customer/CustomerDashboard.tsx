import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Package, Clock, CheckCircle, Search, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyShipments();
    }
  }, [user]);

  const fetchMyShipments = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .or(`sender_email.eq.${user?.email},receiver_email.eq.${user?.email}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      order_created: 'bg-gray-100 text-gray-700',
      picked_up: 'bg-blue-100 text-blue-700',
      in_transit: 'bg-indigo-100 text-indigo-700',
      out_for_delivery: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      exception: 'bg-red-100 text-red-700',
    };
    const style = styles[status] || 'bg-gray-100 text-gray-700';
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${style}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your shipments...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
        <p className="text-gray-500 mt-1">Track and manage packages associated with your email address.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Package className="w-5 h-5" /> Active & Past Deliveries
          </h2>
          <Link to="/customer/receive" className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
            <FileText className="w-4 h-4" /> Receive Package (QR)
          </Link>
        </div>

        {shipments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p>We couldn't find any shipments linked to your email.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Tracking #</th>
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium">Route</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{s.tracking_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{s.item_name}</div>
                      <div className="text-xs text-gray-500">{s.weight} kg</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{s.origin} →</div>
                      <div className="font-medium text-gray-900">{s.destination}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                    <td className="px-6 py-4 text-gray-500">{format(new Date(s.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/track/${s.tracking_number}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
