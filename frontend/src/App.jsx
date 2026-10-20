import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Store from './pages/Store';
import CardDetail from './pages/CardDetail';
import Admin from './pages/Admin';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

// VULNERABILITY (client-side BAC): admin area is gated only by this UI check.
// The backend never really verifies the role — see VULNERABILITIES.md #8.
function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/store" element={<Protected><Store /></Protected>} />
          <Route path="/cards/:id" element={<Protected><CardDetail /></Protected>} />
          <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        IDFC FIRST Gift Card Portal — security testing lab. Intentionally vulnerable; do not deploy.
      </footer>
    </div>
  );
}
