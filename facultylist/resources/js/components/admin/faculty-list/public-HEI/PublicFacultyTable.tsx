import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface FacultyMember {
    id: string | number;
    name: string;
    sex: string;
    type: string;
    submissionStatus: 'submitted' | 'pending';
    schoolYear: string;
}

interface PublicFacultyTableProps {
    faculty: FacultyMember[];
}

export default function PublicFacultyTable({ faculty }: PublicFacultyTableProps) {
    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-gray-50/50 border-gray-200">
                        <TableHead className="w-[200px] font-semibold text-gray-700">Faculty Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Sex</TableHead>
                        <TableHead className="font-semibold text-gray-700">Employment Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">School Year</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {faculty.map((member) => (
                        <TableRow key={member.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                            <TableCell className="font-medium text-gray-900">{member.name}</TableCell>
                            <TableCell className="text-gray-600">{member.sex}</TableCell>
                            <TableCell>
                                <div className="max-w-[250px]" title={member.type}>
                                    <Badge variant="secondary" className="rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 truncate block w-full text-center">
                                        {member.type}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{member.schoolYear}</TableCell>
                            <TableCell>
                                <Badge
                                    className={`rounded-full font-medium shadow-none px-2.5 ${member.submissionStatus === 'submitted'
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                        }`}
                                >
                                    {member.submissionStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center py-2">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-md border-b-2 border-amber-600 active:border-b-0 active:translate-y-px transition-all text-[10px] font-bold uppercase tracking-wider"
                                        title="View Profile"
                                    >
                                        View Profile
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md border-b-2 border-blue-800 active:border-b-0 active:translate-y-px transition-all text-[10px] font-bold uppercase tracking-wider flex gap-1.5"
                                        title="View Submission"
                                    >
                                        <FileText className="h-3.5 w-3.5" />
                                        View Submission
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {faculty.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FileText className="h-8 w-8 text-gray-300" />
                                    <p>No faculty members found.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
