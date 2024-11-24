import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import GraphsPage from './pages/GraphPage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [refreshLogs, setRefreshLogs] = useState<boolean>(false);

  const handleUploadSuccess = () => {
    setRefreshLogs((prev) => !prev);
  };

  if (isLoading) {
    return <p className="text-center my-5">Loading...</p>;
  }

  return (
    <Router>
      <>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={
                    <DashboardPage
                      onUploadSuccess={handleUploadSuccess}
                      refreshLogs={refreshLogs}
                    />
                  }
                />
              }
            />
            <Route
              path="/graphs"
              element={
                <ProtectedRoute
                  element={<GraphsPage refreshLogs={refreshLogs} />}
                />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
