import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";

export interface Program {
    id: string; // Composite key or specific code
    code: string;
    name: string;
    major: string;
    disciplineGroup: string;
    specificMajor: string;
    specificGroup: string;
    programLevel: string;
    originalData: any; // Keep reference for editing
}

interface DisciplineTableProps {
    programs: Program[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onSort: (key: string) => void;
    sortConfig: { key: string, direction: 'asc' | 'desc' } | null;
}

export default function DisciplineTable({ programs, onEdit, onDelete, onSort, sortConfig }: DisciplineTableProps) {
    return (
        <div className="border border-gray-200 rounded-none overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-blue-600 hover:bg-blue-600 border-b-0">
                        <TableHead className="font-bold text-white uppercase text-xs tracking-wider w-12 text-center h-10">#</TableHead>
                        <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[15%]">
                            <div
                                className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'code' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                onClick={() => onSort('code')}
                            >
                                Code <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'code' ? 'opacity-100' : 'opacity-70'}`} />
                            </div>
                        </TableHead>
                        <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[20%]">
                            <div
                                className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'disciplineGroup' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                onClick={() => onSort('disciplineGroup')}
                            >
                                Discipline Group <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'disciplineGroup' ? 'opacity-100' : 'opacity-70'}`} />
                            </div>
                        </TableHead>
                        <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[30%]">
                            <div
                                className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'specificMajor' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                onClick={() => onSort('specificMajor')}
                            >
                                Major Discipline <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'specificMajor' ? 'opacity-100' : 'opacity-70'}`} />
                            </div>
                        </TableHead>
                        <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10">
                            <div
                                className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'name' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                onClick={() => onSort('name')}
                            >
                                Specific Discipline <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'name' ? 'opacity-100' : 'opacity-70'}`} />
                            </div>
                        </TableHead>
                        <TableHead className="font-bold text-white uppercase text-xs tracking-wider text-center h-10">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                No programs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        programs.map((program, index) => (
                            <TableRow key={program.id} className="even:bg-gray-50 hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                                <TableCell className="text-center font-medium text-gray-500 text-xs py-2">{index + 1}</TableCell>
                                <TableCell className="font-medium text-gray-900 text-xs py-2">{program.code}</TableCell>
                                <TableCell className="text-gray-500 text-xs uppercase py-2">{program.disciplineGroup}</TableCell>
                                <TableCell className="text-gray-500 text-xs uppercase py-2">{program.specificMajor}</TableCell>
                                <TableCell className="text-gray-700 text-xs font-semibold uppercase py-2">{program.name}</TableCell>
                                <TableCell className="text-center py-2">
                                    <div className="flex items-center justify-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(program.originalData)}
                                            className="h-7 w-7 p-0 bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-sm shadow-sm"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(program.code)}
                                            className="h-7 w-7 p-0 bg-red-500 hover:bg-red-600 text-white rounded-sm shadow-sm"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
