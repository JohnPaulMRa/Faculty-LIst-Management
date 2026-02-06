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
import FacultyFileDetailsModal from '@/components/faculty/FacultyFileDetailsModal';
import FacultyImportModal from '@/components/faculty/FacultyImportModal';
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
}

const FacultyProfile: FC<FacultyProfileProps> = ({ initialFacultyData = [], filters = {}, referenceData }) => {
    const [facultyList, setFacultyList] = useState<Faculty[]>(initialFacultyData);
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [yearFilter, setYearFilter] = useState<string>(filters.year || 'All Years');

    useEffect(() => {
        setFacultyList(initialFacultyData);
    }, [initialFacultyData]);
    
    // --- STATE ---
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>('E5'); 
    const [importGroup, setImportGroup] = useState<string>('');
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

    // --- HANDLERS ---
    const handleDownloadTemplate = (type: 'E2' | 'E5'): void => {
        let headers: string[] = [];
        let rowExample: string[] = [];
        let fileName = "";

        if (type === 'E2') {
             headers = ["ID","Name","Rank","Degree","Status","Year"];
             rowExample = ["001","Juan Cruz","Prof I","PhD","Completed","2024"];
             fileName = "FORM_E2_PUBLIC.csv";
        } else {
            // E5 Full Headers
            headers = [
                "Faculty Name", 
                "Full-Time Code", 
                "Gender Code", 
                "Primary Disc. Group", 
                "Primary Disc. Code", 
                "Highest Degree Code", 
                "Bachelors Disc. Group", 
                "Bachelors Disc. Code", 
                "Masters Disc. Group", 
                "Masters Disc. Code", 
                "Doctorate Disc. Group", 
                "Doctorate Disc. Code", 
                "Professional License Code", 
                "Tenure Code", 
                "Rank Code", 
                "Salary Code", 
                "Load Code", 
                "Subjects Taught"
            ];
            rowExample = [
                "Dela Cruz, Juan M.", 
                "1", // Full-time
                "1", // Male
                "46", // Mathematics Group
                "461103", // Statistics Code
                "903", // Doctorate
                "46", // Bach Group
                "460100", // Bach Code
                "46", // Mast Group
                "461101", // Mast Code
                "46", // Doc Group
                "461103", // Doc Code
                "1", // License
                "1", // Permanent
                "50", // Professor
                "6", // Salary
                "30", // Load
                "Calculus, Algebra"
            ];
            fileName = "FORM_E5_PRIVATE.csv";
        }

        const processRow = (row: string[]) => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",");
        const csvContent = "data:text/csv;charset=utf-8," + [processRow(headers), processRow(rowExample)].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            // Dynamically import xlsx to avoid massive initial bundle size if possible, or just standard import
            // Since we installed it, we can use it. Ideally we would allow this to be chunked.
            // For simplicity, we assume standard import at top or dynamic here.
            // Let's rely on dynamic import or assume global `XLSX` available if we didn't add import top.
            // But better to add import at top. I will add the import statement separately.
            
            const { read, utils } = await import("xlsx");
            const workbook = read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

            // Remove header row
            const rows = jsonData.slice(1) as any[];

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
                        // ... Mapping other fields sparsely for now. 
                        // If exact column mapping is critical, we need strict index checks.
                        // Assuming simple mapping for key fields:
                        rankCode: row[14]?.toString(),
                        salaryCode: row[15]?.toString(),
                        
                        // Default required fields for DB
                        email: `imported.${Date.now()}.${Math.floor(Math.random()*1000)}@placeholder.com`, // Placeholder email
                        form_type: 'E5',
                        joined_year: '2024-2025', // Default 
                        status: 'Not Yet Completed',
                        employment: row[1] == '1' ? 'Plantilla' : 'Part-time', 
                        degree: 'Unknown', // Derived from highest degree code later
                        avatar_initials: row[0]?.substring(0,2).toUpperCase() || 'NA'
                    };
                } else {
                    // E2 Mapping
                     return {
                        name: row[1], // ID is 0
                        rank: row[2],
                        degree: row[3],
                        status: row[4] || 'Not Yet Completed',
                        joined_year: row[5] || '2024',
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

            if (confirm(`Ready to import ${mappedData.length} records?`)) {
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
                            onFileImport={handleFileImport}
                        />
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-[#003468] hover:bg-[#002a54] gap-2 text-white shadow-md">
                                    <FileDown className="h-4 w-4" /> Download Template
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Select Form Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadTemplate('E2')}>
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                    <span>Form E-2 (Public/SUC)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadTemplate('E5')}>
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-blue-600" />
                                    <span>Form E-5 (Private/LUC)</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                                    <DropdownMenuCheckboxItem checked={yearFilter === 'All Years'} onCheckedChange={() => setYearFilter('All Years')}>All Years</DropdownMenuCheckboxItem>
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const currentYear = new Date().getFullYear();
                                        // Start from next year (e.g., 2026 -> 2026-2027) or current (2025-2026) depending on preference.
                                        // Assuming we want to show a range centered on now or mostly recent.
                                        // Generating: [Current+1]-[Current+2], [Current]-[Current+1], ...
                                        // e.g. if 2026: 2026-2027, 2025-2026, ...
                                        const startYear = currentYear - i + 1; 
                                        const yearString = `${startYear}-${startYear + 1}`;
                                        return (
                                            <DropdownMenuCheckboxItem key={yearString} checked={yearFilter === yearString} onCheckedChange={() => setYearFilter(yearString)}>
                                                {yearString}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
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
                    />
                </div>
            </div>
            </AppLayout>
        </>
    );
};

export default FacultyProfile;