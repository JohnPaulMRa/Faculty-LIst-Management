import type { FC} from 'react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Discipline = {
    code: string;
    desc: string;
};

type Props = {
    value?: string;
    onChange: (code: string, desc: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    referenceData?: any; // Made optional to avoid breaking if not passed immediately, but generally required
};

const DisciplineSelector: FC<Props> = ({ value, onChange, placeholder = "Select Discipline", className, disabled, referenceData }) => {
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    // Safe access to reference data
    const groups = referenceData?.groupDiscipline || [];
    const disciplineMap = referenceData?.disciplines || {};

    const findDisciplineGroup = (code: string) => {
        if (!code) return "";
        
        // First try to find by checking which array contains the code
        for (const [groupCode, disciplines] of Object.entries(disciplineMap)) {
            if ((disciplines as Discipline[]).find(d => d.code === code)) {
                return groupCode;
            }
        }

        // Fallback to prefix matching
        const prefix = code.substring(0, 2);
        if (groups.find((g: any) => g.code === prefix)) {
            return prefix;
        }

        return "";
    };

    // Initialize group based on value
    useEffect(() => {
        if (value && referenceData) {
            const group = findDisciplineGroup(value);
            if (group) {
                setSelectedGroup(group);
            }
        }
    }, [value, referenceData]);

    const handleGroupChange = (groupCode: string) => {
        setSelectedGroup(groupCode);
        onChange("", "");
    };

    const handleDisciplineChange = (code: string) => {
        const disciplines = disciplineMap[selectedGroup] || [];
        const discipline = disciplines.find((d: any) => d.code === code);
        if (discipline) {
            onChange(discipline.code, discipline.desc);
        }
    };

    const currentDisciplines = disciplineMap[selectedGroup] || [];

    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {/* Row 1: Major Group Select (Full Width) */}
            <Select value={selectedGroup} onValueChange={handleGroupChange} disabled={disabled}>
                <SelectTrigger className="w-full shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                    <SelectValue placeholder="Select Major Group" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                    {groups.map((group: any) => (
                        <SelectItem key={group.code} value={group.code}>
                            {group.desc}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Row 2: Code + Specific Discipline */}
            <div className="flex gap-2 w-full">
                {/* Code Input (Read-only) */}
                <Input 
                    value={value || ''} 
                    readOnly 
                    className="w-24 shrink-0 bg-gray-50 text-center font-mono disabled:opacity-100 rounded-none"
                    placeholder="Code" 
                />

                {/* Specific Discipline Select */}
                <Select value={value} onValueChange={handleDisciplineChange} disabled={disabled || !selectedGroup}>
                    <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                         <span className="truncate">
                            {value ? (
                                 (() => {
                                    const d = currentDisciplines.find((d: any) => d.code === value);
                                    if (d) return d.desc;
                                    return value;
                                 })()
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                         </span>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] min-w-[300px]">
                        {currentDisciplines.map((item: any) => (
                            <SelectItem key={item.code} value={item.code}>
                                {item.desc}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default DisciplineSelector;
