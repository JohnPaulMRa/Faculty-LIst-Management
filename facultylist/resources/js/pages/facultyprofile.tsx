import { Head, router } from '@inertiajs/react';
import { 
    ScrollText, 
    Calendar,
    FileDown,
    FileSpreadsheet,
    Search
} from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';

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

import { Faculty, IMPORT_GROUP_OPTIONS } from '@/types/faculty';
import { getCurrentAcademicYear } from '@/lib/utils';
import FacultyFileDetailsModal from '@/components/faculty/FacultyFileDetailsModal';
import FacultyImportModal from '@/components/faculty/FacultyImportModal';
import FacultyDownloadModal from '@/components/faculty/FacultyDownloadModal';
import FacultyListTableE5 from '@/components/faculty/facultyE5/FacultyListTableE5';
import FacultyListTableE2 from '@/components/faculty/facultyE2/FacultyListTableE2';

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
}

const FacultyProfile: FC<FacultyProfileProps> = ({ initialFacultyData = [], filters = {}, referenceData, availableYears = [] }) => {
    const [facultyList, setFacultyList] = useState<Faculty[]>(initialFacultyData);
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [yearFilter, setYearFilter] = useState<string>(filters.year || 'All Years');

    useEffect(() => {
        setFacultyList(initialFacultyData);
    }, [initialFacultyData]);
    
    // --- STATE ---
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>('E5'); 
    const [importGroup, setImportGroup] = useState<string>('');
    const [importYear, setImportYear] = useState<string>(getCurrentAcademicYear()); 
    const [selectedFile, setSelectedFile] = useState<Faculty | null>(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);

    const handleSubmit = () => {
        router.get(route('facultyprofile'), {
            search: searchQuery,
            year: yearFilter
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleFileImport = async (file: File): Promise<void> => {
        // Use selected group for E2 (A groups), undefined for E5
        const detectedGroup = importType === 'E2' ? importGroup : undefined;
        
        // Validation for E2: require group
        if (importType === 'E2' && !detectedGroup) {
            alert("Please select a Group for Form E2 import.");
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

            // Find header row index by looking for "Name of Faculty" or "Faculty Name"
            const headerRowIndex = jsonData.findIndex((row: any) => 
                row.some((cell: any) => 
                    cell && (
                        cell.toString().toLowerCase().includes("name of faculty") || 
                        cell.toString().toLowerCase().includes("faculty name")
                    )
                )
            );

            const startIndex = headerRowIndex !== -1 ? headerRowIndex + 1 : 1;
            const rows = jsonData.slice(startIndex) as any[];

            if (rows.length === 0) {
                alert("File appears to be empty.");
                return;
            }

            // Map data based on type
            const mappedData = rows.map((row: any) => {
                if (importType === 'E5') {
                    // Mapping based on "Form E5 Private" structure (roughly based on headers)
                    // Row index: 0=Name, 1=FullTimeCode, 2=GenderCode, etc.
                    return {
                        name: row[0],
                        fullTimeCode: row[1]?.toString(),
                        genderCode: row[2]?.toString(),
                        disciplineCode: row[4]?.toString(), // Primary Disc Code
                        degree: row[5]?.toString(), // Highest Degree Code
                        
                        // Education Specifics
                        bachelorsCode: row[7]?.toString(),
                        mastersCode: row[9]?.toString(),
                        doctorateCode: row[11]?.toString(),

                        licenseCode: row[12]?.toString(),
                        tenureCode: row[13]?.toString(),
                        rankCode: row[14]?.toString(),
                        salaryCode: row[15]?.toString(),
                        loadCode: row[16]?.toString(),
                        subjects: row[17]?.toString() || '',
                        
                        // Default required fields for DB
                        email: `imported.${Date.now()}.${Math.floor(Math.random()*1000)}@placeholder.com`, // Placeholder email
                        form_type: 'E5',
                        joined_year: importYear, // Use selected import year
                        status: 'Not Updated',
                        employment: row[1] == '1' ? 'Plantilla' : 'Part-time', 
                        avatar_initials: row[0]?.substring(0,2).toUpperCase() || 'NA'
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
                        email: `imported.e2.${Date.now()}.${Math.floor(Math.random()*1000)}@placeholder.com`,
                        avatar_initials: row[1]?.substring(0,2).toUpperCase() || 'NA'
                    };
                }
            }).filter(item => item.name); // Filter empty rows

            if (mappedData.length === 0) {
                 alert("No valid records found in the uploaded file. Please check the template provided.");
                 return;
            }

            if (confirm(`Ready to import ${mappedData.length} records into Academic Year: ${importYear}?`)) {
                try {
                    // Using hardcoded path to bypass named route cache issues with Wayfinder/Ziggy
                    router.post('/faculty/import', { faculty: mappedData }, {
                        onSuccess: () => {
                            setIsImportModalOpen(false); 
                            setImportGroup(''); 
                            alert("Faculty imported successfully.");
                        },
                        onError: (errors) => {
                            console.error("Import failed:", errors);
                            alert("Failed to import faculty. Check console for details.");
                        }
                    });
                } catch (err: any) {
                    console.error("Route Error:", err);
                    alert("System error: Could not find import route. Please refresh the page and try again.");
                }
            }
        }; 
        reader.readAsBinaryString(file);
    };

    const handleDelete = (id: string): void => {
        if(confirm("Delete this record? This action cannot be undone.")) {
            // Using hardcoded path to bypass caching issues
            router.delete(`/faculty/${id}`, {
                onSuccess: () => {
                   // Success handled globally/by Inertia reload
                },
                onError: () => alert("Failed to delete faculty. Please check connection.")
            });
        }
    };

    const handleFileClick = (faculty: Faculty): void => {
        setSelectedFile(faculty);
        setIsFileModalOpen(true);
    };

    const handleUpdateFaculty = (updatedFaculty: Faculty) => {
        // Using hardcoded path to bypass caching issues
        router.put(`/faculty/${updatedFaculty.id}`, updatedFaculty, {
             onSuccess: () => {
                alert("Faculty details updated successfully.");
                setIsFileModalOpen(false);
                setSelectedFile(updatedFaculty); 
             },
             onError: (errors) => {
                console.error("Update failed:", errors);
                alert("Failed to update faculty details.");
             }
        });
    };

    return (
        <>
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

            <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty List Profile - CHED XII" />
            
            <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                {/* HEADER */}
                <div className="flex flex-col justify-end gap-4 p-2 lg:flex-row lg:items-center">
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
                <div className="flex flex-col rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden">
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
                                        Academic Year : <span className="text-blue-600 ml-1 font-bold">{yearFilter === 'All Years' ? 'All' : yearFilter}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Select Academic Year</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem 
                                        checked={yearFilter === 'All Years'} 
                                        onCheckedChange={() => {
                                            setYearFilter('All Years');
                                            // Auto-submit on change
                                            router.get(route('facultyprofile'), { search: searchQuery, year: 'All Years' }, { preserveState: true, preserveScroll: true, replace: true });
                                        }}
                                    >
                                        All Years
                                    </DropdownMenuCheckboxItem>
                                    {availableYears && availableYears.length > 0 ? (
                                        availableYears.map((yearString) => (
                                            <DropdownMenuCheckboxItem 
                                                key={yearString} 
                                                checked={yearFilter === yearString} 
                                                onCheckedChange={() => {
                                                    setYearFilter(yearString);
                                                    // Auto-submit on change
                                                    router.get(route('facultyprofile'), { search: searchQuery, year: yearString }, { preserveState: true, preserveScroll: true, replace: true });
                                                }}
                                            >
                                                {yearString}
                                            </DropdownMenuCheckboxItem>
                                        ))
                                    ) : (
                                        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground p-2">No academic years found</DropdownMenuLabel>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size="sm" onClick={handleSubmit} variant="outline" className="text-[#003468] border-[#003468] hover:bg-gray-100 shadow-sm mr-2">
                                Retrieval
                            </Button>
                            <Button size="sm" onClick={handleSubmit} className="bg-[#003468] text-white hover:bg-[#002a54] shadow-sm">
                                Submit
                            </Button>
                        </div>
                    </div>

                    <FacultyListTableE5 
                        facultyList={facultyList}
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