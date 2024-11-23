import apiClient from './apiClient';

export interface UploadError {
    lineNumber: number;
    error: string;
}

export const uploadFile = async (
    token: string,
    file: File,
    onUploadProgress: (progress: number) => void
) => {
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
            onUploadProgress(percentCompleted);
        },
    });

    return response.data;
};
