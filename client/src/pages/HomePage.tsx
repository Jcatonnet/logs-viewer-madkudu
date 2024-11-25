import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LogsList from '../components/LogsList';
import CustomToast from '../components/Toast';

const HomePage: React.FC = () => {
    const [refreshLogs, setRefreshLogs] = useState<boolean>(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleUploadSuccess = () => {
        setRefreshLogs((prev) => !prev);
    };

    const handleShowToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    return (
        <div>
            <h1>Welcome to the Log Viewer Application</h1>
            <FileUpload onShowToast={handleShowToast}
                onUploadSuccess={handleUploadSuccess} />
            <LogsList refreshLogs={refreshLogs} />
            <CustomToast
                show={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default HomePage;
