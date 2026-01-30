import { Head } from '@inertiajs/react';
import { 
    ScrollText, 
    Search, 
    MoreHorizontal, 
    Trash2, 
    Edit, 
    FileSpreadsheet, 
    UploadCloud,
    GraduationCap,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown, 
    Calendar,
    Maximize2,
    FileDown,
    Send,

} from 'lucide-react';
import { useState, useMemo, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'; 
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from '@/layouts/app-layout';

// --- CONSTANTS ---
const IMPORT_GROUP_OPTIONS = [
    "GROUP A1", "GROUP A2", "GROUP A3", 
    "GROUP B", 
    "GROUP C1", "GROUP C2", "GROUP C3", 
    "GROUP D",
    "GROUP E"
];

// --- EXPANDED VIEW TABS ---
const FORM_SECTIONS = [
    { id: 'A1', label: 'GROUP A1' },
    { id: 'A2', label: 'GROUP A2' },
    { id: 'A3', label: 'GROUP A3' },
    { id: 'B',  label: 'GROUP B' },
    { id: 'C1', label: 'GROUP C1' },
    { id: 'C2', label: 'GROUP C2' },
    { id: 'C3', label: 'GROUP C3' },
    { id: 'D',  label: 'GROUP D' },
    { id: 'E',  label: 'GROUP E' },
];

// --- DATA STRUCTURE ---
type Faculty = {
    id: string;
    name: string;
    email: string;
    department: string;
    rank: string;
    degree: string;
    status: 'Completed' | 'No Submission' | 'Not Yet Completed'; 
    employment: 'Plantilla' | 'Contract of Service' | 'Part-time';
    avatar_initials: string;
    joined_year: string;
    form_type: 'E2' | 'E5';
    import_group?: string; 
};

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

export default function FacultyProfile() {
    const [facultyList, setFacultyList] = useState<Faculty[]>(initialFacultyData);
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- STATE ---
    const [yearFilter, setYearFilter] = useState<string>('All Years');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('A1'); 

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>('E5'); 
    const [selectedGroup, setSelectedGroup] = useState<string>("GROUP A1");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- TOGGLE ROW ---
    const toggleRow = (id: string) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
            setActiveTab('A1'); 
        }
    };

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

    const handleDownloadTemplate = (type: 'E2' | 'E5') => {
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`Importing ${importType} data for ${selectedGroup} only.`);
            const groupIndicator = selectedGroup.replace("GROUP ", "");
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
                import_group: groupIndicator
            };
            setFacultyList([importedEntry, ...facultyList]);
            setIsImportModalOpen(false); 
            event.target.value = ''; 
        }
    };

    const handleDelete = (id: string) => {
        if(confirm("Delete this record? This action cannot be undone.")) {
            setFacultyList(prev => prev.filter(f => f.id !== id));
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'No Submission': 'bg-red-100 text-red-700 border-red-200',
            'Not Yet Completed': 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };
    
    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Completed': return <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />;
            case 'No Submission': return <XCircle className="mr-1.5 h-3.5 w-3.5" />;
            case 'Not Yet Completed': return <Clock className="mr-1.5 h-3.5 w-3.5" />;
            default: return null;
        }
    };

    return (
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
                        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2 text-green-700 hover:text-green-800 hover:bg-green-50 border-green-200">
                                    <FileSpreadsheet className="h-4 w-4" /> Import Excel
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Import Faculty Data</DialogTitle>
                                    <DialogDescription>Select form template and specific group to import.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Select Form Template</Label>
                                        <Select value={importType} onValueChange={(val: 'E2'|'E5') => setImportType(val)}>
                                            <SelectTrigger><SelectValue placeholder="Select Form" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="E5">FORM E-5: Private / LUC</SelectItem>
                                                <SelectItem value="E2">FORM E-2: Public / SUC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Select Group to Import</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between font-normal text-left">
                                                    <span className="truncate">{selectedGroup || "Select a Group"}</span>
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[550px]" align="start">
                                                <DropdownMenuLabel>Available Groups (Single Select)</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {IMPORT_GROUP_OPTIONS.map((group) => (
                                                    <DropdownMenuCheckboxItem key={group} checked={selectedGroup === group} onCheckedChange={() => setSelectedGroup(group)} className="cursor-pointer">
                                                        {group}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <p className="text-[11px] text-gray-500">Only one group can be selected at a time.</p>
                                    </div>
                                    <div className="flex flex-col gap-3 pt-2">
                                        <div className="relative" onClick={() => fileInputRef.current?.click()}>
                                            <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">Click to upload XLSX/CSV</p>
                                                </div>
                                                <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
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

                {/* DATA TABLE */}
                <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181b]">
                    <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search Name, Degree, or Rank..." className="pl-9 bg-gray-50/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className={`gap-2 ${yearFilter !== 'All Years' ? 'text-blue-600 font-semibold' : 'text-muted-foreground'}`}>
                                    <Calendar className="h-4 w-4" /> 
                                    {yearFilter === 'All Years' ? 'Filter Year' : yearFilter}
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#003468]/5 text-[#003468] font-semibold uppercase text-xs dark:bg-white/5 dark:text-white">
                                <tr>
                                    <th className="px-6 py-4">File</th>
                                    <th className="px-6 py-4">School Year</th>
                                    <th className="px-6 py-4">Faculty Name</th>
                                    <th className="px-6 py-4">Faculty Rank</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Submit</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredFaculty.map((faculty) => (
                                    <>
                                        {/* MAIN ROW - NO CLICK HANDLER FOR EXPANSION */}
                                        <tr 
                                            key={faculty.id} 
                                            className={`group transition-colors dark:hover:bg-gray-800/50 ${expandedRow === faculty.id ? 'bg-blue-50/50 dark:bg-gray-800/70' : 'hover:bg-blue-50/50'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Arrow now only visual or could be removed if purely visual. Kept for state indication */}
                                                    <div className={`p-1.5 rounded-full transition-transform ${expandedRow === faculty.id ? 'rotate-180 bg-blue-100 text-blue-600' : 'text-gray-400'}`}>
                                                        <ChevronDown className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-50 text-green-700 dark:bg-gray-800 dark:text-green-400">
                                                            <FileSpreadsheet className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Type</span>
                                                            <div className="flex gap-1">
                                                                <Badge variant="outline" className="text-[10px] font-bold text-gray-700 border-gray-300 px-1.5 py-0 h-5 bg-white">
                                                                    Form {faculty.form_type === 'E2' ? 'E-2' : 'E-5'}
                                                                </Badge>
                                                                {faculty.import_group && faculty.import_group !== 'All' && (
                                                                    <Badge variant="secondary" className="text-[10px] font-bold text-blue-700 bg-blue-50 border-blue-200 px-1.5 py-0 h-5">
                                                                        {faculty.import_group}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className="font-medium text-gray-700 dark:text-gray-300">{faculty.joined_year}</span></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003468] text-xs font-bold text-white">{faculty.avatar_initials}</div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">{faculty.name}</div>
                                                        <div className="text-xs text-gray-500">{faculty.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">{faculty.rank}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5"><GraduationCap className="h-3 w-3" /> {faculty.degree}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`border-0 px-3 py-1 font-medium transition-all ${getStatusBadge(faculty.status)}`}>
                                                    <span className="flex items-center">{getStatusIcon(faculty.status)} {faculty.status}</span>
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Button size="sm" variant="outline" className="h-8 gap-2 text-[#003468] border-[#003468]/20 hover:bg-blue-50 shadow-sm" onClick={(e) => { e.stopPropagation(); alert(`Submitting ${faculty.name}...`) }}>
                                                    <Send className="h-3.5 w-3.5" /> Submit
                                                </Button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {/* EXPAND ONLY WORKS HERE */}
                                                        <DropdownMenuItem className="gap-2" onClick={() => toggleRow(faculty.id)}>
                                                            <Maximize2 className="h-4 w-4"/> Expand
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4"/> Edit Details</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDelete(faculty.id)}><Trash2 className="h-4 w-4"/> Delete Record</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>

                                        {/* EXPANDED ROW (SPREADSHEET VIEW) */}
                                        {expandedRow === faculty.id && (
                                            <tr className="bg-gray-50/50 dark:bg-gray-900/20 animate-in fade-in zoom-in-95 duration-200">
                                                <td colSpan={7} className="p-0 border-t border-gray-200">
                                                    <div className="flex flex-col w-full bg-white dark:bg-[#1b1b18]">
                                                        {/* TABS */}
                                                        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                                                            {FORM_SECTIONS.map((section) => (
                                                                <button
                                                                    key={section.id}
                                                                    onClick={() => setActiveTab(section.id)}
                                                                    className={`
                                                                        px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap
                                                                        ${activeTab === section.id 
                                                                            ? 'border-[#003468] text-[#003468] bg-blue-50/50' 
                                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                                                                    `}
                                                                >
                                                                    {section.label}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* SPREADSHEET MOCK WITH REAL COLUMNS FROM TEMPLATE */}
                                                        <div className="p-0 overflow-x-auto">
                                                            <div className="min-w-full inline-block align-middle">
                                                                <div className="bg-black text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                                                                    FORM E-2: PROFILE OF EACH TERTIARY FACULTY - {FORM_SECTIONS.find(s => s.id === activeTab)?.label}
                                                                </div>
                                                                
                                                                <table className="min-w-full border-collapse text-xs text-gray-700 whitespace-nowrap">
                                                                    <thead>
                                                                        <tr className="bg-gray-100 text-left border-b border-gray-300">
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-12 text-center bg-gray-200">SEQ</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold min-w-[200px]">NAME OF FACULTY</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold min-w-[150px]">GENERIC RANK</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold min-w-[150px]">HOME COLLEGE</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold min-w-[150px]">HOME DEPT</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-24 text-center">TENURED?</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-24 text-center">SALARY GRD</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-32 text-right">ANNUAL SALARY</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-24 text-center">ON LEAVE?</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-24 text-center">FTE</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-24 text-center">GENDER</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold min-w-[150px]">HIGHEST DEGREE</th>
                                                                            <th className="border-r border-gray-300 px-3 py-2 font-bold w-24 text-center">PURSUING?</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white">
                                                                        {[1, 2, 3, 4, 5].map((rowNum) => (
                                                                            <tr key={rowNum} className="border-b border-gray-200 hover:bg-blue-50/30">
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center bg-gray-50 text-gray-500">{rowNum}</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 font-medium">{faculty.name}</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5">{faculty.rank}</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5">College of Sci.</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5">{faculty.department}</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center">Yes</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center">24</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-right font-mono">980,000.00</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center">No</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center">1.0</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center">Female</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5">{faculty.degree}</td>
                                                                                <td className="border-r border-gray-200 px-3 py-1.5 text-center">No</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                        {filteredFaculty.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No records found for {yearFilter}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}