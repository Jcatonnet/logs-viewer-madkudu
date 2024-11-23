import React from 'react';

import AppNavbar from './components/Navbar';

import useAuth from './hooks/useAuth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
