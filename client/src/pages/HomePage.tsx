import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LogsList from '../components/LogsList';

const HomePage: React.FC = () => {
    const [refreshLogs, setRefreshLogs] = useState<boolean>(false);
    const handleUploadSuccess = () => {
        setRefreshLogs((prev) => !prev);
    };

    return (
        <div>
            <h1>Welcome to the Log Viewer Application</h1>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <LogsList refreshLogs={refreshLogs} />
        </div>
    );
};

export default HomePage;
