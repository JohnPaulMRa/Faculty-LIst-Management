/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';

// Basic declaration for Ziggy's route helper
declare function route(name?: string, params?: any, absolute?: boolean): string;

interface UseFacultyImportOptions {
    importType: 'E2' | 'E5';
    importGroup: string;
    importYear: string;
    searchQuery: string;
    showAlert: (message: string, type?: 'info' | 'success' | 'error', title?: string) => void;
    showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
    setIsImportModalOpen: (open: boolean) => void;
    setImportGroup: (group: string) => void;
    setYearFilter: (year: string) => void;
}

/**
 * Returns a `handleFileImport` function that reads an xlsx/csv file,
 * maps rows to the appropriate faculty shape (E2 or E5), and posts
 * them to the server via Inertia router.
 */
export function useFacultyImport({
    importType,
    importGroup,
    importYear,
    searchQuery,
    showAlert,
    showConfirm,
    setIsImportModalOpen,
    setImportGroup,
    setYearFilter,
}: UseFacultyImportOptions) {
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

            const { read, utils } = await import('xlsx');
            const workbook = read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

            // Find title row ("Name of Faculty") then check for sub-header row ("Last Name")
            const titleRowIndex = jsonData.findIndex((row: any) =>
                row.some((cell: any) =>
                    cell &&
                    (cell.toString().toLowerCase().includes('name of faculty') ||
                        cell.toString().toLowerCase().includes('faculty name'))
                )
            );

            // Check if the row after the title is a sub-header row (contains "last name")
            let startIndex = 1;
            if (titleRowIndex !== -1) {
                const nextRow: any = jsonData[titleRowIndex + 1];
                const isSubHeaderRow =
                    nextRow &&
                    nextRow.some((cell: any) =>
                        cell && cell.toString().toLowerCase().includes('last name')
                    );
                startIndex = isSubHeaderRow ? titleRowIndex + 2 : titleRowIndex + 1;
            }

            const rows = jsonData.slice(startIndex) as any[];

            if (rows.length === 0) {
                showAlert('File appears to be empty.', 'error', 'Import Error');
                return;
            }

            // Map data based on type
            const mappedData = rows
                .map((row: any) => {
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

                        return {
                            name: fullName,
                            fullTimeCode: row[5]?.toString(),
                            genderCode: row[4]?.toString(),
                            disciplineCode: row[6]?.toString(),
                            degree: row[7]?.toString(),
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
                            avatar_initials:
                                (lastName.substring(0, 1) + firstName.substring(0, 1)).toUpperCase() || 'NA',
                        };
                    } else {
                        // E2 Mapping
                        return {
                            name: row[1], // ID is 0
                            rank: row[2],
                            degree: row[3],
                            status: row[4] || 'Not Updated',
                            joined_year: importYear,
                            form_type: 'E2',
                            import_group: detectedGroup,
                            email: `imported.e2.${Date.now()}.${Math.floor(Math.random() * 1000)}@placeholder.com`,
                            avatar_initials: row[1]?.substring(0, 2).toUpperCase() || 'NA',
                        };
                    }
                })
                .filter((item) => item.name); // Filter empty rows

            if (mappedData.length === 0) {
                showAlert(
                    'No valid records found in the uploaded file. Please check the template provided.',
                    'error',
                    'Import Error'
                );
                return;
            }

            showConfirm(
                `Ready to import ${mappedData.length} records into Academic Year: ${importYear}?`,
                () => {
                    try {
                        const importRoute = importType === 'E5' ? '/faculty/import-e5' : '/faculty/import';
                        router.post(
                            importRoute,
                            { faculty: mappedData },
                            {
                                onSuccess: (page: any) => {
                                    if (page.props.flash?.error) {
                                        showAlert(page.props.flash.error, 'error', 'Import Failed');
                                        return;
                                    }
                                    setIsImportModalOpen(false);
                                    setImportGroup('');
                                    showAlert(
                                        page.props.flash?.success || 'Faculty imported successfully.',
                                        'success'
                                    );
                                    setYearFilter(importYear);
                                    router.get(
                                        route('facultyprofile'),
                                        { search: searchQuery, year: importYear },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    );
                                },
                                onError: (errors) => {
                                    console.error('Import failed:', errors);
                                    showAlert(
                                        'Failed to import faculty. Check console for details.',
                                        'error'
                                    );
                                },
                            }
                        );
                    } catch (err: any) {
                        console.error('Route Error:', err);
                        showAlert(
                            'System error: Could not find import route. Please refresh the page and try again.',
                            'error'
                        );
                    }
                },
                'Confirm Import'
            );
        };
        reader.readAsBinaryString(file);
    };

    return { handleFileImport };
}
