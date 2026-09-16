import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Package, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

export default function MasterShipments() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setShipments(data);
    } catch (error) {
      console.error('Failed to fetch shipments', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = shipments.filter(s => 
    s.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name.toLowerCase().includes(search.toLowerCase()) ||
    s.receiver_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? 'Master Shipments' : 'All Shipments'}</h1>
          <p className="text-gray-500">Comprehensive view of all recorded shipments.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Tracking, Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-72"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Tracking</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                {isAdmin && <th className="px-6 py-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-500">Loading shipments...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                    <Package className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No shipments found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium text-blue-600">{s.tracking_number}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.item_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="text-gray-500">From:</span> <span className="font-medium text-gray-900">{s.sender_name}</span>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="text-gray-500">To:</span> <span className="font-medium text-gray-900">{s.receiver_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400"/> {s.origin}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400"/> {s.destination}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                        ${s.status === 'order_created' ? 'bg-gray-100 text-gray-700' : ''}
                        ${s.status === 'in_transit' ? 'bg-blue-100 text-blue-700' : ''}
                        ${s.status === 'out_for_delivery' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${s.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                        ${s.status === 'exception' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(s.created_at), 'MMM d, yyyy')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm">
                         <button className="text-blue-600 hover:text-blue-800 font-medium">Manage</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
