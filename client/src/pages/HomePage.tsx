import React from 'react';
import useAuth from '../hooks/useAuth';
import FileUpload from '../components/FileUpload';

const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <h2>Please log in to use the application.</h2>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <FileUpload />
        </div>
    );
};

export default HomePage;
