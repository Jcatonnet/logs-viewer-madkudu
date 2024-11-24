import React from 'react';
import { Toast as BootstrapToast, ToastContainer } from 'react-bootstrap';

interface CustomToastProps {
    show: boolean;
    message: string;
    onClose: () => void;
    variant?: string;
    title?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
    show,
    message,
    onClose,
    variant = 'success',
}) => {
    return (
        <ToastContainer position="top-center" className="p-3">
            <BootstrapToast
                show={show}
                onClose={onClose}
                delay={3000}
                autohide
                bg={variant}
            >
                <BootstrapToast.Body className='text-white'>{message}</BootstrapToast.Body>
            </BootstrapToast>
        </ToastContainer>
    );
};

export default CustomToast;