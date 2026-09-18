const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AuditLogs.tsx', 'utf8');

content = content.replace(".select(\\`\\n", ".select(`\\n");
content = content.replace("          \\`)\\n", "          `)\\n");

fs.writeFileSync('src/pages/admin/AuditLogs.tsx', content);
