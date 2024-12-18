import React, { useState } from 'react';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import { uploadFile, UploadError } from '../services/uploadService';
import useAuth from '../hooks/useAuth';
import ErrorAlert from './ErrorAlert';

interface FileUploadProps {
    onUploadSuccess: () => void;
    onShowToast: (message: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onShowToast }) => {
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<UploadError[]>([]);
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
            setUploadProgress(0);
            const data = await uploadFile(token, file, setUploadProgress);

            if (data.errors) {
                setErrors(data.errors);
            } else {
                setErrors([]);
                onShowToast('File uploaded and processed successfully!');
                onUploadSuccess();
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('An error occurred during file upload.');
            }
        }
    };

    return (
        <div className='mt-4'>
            <h4>Upload CSV File</h4>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center mb-4 mt-2 gap-2">

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
                </div>
            </Form>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
            )}
            {errors.length > 0 && <ErrorAlert errors={errors} />}
        </div>
    );
};

export default FileUpload;
