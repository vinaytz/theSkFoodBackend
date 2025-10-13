import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Lazy load pages for better performance
const Home = React.lazy(() => import('@/pages/Home'));
const MealBuilder = React.lazy(() => import('@/pages/MealBuilder'));
const Checkout = React.lazy(() => import('@/pages/Checkout'));
const Orders = React.lazy(() => import('@/pages/Orders'));
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const AdminMenu = React.lazy(() => import('@/pages/AdminMenu'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route wrapper (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/meal-builder/:mealType"
          element={
            <ProtectedRoute>
              <MealBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<AdminMenu />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;