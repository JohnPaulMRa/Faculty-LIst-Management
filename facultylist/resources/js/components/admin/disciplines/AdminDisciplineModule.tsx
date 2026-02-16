import { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DisciplineTable from './DisciplineTable';
import DisciplineFormModal from './DisciplineFormModal';

// Mock Data
const mockDisciplines = [
    { id: 1, code: "140101", group: "14", majorDiscipline: "Education Science", specificDiscipline: "General Education" },
    { id: 2, code: "140102", group: "14", majorDiscipline: "Education Science", specificDiscipline: "Curriculum Development" },
    { id: 3, code: "140201", group: "14", majorDiscipline: "Teacher Training", specificDiscipline: "Early Childhood Education" },
    { id: 4, code: "140202", group: "14", majorDiscipline: "Teacher Training", specificDiscipline: "Elementary Education" },
    { id: 5, code: "010101", group: "01", majorDiscipline: "Agriculture", specificDiscipline: "Agricultural Economics" },
];

export default function AdminDisciplineModule() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [disciplines, setDisciplines] = useState(mockDisciplines);

    const filteredDisciplines = disciplines.filter(d =>
        d.specificDiscipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.majorDiscipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.includes(searchQuery)
    );

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this discipline?')) {
            setDisciplines(disciplines.filter(d => d.id !== id));
        }
    };

    const handleSubmit = (data: any) => {
        if (editingItem) {
            setDisciplines(disciplines.map(d => d.id === editingItem.id ? { ...d, ...data } : d));
        } else {
            setDisciplines([...disciplines, { id: Math.max(...disciplines.map(d => d.id), 0) + 1, ...data }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discipline Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage academic disciplines, codes, and groups.
                    </p>
                </div>

                <div className="bg-white p-6 border border-gray-200 shadow-none rounded-none">
                    {/* Search and Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by code, major, or specific discipline..."
                                className="pl-9 bg-gray-50 border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-gray-400 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" className="rounded-none border-gray-300 gap-2 h-10 hidden md:flex">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button
                                onClick={handleAdd}
                                className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-none h-10 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Discipline
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <DisciplineTable
                            disciplines={filteredDisciplines}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        {filteredDisciplines.length === 0 && (
                            <div className="py-12 text-center bg-gray-50 border border-t-0 border-dashed border-gray-300 rounded-none rounded-b-none">
                                <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm font-medium">No disciplines found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <DisciplineFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
            />
        </div>
    );
}
