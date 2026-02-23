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
import DisciplineFormModal from './DisciplineFormModal';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filtering logic
    const filteredDisciplines = useMemo(() => {
        const allPrograms: any[] = [];

        disciplines.forEach(major => {
            // Apply major filter if selected
            if (selectedMajor && major.code !== selectedMajor) return;

            major.groups.forEach(group => {
                group.specifics.forEach(specific => {
                    // Search filter
                    if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        const matches =
                            (specific.description || "").toLowerCase().includes(q) ||
                            (specific.code || "").includes(q) ||
                            (group.description || "").toLowerCase().includes(q) ||
                            (major.description || "").toLowerCase().includes(q);

                        if (!matches) return;
                    }

                    allPrograms.push({
                        id: specific.code,
                        code: specific.code,
                        name: specific.description, // Program Name
                        major: major.description,   // Major Name
                        disciplineGroup: major.description, // Discipline Group (Major)
                        specificMajor: group.description, // Specific Major (Group)
                        specificGroup: group.description, // Specific Group (Group - or potentially mapped elsewhere)
                        originalData: {
                            code: specific.code,
                            group: group.code,
                            majorDiscipline: major.description,
                            specificDiscipline: specific.description,
                            type: 'specific'
                        }
                    });
                });
            });
        });

        // Search text check for metadata if not filtered by specifics? 
        // The above loop covers explicit searching within items. 
        // If we want to return empty if no matches, we are good.

        // Apply sorting
        if (sortConfig) {
            allPrograms.sort((a, b) => {
                const aValue = a[sortConfig.key] || "";
                const bValue = b[sortConfig.key] || "";

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return allPrograms;
    }, [disciplines, searchQuery, selectedMajor, sortConfig]);

    const activeMajorName = disciplines.find(m => m.code === selectedMajor)?.description;

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
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

    const handleSubmit = (data: any) => {
        router.post(route('admin.disciplines.store'), data, {
            onSuccess: () => {
                setIsModalOpen(false);
            },
            onError: (errors) => {
                console.error(errors);
            }
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
                    {/* Search and Actions */}
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
                                    <DropdownMenuLabel className="sticky top-0 bg-white z-10 border-b border-gray-100 py-3">Filter by Discipline Group</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="m-0" />
                                    <ScrollArea className="h-[300px] w-full">
                                        <div className="py-1">
                                            <DropdownMenuItem onClick={() => setSelectedMajor(null)} className="rounded-none cursor-pointer py-2 px-3 hover:bg-gray-50">
                                                All Disciplines
                                            </DropdownMenuItem>
                                            {disciplines.map((major) => (
                                                <DropdownMenuItem
                                                    key={major.code}
                                                    onClick={() => setSelectedMajor(major.code)}
                                                    className="rounded-none cursor-pointer text-xs py-2 px-3 hover:bg-gray-50 flex flex-col items-start gap-1"
                                                >
                                                    <span className="font-bold text-gray-400">CODE {major.code}</span>
                                                    <span className="text-gray-900">{major.description}</span>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                onClick={handleAdd}
                                className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-none h-10 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Discipline
                            </Button>
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

            {/* Modal */}
            <DisciplineFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
                majors={disciplines}
            />
        </div>
    );
}
