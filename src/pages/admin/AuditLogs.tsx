import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Clock, User, Settings, Database, Server } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [schemaError, setSchemaError] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select(`
            id, 
            action_type, 
            description, 
            entity_type,
            created_at,
            profiles (full_name, role)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          if (error.code === '42P01') {
             setSchemaError(true);
          }
          throw error;
        }

        setLogs(data || []);
      } catch (error: any) {
        console.log("Audit log table might not exist.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      log.description?.toLowerCase().includes(term) ||
      log.action_type?.toLowerCase().includes(term) ||
      log.profiles?.full_name?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading audit logs...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Audit Logs</h1>
          <p className="text-gray-500 mt-1">Immutable record of system-wide administrative actions</p>
        </div>
      </div>

      {schemaError && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Database className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Database Setup Required</h3>
              <p className="text-sm text-red-700 mb-4">
                The <code className="bg-red-100 px-1 py-0.5 rounded">audit_logs</code> table is missing from your database. 
                Please run the following SQL command in your Supabase SQL Editor to enable this feature:
              </p>
              <pre className="bg-white p-4 rounded-lg text-sm border border-red-100 overflow-x-auto text-gray-800 font-mono">
{`CREATE TABLE audit_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  action_type text NOT NULL,
  description text NOT NULL,
  entity_type text,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super Admins can view audit logs" ON audit_logs FOR SELECT USING (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);
CREATE POLICY "System can insert logs" ON audit_logs FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- Insert dummy data just to visualize
INSERT INTO audit_logs (action_type, description, entity_type) VALUES 
('LOGIN', 'System initialized properly', 'SYSTEM');`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {!schemaError && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search actions, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Server className="w-12 h-12 text-gray-300 mb-4" />
                        <p>No system logs found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 uppercase tracking-wider">
                          {log.action_type || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {log.description}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-700">
                            {log.profiles?.full_name || 'System User'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border">
                          {log.entity_type || 'GLOBAL'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
