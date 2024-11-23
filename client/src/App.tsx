import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import GraphsPage from './pages/GraphPage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [refreshLogs, setRefreshLogs] = useState<boolean>(false);

  const handleUploadSuccess = () => {
    setRefreshLogs((prev) => !prev);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardPage onUploadSuccess={handleUploadSuccess} refreshLogs={refreshLogs} />}
          />
          <Route path="/graphs" element={<GraphsPage refreshLogs={refreshLogs} />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
