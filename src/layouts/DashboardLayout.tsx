import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  PackageSearch, LayoutDashboard, PackagePlus, Warehouse, 
  ScanLine, Package, Truck, FileText, Settings, Users,
  LogOut, ShieldAlert, Activity, ClipboardList, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  const agentLinks = [
    { name: 'Overview', to: '/agent', icon: LayoutDashboard, category: 'Dashboard' },
    { name: 'Register Package', to: '/agent/register', icon: PackagePlus, category: 'Operations & Warehouse' },
    { name: 'Warehouse Inventory', to: '/agent/warehouse', icon: Warehouse, category: 'Operations & Warehouse' },
    { name: 'Scan & Receive', to: '/agent/scan', icon: ScanLine, category: 'Operations & Warehouse' },
    { name: 'All Shipments', to: '/agent/shipments', icon: Package, category: 'Shipments & Tracking' },
    { name: 'Proof of Delivery', to: '/agent/proof', icon: FileText, category: 'Delivery & Proof' },
    { name: 'Settings', to: '/agent/settings', icon: Settings, category: 'Settings & Account' },
  ];

  const adminLinks = [
    { name: 'Overview', to: '/admin', icon: LayoutDashboard, category: 'Dashboard' },
    { name: 'Agents Directory', to: '/admin/agents', icon: Users, category: 'User & Agent Management' },
    { name: 'Customer Accounts', to: '/admin/customers', icon: Users, category: 'User & Agent Management' },
    { name: 'Homepage Editor', to: '/admin/cms', icon: FileText, category: 'Content & CMS' },
    { name: 'Master Shipments', to: '/admin/shipments', icon: Truck, category: 'Global Operations' },
    { name: 'Exception Management', to: '/admin/exceptions', icon: ShieldAlert, category: 'Global Operations' },
    { name: 'Analytics & Reports', to: '/admin/analytics', icon: Activity, category: 'System & Analytics' },
    { name: 'Audit Logs', to: '/admin/logs', icon: ClipboardList, category: 'System & Analytics' },
  ];

  const links = isAdmin ? adminLinks : agentLinks;

  // Group links by category
  const categories = Array.from(new Set(links.map(l => l.category)));

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold">
           <PackageSearch className="w-6 h-6 text-blue-600" />
           CargoFlow
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-500">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-gray-900 text-gray-300 w-64 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 md:static",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-800 bg-gray-950 font-bold text-xl text-white">
          <PackageSearch className="w-6 h-6 text-blue-500" />
          CargoFlow {isAdmin ? 'Admin' : 'Agent'}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-800">
          {categories.map((category, idx) => (
            <div key={idx} className="mb-6">
              <div className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category}
              </div>
              <ul className="space-y-1">
                {links.filter(l => l.category === category).map((link, i) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <li key={i}>
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                          isActive ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500" : "hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        <link.icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "text-gray-400")} />
                        {link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16 h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
