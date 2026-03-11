import { FC } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
                className="max-w-sm rounded-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className={titleColor[type]}>
                        {title ?? defaultTitles[type]}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-700 pt-1">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 justify-end pt-2">
                    {isConfirm && (
                        <Button
                            variant="outline"
                            className="rounded-none"
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </Button>
                    )}
                    <Button
                        type="button"
                        className={`rounded-none ${type === 'error' ? 'bg-red-600 hover:bg-red-700' : type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : type === 'confirm' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('AlertModal: Button clicked', { isConfirm, hasOnConfirm: !!onConfirm });
                            if (isConfirm && onConfirm) {
                                console.log('AlertModal: Executing onConfirm');
                                onConfirm();
                            }
                            onClose();
                        }}
                    >
                        {isConfirm ? confirmLabel : 'OK'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AlertModal;
