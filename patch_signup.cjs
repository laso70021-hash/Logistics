const fs = require('fs');
let content = fs.readFileSync('src/pages/public/SignUpPage.tsx', 'utf8');

content = content.replace("import toast from 'react-hot-toast';", "import toast from 'react-hot-toast';\nimport { sendEmail, getGmailToken } from '../../lib/gmail';");

const target = `if (data.session) {
        navigate('/agent');
      } else {
        toast.success("Your account has been created. Please check your email and verify your address before logging in.", { duration: 5000 });
        navigate('/login', { state: { email } });
      }`;

const replacement = `if (data.session) {
        navigate('/agent');
      } else {
        toast.success("Your account has been created. Please check your email and verify your address before logging in.", { duration: 5000 });
        
        if (getGmailToken()) {
          try {
            await sendEmail(
              email,
              'Welcome to CargoFlow!',
              \`<h2>Welcome \${fullName}</h2><p>Thank you for signing up for CargoFlow.</p>\`
            );
          } catch(e) {}
        }

        navigate('/login', { state: { email } });
      }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/public/SignUpPage.tsx', content);
