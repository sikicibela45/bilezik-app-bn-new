import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Workshops from './pages/Workshops';
import Orders from './pages/Orders';
import Templates from './pages/Templates';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './lib/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Workshops />} />
            <Route path="orders" element={<Orders />} />
            <Route path="templates" element={<Templates />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
