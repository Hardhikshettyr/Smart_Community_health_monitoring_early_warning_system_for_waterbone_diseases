import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export function ProtectedRoute({ children, requireHealthWorker = false, requireAdmin = false }) {
  const { user, loading, isAuthenticated, isHealthWorkerOrAdmin, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" label="Verifying security credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireHealthWorker && !isHealthWorkerOrAdmin) {
    return <Navigate to="/check" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/check" replace />;
  }

  return children;
}

export default ProtectedRoute;
