const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AgentManagement.tsx', 'utf8');

const importReplacement = `import { useEffect, useState } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Users, Search, CheckCircle, XCircle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';`;

const logicReplacement = `  const handleAddAgent = async (e: React.FormEvent) => {
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
             region: newAgent.region
           })
           .eq('id', data.user.id);
           
         if (updateError) throw updateError;
      }`;

content = content.replace(/import { useEffect.*?toast';/s, importReplacement);
content = content.replace(/  const handleAddAgent = async \(e: React\.FormEvent\) => \{.*?if \(data\?\.user\?\.id\) \{.*?\}\s*\}/s, logicReplacement + '\n      }');

fs.writeFileSync('src/pages/admin/AgentManagement.tsx', content);
