import type { FC } from 'react';
import { Input } from '@/components/ui/input';
import type { PublicFaculty } from '@/types/faculty';

type FacultyProfileCardsE2Props = {
    formData: Partial<PublicFaculty>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange?: (field: keyof PublicFaculty, value: any) => void;
    readOnly?: boolean;
};

export const FacultyProfileCardsE2: FC<FacultyProfileCardsE2Props> = ({ formData, handleChange, readOnly = false }) => {
    
    // Helper to handle change if not readOnly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onErrorSafeChange = (field: keyof PublicFaculty, value: any) => {
        if (!readOnly && handleChange) {
            handleChange(field, value);
        }
    };

    const cardClass = readOnly 
        ? "space-y-3" 
        : "bg-white p-4 border border-gray-200 shadow-sm space-y-3";

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">

            {/* Faculty Details Card */}
            <div className={cardClass}>
                <h3 className="font-bold text-gray-900 border-b pb-2">Faculty Details (E2)</h3>
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Faculty Name</label>
                        <Input 
                            value={formData.name || ''} 
                            onChange={(e) => onErrorSafeChange('name', e.target.value)}
                            className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none"
                            readOnly={readOnly}
                            disabled={readOnly}
                            placeholder="Last name, first name, middle initial"
                        />
                    </div>
                     <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Generic Faculty Rank (Code)</label>
                        <Input 
                            value={formData.rank || ''} 
                            onChange={(e) => onErrorSafeChange('rank', e.target.value)}
                            className="focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none"
                            readOnly={readOnly}
                            disabled={readOnly}
                            placeholder="Code"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Home Department</label>
                        <Input 
                            value={formData.department || ''} 
                            onChange={(e) => onErrorSafeChange('department', e.target.value)}
                            className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none"
                            readOnly={readOnly}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Education Card */}
            <div className={cardClass}>
                <h3 className="font-bold text-gray-900 border-b pb-2">Education</h3>
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Highest Degree Attained (Code)</label>
                         <Input 
                            value={formData.degree || ''} 
                            onChange={(e) => onErrorSafeChange('degree', e.target.value)}
                            className="focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none"
                            readOnly={readOnly}
                            disabled={readOnly}
                            placeholder="Code"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
