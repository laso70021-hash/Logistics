const fs = require('fs');
let content = fs.readFileSync('src/components/EditShipmentModal.tsx', 'utf8');

// Imports
content = content.replace("import toast from 'react-hot-toast';", "import toast from 'react-hot-toast';\nimport { sendEmail, getGmailToken } from '../lib/gmail';");

// Inside handleUpdateStatus after success toast
const targetStatus = `toast.success('Status updated successfully');`;
const replacementStatus = `toast.success('Status updated successfully');
      
      if (getGmailToken() && shipment.sender_email) {
        try {
          await sendEmail(
            shipment.sender_email,
            \`Shipment Update: \${shipment.tracking_number}\`,
            \`<h2>Shipment Status Update</h2>
             <p>Your shipment <strong>\${shipment.tracking_number}</strong> status has been updated to <strong>\${newStatus.replace('_', ' ').toUpperCase()}</strong>.</p>
             <p><strong>Location:</strong> \${location || 'N/A'}</p>
             \${finalNote ? \`<p><strong>Note:</strong> \${finalNote}</p>\` : ''}
             <p>Thank you for using CargoFlow!</p>\`
          );
          toast.success('Email notification sent to customer!');
        } catch (e: any) {
          console.error(e);
          toast.error('Failed to send email notification');
        }
      }`;

content = content.replace(targetStatus, replacementStatus);
fs.writeFileSync('src/components/EditShipmentModal.tsx', content);
