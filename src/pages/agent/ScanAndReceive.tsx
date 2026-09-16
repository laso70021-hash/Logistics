import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { Search, Package, MapPin, Clock, CheckCircle, ScanLine } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function ScanAndReceive() {
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner;
    
    if (scannerActive) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
      scanner.render((decodedText) => {
        setTrackingNumber(decodedText);
        scanner.clear();
        setScannerActive(false);
        handleSearch(decodedText);
      }, (error) => {
         // ignore continuous scanning errors
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scannerActive]);

  const handleSearch = async (searchVal = trackingNumber) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setShipment(null);

    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', searchVal)
        .single();

      if (error) throw error;
      if (data) {
        setShipment(data);
      } else {
        toast.error('Shipment not found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error finding shipment');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!shipment) return;
    setUpdating(true);

    try {
      // 1. Update shipment
      const { error: updateError } = await supabase
        .from('shipments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', shipment.id);

      if (updateError) throw updateError;

      // 2. Record event
      const { error: eventError } = await supabase
        .from('shipment_events')
        .insert({
          shipment_id: shipment.id,
          status: newStatus,
          agent_id: user?.id,
          note: `Marked as ${newStatus.replace('_', ' ')} via Scan & Receive`,
        });

      if (eventError) throw eventError;

      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      setShipment({ ...shipment, status: newStatus });
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Scan & Receive</h1>
        <p className="text-gray-500">Scan QR codes or enter tracking numbers to update shipment status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Scanner / Input */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Manual Entry</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="TRK-..." 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
              <button 
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">QR Scanner</h3>
              <button 
                onClick={() => setScannerActive(!scannerActive)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${scannerActive ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}
              >
                {scannerActive ? 'Stop Camera' : 'Start Camera'}
              </button>
            </div>
            
            {scannerActive ? (
              <div id="reader" className="w-full overflow-hidden rounded-lg border"></div>
            ) : (
              <div className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                <ScanLine className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Camera inactive</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Results */}
        <div>
           {loading ? (
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
           ) : shipment ? (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                   <div className="font-mono font-bold text-lg text-gray-900">{shipment.tracking_number}</div>
                   <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                     {shipment.status.replace('_', ' ')}
                   </span>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Item</p>
                      <p className="font-medium text-gray-900">{shipment.item_name}</p>
                      <p className="text-sm text-gray-500 mt-1">{shipment.weight}kg • {shipment.quantity} units</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Origin</p>
                      <p className="font-medium text-sm text-gray-900">{shipment.origin}</p>
                      <p className="text-xs text-gray-500 mt-1">{shipment.sender_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Destination</p>
                      <p className="font-medium text-sm text-gray-900">{shipment.destination}</p>
                      <p className="text-xs text-gray-500 mt-1">{shipment.receiver_name}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-3">Update Status</p>
                    
                    {shipment.status === 'out_for_delivery' ? (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-4">
                        <h4 className="font-semibold text-green-900">Proof of Delivery</h4>
                        <div>
                          <label className="block text-sm font-medium text-green-800 mb-1">Receiver Name</label>
                          <input 
                            type="text" 
                            id="receiverNameInput"
                            placeholder="Person who received it"
                            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                          />
                        </div>
                        <button 
                          onClick={async () => {
                            const receiverName = (document.getElementById('receiverNameInput') as HTMLInputElement)?.value;
                            if (!receiverName) {
                              toast.error('Receiver name is required for delivery');
                              return;
                            }
                            setUpdating(true);
                            try {
                              // Record POD
                              const { error: podError } = await supabase.from('proof_of_delivery').insert({
                                shipment_id: shipment.id,
                                receiver_name: receiverName,
                                agent_id: user?.id,
                                device_info: navigator.userAgent
                              });
                              if (podError) throw podError;
                              
                              // Update Status
                              await updateStatus('delivered');
                            } catch (e: any) {
                              toast.error(e.message || 'Failed to record delivery');
                              setUpdating(false);
                            }
                          }}
                          disabled={updating}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          Confirm Delivery
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => updateStatus('in_transit')}
                          disabled={updating || shipment.status === 'in_transit' || shipment.status === 'delivered'}
                          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          Mark In Transit
                        </button>
                        <button 
                          onClick={() => updateStatus('out_for_delivery')}
                          disabled={updating || shipment.status === 'out_for_delivery' || shipment.status === 'delivered'}
                          className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          Out for Delivery
                        </button>
                        <button 
                          onClick={() => updateStatus('exception')}
                          disabled={updating || shipment.status === 'delivered'}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors col-span-2"
                        >
                          Report Exception
                        </button>
                      </div>
                    )}
                  </div>
                </div>
             </div>
           ) : (
             <div className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-200 flex flex-col justify-center items-center h-64 text-gray-400">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p>Scan a QR code or enter tracking number to view details</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
