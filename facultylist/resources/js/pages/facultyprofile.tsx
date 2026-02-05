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
import FacultyListTable from '@/components/faculty/FacultyListTable';

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
}

const FacultyProfile: FC<FacultyProfileProps> = ({ initialFacultyData = [], filters = {} }) => {
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

    const handleFileImport = (file: File): void => {
        // Use selected group for E2 (A groups), undefined for E5
        const detectedGroup = importType === 'E2' ? importGroup : undefined;
        
        // Validation for E2: require group
        if (importType === 'E2' && !detectedGroup) {
            alert("Please select a Group for Form E2 import.");
            return;
        }

        alert(`Importing ${importType} data. Group: ${detectedGroup || 'N/A'} from file '${file.name}'.`);
        
        const importedEntry = {
            // In a real app, you'd parse variables from the file here.
            // For now, preserving mock logic sending to backend
            name: 'Prof. Imported User',
            email: `import${Math.floor(Math.random() * 999)}@ched.gov.ph`,
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

        router.post(route('faculty.store'), importedEntry, {
            onSuccess: () => {
                setIsImportModalOpen(false); 
                setImportGroup(''); 
                alert("Faculty imported successfully.");
            },
            onError: (errors) => {
                console.error("Import failed:", errors);
                alert("Failed to import faculty.");
            }
        });
    };

    const handleDelete = (id: string): void => {
        if(confirm("Delete this record? This action cannot be undone.")) {
            router.delete(route('faculty.destroy', id), {
                onSuccess: () => {
                    // Alert handled by flash message usually, or here
                },
                onError: () => alert("Failed to delete faculty.")
            });
        }
    };

    const handleFileClick = (faculty: Faculty): void => {
        setSelectedFile(faculty);
        setIsFileModalOpen(true);
    };

    const handleUpdateFaculty = (updatedFaculty: Faculty) => {
        router.put(route('faculty.update', updatedFaculty.id), updatedFaculty, {
             onSuccess: () => {
                alert("Faculty details updated successfully.");
                setIsFileModalOpen(false);
                setSelectedFile(updatedFaculty); // Update local selected file to reflect changes immediately if needed
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

                    <FacultyListTable 
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