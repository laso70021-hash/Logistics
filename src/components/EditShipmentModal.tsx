import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { X, Save, Clock, MapPin, Tag } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types';

interface EditShipmentModalProps {
  shipment: Shipment;
  onClose: () => void;
  onUpdate: () => void;
  agentId?: string;
}

const STATUSES: { value: ShipmentStatus; label: string }[] = [
  { value: 'order_created', label: 'Order Created' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'exception', label: 'Exception' }
];

const EXCEPTION_REASONS = [
  'Wrong / Incomplete Address',
  'Package Damaged',
  'Package Lost / Missing',
  'Customer Unavailable',
  'Customs / Clearance Issue',
  'Vehicle / Transport Problem',
  'Weather / Service Disruption'
];

export default function EditShipmentModal({ shipment, onClose, onUpdate, agentId }: EditShipmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'details'>('status');

  // Status State
  const [newStatus, setNewStatus] = useState<ShipmentStatus>(shipment.status);
  const [exceptionReason, setExceptionReason] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  // Details State
  const [origin, setOrigin] = useState(shipment.origin);
  const [destination, setDestination] = useState(shipment.destination);
  const [senderName, setSenderName] = useState(shipment.sender_name);
  const [receiverName, setReceiverName] = useState(shipment.receiver_name);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let finalNote = note;
    if (newStatus === 'exception' && exceptionReason) {
      finalNote = finalNote ? `Exception: ${exceptionReason} - ${finalNote}` : `Exception: ${exceptionReason}`;
    }

    try {
      // 1. Update Shipment Row
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: newStatus })
        .eq('id', shipment.id);
        
      if (shipmentError) throw shipmentError;

      // 2. Add Tracking Event
      const { error: eventError } = await supabase
        .from('shipment_events')
        .insert({
          shipment_id: shipment.id,
          status: newStatus,
          location: location || null,
          note: finalNote || null,
          agent_id: agentId || null
        });

      if (eventError) {
        // Fallback if the table is actually shipment_events instead of tracking_events
        const { error: eventError2 } = await supabase
          .from('shipment_events')
          .insert({
            shipment_id: shipment.id,
            status: newStatus,
            location: location || null,
            note: finalNote || null,
            agent_id: agentId || null
          });
        if (eventError2) {
          console.error("Event error:", eventError2);
        }
      }

      toast.success('Status updated successfully');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('shipments')
        .update({
          origin,
          destination,
          sender_name: senderName,
          receiver_name: receiverName
        })
        .eq('id', shipment.id);
        
      if (error) throw error;

      toast.success('Shipment details updated');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Shipment</h2>
            <p className="text-sm text-gray-500 font-mono mt-1">{shipment.tracking_number}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'status' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Update Lifecycle
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Edit Details
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'status' ? (
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => {
                        setNewStatus(s.value);
                        if (s.value !== 'exception') setExceptionReason('');
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border flex items-center justify-center transition-colors
                        ${newStatus === s.value 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {newStatus === 'exception' && (
                <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
                  <label className="block text-sm font-semibold text-red-800 mb-3">Select an exception reason</label>
                  <div className="space-y-2">
                    {EXCEPTION_REASONS.map(reason => (
                      <label key={reason} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="radio" 
                          name="exception_reason" 
                          value={reason} 
                          checked={exceptionReason === reason}
                          onChange={(e) => setExceptionReason(e.target.value)}
                          className="text-red-600 focus:ring-red-500 w-4 h-4"
                        />
                        {reason}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location (City, Facility)</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sort Facility, London"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Note / Remarks</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional notes visible to customer tracking..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button 
                  type="submit" 
                  disabled={loading || (newStatus === 'exception' && !exceptionReason)} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : (newStatus === 'exception' ? 'Confirm Exception' : 'Update Status')}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdateDetails} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin Address</label>
                  <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Address</label>
                  <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                  <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
                  <input type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
