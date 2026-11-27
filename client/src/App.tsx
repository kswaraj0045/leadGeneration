import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OverviewPage } from './pages/OverviewPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { MatchingPage } from './pages/MatchingPage';
import { SavedWorkspacePage } from './pages/SavedWorkspacePage';
import { SavedSearchesPage } from './pages/SavedSearchesPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { IndustryExplorerPage } from './pages/IndustryExplorerPage';
import { GeographicInsightsPage } from './pages/GeographicInsightsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPage } from './pages/AdminPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-slate-500">Connecting to VIASET Workspace...</span>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-slate-500">Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/app/overview" replace />;
  return children;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirect /app to /app/overview */}
        <Route path="/app" element={<Navigate to="/app/overview" replace />} />

        {/* Intelligence & Discovery (Open Access) */}
        <Route path="/app/overview" element={<OverviewPage />} />
        <Route path="/app/discovery" element={<DiscoveryPage />} />
        <Route path="/app/matching" element={<MatchingPage />} />
        <Route path="/app/opportunities" element={<OpportunitiesPage />} />
        <Route path="/app/industries" element={<IndustryExplorerPage />} />
        <Route path="/app/geographic" element={<GeographicInsightsPage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />

        {/* Authenticated Workspace & Pipelines */}
        <Route
          path="/app/workspace"
          element={
            <ProtectedRoute>
              <SavedWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/searches"
          element={
            <ProtectedRoute>
              <SavedSearchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/subscription"
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
