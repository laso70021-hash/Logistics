import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import TrackingPage from './pages/public/TrackingPage';
import LoginPage from './pages/public/LoginPage';
import SignUpPage from './pages/public/SignUpPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Private Pages - Customer
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerScanReceive from './pages/customer/CustomerScanReceive';

// Private Pages - Agent
import AgentDashboard from './pages/agent/AgentDashboard';
import RegisterPackage from './pages/agent/RegisterPackage';
import WarehouseInventory from './pages/agent/WarehouseInventory';
import ScanAndReceive from './pages/agent/ScanAndReceive';
import ProofOfDelivery from './pages/agent/ProofOfDelivery';
import AgentSettings from './pages/agent/AgentSettings';

// Private Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AgentManagement from './pages/admin/AgentManagement';
import MasterShipments from './pages/admin/MasterShipments';
import CustomerAccounts from './pages/admin/CustomerAccounts';
import ContentCMS from './pages/admin/ContentCMS';
import ExceptionManagement from './pages/admin/ExceptionManagement';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import AuditLogs from './pages/admin/AuditLogs';

import React from 'react';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { session, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check access
  if (allowedRoles) {
    const isSuperAdmin = session.user.id === '8c628e03-de74-4ca4-85a4-dfa218faac54' || profile?.role === 'super_admin';
    if (!isSuperAdmin && (!profile || !profile.role || !allowedRoles.includes(profile.role))) {
       return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

// Admin Route Redirect (for super admin)
const AdminRedirect = ({ children }: { children: React.ReactNode }) => {
  const { session, profile, isLoading } = useAuth();
  
  if (!isLoading && session && profile) {
    if (profile.id === '8c628e03-de74-4ca4-85a4-dfa218faac54' || profile.role === 'super_admin' || profile.role === 'admin') {
      // User is already on an admin route, or we should let them stay if they requested it? 
      // Actually this is to redirect super admin from login to admin
    }
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track/:trackingNumber?" element={<TrackingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['customer', 'agent', 'admin', 'super_admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CustomerDashboard />} />
        <Route path="receive" element={<CustomerScanReceive />} />
      </Route>

      {/* Agent Routes */}
      <Route path="/agent" element={
        <ProtectedRoute allowedRoles={['agent']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AgentDashboard />} />
        <Route path="register" element={<RegisterPackage />} />
        <Route path="warehouse" element={<WarehouseInventory />} />
        <Route path="scan" element={<ScanAndReceive />} />
        <Route path="proof" element={<ProofOfDelivery />} />
        <Route path="shipments" element={<MasterShipments />} />
        <Route path="settings" element={<AgentSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="agents" element={<AgentManagement />} />
        <Route path="shipments" element={<MasterShipments />} />
        <Route path="customers" element={<CustomerAccounts />} />
        <Route path="cms" element={<ContentCMS />} />
        <Route path="exceptions" element={<ExceptionManagement />} />
        <Route path="analytics" element={<AnalyticsReports />} />
        <Route path="logs" element={<AuditLogs />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
