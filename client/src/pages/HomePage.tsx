import React from 'react';
import useAuth from '../hooks/useAuth';
import FileUpload from '../components/FileUpload';
import LogsList from '../components/LogsList';

const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <h2>Please log in to use the application.</h2>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <FileUpload />
            <LogsList />
        </div>
    );
};

export default HomePage;
