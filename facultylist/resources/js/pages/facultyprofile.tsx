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
        id: 'CHED-12-001', 
        name: 'Dr. Maria Santos', 
        email: 'msantos@ched.gov.ph', 
        department: 'Technical Division', 
        rank: 'Chief Educ. Prog. Spc.', 
        degree: 'PhD in Ed. Mgmt.', 
        status: 'Completed', 
        employment: 'Plantilla', 
        avatar_initials: 'MS',
        joined_year: '2024',
        form_type: 'E2',
        import_group: 'A1' 
    },
    { 
        id: 'CHED-12-002', 
        name: 'Engr. Juan Dela Cruz', 
        email: 'jdelacruz@ched.gov.ph', 
        department: 'Engineering Unit', 
        rank: 'Educ. Supervisor II', 
        degree: 'MS Civil Eng.', 
        status: 'No Submission', 
        employment: 'Plantilla', 
        avatar_initials: 'JD',
        joined_year: '2023',
        form_type: 'E2',
        import_group: 'All'
    },
    { 
        id: 'CHED-12-003', 
        name: 'Ms. Sarah Lee', 
        email: 'slee@ched.gov.ph', 
        department: 'Quality Assurance', 
        rank: 'Project Tech. Staff', 
        degree: 'MA Public Admin.', 
        status: 'Not Yet Completed', 
        employment: 'Contract of Service', 
        avatar_initials: 'SL',
        joined_year: '2025',
        form_type: 'E5',
        import_group: 'C1'
    },
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

            return matchesSearch && matchesYear;
        });
    }, [facultyList, searchQuery, yearFilter]);

    // --- HANDLERS ---
    const handleDownloadTemplate = (type: 'E2' | 'E5'): void => {
        const headers = ["ID","Name","Rank","Degree","Status","Year"];
        const rowExample = ["001","Juan Cruz","Prof I","PhD","Completed","2024"];
        const fileName = type === 'E2' ? "FORM_E2_PUBLIC.csv" : "FORM_E5_PRIVATE.csv";
        const csvContent = "data:text/csv;charset=utf-8," + [headers, rowExample].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileImport = (file: File): void => {
        // Simulate auto-detection logic (e.g., reading header)
        const detectedGroups = ["A1", "A2", "B", "C1"];
        const randomGroup = detectedGroups[Math.floor(Math.random() * detectedGroups.length)];
        
        alert(`Importing ${importType} data. Detected Group: ${randomGroup} from file '${file.name}'.`);
        
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
            import_group: randomGroup
        };
        setFacultyList([importedEntry, ...facultyList]);
        setIsImportModalOpen(false); 
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
                            <p className="text-sm text-gray-500">Manage faculty records and employment status.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FacultyImportModal 
                            isOpen={isImportModalOpen}
                            onOpenChange={setIsImportModalOpen}
                            importType={importType}
                            setImportType={setImportType}
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className={`gap-2 ml-4 ${yearFilter !== 'All Years' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                                    <Calendar className="h-4 w-4" /> 
                                    {yearFilter === 'All Years' ? 'Year' : yearFilter}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Select Year</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={yearFilter === 'All Years'} onCheckedChange={() => setYearFilter('All Years')}>All Years</DropdownMenuCheckboxItem>
                                {['2026', '2025', '2024', '2023', '2022', '2021'].map((year) => (
                                    <DropdownMenuCheckboxItem key={year} checked={yearFilter === year} onCheckedChange={() => setYearFilter(year)}>{year}</DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
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