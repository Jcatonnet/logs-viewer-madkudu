import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

interface Error {
    lineNumber: number;
    error: string;
}

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Error[]>([]);
    const { getAccessToken } = useAuth();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        try {
            const token = await getAccessToken();
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                setErrors([]);
                alert('File uploaded and processed successfully.');
            }
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('An error occurred during file upload.');
            }
        }
    };

    return (
        <div>
            <h2>Upload CSV File</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".csv" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
            </form>
            {errors.length > 0 && (
                <div>
                    <h3>Errors Found:</h3>
                    <ul>
                        {errors.map((error) => (
                            <li key={error.lineNumber}>
                                Line {error.lineNumber}: {error.error}
                            </li>
                        ))}
                    </ul>
                    <p>Please correct the errors in the CSV file and try again.</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
