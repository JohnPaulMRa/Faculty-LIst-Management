import { useState } from 'react';
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
import { Pencil, Trash2, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { Label } from 'recharts';

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

interface DisciplineTableProps {
    major: MajorDiscipline;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
}

export default function DisciplineTable({ major, onEdit, onDelete }: DisciplineTableProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (code: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [code]: !prev[code]
        }));
    };

    return (
        <div className="border border-gray-200 rounded-none overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-blue-600 hover:bg-blue-600 border-b-2 border-gray-200">
                        <TableHead className="font-extrabold text-white w-[200px] uppercase text-xs tracking-wider">CODE </TableHead>
                        <TableHead className="font-extrabold text-white uppercase text-xs tracking-wider">MAJOR DISCIPLINE</TableHead>
                        <TableHead className="font-extrabold text-white text-right w-[140px] uppercase text-xs tracking-wider">ACTION</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Major Discipline Row */}
                    <TableRow className="bg-blue-100 hover:bg-blue-100">
                        <TableCell className="font-mono text-sm font-bold text-gray-900">
                            <Badge variant="outline" className="rounded-none px-3 py-1 font-bold border-gray-900 bg-white text-gray-900">
                                {major.code}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 font-bold text-lg">{major.description}</TableCell>
                        <TableCell className="text-right">
                            {/* Actions for Major if needed, or leave empty if user only wants actions on rows */}
                        </TableCell>
                    </TableRow>

                    {/* Discipline Groups */}
                    {major.groups.map((group) => (
                        <CardGroup
                            key={group.code}
                            major={major}
                            group={group}
                            isExpanded={!!expandedGroups[group.code]}
                            onToggle={() => toggleGroup(group.code)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function CardGroup({ major, group, isExpanded, onToggle, onEdit, onDelete }: {
    major: MajorDiscipline,
    group: DisciplineGroup,
    isExpanded: boolean,
    onToggle: () => void,
    onEdit: (item: any) => void,
    onDelete: (id: string) => void
}) {
    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-blue-50/30 border-gray-100 group/row"
                onClick={onToggle}
            >
                <TableCell className="pl-8">
                    <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-blue-600" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                        <span className="font-mono text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-none">
                            {group.code}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="font-semibold text-black">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-300" />
                        {group.description}
                        <span className="text-[10px] text-gray-400 font-normal ml-2">
                            ({group.specifics.length} specifics)
                        </span>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit({
                                    code: group.code,
                                    group: group.code,
                                    majorDiscipline: major.description,
                                    specificDiscipline: '', // Empty for group edit
                                    groupDescription: group.description, // Pass group description
                                    type: 'group' // Marker
                                });
                            }}
                            className="h-7 rounded-none text-black hover:text-blue-900 hover:bg-blue-50 text-xs px-2 font-medium"
                        >
                            Edit
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {isExpanded && (
                <TableRow className="bg-white hover:bg-white border-none">
                    <TableCell colSpan={3} className="p-0 border-none">
                        <div className="pl-16 pr-8 pb-4 animate-in slide-in-from-top-1 duration-200">
                            <div className="border-l-2 border-gray-100">
                                <Table>
                                    <TableHeader className="bg-blue-100 border-none">
                                        <TableRow className="hover:bg-transparent border-b border-gray-300">
                                            <TableHead className="h-8 text-[10px] uppercase font-bold text-gray-900 w-[120px]">Specific Code</TableHead>
                                            <TableHead className="h-8 text-[10px] uppercase font-bold text-gray-900">Description</TableHead>
                                            <TableHead className="h-8 text-[10px] uppercase font-bold text-gray-900 text-right w-[100px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.specifics.map((spec) => (
                                            <TableRow key={spec.code} className="hover:bg-gray-50/50 border-b border-gray-50 group/spec">
                                                <TableCell className="py-2 font-mono text-xs text-black">
                                                    {spec.code}
                                                </TableCell>
                                                <TableCell className="py-2 text-sm text-black">
                                                    {spec.description}
                                                </TableCell>
                                                <TableCell className="py-2 text-right">
                                                    <div className="flex items-center justify-end gap-1 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit({
                                                                code: spec.code,
                                                                group: group.code,
                                                                majorDiscipline: major.description,
                                                                specificDiscipline: spec.description,
                                                                type: 'specific'
                                                            })}
                                                            className="h-6 rounded-none text-blue-600 hover:text-blue-900 hover:bg-blue-50 text-xs px-2 font-medium"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onDelete(spec.code)}
                                                            className="h-6 rounded-none text-red-600 hover:text-red-900 hover:bg-red-50 text-xs px-2 font-medium"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}
