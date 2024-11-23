import React from 'react';
import { Alert } from 'react-bootstrap';
import { UploadError } from '../services/uploadService';

interface ErrorAlertProps {
    errors: UploadError[];
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errors }) => (
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
);

export default ErrorAlert;