import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p className="text-center my-5">Loading...</p>;
    }

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
