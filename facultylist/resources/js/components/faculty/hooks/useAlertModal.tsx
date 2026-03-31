import { useState, useCallback } from 'react';

export type AlertType = 'info' | 'success' | 'error' | 'confirm';

export interface AlertModalState {
    open: boolean;
    title?: string;
    message: string;
    type: AlertType;
    onConfirm?: () => void;
}

export const useAlertModal = () => {
    const [alertModal, setAlertModal] = useState<AlertModalState>({
        open: false,
        message: '',
        type: 'info',
    });

    const showAlert = useCallback((message: string, type: Exclude<AlertType, 'confirm'> = 'info', title?: string) => {
        setAlertModal({
            open: true,
            message,
            type,
            title,
        });
    }, []);

    const showConfirm = useCallback((message: string, onConfirm: () => void, title: string = 'Confirm Action') => {
        setAlertModal({
            open: true,
            message,
            type: 'confirm',
            title,
            onConfirm: () => {
                onConfirm();
                setAlertModal((prev) => ({ ...prev, open: false }));
            },
        });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertModal((prev) => ({ ...prev, open: false }));
    }, []);

    return {
        alertModal,
        showAlert,
        showConfirm,
        closeAlert,
        setAlertModal,
    };
};
