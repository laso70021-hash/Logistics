import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { Search, Package, MapPin, CheckCircle, ScanLine, Smartphone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function CustomerScanReceive() {
  const { user, profile } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
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
      
      // Ensure the user actually owns this shipment
      if (data.receiver_email !== user?.email && data.sender_email !== user?.email) {
        throw new Error("This shipment does not belong to your account.");
      }

      setShipment(data);
    } catch (error: any) {
      toast.error(error.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!shipment) return;
    
    if (shipment.status === 'delivered') {
      toast.error("This package is already marked as delivered.");
      return;
    }

    setConfirming(true);
    try {
      // 1. Update Shipment Status
      const { error: updateError } = await supabase
        .from('shipments')
        .update({ status: 'delivered', updated_at: new Date().toISOString() })
        .eq('id', shipment.id);

      if (updateError) throw updateError;

      // 2. Add Event
      await supabase.from('shipment_events').insert({
        shipment_id: shipment.id,
        status: 'delivered',
        location: shipment.destination,
        note: `Self-confirmed by customer (${profile?.full_name || user?.email})`,
      });

      // 3. Add to Proof of Delivery
      await supabase.from('proof_of_delivery').insert({
        shipment_id: shipment.id,
        receiver_name: profile?.full_name || user?.email,
        device_info: 'Customer Self-Scan (Web)',
      });

      toast.success('Successfully confirmed delivery!');
      
      // Reload shipment details
      handleSearch(shipment.tracking_number);

    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm receipt');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Confirm Receipt</h1>
        <p className="text-gray-500 mt-1">Scan the QR code on your package to confirm delivery.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Scanner / Manual Input */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={loading || !trackingNumber.trim()}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          
          <button
            onClick={() => setScannerActive(!scannerActive)}
            className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border-2 transition-colors ${
              scannerActive 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
            }`}
          >
            <ScanLine className="w-5 h-5" />
            {scannerActive ? 'Stop Scanner' : 'Start Camera'}
          </button>
        </div>

        {scannerActive && (
          <div className="mb-8 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
            <div id="reader" className="w-full"></div>
            <div className="p-3 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4" /> Point camera at the QR code on the package
            </div>
          </div>
        )}

        {/* Shipment Details */}
        {shipment && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-gray-500 tracking-wider">TRACKING NUMBER</span>
                <h3 className="text-xl font-mono font-bold text-gray-900 mt-1">{shipment.tracking_number}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                shipment.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {shipment.status.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{shipment.item_name}</h4>
                  <p className="text-sm text-gray-500">{shipment.weight} kg • {shipment.category || 'General'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl mb-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> FROM
                  </div>
                  <div className="font-semibold text-gray-900">{shipment.origin}</div>
                  <div className="text-sm text-gray-600">{shipment.sender_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> TO (ME)
                  </div>
                  <div className="font-semibold text-gray-900">{shipment.destination}</div>
                  <div className="text-sm text-gray-600">{shipment.receiver_name}</div>
                </div>
              </div>

              {shipment.status !== 'delivered' ? (
                <div className="border-t pt-6 mt-2">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      By confirming receipt, you acknowledge that you have received this package in good condition.
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmReceipt}
                    disabled={confirming}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-6 h-6" />
                    {confirming ? 'Confirming...' : 'Yes, I received this package'}
                  </button>
                </div>
              ) : (
                <div className="border-t pt-6 mt-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center text-center">
                    <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                    <h3 className="font-bold text-green-800 text-lg">Delivery Confirmed</h3>
                    <p className="text-green-600 text-sm mt-1">Thank you for confirming receipt of this package.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
