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
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-gray-100">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-lg border-gray-200 shadow-md">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-gray-100 m-1">
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-gray-100" />
                                        <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-gray-100 m-1">
                                            <FileText className="mr-2 h-4 w-4" /> View Submission
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
