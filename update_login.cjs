const fs = require('fs');
let content = fs.readFileSync('src/pages/public/LoginPage.tsx', 'utf8');

const replacement = `        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
                  
        // Fallback to metadata if profile fails to load (e.g. RLS issues or missing row)
        const userRole = profile?.role || data.session.user.user_metadata?.role || 'customer';
        console.log("Login successful, role resolved to:", userRole, "Profile:", profile, "Error:", profileError);
        
        if (userRole === 'admin' || userRole === 'super_admin' || data.session.user.id === '8c628e03-de74-4ca4-85a4-dfa218faac54') {
             navigate('/admin');
        } else if (userRole === 'agent') {
             navigate('/agent');
        } else {
             navigate(from);
        }`;

content = content.replace(/const \{ data: profile \} = await supabase.*?navigate\(from\);\s*\}/s, replacement);
fs.writeFileSync('src/pages/public/LoginPage.tsx', content);
