import { Head, router, usePage } from '@inertiajs/react';
import AlertModal from '@/components/common/AlertModal';
import { FileDown } from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo } from 'react';

import FacultyDownloadModal from '@/components/faculty/FacultyDownloadModal';
import FacultyListTableE5 from '@/components/faculty/facultyE5/FacultyListTableE5';
import FacultyListTableE2 from '@/components/faculty/facultyE2/FacultyListTableE2';
import FacultyFileDetailsModal from '@/components/faculty/FacultyFileDetailsModal';
import FacultyImportModal from '@/components/faculty/FacultyImportModal';
import { FacultyCopyDataModal } from '@/components/faculty/FacultyCopyDataModal';
import { SubmitFacultyModal } from '@/components/faculty/SubmitFacultyModal';
import { FacultyToolbar } from '@/components/faculty/FacultyToolbar';
import { useFacultyImport } from '@/components/faculty/useFacultyImport';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

import { getCurrentAcademicYear } from '@/lib/utils';
import type { Faculty } from '@/types/faculty';
import { edit } from '@/routes/faculty';

// Basic declaration for Ziggy's route helper
declare function route(name?: string, params?: any, absolute?: boolean): string;

import type { BreadcrumbItem } from '@/types';

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
    usePage<any>().props; // keep academicYears available if needed by child components

    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const initialYear =
        filters.year || (availableYears && availableYears.length > 0 ? availableYears[0] : getCurrentAcademicYear());
    const [yearFilter, setYearFilter] = useState<string>(initialYear);

    // --- Client-side filtered list ---
    const filteredFacultyList = useMemo(() => {
        let list = initialFacultyData;

        if (yearFilter) {
            list = list.filter((f) => f.joined_year === yearFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (f) =>
                    (f.name && f.name.toLowerCase().includes(q)) ||
                    (f.degree && f.degree.toLowerCase().includes(q)) ||
                    (f.form_type === 'E2' && f.rank && f.rank.toLowerCase().includes(q)) ||
                    (f.form_type === 'E2' && f.import_group && f.import_group.toLowerCase().includes(q)) ||
                    (f.form_type === 'E5' && f.rankCode && f.rankCode.toLowerCase().includes(q))
            );
        }

        return list;
    }, [initialFacultyData, yearFilter, searchQuery]);

    // --- Modal / UI state ---
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>(schoolType?.toLowerCase() === 'public' ? 'E2' : 'E5');
    const [importGroup, setImportGroup] = useState<string>('');
    const [importYear, setImportYear] = useState<string>(getCurrentAcademicYear());
    const [submitYear, setSubmitYear] = useState<string>(getCurrentAcademicYear());
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<Faculty | null>(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);

    // --- Alert / Confirm modal ---
    const [alertModal, setAlertModal] = useState<{
        open: boolean;
        title?: string;
        message: string;
        type: 'info' | 'success' | 'error' | 'confirm';
        onConfirm?: () => void;
    }>({ open: false, message: '', type: 'info' });

    const showAlert = (message: string, type: 'info' | 'success' | 'error' = 'info', title?: string) => {
        setAlertModal({ open: true, message, type, title });
    };

    const showConfirm = (message: string, onConfirm: () => void, title?: string) => {
        setAlertModal({ open: true, message, type: 'confirm', onConfirm, title });
    };

    // --- Submit handlers ---
    const handleSubmit = () => {
        setSubmitYear('');
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
                    route('faculty.submit'),
                    { year: submitYear },
                    {
                        preserveState: true,
                        preserveScroll: true,
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

    // --- Delete handler ---
    const handleDelete = (id: string): void => {
        showConfirm(
            'Delete this record? This action cannot be undone.',
            () => {
                router.delete(`/faculty/${id}`, {
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

    // --- File detail handlers ---
    const handleFileClick = (faculty: Faculty): void => {
        setSelectedFile(faculty);
        setIsFileModalOpen(true);
    };

    const handleEdit = (faculty: Faculty) => {
        router.visit(edit(faculty.id).url);
    };

    const handleUpdateFaculty = (updatedFaculty: Faculty) => {
        router.put(`/faculty/${updatedFaculty.id}`, updatedFaculty, {
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

    // --- Import hook ---
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

    // --- Year change (toolbar) ---
    const handleYearChange = (year: string) => {
        setYearFilter(year);
        router.get(route('facultyprofile'), { search: searchQuery, year }, { preserveScroll: true });
    };

    return (
        <>
            <AlertModal
                open={alertModal.open}
                message={alertModal.message}
                type={alertModal.type}
                title={alertModal.title}
                onClose={() => setAlertModal((prev) => ({ ...prev, open: false }))}
                onConfirm={alertModal.onConfirm}
                confirmLabel="Confirm"
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
                                importGroup={importGroup}
                                setImportGroup={setImportGroup}
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
                    <div className="flex flex-col rounded-none border border-gray-300 bg-white shadow-sm overflow-hidden">
                        <FacultyToolbar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            yearFilter={yearFilter}
                            availableYears={availableYears}
                            onYearChange={handleYearChange}
                            onCopyData={() => setIsCopyModalOpen(true)}
                            onSubmit={handleSubmit}
                        />

                        {schoolType?.toLowerCase() === 'private' ? (
                            <FacultyListTableE5
                                facultyList={filteredFacultyList}
                                yearFilter={yearFilter}
                                onFileClick={handleFileClick}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                referenceData={referenceData}
                            />
                        ) : (
                            <FacultyListTableE2
                                facultyList={filteredFacultyList}
                                yearFilter={yearFilter}
                                onFileClick={handleFileClick}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                referenceData={referenceData}
                            />
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default FacultyProfile;
