import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

interface AlertModalProps {
    open: boolean;
    title?: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'confirm';
    onClose: () => void;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

const AlertModal: FC<AlertModalProps> = ({
    open,
    title,
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmLabel = 'OK',
    cancelLabel = 'Cancel',
}) => {
    const isConfirm = type === 'confirm';

    const titleColor: Record<string, string> = {
        info: 'text-blue-600',
        success: 'text-emerald-600',
        error: 'text-red-600',
        confirm: 'text-yellow-600',
    };

    const defaultTitles: Record<string, string> = {
        info: 'Notice',
        success: 'Success',
        error: 'Error',
        confirm: 'Confirm Action',
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent 
                className="max-w-md rounded-2xl p-0 overflow-hidden shadow-2xl border-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className={`px-8 py-6 text-white bg-linear-to-r ${type === 'error' ? 'from-red-600 to-red-500' : type === 'success' ? 'from-emerald-600 to-emerald-500' : type === 'confirm' ? 'from-amber-500 to-amber-400' : 'from-blue-600 to-blue-500'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            {title ?? defaultTitles[type]}
                        </DialogTitle>
                    </DialogHeader>
                </div>
                <div className="px-8 py-8">
                    <DialogDescription className="text-base text-gray-700 leading-relaxed">
                        {message}
                    </DialogDescription>
                </div>
                <div className="flex gap-3 justify-end px-8 py-5 bg-slate-50 border-t border-slate-100">
                    {isConfirm && (
                        <Button
                            variant="outline"
                            className="h-11 px-6 font-semibold text-slate-600 border-slate-300 hover:bg-slate-100 rounded-xl"
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </Button>
                    )}
                    <Button
                        type="button"
                        className={`h-11 px-8 font-bold text-white shadow-lg rounded-xl transition-all active:scale-[0.98] ${type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : type === 'confirm' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isConfirm && onConfirm) {
                                onConfirm();
                            }
                            onClose();
                        }}
                    >
                        {isConfirm ? confirmLabel : 'OK'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AlertModal;
