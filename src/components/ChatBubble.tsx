import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hi! I am the CargoFlow Assistant. How can I help you with your shipments today? (You can ask me about tracking numbers like TRK-2026-12345)' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Basic Tracking Number Extraction
      const trackingMatch = userMessage.match(/TRK-\d{4}-\d{5}/i);
      
      let aiResponse = "";

      if (trackingMatch) {
        const trackingNumber = trackingMatch[0].toUpperCase();
        const { data: shipment, error } = await supabase
          .from('shipments')
          .select('status, origin, destination')
          .eq('tracking_number', trackingNumber)
          .single();

        if (error || !shipment) {
          aiResponse = `I couldn't find a shipment with the tracking number ${trackingNumber}. Please verify the number and try again.`;
        } else {
          const statusMap: Record<string, string> = {
            'order_created': 'registered and awaiting pickup',
            'picked_up': 'picked up by our courier',
            'in_transit': 'currently in transit',
            'out_for_delivery': 'out for delivery',
            'delivered': 'delivered successfully',
            'exception': 'experiencing a delivery exception'
          };
          
          aiResponse = `Shipment **${trackingNumber}** is going from ${shipment.origin} to ${shipment.destination}. It is currently **${statusMap[shipment.status] || shipment.status}**.`;
        }
      } else {
        // Simple FAQ matching
        const lowerInput = userMessage.toLowerCase();
        if (lowerInput.includes('how long') || lowerInput.includes('transit time')) {
          aiResponse = "Standard delivery takes 3-5 business days. Express delivery typically takes 1-2 business days depending on the destination.";
        } else if (lowerInput.includes('exception') || lowerInput.includes('delayed')) {
          aiResponse = "If your package shows a delivery exception, it means there was an unexpected event (like weather or incorrect address). Our team is working to resolve it, and you can contact support for details.";
        } else if (lowerInput.includes('contact') || lowerInput.includes('support')) {
          aiResponse = "You can reach our support team at support@cargoflow.com or call +1 (555) 123-4567 during business hours.";
        } else if (lowerInput.includes('proof of delivery')) {
          aiResponse = "Proof of delivery (POD) is a digital signature and photo taken when your package is handed over. You can view it on the tracking page once your package is delivered.";
        } else {
          aiResponse = "I can help you track shipments or answer general questions about CargoFlow services. Try giving me a tracking number (e.g., TRK-2026-98421) or asking about delivery times.";
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: "I'm having trouble connecting to the system right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 transition-all origin-bottom-right flex flex-col overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold">Logistics Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 flex flex-col">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white border border-gray-200 rounded-bl-sm shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            placeholder="Ask about a shipment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:bg-blue-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
