// src/components/FileUpload.tsx

import React, { useState } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';

import useAuth from '../hooks/useAuth';
import apiClient from '../services/apiClient';

interface Error {
    lineNumber: number;
    error: string;
}

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Error[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
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

            const response = await apiClient.post('/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total!
                    );
                    setUploadProgress(percentCompleted);
                },
            });

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
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        required
                        accept=".csv"
                    />
                </Form.Group>
                <Button type="submit" disabled={!file}>
                    Upload
                </Button>
            </Form>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
            )}
            {errors.length > 0 && (
                <Alert variant="danger" className="mt-3">
                    <h4>Errors Found:</h4>
                    <ul>
                        {errors.map((error) => (
                            <li key={error.lineNumber}>
                                Line {error.lineNumber}: {error.error}
                            </li>
                        ))}
                    </ul>
                    <p>Please correct the errors in the CSV file and try again.</p>
                </Alert>
            )}
        </div>
    );
};

export default FileUpload;
