import { Head } from '@inertiajs/react';
import { 
    ScrollText, 
    Calendar,
    FileDown,
    FileSpreadsheet
} from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo } from 'react';

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
import { Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

import { Faculty, IMPORT_GROUP_OPTIONS } from '@/types/faculty';
import FacultyFileDetailsModal from '@/components/faculty/FacultyFileDetailsModal';
import FacultyImportModal from '@/components/faculty/FacultyImportModal';
import FacultyListTable from '@/components/faculty/FacultyListTable';

// --- MOCK DATA ---
const initialFacultyData: Faculty[] = [
    {
        id: 'FAC-001',
        name: 'Dr. Maria Santos',
        email: 'msantos@university.edu',
        department: 'Biology Department',
        rank: 'Professor III',
        degree: 'PhD in Biology',
        status: 'Completed',
        employment: 'Plantilla',
        avatar_initials: 'MS',
        joined_year: '2021',
        form_type: 'E5',
        import_group: 'A1'
    },
    {
        id: 'FAC-002',
        name: 'Prof. Juan Dela Cruz',
        email: 'jdelacruz@university.edu',
        department: 'Mathematics',
        rank: 'Associate Professor I',
        degree: 'MS Mathematics',
        status: 'Not Yet Completed',
        employment: 'Part-time',
        avatar_initials: 'JD',
        joined_year: '2023',
        form_type: 'E5',
        import_group: 'B'
    },
    {
        id: 'FAC-003',
        name: 'Inst. Ana Reyes',
        email: 'areyes@university.edu',
        department: 'Chemistry',
        rank: 'Instructor I',
        degree: 'BS Chemistry',
        status: 'No Submission',
        employment: 'Plantilla',
        avatar_initials: 'AR',
        joined_year: '2024',
        form_type: 'E5',
        import_group: 'A2'
    }
];

const breadcrumbs = [
    { title: 'Faculty', href: '/faculty-profile' },
];

const FacultyProfile: FC = () => {
    const [facultyList, setFacultyList] = useState<Faculty[]>(initialFacultyData);
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    // --- STATE ---
    const [yearFilter, setYearFilter] = useState<string>('All Years');

    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>('E5'); 
    const [importGroup, setImportGroup] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<Faculty | null>(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);

    // --- FILTER LOGIC ---
    const filteredFaculty = useMemo(() => {
        return facultyList.filter(f => {
            const matchesSearch = 
                f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.degree.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesYear = yearFilter === 'All Years' || f.joined_year === yearFilter;

            // Optional: Filter by Group if needed?
            // const matchesGroup = ...

            return matchesSearch && matchesYear;
        });
    }, [facultyList, searchQuery, yearFilter]);

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

    const handleFileImport = (file: File): void => {
        // Use selected group for E2 (A groups), undefined for E5
        const detectedGroup = importType === 'E2' ? importGroup : undefined;
        
        // Validation for E2: require group
        if (importType === 'E2' && !detectedGroup) {
            alert("Please select a Group for Form E2 import.");
            return;
        }

        alert(`Importing ${importType} data. Group: ${detectedGroup || 'N/A'} from file '${file.name}'.`);
        
        const importedEntry: Faculty = {
            id: `IMP-${Math.floor(Math.random() * 999)}`,
            name: 'Prof. Imported User',
            email: 'import@ched.gov.ph',
            department: 'Imported Dept',
            rank: 'Guest Lecturer',
            degree: 'PhD',
            status: 'Completed',
            employment: 'Contract of Service',
            avatar_initials: 'IM',
            joined_year: '2024',
            form_type: importType,
            import_group: detectedGroup
        };
        setFacultyList([importedEntry, ...facultyList]);
        setIsImportModalOpen(false); 
        setImportGroup(''); // Reset group after import
    };

    const handleDelete = (id: string): void => {
        if(confirm("Delete this record? This action cannot be undone.")) {
            setFacultyList(prev => prev.filter(f => f.id !== id));
        }
    };

    const handleFileClick = (faculty: Faculty): void => {
        setSelectedFile(faculty);
        setIsFileModalOpen(true);
    };

    const handleEdit = (faculty: Faculty): void => {
        handleFileClick(faculty);
    };

    const handleUpdateFaculty = (updatedFaculty: Faculty) => {
        setFacultyList(prev => prev.map(f => f.id === updatedFaculty.id ? updatedFaculty : f));
        setSelectedFile(updatedFaculty); 
        alert("Faculty details saved successfully (Local State Only).");
    };

    return (
        <>
            <FacultyFileDetailsModal 
                isOpen={isFileModalOpen} 
                onOpenChange={setIsFileModalOpen} 
                faculty={selectedFile} 
                onSave={handleUpdateFaculty}
            />

            <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty List Profile - CHED XII" />
            
            <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#18181b] lg:flex-row lg:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003468] text-white shadow-sm">
                            <ScrollText className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-[#003468] dark:text-white uppercase">Faculty</h2>
                            <p className="text-sm text-gray-500">Faculty records and employment status.</p>
                        </div>
                    </div>
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
                                    <Button variant="ghost" size="sm" className={`gap-2 ${yearFilter !== 'All Years' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                                        <Calendar className="h-4 w-4" /> 
                                        {yearFilter === 'All Years' ? 'School Year' : yearFilter}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Select School Year</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked={yearFilter === 'All Years'} onCheckedChange={() => setYearFilter('All Years')}>All Years</DropdownMenuCheckboxItem>
                                    {['2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021'].map((year) => (
                                        <DropdownMenuCheckboxItem key={year} checked={yearFilter === year} onCheckedChange={() => setYearFilter(year)}>{year}</DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size="sm" className="bg-[#003468] text-white hover:bg-[#002a54] shadow-sm">
                                Submit
                            </Button>
                        </div>
                    </div>

                    <FacultyListTable 
                        facultyList={filteredFaculty}
                        yearFilter={yearFilter}
                        onFileClick={handleFileClick}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </AppLayout>
        </>
    );
};

export default FacultyProfile;