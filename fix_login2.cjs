const fs = require('fs');
let content = fs.readFileSync('src/pages/public/LoginPage.tsx', 'utf8');

const replacement = `  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
                  
        if (profile) {
           if (profile.role === 'admin' || profile.role === 'super_admin' || data.session.user.id === '8c628e03-de74-4ca4-85a4-dfa218faac54') {
             navigate('/admin');
           } else if (profile.role === 'agent') {
             navigate('/agent');
           } else {
             navigate(from);
           }
        } else {
           if (data.session.user.id === '8c628e03-de74-4ca4-85a4-dfa218faac54') {
             navigate('/admin');
           } else {
             navigate(from);
           }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(/const handleLogin = async.*?setLoading\(false\);\s*\}\s*\};/s, replacement);
fs.writeFileSync('src/pages/public/LoginPage.tsx', content);
