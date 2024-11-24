import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import FileUpload from '../components/FileUpload';
import LogsList from '../components/LogsList';
import LogGraph from '../components/LogGraph';

const HomePage: React.FC = () => {
    // const { isAuthenticated, login } = useAuth();
    const [refreshLogs, setRefreshLogs] = useState<boolean>(false);

    // if (!isAuthenticated) {
    //     console.log("here")
    //     return (
    //         <div className="text-center">
    //             <h2>Please log in to use the application.</h2>
    //             <button className="btn btn-primary" onClick={login}>
    //                 Log In
    //             </button>
    //         </div>
    //     );
    // }

    const handleUploadSuccess = () => {
        setRefreshLogs((prev) => !prev);
    };

    return (
        <div>
            <h1>Welcome to the Log Viewer Application</h1>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <LogGraph refreshLogs={refreshLogs} />
            <LogsList refreshLogs={refreshLogs} />
        </div>
    );
};

export default HomePage;
