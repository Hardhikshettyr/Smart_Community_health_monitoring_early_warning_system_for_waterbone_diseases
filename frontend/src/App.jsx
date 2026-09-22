import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import VerifyPage from './pages/VerifyPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import BulkCheckPage from './pages/BulkCheckPage';
import AboutPage from './pages/AboutPage';
import CommunityHealthPage from './pages/CommunityHealthPage';
import AdminHistoryPage from './pages/AdminHistoryPage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-500 selection:text-white">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/check" element={<DashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected User Routes */}
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Health Worker & Admin Routes */}
              <Route
                path="/bulk-check"
                element={
                  <ProtectedRoute requireHealthWorker>
                    <BulkCheckPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/community-health"
                element={
                  <ProtectedRoute requireHealthWorker>
                    <CommunityHealthPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin-Only Route */}
              <Route
                path="/admin/history"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminHistoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
