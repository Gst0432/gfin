import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Services from '../pages/Services';
import Sales from '../pages/Sales';
import Settings from '../pages/Settings';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminSubscriptions from '../pages/admin/Subscriptions';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminNotifications from '../pages/admin/Notifications';
import AdminSettings from '../pages/admin/Settings';
import UserDetails from '../pages/admin/UserDetails/UserDetails';
import UserSales from '../pages/admin/UserDetails/UserSales';
import UserGoals from '../pages/admin/UserDetails/UserGoals';
import UserDigitalLinks from '../pages/admin/UserDetails/UserDigitalLinks';
import UserSubscriptionSales from '../pages/admin/UserDetails/UserSubscriptionSales';
import SubscriptionSales from '../pages/SubscriptionSales';
import Expenses from '../pages/Expenses';
import SalesGoals from '../pages/SalesGoals';
import DigitalLinks from '../pages/DigitalLinks';
import Reports from '../pages/Reports';

// Import company pages
import About from '../pages/company/About';
import Blog from '../pages/company/Blog';
import FAQ from '../pages/company/FAQ';
import Features from '../pages/company/Features';
import Pricing from '../pages/company/Pricing';

// Import legal pages
import Legal from '../pages/legal/Legal';
import Privacy from '../pages/legal/Privacy';
import Terms from '../pages/legal/Terms';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

const PrivateRoute = ({ children, adminRequired = false }: PrivateRouteProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && user.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Company pages */}
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Legal pages */}
      <Route path="/legal" element={<Legal />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Protected user routes */}
      <Route path="/app" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="services" element={<Services />} />
        <Route path="sales" element={<Sales />} />
        <Route path="subscription-sales" element={<SubscriptionSales />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="goals" element={<SalesGoals />} />
        <Route path="digital-links" element={<DigitalLinks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Protected admin routes */}
      <Route path="/admin" element={<PrivateRoute adminRequired><DashboardLayout isAdmin /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<UserDetails />} />
        <Route path="users/:userId/sales" element={<UserSales />} />
        <Route path="users/:userId/goals" element={<UserGoals />} />
        <Route path="users/:userId/digital-links" element={<UserDigitalLinks />} />
        <Route path="users/:userId/subscriptions" element={<UserSubscriptionSales />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Redirect authenticated users */}
      <Route path="/" element={
        user ? (
          <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />
        ) : (
          <Landing />
        )
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;