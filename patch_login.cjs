const fs = require('fs');
let content = fs.readFileSync('src/pages/public/LoginPage.tsx', 'utf8');

const targetRoutes = `        if (userRole === 'super_admin' || userRole === 'admin') {
             navigate('/admin');
        } else if (userRole === 'agent') {
             navigate('/agent');
        } else {
             navigate(from);
        }`;

const replacementRoutes = `        if (userRole === 'super_admin' || userRole === 'admin') {
             navigate('/admin');
        } else if (userRole === 'agent') {
             navigate('/agent');
        } else if (userRole === 'customer') {
             navigate('/customer');
        } else {
             navigate(from);
        }`;

content = content.replace(targetRoutes, replacementRoutes);
fs.writeFileSync('src/pages/public/LoginPage.tsx', content);
