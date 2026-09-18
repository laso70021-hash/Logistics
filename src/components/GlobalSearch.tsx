import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Loader2, Package } from 'lucide-react';
import { cn } from '../lib/utils';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('shipments')
          .select('id, tracking_number, receiver_name, receiver_email, status, item_name')
          .or(`tracking_number.ilike.%${query}%,receiver_name.ilike.%${query}%,receiver_email.ilike.%${query}%,sender_email.ilike.%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md z-50" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by tracking #, name, or email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-2">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">No shipments found.</div>
          ) : (
            <ul>
              {results.map((shipment) => (
                <li key={shipment.id}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      navigate(`/track/${shipment.tracking_number}`);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                  >
                    <div className="mt-0.5 bg-blue-100 p-1.5 rounded-md text-blue-600">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-gray-900 truncate">
                          {shipment.tracking_number}
                        </span>
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {shipment.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {shipment.receiver_name} • {shipment.item_name}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
