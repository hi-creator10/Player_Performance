
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { OfflineProvider } from './contexts/OfflineContext.jsx';
import { ErrorBoundary, RouteWrapper, NotFound } from './components';
import OfflineIndicator from './components/shared/OfflineIndicator.jsx';
import { ProtectedRoute } from './components/auth/index.js';
import { HomePage, LandingPage, CoachPage, PlayerPage } from './pages/index.js';

/**
 * Main App component with routing configuration
 * Requirements: 1.4, 1.5, 1.7 - Role-based route protection, navigation, and loading states
 */
function App() {
  return (
    <ErrorBoundary>
      <OfflineProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <OfflineIndicator />
              <RouteWrapper>
                <Routes>
                  {/* Public landing page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Public route - Auth page */}
                  <Route 
                    path="/login" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <HomePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Coach route */}
                  <Route 
                    path="/coach" 
                    element={
                      <ProtectedRoute requiredRole="coach">
                        <CoachPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Player route */}
                  <Route 
                    path="/player" 
                    element={
                      <ProtectedRoute requiredRole="player">
                        <PlayerPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all for invalid routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RouteWrapper>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </OfflineProvider>
    </ErrorBoundary>
  );
}

export default App;
