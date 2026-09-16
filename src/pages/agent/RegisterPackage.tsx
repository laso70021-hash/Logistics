import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';

export default function RegisterPackage() {
  const [loading, setLoading] = useState(false);
  const [createdTracking, setCreatedTracking] = useState('');
  
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
          <button 
            onClick={copyTracking}
            className="p-3 bg-white hover:bg-green-100 rounded-lg text-green-700 transition-colors flex flex-col items-center gap-1 shadow-sm border border-green-200"
          >
            <Copy className="w-5 h-5" />
            <span className="text-xs font-medium">Copy</span>
          </button>
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
    </div>
  );
}
