const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetImports = "// Private Pages - Agent";
const replacementImports = `// Private Pages - Customer
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerScanReceive from './pages/customer/CustomerScanReceive';

// Private Pages - Agent`;

content = content.replace(targetImports, replacementImports);

const targetRoutes = "{/* Agent Routes */}";
const replacementRoutes = `{/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['customer', 'agent', 'admin', 'super_admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CustomerDashboard />} />
        <Route path="receive" element={<CustomerScanReceive />} />
      </Route>

      {/* Agent Routes */}`;

content = content.replace(targetRoutes, replacementRoutes);
fs.writeFileSync('src/App.tsx', content);
