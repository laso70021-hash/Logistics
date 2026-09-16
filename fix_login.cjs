const fs = require('fs');
let content = fs.readFileSync('src/pages/public/LoginPage.tsx', 'utf8');
content = content.replace(/\} else \{\s*navigate\(from\);\s*\}/g, '} else { navigate(from); }');
content = content.replace(/\}\s*\} else \{ navigate\(from\); \}/, '}');
fs.writeFileSync('src/pages/public/LoginPage.tsx', content);
