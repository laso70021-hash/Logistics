import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Search, Package, Clock, ShieldAlert, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExceptionManagement() {
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedException, setSelectedException] = useState<any | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchExceptions = async () => {
    try {
      // Assuming exceptions are marked via a status or an 'exception' flag. We'll use status='exception' for this example.
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('status', 'exception')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setExceptions(data || []);
    } catch (error: any) {
      toast.error('Failed to load exceptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExceptions();
  }, []);

  const handleResolve = async () => {
    if (!selectedException) return;
    setProcessing(true);
    
    try {
      // 1. Update status back to in_transit
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: 'in_transit' })
        .eq('id', selectedException.id);

      if (shipmentError) throw shipmentError;

      // 2. Add event for resolution
      const { error: eventError } = await supabase
        .from('shipment_events')
        .insert([{
          shipment_id: selectedException.id,
          status: 'in_transit',
          location: 'Resolution Center',
          note: `Exception Resolved: ${resolutionNote || 'Issue cleared by admin.'}`
        }]);
        
      if (eventError) throw eventError;

      toast.success('Exception resolved successfully');
      setSelectedException(null);
      setResolutionNote('');
      fetchExceptions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to resolve exception');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exception Management</h1>
          <p className="text-gray-500 mt-1">Review and resolve shipment anomalies and delays</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : exceptions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                        No active exceptions right now.
                      </td>
                    </tr>
                  ) : (
                    exceptions.map((exc) => (
                      <tr key={exc.id} className={selectedException?.id === exc.id ? 'bg-red-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
                            <span className="font-mono text-sm font-medium">{exc.tracking_number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Delivery Exception
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(exc.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedException(exc)}
                            className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded-md"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedException ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 border-t-4 border-t-red-500 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Resolve Exception</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Shipment:</p>
                <p className="font-mono text-gray-900">{selectedException.tracking_number}</p>
                
                <p className="text-sm font-medium text-gray-700 mt-3">Sender:</p>
                <p className="text-gray-900">{selectedException.sender_name}</p>
                
                <p className="text-sm font-medium text-gray-700 mt-3">Receiver:</p>
                <p className="text-gray-900">{selectedException.receiver_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Note</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Explain how this exception was resolved..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => { setSelectedException(null); setResolutionNote(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 flex items-center"
                >
                  {processing ? 'Processing...' : 'Mark as Resolved'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed text-center flex flex-col items-center justify-center h-full text-gray-500 min-h-[300px]">
              <AlertTriangle className="h-12 w-12 text-gray-400 mb-3" />
              <p>Select an exception from the list to review and resolve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
