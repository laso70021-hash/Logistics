const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AgentManagement.tsx', 'utf8');

const correctLogic = `      toast.success('Agent created successfully!');
      setShowModal(false);
      setNewAgent({ fullName: '', email: '', password: '', role: 'agent', station: '', region: '' });
      fetchAgents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create agent');
    } finally {
      setIsSubmitting(false);
    }
  };`;

content = content.replace(/      \}\n      \};\n/, "      }\n\n" + correctLogic + "\n");
fs.writeFileSync('src/pages/admin/AgentManagement.tsx', content);
