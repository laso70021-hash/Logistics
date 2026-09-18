const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AgentManagement.tsx', 'utf8');

const target = `toast.success('Agent created successfully!');`;
const replacement = `toast.success('Agent created successfully!');
      
      // Send Email to Agent
      if (getGmailToken()) {
        try {
          await sendEmail(
            newAgent.email,
            'Welcome to CargoFlow - Agent Account Created',
            \`<h1>Welcome to CargoFlow</h1>
             <p>Hello \${newAgent.fullName},</p>
             <p>An administrator has created an account for you.</p>
             <p><strong>Email:</strong> \${newAgent.email}<br/>
             <strong>Password:</strong> \${newAgent.password}</p>
             <p>Please log in and change your password as soon as possible.</p>\`
          );
          toast.success('Welcome email sent to agent via Gmail!');
        } catch (emailErr: any) {
          console.error(emailErr);
          toast.error('Agent created, but failed to send email: ' + emailErr.message);
        }
      }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/admin/AgentManagement.tsx', content);
