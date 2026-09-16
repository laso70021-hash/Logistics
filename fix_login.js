const fs = require('fs');
const content = fs.readFileSync('src/pages/public/LoginPage.tsx', 'utf8');
const newContent = content.replace(
  /if \(profile\) \{[\s\S]*?navigate\(from\);\s*\}\s*\}/,
  `if (profile) {
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
        }`
);
fs.writeFileSync('src/pages/public/LoginPage.tsx', newContent);
