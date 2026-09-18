import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Copy, Printer, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function RegisterPackage() {
  const [loading, setLoading] = useState(false);
  const [createdTracking, setCreatedTracking] = useState('');
  const [createdShipment, setCreatedShipment] = useState<any>(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: 1,
    weight: '',
    description: '',
    origin: '',
    destination: '',
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateTrackingNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); // 5 digits
    return `TRK-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCreatedTracking('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const trackingNumber = generateTrackingNumber();
      
      const { data: shipment, error } = await supabase.from('shipments').insert({
        tracking_number: trackingNumber,
        status: 'order_created',
        origin: formData.origin,
        destination: formData.destination,
        item_name: formData.itemName,
        category: formData.category,
        quantity: parseInt(formData.quantity.toString()),
        weight: parseFloat(formData.weight),
        description: formData.description,
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        sender_email: formData.senderEmail,
        receiver_name: formData.receiverName,
        receiver_phone: formData.receiverPhone,
        receiver_email: formData.receiverEmail,
      }).select().single();

      if (error) throw error;
      
      // Insert initial event
      await supabase.from('shipment_events').insert({
        shipment_id: shipment.id,
        status: 'order_created',
        location: formData.origin,
        note: 'Package registered and tracking number generated.',
        agent_id: user?.id
      });

      setCreatedTracking(trackingNumber);
      setCreatedShipment({
        trackingNumber,
        origin: formData.origin,
        destination: formData.destination,
        weight: formData.weight,
        senderName: formData.senderName,
        receiverName: formData.receiverName,
        date: new Date().toLocaleDateString()
      });
      setShowLabelModal(true);
      toast.success('Package registered successfully!');
      
      // Reset form (optional)
      setFormData({
        itemName: '', category: '', quantity: 1, weight: '', description: '',
        origin: '', destination: '', senderName: '', senderPhone: '', senderEmail: '',
        receiverName: '', receiverPhone: '', receiverEmail: '',
      });
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to register package');
    } finally {
      setLoading(false);
    }
  };

  const copyTracking = () => {
    navigator.clipboard.writeText(createdTracking);
    toast.success('Tracking number copied');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Register Package</h1>
        <p className="text-gray-500">Enter shipment details to create a new record and generate a tracking number.</p>
      </div>

      {createdTracking && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-green-800 font-semibold mb-1">Shipment Created Successfully!</h3>
            <p className="text-green-600 text-sm">Tracking Number:</p>
            <div className="text-3xl font-bold text-green-900 font-mono tracking-wider mt-1">
              {createdTracking}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowLabelModal(true)}
              className="p-3 bg-white hover:bg-green-100 rounded-lg text-green-700 transition-colors flex flex-col items-center gap-1 shadow-sm border border-green-200"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs font-medium">Label</span>
            </button>
            <button 
              onClick={copyTracking}
              className="p-3 bg-white hover:bg-green-100 rounded-lg text-green-700 transition-colors flex flex-col items-center gap-1 shadow-sm border border-green-200"
            >
              <Copy className="w-5 h-5" />
              <span className="text-xs font-medium">Copy</span>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Package Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Package Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input type="text" name="itemName" required value={formData.itemName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select category...</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="documents">Documents</option>
                <option value="heavy">Heavy Machinery</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
          </div>
        </section>

        {/* Route Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Route Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
              <input type="text" name="origin" required placeholder="City, Country" value={formData.origin} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
              <input type="text" name="destination" required placeholder="City, Country" value={formData.destination} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Sender Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Sender</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="senderName" required value={formData.senderName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="senderPhone" value={formData.senderPhone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Receiver Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Receiver</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="receiverName" required value={formData.receiverName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>
        </div>

        <div className="pt-4 border-t">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Package & Generate Label'}
          </button>
        </div>
      </form>

      {showLabelModal && createdShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:p-0 print:bg-white print:block">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col print:shadow-none print:max-w-none print:w-full print:border-0 print:rounded-none">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 print:hidden bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Shipping Label Preview
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Print
                </button>
                <button onClick={() => setShowLabelModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Label Content (Printable area) */}
            <div className="p-8 bg-white" id="printable-label">
              <div className="border-4 border-black p-6 rounded-xl relative">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-black tracking-tighter">CARGOFLOW</h1>
                    <p className="text-sm font-bold mt-1">PRIORITY SHIPPING</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500">DATE</p>
                    <p className="font-bold">{createdShipment.date}</p>
                    <p className="text-xs font-bold text-gray-500 mt-2">WEIGHT</p>
                    <p className="font-bold">{createdShipment.weight || 'N/A'} kg</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="flex justify-between gap-8 mb-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 mb-1">FROM</p>
                    <p className="font-bold text-lg uppercase">{createdShipment.senderName}</p>
                    <p className="text-gray-700">{createdShipment.origin}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 mb-1">TO</p>
                    <p className="font-bold text-xl uppercase">{createdShipment.receiverName}</p>
                    <p className="text-gray-900 font-medium">{createdShipment.destination}</p>
                  </div>
                </div>

                {/* Tracking & Barcode */}
                <div className="border-t-2 border-black pt-6 flex flex-col items-center">
                  <QRCodeSVG value={createdShipment.trackingNumber} size={120} />
                  <p className="text-2xl font-mono tracking-widest font-bold mt-4">
                    {createdShipment.trackingNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
