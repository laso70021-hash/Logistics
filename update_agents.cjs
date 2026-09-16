const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AgentManagement.tsx', 'utf8');

const importReplacement = `import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Search, CheckCircle, XCircle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';`;

content = content.replace(/import { useEffect.*?toast';/s, importReplacement);

fs.writeFileSync('src/pages/admin/AgentManagement.tsx', content);
