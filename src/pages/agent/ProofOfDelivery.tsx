import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Camera, CheckCircle, Search, Upload, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function ProofOfDelivery() {
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [podImageUrl, setPodImageUrl] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', trackingNumber.trim())
        .single();

      if (error) throw error;
      
      if (!data) {
        toast.error('Shipment not found');
        setShipment(null);
      } else {
        setShipment(data);
        if (data.status === 'delivered') {
          toast.success('This shipment is already marked as delivered.');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error finding shipment');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !shipment) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/proof-of-delivery/${shipment.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) {
         toast.error(`Storage error: ${uploadError.message}.`);
      } else {
        const { data } = supabase.storage
          .from('app-files')
          .getPublicUrl(filePath);
        setPodImageUrl(data.publicUrl);
        toast.success('Proof of delivery image uploaded');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!shipment) return;
    if (!receiverName.trim()) {
      toast.error('Receiver name is required');
      return;
    }

    setLoading(true);
    try {
      // 1. Update Shipment Status
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: 'delivered' })
        .eq('id', shipment.id);

      if (shipmentError) throw shipmentError;

      // 2. Add Tracking Event
      const { error: eventError } = await supabase
        .from('shipment_events')
        .insert([{
          shipment_id: shipment.id,
          status: 'delivered',
          location: 'Delivery Address',
          note: `Delivered to: ${receiverName}${notes ? ` - ${notes}` : ''}`,
          agent_id: user?.id
        }]);

      if (eventError) throw eventError;
      
      // 3. Create Proof of Delivery
      const { error: podError } = await supabase
        .from('proof_of_delivery')
        .insert([{
          shipment_id: shipment.id,
          receiver_name: receiverName,
          signature_url: podImageUrl,
          agent_id: user?.id,
          device_info: navigator.userAgent
        }]);
        
      if (podError) throw podError;

      toast.success('Shipment successfully marked as delivered!');
      setShipment({ ...shipment, status: 'delivered' });
      setNotes('');
      setReceiverName('');
      setPodImageUrl(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proof of Delivery (POD)</h1>
          <p className="text-gray-500 mt-1">Record final delivery and capture proof</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Find Shipment</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tracking #"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>

        {/* Action Column */}
        <div className="md:col-span-2">
          {shipment ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Shipment Details
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    shipment.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Tracking: <span className="font-mono font-medium text-gray-900">{shipment.tracking_number}</span>
                </div>
              </div>

              {shipment.status !== 'delivered' ? (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name *</label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name of the person receiving the package"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Left at front door, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Delivery (Photo)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        {podImageUrl ? (
                          <div className="mb-4">
                            <img src={podImageUrl} alt="POD" className="mx-auto h-32 object-cover rounded-lg" />
                          </div>
                        ) : (
                          <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                          </label>
                          <p className="pl-1">or take a photo</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || uploading || !receiverName.trim()}
                      className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      {loading ? 'Processing...' : 'Complete Delivery'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery Complete</h3>
                  <p className="text-gray-500">This shipment has been successfully delivered and closed.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-64 flex flex-col items-center justify-center text-gray-400">
              <Package className="w-12 h-12 mb-2 opacity-50" />
              <p>Search for a tracking number to record delivery</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
