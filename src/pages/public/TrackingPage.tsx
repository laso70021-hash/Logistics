import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Package, Truck, CheckCircle, Clock, MapPin, AlertTriangle, ArrowRight, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function TrackingPage() {
  const { trackingNumber: initialTracking } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || '');
  const [shipment, setShipment] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialTracking) {
      handleSearch(initialTracking);
    }
  }, [initialTracking]);

  const handleSearch = async (tracking = trackingNumber) => {
    if (!tracking.trim()) return;
    setLoading(true);
    setSearched(true);
    setShipment(null);
    setEvents([]);

    try {
      // Fetch shipment
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', tracking)
        .single();

      if (shipmentError) {
         if (shipmentError.code === 'PGRST116') {
             // Not found
             setLoading(false);
             return;
         }
         throw shipmentError;
      }

      setShipment(shipmentData);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('shipment_events')
        .select('*')
        .eq('shipment_id', shipmentData.id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

    } catch (error: any) {
      toast.error('Failed to retrieve tracking information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/track/${shipment.tracking_number}`;
    navigator.clipboard.writeText(url);
    toast.success('Tracking link copied');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'order_created': return <Package className="w-5 h-5" />;
      case 'picked_up': return <Package className="w-5 h-5" />;
      case 'in_transit': return <Truck className="w-5 h-5" />;
      case 'out_for_delivery': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'exception': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'exception': return 'text-red-600 bg-red-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'out_for_delivery': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/track/${trackingNumber}`);
              handleSearch();
            }}
            className="max-w-xl mx-auto flex gap-2"
          >
            <input
              type="text"
              placeholder="Enter Tracking Number (e.g. TRK-12345)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase"
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              Track
            </button>
          </form>
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : searched && !shipment ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Shipment Not Found</h3>
            <p className="text-gray-500 mt-2">We couldn't find a shipment with that tracking number. Please verify and try again.</p>
          </div>
        ) : shipment ? (
          <div className="space-y-6">
            
            {/* Shipment Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white">
                <div>
                   <p className="text-gray-400 text-sm">Tracking Number</p>
                   <p className="font-mono font-bold text-lg">{shipment.tracking_number}</p>
                </div>
                <button onClick={copyLink} className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                  <Copy className="w-4 h-4" /> Share Link
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                   <div>
                     <p className="text-sm text-gray-500">Status</p>
                     <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${getStatusColor(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status.replace('_', ' ')}
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm text-gray-500">Last Updated</p>
                     <p className="font-medium text-gray-900 mt-1">{format(new Date(shipment.updated_at), 'MMM d, h:mm a')}</p>
                   </div>
                </div>

                {shipment.status !== 'delivered' && (
                  <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Estimated Delivery</p>
                      <p className="text-lg font-bold text-blue-900">
                        {format(new Date(new Date(shipment.created_at).getTime() + 4 * 24 * 60 * 60 * 1000), 'EEEE, MMM d')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-700 font-medium">Time Remaining</p>
                      <p className="text-lg font-bold text-blue-900">
                        {Math.max(0, Math.ceil((new Date(new Date(shipment.created_at).getTime() + 4 * 24 * 60 * 60 * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Days
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Origin</p>
                    <p className="font-semibold text-gray-900">{shipment.origin}</p>
                  </div>
                  <div className="px-4 text-gray-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500 mb-1 flex items-center justify-end gap-1"><MapPin className="w-3 h-3"/> Destination</p>
                    <p className="font-semibold text-gray-900">{shipment.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Tracking History</h3>
              
              <div className="space-y-6">
                {events.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">No updates yet.</div>
                ) : (
                  <div className="relative border-l border-gray-200 ml-3 space-y-8">
                    {events.map((event, idx) => (
                      <div key={event.id} className="relative pl-6">
                        <div className={`absolute -left-3.5 top-0.5 p-1 rounded-full bg-white border-2 ${idx === 0 ? 'border-blue-500' : 'border-gray-300'}`}>
                           <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{event.status.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500 mt-1">{format(new Date(event.created_at), 'MMM d, yyyy • h:mm a')}</p>
                          {event.note && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Initial Creation Event Fallback (if no events created by trigger yet) */}
                    <div className="relative pl-6">
                        <div className={`absolute -left-3.5 top-0.5 p-1 rounded-full bg-white border-2 border-gray-300`}>
                           <div className={`w-2.5 h-2.5 rounded-full bg-gray-300`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Shipment Information Received</p>
                          <p className="text-sm text-gray-500 mt-1">{format(new Date(shipment.created_at), 'MMM d, yyyy • h:mm a')}</p>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}
