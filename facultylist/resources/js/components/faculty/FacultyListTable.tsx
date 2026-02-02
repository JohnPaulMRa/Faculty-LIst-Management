import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Trash2,
    Edit,
    FileSpreadsheet,
} from 'lucide-react';
import { Faculty } from '@/types/faculty';
import { FC } from 'react';

type Props = {
    facultyList: Faculty[];
    yearFilter: string;
    onFileClick: (faculty: Faculty) => void;
    onDelete: (id: string) => void;
    onEdit: (faculty: Faculty) => void;
};

const FacultyListTable: FC<Props> = ({ facultyList, yearFilter, onFileClick, onDelete, onEdit }) => {
    const getStatusBadge = (status: string): string => {
        const styles: Record<string, string> = {
            'Completed': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            'No Submission': 'bg-red-100 text-red-700 border border-red-200',
            'Not Yet Completed': 'bg-orange-100 text-orange-700 border border-orange-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    return (
        <div className="flex flex-col border border-black bg-white shadow-none overflow-hidden rounded-none">
            <div className="overflow-x-auto">
                {/* SPREADSHEET HEADER */}
                <div className="bg-white text-black px-3 py-1.5 text-xl font-bold uppercase tracking-wide border-b border-black">
                    FACULTY DATA RECORDS
                </div>

                <table className="w-full border-collapse text-xl whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-black text-white border-b border-black">
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-left">File</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-left">Name of Faculty</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-left">Generic Rank</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-left">Home College</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-left">Home Dept</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-left">Highest Degree Attained</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-center">Gender</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-center">Year</th>
                            <th className="px-3 py-2 border-r border-white/20 font-bold text-center">Status</th>
                            <th className="px-3 py-2 font-bold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {facultyList.length > 0 ? (
                        facultyList.map((faculty) => (
                            <tr key={faculty.id} className="border-b border-black hover:bg-gray-100 transition-colors">
                                <td className="px-3 py-1.5 border border-black">
                                    <span className="text-black font-bold">
                                        Form-{faculty.form_type}
                                    </span>
                                </td>
                                <td className="px-3 py-1.5 border border-black text-black font-medium">{faculty.name}</td>
                                <td className="px-3 py-1.5 border border-black text-black">{faculty.rank}</td>
                                <td className="px-3 py-1.5 border border-black text-black">College of Science</td>
                                <td className="px-3 py-1.5 border border-black text-black">{faculty.department}</td>
                                <td className="px-3 py-1.5 border border-black text-black">{faculty.degree}</td>
                                <td className="px-3 py-1.5 border border-black text-center text-black">Female</td>
                                <td className="px-3 py-1.5 border border-black text-center text-black">{faculty.joined_year}</td>
                                <td className="px-3 py-1.5 border border-black text-center">
                                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-sm font-bold ${getStatusBadge(faculty.status)}`}>
                                        {faculty.status}
                                    </span>
                                </td>
                                <td className="px-3 py-1.5 border border-black text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="hover:text-black text-gray-600 transition-colors w-full h-full flex items-center justify-center p-1" aria-label="Actions menu">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="text-xs w-40">
                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onFileClick(faculty)}>
                                                <FileSpreadsheet className="h-3 w-3"/> Expand File
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => onEdit(faculty)}>
                                                <Edit className="h-3 w-3"/> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer" onClick={() => onDelete(faculty.id)}>
                                                <Trash2 className="h-3 w-3"/> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="px-6 py-8 text-center text-gray-500 text-sm border border-black bg-gray-50">
                                No records found for {yearFilter}.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyListTable;
