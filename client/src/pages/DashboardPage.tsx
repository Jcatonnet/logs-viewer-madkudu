import React from 'react';
import FileUpload from '../components/FileUpload';
import LogsList from '../components/LogsList';

interface DashboardPageProps {
    onUploadSuccess: () => void;
    refreshLogs: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onUploadSuccess, refreshLogs }) => {
    return (
        <div>
            <h2>Dashboard</h2>
            <FileUpload onUploadSuccess={onUploadSuccess} />
            <LogsList refreshLogs={refreshLogs} />
        </div>
    );
};

export default DashboardPage;
