/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';

import type { AlertDialogType } from '@/components/faculty/hooks';

// Basic declaration for Ziggy's route helper
declare function route(name?: string, params?: any, absolute?: boolean): string;

interface UseFacultyImportOptions {
    importType: 'E2' | 'E5';
    importGroup: string;
    importYear: string;
    searchQuery: string;
    showAlert: (message: string, type?: Exclude<AlertDialogType, 'confirm'>, title?: string) => void;
    showConfirm: (message: string, onConfirm: () => void, title?: string, type?: AlertDialogType) => void;
    setIsImportModalOpen: (open: boolean) => void;
    setImportGroup: (group: string) => void;
    setYearFilter: (year: string) => void;
    availableYears: string[];
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
    availableYears,
}: UseFacultyImportOptions) {
    const handleFileImport = async (file: File): Promise<void> => {
        if (!importYear) {
            showAlert('Please specify an Academic Year before importing.', 'error', 'Import Restricted');
            return;
        }

        if (availableYears.includes(importYear)) {
            showAlert(`The Academic Year ${importYear} already exists in your records. To prevent duplicate entries, re-importing to an existing academic year is not allowed.`, 'error', 'Import Restricted');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;

            const { read, utils } = await import('xlsx');
            const workbook = read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            // --- Automatic Group Detection for E2 ---
            let detectedGroup = importType === 'E2' ? importGroup : undefined;
            if (importType === 'E2') {
                for (const row of jsonData) {
                    const groupCell = row.find((cell: any) => {
                        if (!cell || typeof cell !== 'string') return false;
                        const s = cell.toUpperCase().trim();
                        // Match "GROUP A1", "GROUP: A1", "A1", etc.
                        return s.includes('GROUP') || /^[A-E][1-3]$/.test(s) || /^[B-E]$/.test(s);
                    });

                    if (groupCell) {
                        const s = groupCell.toUpperCase().trim();
                        const match = s.match(/GROUP[:\-\s]*([A-E][1-3]|[B-E])/);
                        if (match) {
                            detectedGroup = `GROUP ${match[1]}`;
                            break;
                        } else if (/^[A-E][1-3]|[B-E]$/.test(s)) {
                            detectedGroup = `GROUP ${s}`;
                            break;
                        }
                    }
                }

                // If still not detected and no manual selection, fallback or warn
                if (!detectedGroup) {
                    showAlert('Could not automatically detect the Group (e.g., GROUP A1) from the Excel file. Please ensure the group is mentioned in the sheet.', 'error', 'Import Error');
                    return;
                }
            }

            // Find title row aggressively by searching for a row that has at least 3 common header keywords
            const titleRowIndex = jsonData.findIndex((row: any) => {
                if (!row || !Array.isArray(row)) return false;
                let matches = 0;
                row.forEach((cell: any) => {
                    if (!cell) return;
                    const s = cell.toString().toLowerCase();
                    if (s.includes('name') || s.includes('gender') || s.includes('rank') || s.includes('tenure') || s.includes('group') || s.includes('degree')) {
                        matches++;
                    }
                });
                return matches >= 3;
            });

            // Check if the row after the title is a sub-header row (contains "last name")
            let startIndex = 0;
            if (titleRowIndex !== -1) {
                const nextRow: any = jsonData[titleRowIndex + 1];
                const isSubHeaderRow =
                    nextRow &&
                    nextRow.some((cell: any) =>
                        cell && (cell.toString().toLowerCase().includes('last name') || cell.toString().toLowerCase().includes('first name'))
                    );
                startIndex = isSubHeaderRow ? titleRowIndex + 2 : titleRowIndex + 1;
            } else {
                startIndex = 1;
            }

            // --- Robust Column Detection for E2 ---
            // Initialize with -1 to ensure we only map what we actually find
            const colMap: Record<string, number> = {
                name: -1,
                last_name: -1,
                first_name: -1,
                middle_name: -1,
                rank: -1,
                degree: -1,
                salary_grade: -1,
                annual_salary: -1,
                on_leave_pay: -1,
                tenure: -1,
                fte: -1,
                gender: -1,
                group: -1,
                pursuing: -1,
                thesis: -1,
                dissertation: -1
            };

            if (titleRowIndex !== -1 && importType === 'E2') {
                // Use the row immediately before data as the header row for mapping
                const headerRow = jsonData[startIndex - 1];
                const findCol = (terms: string[]) => 
                    headerRow.findIndex((cell: any) => 
                        cell && terms.some(t => cell.toString().toLowerCase().includes(t))
                    );

                const n = findCol(['name of faculty', 'faculty name', 'full name', 'name']);
                if (n !== -1) colMap.name = n;

                const ln = findCol(['last name', 'surname', 'family name']);
                if (ln !== -1) colMap.last_name = ln;

                const fn = findCol(['first name', 'given name']);
                if (fn !== -1) colMap.first_name = fn;

                const mn = findCol(['middle name', 'middle initial', 'm.i.']);
                if (mn !== -1) colMap.middle_name = mn;
                
                const r = findCol(['rank', 'generic rank', 'faculty rank']);
                if (r !== -1) colMap.rank = r;

                const d = findCol(['degree', 'highest degree', 'educational qualification']);
                if (d !== -1) colMap.degree = d;

                const g = findCol(['gender', 'sex', 'm/f']);
                if (g !== -1) colMap.gender = g;

                const t = findCol(['tenure', 'tenured', 'status of appointment']);
                if (t !== -1) colMap.tenure = t;

                const grp = findCol(['group', 'category']);
                if (grp !== -1) colMap.group = grp;

                const sg = findCol(['salary grade', 'sg', 'grade']);
                if (sg !== -1) colMap.salary_grade = sg;

                const as = findCol(['annual salary', 'salary', 'compensation']);
                if (as !== -1) colMap.annual_salary = as;

                const ol = findCol(['leave without pay', 'official leave', 'on leave']);
                if (ol !== -1) colMap.on_leave_pay = ol;

                const fte = findCol(['ftef', 'fte', 'full time equivalent']);
                if (fte !== -1) colMap.fte = fte;

                const pd = findCol(['pursuing', 'actively pursuing', 'studying']);
                if (pd !== -1) colMap.pursuing = pd;

                const th = findCol(['thesis']);
                if (th !== -1) colMap.thesis = th;

                const ds = findCol(['dissertation']);
                if (ds !== -1) colMap.dissertation = ds;
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
                        // E2 Mapping - Using Dynamic Column Map with index safety
                        const getName = () => {
                            // Support split names (Last, First, Middle)
                            if (colMap.last_name !== -1 || colMap.first_name !== -1) {
                                const ln = colMap.last_name !== -1 ? row[colMap.last_name]?.toString().trim() : '';
                                const fn = colMap.first_name !== -1 ? row[colMap.first_name]?.toString().trim() : '';
                                const mn = colMap.middle_name !== -1 ? row[colMap.middle_name]?.toString().trim() : '';
                                if (ln || fn) {
                                    return `${ln}${ln && fn ? ', ' : ''}${fn}${mn ? ' ' + mn : ''}`.trim();
                                }
                            }
                            
                            if (colMap.name !== -1) return row[colMap.name]?.toString().trim();
                            // If name not found, try common positions (1 or 2)
                            return (row[1] || row[0])?.toString().trim();
                        };

                        return {
                            name: getName(),
                            rank: colMap.rank !== -1 ? row[colMap.rank]?.toString().trim() : null,
                            degree: colMap.degree !== -1 ? row[colMap.degree]?.toString().trim() : null,
                            gender: colMap.gender !== -1 ? row[colMap.gender]?.toString().trim() : null,
                            is_tenured: colMap.tenure !== -1 ? row[colMap.tenure]?.toString().trim() : null,
                            status: 'Not Updated',
                            joined_year: importYear,
                            form_type: 'E2',
                            import_group: colMap.group !== -1 ? row[colMap.group]?.toString().trim() : detectedGroup,
                            email: `imported.e2.${Date.now()}.${Math.floor(Math.random() * 1000)}@placeholder.com`,
                            avatar_initials: getName()?.substring(0, 2).toUpperCase() || 'NA',
                            // Additional fields for completeness
                            salary_grade: colMap.salary_grade !== -1 ? row[colMap.salary_grade]?.toString().trim() : null,
                            annual_salary: colMap.annual_salary !== -1 ? row[colMap.annual_salary]?.toString().trim() : null,
                            on_leave_pay: colMap.on_leave_pay !== -1 ? row[colMap.on_leave_pay]?.toString().trim() : null,
                            fte: colMap.fte !== -1 ? row[colMap.fte]?.toString().trim() : null,
                            pursuing_degree: colMap.pursuing !== -1 ? row[colMap.pursuing]?.toString().trim() : null,
                            thesis: colMap.thesis !== -1 ? row[colMap.thesis]?.toString().trim() : null,
                            dissertation: colMap.dissertation !== -1 ? row[colMap.dissertation]?.toString().trim() : null,
                        };
                    }
                })
                .filter((item) => item && item.name && item.name.toString().toLowerCase().trim() !== 'name of faculty' && item.name.toString().toLowerCase().trim() !== 'faculty name'); // Filter empty or header rows

            if (mappedData.length === 0) {
                showAlert(
                    'No valid records found in the uploaded file. Please check the template provided.',
                    'error',
                    'Import Error'
                );
                return;
            }

            showConfirm(
                `Ready to import ${mappedData.length} Records into Academic Year: ${importYear}?`,
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
