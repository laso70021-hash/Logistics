const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/MasterShipments.tsx', 'utf8');

// Imports
content = content.replace("import { useAuth } from '../../hooks/useAuth';", "import { useAuth } from '../../hooks/useAuth';\nimport EditShipmentModal from '../../components/EditShipmentModal';");

// State
content = content.replace("const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';", "const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';\n  const [editingShipment, setEditingShipment] = useState<any>(null);");

// Table Header
content = content.replace("{isAdmin && <th className=\"px-6 py-4 font-medium\">Actions</th>}", "<th className=\"px-6 py-4 font-medium\">Actions</th>");

// Table Row Actions
content = content.replace("{isAdmin && (\n                      <td className=\"px-6 py-4 text-sm\">\n                         <button className=\"text-blue-600 hover:text-blue-800 font-medium\">Manage</button>\n                      </td>\n                    )}", "                    <td className=\"px-6 py-4 text-sm\">\n                         <button onClick={() => setEditingShipment(s)} className=\"text-blue-600 hover:text-blue-800 font-medium\">Manage</button>\n                      </td>");

// Modal rendering before last </div>
content = content.replace("    </div>\n  );\n}", "      {editingShipment && (\n        <EditShipmentModal\n          shipment={editingShipment}\n          onClose={() => setEditingShipment(null)}\n          onUpdate={fetchShipments}\n          agentId={profile?.id}\n        />\n      )}\n    </div>\n  );\n}");

fs.writeFileSync('src/pages/admin/MasterShipments.tsx', content);
