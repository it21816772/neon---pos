import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import POSPage from './pages/POSPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
// authentication disabled - session store import left commented for future use
// import { useSessionStore } from './store/sessionStore';
import { StatusBar } from './components/layout/StatusBar';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // Authentication is disabled for this workspace at the user's request.
  // The app will allow access to protected routes without a login. If you
  // later want to re-enable auth, restore the previous user checks.
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-midnight text-white bg-cyber-gradient selection:bg-neon-cyan/40">
      <StatusBar />
      <Suspense fallback={<div className="p-8 text-center text-neon-cyan">Booting POS interface…</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <POSPage />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/pos" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

