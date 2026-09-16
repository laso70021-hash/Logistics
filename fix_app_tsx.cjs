const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /if \(!isSuperAdmin && \(!profile \|\| !allowedRoles\.includes\(profile\.role\)\)\) \{/,
  "if (!isSuperAdmin && (!profile || !profile.role || !allowedRoles.includes(profile.role))) {"
);
fs.writeFileSync('src/App.tsx', content);
