import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Search, Clock, User, Package, Settings, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // For this example, we'll fetch from shipment_events to simulate an audit log
    // In a real production system with an 'audit_logs' table, you would query that instead.
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('shipment_events')
          .select(`
            id, 
            status, 
            note, 
            created_at,
            shipment_id,
            shipments (tracking_number),
            profiles (full_name, role)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setLogs(data || []);
      } catch (error: any) {
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getLogIcon = (status: string) => {
    if (status === 'delivered') return <Package className="h-4 w-4 text-green-500" />;
    if (status === 'exception') return <Settings className="h-4 w-4 text-red-500" />;
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.shipments?.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.status === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Audit Logs</h1>
          <p className="text-gray-500 mt-1">Review system actions and tracking event history</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Events</option>
              <option value="pending">Created</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="exception">Exceptions</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    No audit logs found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getLogIcon(log.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.status.toUpperCase().replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">{log.note}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.shipments ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 font-mono">
                          {log.shipments.tracking_number}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">System</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {log.profiles ? `${log.profiles.full_name} (${log.profiles.role})` : 'System Auto'}
                      </div>
                    </td>
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
