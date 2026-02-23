import { Head, router, usePage } from '@inertiajs/react';
import AlertModal from '@/components/common/AlertModal';
import {
    ScrollText,
    Calendar,
    FileDown,
    FileSpreadsheet,
    Search
} from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';

import FacultyDownloadModal from '@/components/faculty/FacultyDownloadModal';
import FacultyListTableE2 from '@/components/faculty/facultyE2/FacultyListTableE2';
import FacultyListTableE5 from '@/components/faculty/facultyE5/FacultyListTableE5';
import FacultyFileDetailsModal from '@/components/faculty/FacultyFileDetailsModal';
import FacultyImportModal from '@/components/faculty/FacultyImportModal';
import { FacultyCopyDataModal } from '@/components/faculty/FacultyCopyDataModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

import { getCurrentAcademicYear } from '@/lib/utils';
import type { Faculty } from '@/types/faculty';
import { IMPORT_GROUP_OPTIONS } from '@/types/faculty';

// Basic declaration for Ziggy's route helper
declare function route(name?: string, params?: any, absolute?: boolean): string;

const breadcrumbs = [
    { title: 'Faculty', href: '/faculty-profile' },
];

interface FacultyProfileProps {
    initialFacultyData: Faculty[];
    filters: {
        search?: string;
        year?: string;
    };
    referenceData: any;
    availableYears?: string[];
    schoolName?: string;
}

const FacultyProfile: FC<FacultyProfileProps> = ({ initialFacultyData = [], filters = {}, referenceData, availableYears = [], schoolName = 'School Name' }) => {
    const { academicYears } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const initialYear = filters.year || (availableYears && availableYears.length > 0 ? availableYears[0] : getCurrentAcademicYear());
    const [yearFilter, setYearFilter] = useState<string>(initialYear);

    // Client-side filtered list based on yearFilter and searchQuery
    const filteredFacultyList = useMemo(() => {
        let list = initialFacultyData;

        // Filter by year
        if (yearFilter) {
            list = list.filter(f => f.joined_year === yearFilter);
        }

        // Filter by search query (name, degree, rank)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(f =>
                (f.name && f.name.toLowerCase().includes(q)) ||
                (f.degree && f.degree.toLowerCase().includes(q)) ||
                (f.rank && f.rank.toLowerCase().includes(q))
            );
        }

        return list;
    }, [initialFacultyData, yearFilter, searchQuery]);

    // --- STATE ---
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>('E5');
    const [importGroup, setImportGroup] = useState<string>('');
    const [importYear, setImportYear] = useState<string>(getCurrentAcademicYear());
    const [submitYear, setSubmitYear] = useState<string>(getCurrentAcademicYear());
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<Faculty | null>(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);

    // Alert/Confirm modal state
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

    const handleRetrieval = () => {
        setIsCopyModalOpen(true);
    };

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
            `Are you sure you want to SUBMIT the faculty list for ${submitYear}? This will mark records as Completed.`,
            () => {
                console.log('facultyprofile: Sending submit request for year:', submitYear);
                router.post(route('faculty.submit'), {
                    year: submitYear
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page: any) => {
                        console.log('facultyprofile: Submit responded');
                        if (page.props.flash?.error) {
                            showAlert(page.props.flash.error, 'error');
                            return;
                        }
                        showAlert(page.props.flash?.success || 'Faculty list submitted successfully!', 'success');
                    },
                    onError: (errors) => {
                        console.error('facultyprofile: Submit failed', errors);
                        showAlert('Failed to submit faculty list.', 'error');
                    },
                    onFinish: () => console.log('facultyprofile: Submit request finished'),
                });
            },
            'Submit Faculty List'
        );
    };

    const handleFileImport = async (file: File): Promise<void> => {
        // Use selected group for E2 (A groups), undefined for E5
        const detectedGroup = importType === 'E2' ? importGroup : undefined;

        // Validation for E2: require group
        if (importType === 'E2' && !detectedGroup) {
            showAlert('Please select a Group for Form E2 import.', 'info', 'Notice');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;

            const { read, utils } = await import("xlsx");
            const workbook = read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

            // Find title row ("Name of Faculty") then check for sub-header row ("Last Name")
            const titleRowIndex = jsonData.findIndex((row: any) =>
                row.some((cell: any) =>
                    cell &&
                    (cell.toString().toLowerCase().includes("name of faculty") ||
                        cell.toString().toLowerCase().includes("faculty name"))
                )
            );

            // Check if the row after the title is a sub-header row (contains "last name")
            let startIndex = 1;
            if (titleRowIndex !== -1) {
                const nextRow: any = jsonData[titleRowIndex + 1];
                const isSubHeaderRow = nextRow && nextRow.some((cell: any) =>
                    cell && cell.toString().toLowerCase().includes("last name")
                );
                startIndex = isSubHeaderRow ? titleRowIndex + 2 : titleRowIndex + 1;
            }

            const rows = jsonData.slice(startIndex) as any[];

            if (rows.length === 0) {
                showAlert('File appears to be empty.', 'error', 'Import Error');
                return;
            }

            // Map data based on type
            const mappedData = rows.map((row: any) => {
                if (importType === 'E5') {
                    // Template columns (Row 2 sub-headers):
                    // A(0)=Last Name, B(1)=First Name, C(2)=Middle Name, D(3)=blank
                    // E(4)=Gender, F(5)=Full-Time/Part-Time, G(6)=Discipline Code
                    // H(7)=Degree, I(8)=Rank
                    // J(9)=Bachelors, K(10)=Masters, L(11)=Doctorate
                    // M(12)=License, N(13)=Tenure, O(14)=Salary Grade, P(15)=Load, Q(16)=Subjects

                    const lastName = row[0]?.toString().trim() || '';
                    const firstName = row[1]?.toString().trim() || '';
                    const middleName = row[2]?.toString().trim() || '';
                    const fullName = [lastName, firstName, middleName].filter(Boolean).join(', ');

                    const fullTimeCode = row[5]?.toString();

                    return {
                        name: fullName,
                        fullTimeCode: fullTimeCode,
                        genderCode: row[4]?.toString(),
                        disciplineCode: row[6]?.toString(),
                        degree: row[7]?.toString(),

                        // Education Specifics
                        bachelorsCode: row[9]?.toString(),
                        mastersCode: row[10]?.toString(),
                        doctorateCode: row[11]?.toString(),

                        licenseCode: row[12]?.toString(),
                        tenureCode: row[13]?.toString(),
                        rankCode: row[8]?.toString(),
                        salaryCode: row[14]?.toString(),
                        loadCode: row[15]?.toString(),
                        subjects: row[16]?.toString() || '',

                        // Default required fields for DB
                        email: `imported.${Date.now()}.${Math.floor(Math.random() * 1000)}@placeholder.com`,
                        form_type: 'E5',
                        joined_year: importYear,
                        status: 'Not Updated',
                        employment: null,
                        avatar_initials: (lastName.substring(0, 1) + firstName.substring(0, 1)).toUpperCase() || 'NA'
                    };
                } else {
                    // E2 Mapping
                    return {
                        name: row[1], // ID is 0
                        rank: row[2],
                        degree: row[3],
                        status: row[4] || 'Not Yet Completed',
                        joined_year: importYear,
                        form_type: 'E2',
                        import_group: detectedGroup,
                        email: `imported.e2.${Date.now()}.${Math.floor(Math.random() * 1000)}@placeholder.com`,
                        avatar_initials: row[1]?.substring(0, 2).toUpperCase() || 'NA'
                    };
                }
            }).filter(item => item.name); // Filter empty rows

            if (mappedData.length === 0) {
                showAlert('No valid records found in the uploaded file. Please check the template provided.', 'error', 'Import Error');
                return;
            }

            showConfirm(
                `Ready to import ${mappedData.length} records into Academic Year: ${importYear}?`,
                () => {
                    try {
                        const importRoute = importType === 'E5' ? '/faculty/import-e5' : '/faculty/import';
                        router.post(importRoute, { faculty: mappedData }, {
                            onSuccess: (page: any) => {
                                if (page.props.flash?.error) {
                                    showAlert(page.props.flash.error, 'error', 'Import Failed');
                                    return;
                                }
                                setIsImportModalOpen(false);
                                setImportGroup('');
                                showAlert(page.props.flash?.success || 'Faculty imported successfully.', 'success');

                                setYearFilter(importYear);
                                router.get(route('facultyprofile'), {
                                    search: searchQuery,
                                    year: importYear
                                }, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true
                                });
                            },
                            onError: (errors) => {
                                console.error('Import failed:', errors);
                                showAlert('Failed to import faculty. Check console for details.', 'error');
                            }
                        });
                    } catch (err: any) {
                        console.error('Route Error:', err);
                        showAlert('System error: Could not find import route. Please refresh the page and try again.', 'error');
                    }
                },
                'Confirm Import'
            );
        };
        reader.readAsBinaryString(file);
    };

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

    const handleFileClick = (faculty: Faculty): void => {
        setSelectedFile(faculty);
        setIsFileModalOpen(true);
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
            onError: (errors) => {
                console.error('Update failed:', errors);
                showAlert('Failed to update faculty details.', 'error');
            }
        });
    };

    return (
        <>
            <AlertModal
                open={alertModal.open}
                message={alertModal.message}
                type={alertModal.type}
                title={alertModal.title}
                onClose={() => setAlertModal(prev => ({ ...prev, open: false }))}
                onConfirm={alertModal.onConfirm}
                confirmLabel="Confirm"
            />

            {/* Submit Faculty List Modal */}
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent
                    className="sm:max-w-4xl rounded-none"
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="text-[#003468]">Submit Faculty List</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <p className="text-sm text-gray-600">Select the Academic Year you want to submit the faculty list for:</p>
                        <Select value={submitYear} onValueChange={setSubmitYear}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Academic Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableYears && availableYears.length > 0 ? (
                                    availableYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">No academic years found</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)} className="text-[#003468] border-[#003468] hover:bg-gray-100 shadow-sm">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmSubmit}
                            disabled={!submitYear}
                            className="bg-[#003468] text-white hover:bg-[#002a54]"
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                            />

                            <Button
                                onClick={() => setIsDownloadModalOpen(true)}
                                className="bg-[#003468] hover:bg-[#002a54] gap-2 text-white shadow-md"
                            >
                                <FileDown className="h-4 w-4" /> Download Template
                            </Button>
                        </div>
                    </div>



                    {/* DATA TABLE - COMPACT SPREADSHEET VIEW */}
                    <div className="flex flex-col rounded-none border border-gray-300 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-4 py-3">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Name, Degree, or Rank..."
                                    className="pl-9 bg-white text-xs"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="gap-2 text-gray-600 font-semibold">
                                            <Calendar className="h-4 w-4" />
                                            Academic Year : <span className="text-blue-600 ml-1 font-bold">{yearFilter}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">

                                        {availableYears && availableYears.length > 0 ? (
                                            availableYears.map((yearString) => (
                                                <DropdownMenuCheckboxItem
                                                    key={yearString}
                                                    checked={yearFilter === yearString}
                                                    onCheckedChange={() => {
                                                        setYearFilter(yearString);
                                                        router.get(route('facultyprofile'), { search: searchQuery, year: yearString }, { preserveScroll: true });
                                                    }}
                                                >
                                                    {yearString}
                                                </DropdownMenuCheckboxItem>
                                            ))
                                        ) : (
                                            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground p-2">No data found</DropdownMenuLabel>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" onClick={handleRetrieval} variant="outline" className="text-[#003468] border-[#003468] hover:bg-gray-100 shadow-sm mr-2">
                                    Copy Data
                                </Button>
                                <Button size="sm" onClick={handleSubmit} className="bg-[#003468] text-white hover:bg-[#002a54] shadow-sm">
                                    Submit
                                </Button>
                            </div>
                        </div>

                        <FacultyListTableE5
                            facultyList={filteredFacultyList}
                            yearFilter={yearFilter}
                            onFileClick={handleFileClick}
                            onDelete={handleDelete}
                            onEdit={handleFileClick}
                            referenceData={referenceData}
                        />
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default FacultyProfile;