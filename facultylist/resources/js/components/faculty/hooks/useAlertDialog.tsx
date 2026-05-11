import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type AlertDialogType = 'info' | 'success' | 'error' | 'confirm';

export interface AlertDialogState {
    open: boolean;
    title?: string;
    message: string;
    type: AlertDialogType;
    onConfirm?: () => void;
}

export const useAlertDialog = () => {
    const [alertDialog, setAlertDialog] = useState<AlertDialogState>({
        open: false,
        message: '',
        type: 'info',
    });

    const showAlert = useCallback((message: string, type: Exclude<AlertDialogType, 'confirm'> = 'info', title?: string) => {
        const fullMessage = title ? `${title}: ${message}` : message;
        
        switch (type) {
            case 'success':
                toast.success(fullMessage);
                break;
            case 'error':
                toast.error(fullMessage);
                break;
            case 'info':
            default:
                toast.info(fullMessage);
                break;
        }
    }, []);

    const showConfirm = useCallback((message: string, onConfirm: () => void, title: string = 'Confirm Action', type: AlertDialogType = 'confirm') => {
        setAlertDialog({
            open: true,
            message,
            type,
            title,
            onConfirm: () => {
                onConfirm();
                setAlertDialog((prev) => ({ ...prev, open: false }));
            },
        });
    }, []);

    const closeDialog = useCallback(() => {
        setAlertDialog((prev) => ({ ...prev, open: false }));
    }, []);

    return {
        alertDialog,
        showAlert,
        showConfirm,
        closeDialog,
        setAlertDialog,
    };
};
