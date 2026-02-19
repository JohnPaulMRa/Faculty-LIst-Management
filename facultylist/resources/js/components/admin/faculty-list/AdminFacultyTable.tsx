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
import { FileText, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FacultyMember {
    id: string | number;
    name: string;
    sex: string;
    type: string;
    submissionStatus: 'submitted' | 'pending';
    schoolYear: string;
}

interface AdminFacultyTableProps {
    faculty: FacultyMember[];
}

export default function AdminFacultyTable({ faculty }: AdminFacultyTableProps) {
    return (
        <div className="rounded-none border border-gray-200 overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow className="hover:bg-gray-50 border-gray-200">
                        <TableHead className="w-[200px] font-bold text-gray-700">Faculty Name</TableHead>
                        <TableHead className="font-bold text-gray-700">Sex</TableHead>
                        <TableHead className="font-bold text-gray-700">Employment Type</TableHead>
                        <TableHead className="font-bold text-gray-700">School Year</TableHead>
                        <TableHead className="font-bold text-gray-700">Status</TableHead>
                        <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {faculty.map((member) => (
                        <TableRow key={member.id} className="hover:bg-gray-50/50 border-gray-100">
                            <TableCell className="font-medium text-gray-900">{member.name}</TableCell>
                            <TableCell className="text-gray-600">{member.sex}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="rounded-none font-normal bg-gray-100 text-gray-700 hover:bg-gray-200">
                                    {member.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{member.schoolYear}</TableCell>
                            <TableCell>
                                <Badge
                                    className={`rounded-none font-normal ${member.submissionStatus === 'submitted'
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-none'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-none'
                                        }`}
                                >
                                    {member.submissionStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-none">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-none border-gray-200">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem className="cursor-pointer rounded-none focus:bg-gray-100">
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-gray-100" />
                                        <DropdownMenuItem className="cursor-pointer rounded-none focus:bg-gray-100">
                                            <FileText className="mr-2 h-4 w-4" /> View Submission
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {faculty.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                No faculty members found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
