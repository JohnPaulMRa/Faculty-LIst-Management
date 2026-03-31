import { router } from '@inertiajs/react';
import type { AlertType } from '@/components/faculty/hooks';
import { useFacultyImport } from '@/components/faculty/useFacultyImport';
import { edit } from '@/routes/faculty';
import type { Faculty } from '@/types/faculty';

export interface UseFacultyActionsProps {
    // From useAlertModal
    showAlert: (message: string, type?: Exclude<AlertType, 'confirm'>, title?: string) => void;
    showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
    
    // From useFacultyModals
    setIsSubmitModalOpen: (open: boolean) => void;
    setIsFileModalOpen: (open: boolean) => void;
    setIsImportModalOpen: (open: boolean) => void;
    setSelectedFile: (file: Faculty | null) => void;
    setImportGroup: (group: string) => void;
    submitYear: string;
    importType: 'E2' | 'E5';
    importGroup: string;
    importYear: string;
    
    // From useFacultyFilters
    searchQuery: string;
    setYearFilter: (year: string) => void;
}

// Basic declaration for Ziggy's route helper if not imported
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function route(name?: string, params?: any, absolute?: boolean): string;

export const useFacultyActions = ({
    showAlert,
    showConfirm,
    setIsSubmitModalOpen,
    setIsFileModalOpen,
    setIsImportModalOpen,
    setSelectedFile,
    setImportGroup,
    submitYear,
    importType,
    importGroup,
    importYear,
    searchQuery,
    setYearFilter,
}: UseFacultyActionsProps) => {

    const handleSubmit = () => {
        setIsSubmitModalOpen(true);
    };

    const confirmSubmit = () => {
        if (!submitYear) {
            showAlert('Please select a specific Academic Year before submitting.', 'info', 'Notice');
            return;
        }
        setIsSubmitModalOpen(false);
        showConfirm(
            `Are you sure you want to SUBMIT the faculty list for ${submitYear}? This will mark records as Submitted.`,
            () => {
                router.post(
                    route ? route('faculty.submit') : '/faculty/submit',
                    { year: submitYear },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onSuccess: (page: any) => {
                            if (page.props.flash?.error) {
                                showAlert(page.props.flash.error, 'error');
                                return;
                            }
                            showAlert(page.props.flash?.success || 'Faculty list submitted successfully!', 'success');
                        },
                        onError: () => showAlert('Failed to submit faculty list.', 'error'),
                    }
                );
            },
            'Submit Faculty List'
        );
    };

    const handleDelete = (id: string): void => {
        showConfirm(
            'Delete this record? This action cannot be undone.',
            () => {
                router.delete(`/faculty/${id}`, {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSuccess: (page: any) => {
                        if (page.props.flash?.error) {
                            showAlert(page.props.flash.error, 'error', 'Delete Failed');
                        } else {
                            showAlert(page.props.flash?.success || 'Record deleted successfully.', 'success');
                        }
                    },
                    onError: () => showAlert('Failed to delete faculty. Please check connection.', 'error'),
                });
            },
            'Delete Record'
        );
    };

    const handleFileClick = (faculty: Faculty): void => {
        setSelectedFile(faculty);
        setIsFileModalOpen(true);
    };

    const handleEdit = (faculty: Faculty) => {
        router.visit(edit(faculty.id).url);
    };

    const handleUpdateFaculty = (updatedFaculty: Faculty) => {
        router.put(`/faculty/${updatedFaculty.id}`, updatedFaculty, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSuccess: (page: any) => {
                if (page.props.flash?.error) {
                    showAlert(page.props.flash.error, 'error', 'Update Failed');
                    return;
                }
                showAlert(page.props.flash?.success || 'Faculty details updated successfully.', 'success');
                setIsFileModalOpen(false);
                setSelectedFile(updatedFaculty);
            },
            onError: () => showAlert('Failed to update faculty details.', 'error'),
        });
    };

    // Import hook integration
    const { handleFileImport } = useFacultyImport({
        importType,
        importGroup,
        importYear,
        searchQuery,
        showAlert,
        showConfirm,
        setIsImportModalOpen,
        setImportGroup,
        setYearFilter,
    });

    return {
        handleSubmit,
        confirmSubmit,
        handleDelete,
        handleFileClick,
        handleEdit,
        handleUpdateFaculty,
        handleFileImport,
    };
};
