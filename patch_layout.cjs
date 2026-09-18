const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const targetLinks = "const adminLinks = [";
const replacementLinks = `const customerLinks = [
    { name: 'My Shipments', to: '/customer', icon: Package, category: 'Dashboard' },
    { name: 'Receive Package (QR)', to: '/customer/receive', icon: ScanLine, category: 'Actions' },
  ];

  const adminLinks = [`;

content = content.replace(targetLinks, replacementLinks);

const targetCondition = "const links = isAdmin ? adminLinks : agentLinks;";
const replacementCondition = "const links = isAdmin ? adminLinks : (profile?.role === 'customer' ? customerLinks : agentLinks);";

content = content.replace(targetCondition, replacementCondition);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
