import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LogsList from '../components/LogsList';
import CustomToast from '../components/Toast';

interface DashboardPageProps {
    onUploadSuccess: () => void;
    refreshLogs: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onUploadSuccess, refreshLogs }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleShowToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <FileUpload
                onUploadSuccess={onUploadSuccess}
                onShowToast={handleShowToast}
            />
            <LogsList refreshLogs={refreshLogs} />
            <CustomToast
                show={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default DashboardPage;
