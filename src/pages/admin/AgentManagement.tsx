import { useEffect, useState } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Users, Search, CheckCircle, XCircle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentManagement() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAgent, setNewAgent] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'agent',
    station: '',
    region: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['agent', 'admin'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setAgents(data);
    } catch (error: any) {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Agent status updated');
      fetchAgents();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create a temporary client that doesn't persist the session, 
      // so it doesn't log the admin out when signing up the new agent
      const tempSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });

      // Create user
      const { data, error } = await tempSupabase.auth.signUp({
        email: newAgent.email,
        password: newAgent.password,
        options: {
          data: {
            full_name: newAgent.fullName,
            role: newAgent.role,
          }
        }
      });
      
      if (error) throw error;
      
      // Update additional profile fields since trigger handles the initial creation
      if (data?.user?.id) {
         // Wait a moment for the database trigger to create the profile row
         await new Promise(resolve => setTimeout(resolve, 500));
         
         const { error: updateError } = await supabase
           .from('profiles')
           .update({
             station: newAgent.station,
             region: newAgent.region, role: newAgent.role
           })
           .eq('id', data.user.id);
           
         if (updateError) throw updateError;
      }

      toast.success('Agent created successfully!');
      setShowModal(false);
      setNewAgent({ fullName: '', email: '', password: '', role: 'agent', station: '', region: '' });
      fetchAgents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = agents.filter(a => 
    (a.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (a.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents Directory</h1>
          <p className="text-gray-500">Manage agent accounts, roles, and facility assignments.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Station/Region</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading agents...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No agents found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {a.full_name?.charAt(0) || a.email.charAt(0)}
                         </div>
                         <div>
                            <div className="font-medium text-gray-900">{a.full_name || 'Unnamed Agent'}</div>
                            <div className="text-xs text-gray-500">{a.email}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm font-medium text-gray-700">{a.role.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{a.station || 'Unassigned'}</div>
                      <div className="text-xs text-gray-500">{a.region || 'Global'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1
                        ${a.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {a.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {a.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => toggleStatus(a.id, a.active)}
                        className={`font-medium ${a.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                      >
                        {a.active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Add New Agent</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAgent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newAgent.fullName}
                  onChange={(e) => setNewAgent({...newAgent, fullName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="john@cargoflow.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({...newAgent, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    value={newAgent.role}
                    onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <input 
                    type="text" 
                    value={newAgent.region}
                    onChange={(e) => setNewAgent({...newAgent, region: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. North America"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility / Station</label>
                <input 
                  type="text" 
                  value={newAgent.station}
                  onChange={(e) => setNewAgent({...newAgent, station: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. NY Central Hub"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
