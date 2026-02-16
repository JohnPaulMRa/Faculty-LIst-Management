import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface DisciplineItem {
    id: number;
    code: string;
    group: string; // Discipline Group
    majorDiscipline: string; // Major Discipline Name
    specificDiscipline: string; // Specific Discipline Name
}

interface DisciplineTableProps {
    disciplines: DisciplineItem[];
    onEdit: (item: DisciplineItem) => void;
    onDelete: (id: number) => void;
}

export default function DisciplineTable({ disciplines, onEdit, onDelete }: DisciplineTableProps) {
    return (
        <div className="border border-gray-200 rounded-none overflow-hidden bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead className="font-bold text-gray-900 w-[100px]">CODE</TableHead>
                        <TableHead className="font-bold text-gray-900 w-[100px]">GROUP</TableHead>
                        <TableHead className="font-bold text-gray-900">MAJOR DISCIPLINE</TableHead>
                        <TableHead className="font-bold text-gray-900">SPECIFIC DISCIPLINE</TableHead>
                        <TableHead className="font-bold text-gray-900 text-right w-[140px]">ACTION</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {disciplines.length > 0 ? (
                        disciplines.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50/50 border-gray-100 group">
                                <TableCell className="font-mono text-xs font-semibold text-gray-600">
                                    <Badge variant="outline" className="rounded-none font-normal border-gray-300 bg-gray-50 text-gray-700">
                                        {item.code}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-600 font-medium">{item.group}</TableCell>
                                <TableCell className="text-gray-900 font-medium">{item.majorDiscipline}</TableCell>
                                <TableCell className="text-gray-600">{item.specificDiscipline}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(item)}
                                            className="h-8 w-8 rounded-none text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(item.id)}
                                            className="h-8 w-8 rounded-none text-gray-500 hover:text-red-600 hover:bg-red-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground hidden">
                                {/* Hidden because handled in parent component for better layout */}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
