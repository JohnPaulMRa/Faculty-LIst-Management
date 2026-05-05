/* eslint-disable @typescript-eslint/no-explicit-any */
// Vite touch: Re-evaluating FacultyListTableE2 after refactoring to ensure import resolution.

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, router } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import type { FC } from 'react';
import AlertDialogModal from '@/components/common/AlertDialogModal';

import { FacultyCopyDataModal } from '@/components/faculty/FacultyCopyDataModal';
import FacultyDownloadModal from '@/components/faculty/FacultyDownloadModal';
import FacultyListTableE2 from '@/components/faculty/facultyE2/FacultyListTableE2';
import FacultyListTableE5 from '@/components/faculty/facultyE5/FacultyListTableE5';
import FacultyFileDetailsModal from '@/components/faculty/FacultyFileDetailsModal';
import FacultyImportModal from '@/components/faculty/FacultyImportModal';
import { FacultyToolbar } from '@/components/faculty/FacultyToolbar';
import {
    useAlertDialog,
    useFacultyFilters,
    useFacultyActions,
    useFacultyModals
} from '@/components/faculty/hooks';
import { SubmitFacultyModal } from '@/components/faculty/SubmitFacultyModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';
import type { Faculty } from '@/types/faculty';

// Basic declaration for Ziggy's route helper

declare function route(name?: string, params?: any, absolute?: boolean): string;

const breadcrumbs: BreadcrumbItem[] = [];

interface FacultyProfileProps {
    initialFacultyData: Faculty[];
    filters: {
        search?: string;
        year?: string;
    };

    referenceData: any;
    availableYears?: string[];
    schoolName?: string;
    schoolType?: string;
}

const FacultyProfile: FC<FacultyProfileProps> = ({
    initialFacultyData = [],
    filters = {},
    referenceData,
    availableYears = [],
    schoolName = 'School Name',
    schoolType = 'private',
}) => {
    // --- Custom Hooks ---
    const { alertDialog, showAlert, showConfirm, closeDialog } = useAlertDialog();

    const {
        searchQuery,
        setSearchQuery,
        yearFilter,
        setYearFilter,
        filteredFacultyList,
        handleYearChange,
        isYearLocked,
    } = useFacultyFilters({ initialFacultyData, filters, availableYears: availableYears || [] });

    const {
        isImportModalOpen, setIsImportModalOpen,
        isDownloadModalOpen, setIsDownloadModalOpen,
        importType, setImportType,
        importGroup, setImportGroup,
        importYear, setImportYear,
        submitYear, setSubmitYear,
        isSubmitModalOpen, setIsSubmitModalOpen,
        selectedFile, setSelectedFile,
        isFileModalOpen, setIsFileModalOpen,
        isCopyModalOpen, setIsCopyModalOpen,
    } = useFacultyModals({ schoolType: schoolType || 'private' });

    const {
        handleSubmit,
        confirmSubmit,
        handleDelete,
        handleFileClick,
        handleEdit,
        handleUpdateFaculty,
        handleFileImport,
    } = useFacultyActions({
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
    });

    return (
        <>
            <AlertDialogModal
                open={alertDialog.open}
                message={alertDialog.message}
                type={alertDialog.type}
                title={alertDialog.title}
                onClose={closeDialog}
                onConfirm={alertDialog.onConfirm}
                confirmLabel={alertDialog.type === 'error' ? "Delete" : "Confirm"}
            />

            <SubmitFacultyModal
                isOpen={isSubmitModalOpen}
                onOpenChange={setIsSubmitModalOpen}
                submitYear={submitYear}
                setSubmitYear={setSubmitYear}
                availableYears={availableYears}
                onConfirmSubmit={confirmSubmit}
            />

            <FacultyFileDetailsModal
                isOpen={isFileModalOpen}
                onOpenChange={setIsFileModalOpen}
                faculty={selectedFile}
                onSave={handleUpdateFaculty}
                referenceData={referenceData}
            />

            <FacultyDownloadModal
                isOpen={isDownloadModalOpen}
                onOpenChange={setIsDownloadModalOpen}
                schoolType={schoolType}
            />

            <FacultyCopyDataModal
                isOpen={isCopyModalOpen}
                onOpenChange={setIsCopyModalOpen}
                availableYears={availableYears}
                onSuccess={() => {
                    showAlert('Successfully copied faculty data. Reloading page...', 'success');
                    router.reload({ only: ['initialFacultyData', 'availableYears'] });
                }}
            />

            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Faculty List Profile - CHED XII" />

                <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                    {/* HEADER */}
                    <div className="flex flex-col justify-between gap-4 p-2 lg:flex-row lg:items-center">
                        {/* LEFT: School Name */}
                        <div>
                            <h2 className="text-3xl font-bold text-[#202020]">{schoolName}</h2>
                        </div>

                        {/* RIGHT: Buttons */}
                        <div className="flex items-center gap-2">
                            <FacultyImportModal
                                isOpen={isImportModalOpen}
                                onOpenChange={setIsImportModalOpen}
                                importType={importType}
                                setImportType={(type) => {
                                    setImportType(type);
                                    setImportGroup('');
                                }}
                                importYear={importYear}
                                setImportYear={setImportYear}
                                onFileImport={handleFileImport}
                                schoolType={schoolType}
                            />

                            <Button
                                onClick={() => setIsDownloadModalOpen(true)}
                                className="bg-[#003468] hover:bg-[#002a54] gap-2 font-medium text-white shadow-sm rounded-md h-9 px-4"
                            >
                                <FileDown className="h-4 w-4" /> Download Template
                            </Button>
                        </div>
                    </div>

                    {/* DATA TABLE */}
                    <div className="flex flex-col rounded-none border border-blue-100/60 bg-white shadow-xl shadow-blue-900/5 overflow-hidden relative">


                        <FacultyToolbar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            yearFilter={yearFilter}
                            availableYears={availableYears}
                            onYearChange={handleYearChange}
                            onCopyData={() => setIsCopyModalOpen(true)}
                            onSubmit={handleSubmit}
                            isLocked={isYearLocked}
                        />

                        {schoolType?.toLowerCase() === 'private' ? (
                            <FacultyListTableE5
                                facultyList={filteredFacultyList}
                                yearFilter={yearFilter}
                                onDelete={handleDelete}
                                referenceData={referenceData}
                                isLocked={isYearLocked}
                            />
                        ) : (
                            <FacultyListTableE2
                                facultyList={filteredFacultyList}
                                yearFilter={yearFilter}
                                onDelete={handleDelete}
                                referenceData={referenceData}
                                isLocked={isYearLocked}
                            />
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default FacultyProfile;
