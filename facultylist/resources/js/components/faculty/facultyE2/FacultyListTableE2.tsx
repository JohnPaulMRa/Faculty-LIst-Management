import {
    Trash2,
    Eye,
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

const FacultyListTableE2: FC<Props> = ({ facultyList, yearFilter, onFileClick, onDelete, onEdit }) => {
    const getStatusBadge = (status: string): string => {
        const styles: Record<string, string> = {
            'Completed': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            'No Submission': 'bg-red-100 text-red-700 border border-red-200',
            'Not Yet Completed': 'bg-red-100 text-red-700 border border-red-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
    };

    return (
        <div className="flex flex-col border border-gray-300 bg-white shadow-none overflow-hidden rounded-none m-4">
            <div className="overflow-x-auto">
                {/* SPREADSHEET HEADER */}
                <div className="bg-gray-50 text-black px-4 py-3 text-sm font-bold uppercase tracking-wide border-b border-gray-300">
                    FACULTY DATA RECORDS (E2)
                </div>

                <table className="w-full border-collapse text-xl whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-gray-100 text-black border-b border-gray-300">
                            <th className="px-3 py-2 font-bold text-center">No.</th>
                            <th className="px-3 py-2 font-bold text-center">Academic Year</th>
                            <th className="px-3 py-2 font-bold text-center">Faculty Name</th>
                            <th className="px-3 py-2 font-bold text-center">Gender</th>
                            <th className="px-3 py-2 font-bold text-center">Full-Time / Part-Time</th>
                            <th className="px-3 py-2 font-bold text-center">Status</th>
                            <th className="px-3 py-2 font-bold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm ">
                    {facultyList.length > 0 ? (
                        facultyList.map((faculty, index) => (
                            <tr key={faculty.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                                <td className="px-3 py-2 text-center text-black">{index + 1}</td>
                                <td className="px-3 py-2 text-center text-black">{faculty.joined_year}</td>
                                <td className="px-3 py-2 text-center font-medium text-black">{faculty.name}</td>
                                <td className="px-3 py-2 text-center text-black">Female</td>
                                <td className="px-3 py-2 text-center text-black">
                                    {faculty.employment === 'Plantilla' ? 'Full-Time' : 'Part-Time'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-none font-bold ${getStatusBadge(faculty.status)}`}>
                                        {faculty.status}
                                    </span>
                                </td>
                                <td className="px-3 py-2 font-bold text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => onEdit(faculty)}
                                            className="flex items-center gap-1 text-black-600 hover:text-black transition-colors bg-blue-50 px-2 py-1.5 rounded-none border border-blue-200 text-xs font-semibold"
                                            title="View Profile"
                                        >
                                            <Eye className="h-3 w-3" /> View Profile
                                        </button>
                                        <button 
                                            onClick={() => onDelete(faculty.id)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors bg-red-50 px-2 py-1.5 rounded-none border border-red-200 text-xs font-semibold"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm border border-gray-300 bg-gray-50">
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

export default FacultyListTableE2;
