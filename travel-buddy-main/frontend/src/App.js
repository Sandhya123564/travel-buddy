import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/sonner';

// Pages
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import SearchBuddies from './pages/SearchBuddies';
import Login from './pages/Login';
import Register from './pages/Register';
import BuddyProfile from './pages/BuddyProfile';
import TravelerDashboard from './pages/TravelerDashboard';
import BuddyDashboard from './pages/BuddyDashboard';
import AdminPanel from './pages/AdminPanel';

// Protected Route Component
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
      <Route path="/search" element={<Layout><SearchBuddies /></Layout>} />
      <Route path="/buddy/:id" element={<Layout><BuddyProfile /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - Traveler */}
      <Route 
        path="/traveler/dashboard" 
        element={
          <ProtectedRoute roles={['traveler']}>
            <Layout><TravelerDashboard /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes - Buddy */}
      <Route 
        path="/buddy/dashboard" 
        element={
          <ProtectedRoute roles={['buddy']}>
            <Layout><BuddyDashboard /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes - Admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute roles={['admin']}>
            <Layout><AdminPanel /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
