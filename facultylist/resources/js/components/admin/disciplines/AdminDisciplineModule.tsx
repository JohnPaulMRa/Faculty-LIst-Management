import { useState, useMemo } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import DisciplineTable from './DisciplineTable';
import AddDisciplineForm from './AddDisciplineForm';
import EditDisciplineModal from './EditDisciplineModal';

interface SpecificDiscipline {
    code: string;
    description: string;
}

interface DisciplineGroup {
    code: string;
    description: string;
    specifics: SpecificDiscipline[];
}

interface MajorDiscipline {
    code: string;
    description: string;
    groups: DisciplineGroup[];
}

interface AdminDisciplineModuleProps {
    disciplines: MajorDiscipline[];
}

export default function AdminDisciplineModule({ disciplines = [] }: AdminDisciplineModuleProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
    // New state for filtering by discipline group
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    // Compute flat list of all groups for the filter dropdown
    const allGroups = useMemo(() => {
        const groups: { code: string; description: string }[] = [];
        disciplines.forEach((major) => {
            major.groups.forEach((g) => {
                groups.push({ code: g.code, description: g.description });
            });
        });
        return groups;
    }, [disciplines]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filtering logic
    const filteredDisciplines = useMemo(() => {
        if (!Array.isArray(disciplines)) return [];

        let allPrograms: any[] = [];

        // Flatten all groups, majors, and specifics into a single array first
        disciplines.forEach(major => {
            const groups = Array.isArray(major.groups) ? major.groups : [];

            groups.forEach(group => {
                const specifics = Array.isArray(group.specifics) ? group.specifics : [];

                if (specifics.length === 0) {
                    allPrograms.push({
                        id: String(group.code),
                        code: String(group.code),
                        name: '',
                        major: String(major.description || ''),
                        disciplineGroup: String(major.description || ''),
                        specificMajor: String(group.description || ''),
                        specificGroup: String(group.description || ''),
                        originalData: {
                            code: group.code,
                            group: group.code,
                            groupCode: major.code,
                            groupName: major.description,
                            majorCode: group.code,
                            majorName: group.description,
                            majorDiscipline: major.description,
                            specificDiscipline: '',
                            groupDescription: group.description,
                            type: 'major'
                        }
                    });
                    return;
                }

                specifics.forEach(specific => {
                    const isOrphan = String(group.code).endsWith('_orphan');
                    allPrograms.push({
                        id: String(specific.code),
                        code: String(specific.code),
                        name: String(specific.description || ''),
                        major: String(major.description || ''),
                        disciplineGroup: String(major.description || ''),
                        specificMajor: isOrphan ? '' : String(group.description || ''),
                        specificGroup: isOrphan ? '' : String(group.description || ''),
                        originalData: {
                            code: specific.code,
                            group: group.code,
                            groupCode: major.code,
                            groupName: major.description,
                            majorCode: group.code,
                            majorName: isOrphan ? '' : group.description,
                            majorDiscipline: major.description,
                            specificDiscipline: specific.description,
                            type: 'specific'
                        }
                    });
                });
            });
        });

        const q = (searchQuery || "").toLowerCase().trim();

        // Apply filters on the flattened array
        let result = allPrograms;

        if (selectedMajor) {
            // "The first two codes are the same"
            // Reverting back to native `.startsWith` on the `program.code` string since this is the only reliable way to filter accurately by prefix
            // when backend `groupCode` relationships might be missing for orphan specific disciplines or empty major groups.
            result = result.filter(program => String(program.code).startsWith(String(selectedMajor)));
        }

        if (q) {
            result = result.filter(program =>
                String(program.name).toLowerCase().includes(q) ||
                String(program.code).toLowerCase().includes(q) ||
                String(program.disciplineGroup).toLowerCase().includes(q) ||
                String(program.specificMajor).toLowerCase().includes(q) ||
                String(program.originalData?.groupCode || "").toLowerCase().includes(q)
            );
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = String(a[sortConfig.key] || "").toLowerCase();
                const bValue = String(b[sortConfig.key] || "").toLowerCase();

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [disciplines, searchQuery, selectedMajor, sortConfig]);

    const activeMajorName = disciplines.find(m => m.code === selectedMajor)?.description;


    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this discipline?')) {
            router.delete(route('admin.disciplines.destroy', id), {
                onSuccess: () => {
                    // Success toast
                }
            });
        }
    };

    const handleAddSubmit = (data: any) => {
        console.log("router.post starting with data:", data);
        setProcessing(true);
        router.post(route('admin.disciplines.store'), data, {
            onStart: () => console.log("Inertia request started"),
            onSuccess: (page: any) => {
                console.log("Inertia request success:", page);
                setProcessing(false);
                const flash = (page.props as any).flash;
                if (flash?.error) {
                    alert('Error: ' + flash.error);
                } else {
                    setSelectedMajor(null);
                    alert('Discipline added successfully.');
                }
            },
            onError: (errors) => {
                console.log("Inertia request error:", errors);
                setProcessing(false);
                const messages = Object.values(errors).join('\n');
                alert('Validation error:\n' + messages);
                console.error(errors);
            },
            onFinish: () => {
                console.log("Inertia request finished");
                setProcessing(false);
            },
        });
    };

    const handleEditSubmit = (data: any) => {
        if (!editingItem) return;
        setProcessing(true);
        // Determine type: 'specific' or 'major' based on originalData
        const type = editingItem.type === 'specific' ? 'specific' : 'major';
        const description = data.specificDiscipline || data.majorName || data.groupDescription || '';
        const newCode = data.code || editingItem.code;

        router.put(route('admin.disciplines.update', editingItem.code), {
            type,
            description,
            newCode: newCode !== editingItem.code ? newCode : undefined,
        }, {
            onSuccess: (page: any) => {
                setProcessing(false);
                const flash = (page.props as any).flash;
                if (flash?.error) {
                    alert('Error: ' + flash.error);
                } else {
                    setIsEditModalOpen(false);
                }
            },
            onError: (errors) => {
                setProcessing(false);
                const messages = Object.values(errors).join('\n');
                alert('Validation error:\n' + messages);
            },
        });
    };

    return (
        <div className="flex flex-col gap-8 w-full text-foreground bg-background">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discipline Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage academic disciplines, codes, and groups.
                    </p>
                </div>

                <div className="flex flex-col w-full">
                    {/* Add Discipline Form */}
                    <AddDisciplineForm
                        onSubmit={handleAddSubmit}
                        majors={disciplines}
                        processing={processing}
                    />

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by code, group, major, or specific..."
                                className="pl-9 bg-gray-50 border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-gray-400 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={`rounded-none border-gray-300 gap-2 h-10 md:flex ${selectedMajor ? 'bg-gray-100 border-gray-900' : ''}`}>
                                        <Filter className="h-4 w-4" />
                                        {selectedMajor ? 'Filtering' : 'Filter'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[300px] rounded-none p-0">
                                    <DropdownMenuLabel className="sticky top-0 bg-white z-10 border-b border-gray-100 py-3 flex justify-between items-center">
                                        <span>Filter by Discipline Group</span>
                                        <span className="text-[10px] text-gray-400 font-normal">{disciplines.length} total</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="m-0" />
                                    <DropdownMenuItem
                                        onSelect={(e) => { e.preventDefault(); setSelectedMajor(null); }}
                                        onClick={() => setSelectedMajor(null)}
                                        className="rounded-none cursor-pointer py-2 px-3 hover:bg-gray-50"
                                    >
                                        All Disciplines
                                    </DropdownMenuItem>
                                    {disciplines.map((major) => (
                                        <DropdownMenuItem
                                            key={`filter-group-${major.code}`}
                                            onSelect={(e) => { e.preventDefault(); setSelectedMajor(String(major.code)); }}
                                            onClick={() => setSelectedMajor(String(major.code))}
                                            className="rounded-none cursor-pointer text-xs py-2 px-3 hover:bg-gray-50 flex flex-col items-start gap-1"
                                        >
                                            <span className="font-bold text-gray-400">CODE {major.code}</span>
                                            <span className="text-gray-900">{major.description}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <div className="pb-8" />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {selectedMajor && (
                        <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-left-2">
                            <Badge variant="secondary" className="rounded-none bg-gray-900 text-white pl-2 pr-1 py-1 gap-1 font-normal">
                                Group: {activeMajorName}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 hover:bg-gray-700 text-white rounded-none"
                                    onClick={() => setSelectedMajor(null)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                            <Button
                                variant="link"
                                className="text-xs text-gray-500 h-auto p-0"
                                onClick={() => setSelectedMajor(null)}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}

                    {/* Hierarchy Display */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8">
                        <DisciplineTable
                            programs={filteredDisciplines}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                    </div>
                </div>
            </div>


            <EditDisciplineModal
                isOpen={isEditModalOpen}
                onClose={() => { if (!processing) setIsEditModalOpen(false); }}
                onSubmit={handleEditSubmit}
                initialData={editingItem}
                processing={processing}
            />
        </div>
    );
}
