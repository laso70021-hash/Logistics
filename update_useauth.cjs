const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAuth.tsx', 'utf8');

const replacement = `  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback if RLS or row missing prevents fetching profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           setProfile({
             id: user.id,
             role: user.user_metadata?.role || 'customer',
             email: user.email,
             full_name: user.user_metadata?.full_name || 'Agent',
             active: true
           });
        }
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setIsLoading(false);
    }
  };`;

content = content.replace(/  const fetchProfile = async \(userId: string\) => \{.*?setIsLoading\(false\);\s*\}\s*\};/s, replacement);
fs.writeFileSync('src/hooks/useAuth.tsx', content);
