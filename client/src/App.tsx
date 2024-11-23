import React from 'react';
import useAuth from './hooks/useAuth';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const { isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Log Viewer Application</h1>
        <button onClick={login}>Log In</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Log Viewer Application</h1>
      <button onClick={logout}>Log Out</button>
      <FileUpload />
    </div>
  );
};

export default App;
