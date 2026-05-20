import type { FC } from 'react';
import type { AlertDialogType } from '@/components/faculty/hooks';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AlertDialogModalProps {
    open: boolean;
    title?: string;
    message: string;
    type?: AlertDialogType;
    onClose: () => void;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

const AlertDialogModal: FC<AlertDialogModalProps> = ({
    open,
    title,
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmLabel = 'OK',
    cancelLabel = 'Cancel',
}) => {
    const isConfirmationType = type === 'confirm' || type === 'error';

    const defaultTitles: Record<string, string> = {
        info: 'Notice',
        success: 'Success',
        error: 'Confirm Action',
        confirm: 'Confirm Action',
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent 
                className="max-w-md rounded-2xl p-0 overflow-hidden shadow-2xl border-none"
            >
                <div className={`px-8 py-6 text-white bg-linear-to-r ${type === 'error' ? 'from-red-600 to-red-500' : type === 'success' ? 'from-emerald-600 to-emerald-500' : type === 'confirm' ? 'from-amber-500 to-amber-400' : 'from-blue-600 to-blue-500'}`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold tracking-tight">
                            {title ?? defaultTitles[type]}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                </div>
                <div className="px-8 py-8 text-center">
                    <AlertDialogDescription className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {message}
                    </AlertDialogDescription>
                </div>
                <div className="flex gap-3 justify-center px-8 py-5 bg-slate-50 border-t border-slate-100">
                    {isConfirmationType && (
                        <AlertDialogCancel
                            className="h-11 px-6 font-semibold text-slate-600 border-slate-300 hover:bg-slate-100 rounded-xl m-0"
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        className={`h-11 px-8 font-bold text-white shadow-lg rounded-xl transition-all active:scale-[0.98] border-none ${type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : type === 'confirm' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                        onClick={() => {
                            if (isConfirmationType && onConfirm) {
                                onConfirm();
                            }
                            onClose();
                        }}
                    >
                        {isConfirmationType ? confirmLabel : 'OK'}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogModal;
