import { FC, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    groupDiscipline,
    religionTheologyDisciplines,
    humanitiesDisciplines,
    educationDisciplines,
    fineArtsDisciplines,
    socialBehavioralDisciplines,
    businessAdminDisciplines,
    lawJurisprudenceDisciplines,
    naturalScienceDisciplines,
    mathematicsDisciplines,
    itRelatedDisciplines,
    medicalAlliedDisciplines,
    tradeCraftDisciplines,
    engineeringDisciplines,
    architectureDisciplines,
    agriculturalForestryFisheriesDisciplines,
    homeEconomicsDisciplines,
    serviceTradesDisciplines,
    massCommunicationDisciplines,
    otherDisciplines,
    maritimeDisciplines,
    generalDisciplines
} from '@/constants/groupDiscipline';

type Discipline = {
    code: string;
    desc: string;
};

type Props = {
    value?: string;
    onChange: (code: string, desc: string) => void;
    placeholder?: string;
    className?: string; // To support external styling
};

// Map group codes to their respective discipline arrays
const DISCIPLINE_MAP: Record<string, Discipline[]> = {
    "26": religionTheologyDisciplines,
    "22": humanitiesDisciplines,
    "14": educationDisciplines,
    "18": fineArtsDisciplines,
    "30": socialBehavioralDisciplines,
    "34": businessAdminDisciplines,
    "38": lawJurisprudenceDisciplines,
    "42": naturalScienceDisciplines,
    "46": mathematicsDisciplines,
    "47": itRelatedDisciplines,
    "50": medicalAlliedDisciplines,
    "52": tradeCraftDisciplines,
    "54": engineeringDisciplines,
    "58": architectureDisciplines,
    "62": agriculturalForestryFisheriesDisciplines,
    "66": homeEconomicsDisciplines,
    "78": serviceTradesDisciplines,
    "84": massCommunicationDisciplines,
    "89": otherDisciplines,
    "90": maritimeDisciplines,
    "00": generalDisciplines
};

const findDisciplineGroup = (code: string) => {
    if (!code) return "";
    
    // First try to find by checking which array contains the code
    // This is necessary because some disciplines (like Maritime) have codes that don't match the group prefix
    for (const [groupCode, disciplines] of Object.entries(DISCIPLINE_MAP)) {
        if (disciplines.find(d => d.code === code)) {
            return groupCode;
        }
    }

    // Fallback to prefix matching for standard codes
    // Most codes start with the group code (2 digits)
    const prefix = code.substring(0, 2);
    if (groupDiscipline.find(g => g.code === prefix)) {
        return prefix;
    }

    return "";
};

const DisciplineSelector: FC<Props> = ({ value, onChange, placeholder = "Select Discipline", className }) => {
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    // Initialize group based on value
    useEffect(() => {
        if (value) {
            const group = findDisciplineGroup(value);
            if (group) {
                setSelectedGroup(group);
            }
        }
    }, [value]);

    const handleGroupChange = (groupCode: string) => {
        setSelectedGroup(groupCode);
        // Reset discipline when group changes
        onChange("", "");
    };

    const handleDisciplineChange = (code: string) => {
        const disciplines = DISCIPLINE_MAP[selectedGroup] || [];
        const discipline = disciplines.find(d => d.code === code);
        if (discipline) {
            onChange(discipline.code, discipline.desc);
        }
    };

    const currentDisciplines = DISCIPLINE_MAP[selectedGroup] || [];

    // Find description for current value to display in trigger if needed (SelectValue handles this automatically if value matches Option)
    // But we need to make sure the specific discipline select has the options loaded.

    return (
        <div className={`flex gap-2 w-full ${className}`}>
            {/* Major Group Select */}
            <Select value={selectedGroup} onValueChange={handleGroupChange}>
                <SelectTrigger className="w-[180px] shrink-0">
                    <SelectValue placeholder="Select Major Group" />
                </SelectTrigger>
                <SelectContent className="h-[300px]">
                    {groupDiscipline.map((group) => (
                        <SelectItem key={group.code} value={group.code}>
                            {group.desc}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Code Input (Read-only) */}
            <Input 
                value={value || ''} 
                readOnly 
                className="w-24 shrink-0 bg-gray-50 text-center font-mono"
                placeholder="Code" 
            />

            {/* Specific Discipline Select */}
            <Select value={value} onValueChange={handleDisciplineChange} disabled={!selectedGroup}>
                <SelectTrigger className="flex-1">
                     {/* Show ONLY description in the value */}
                     <span className="truncate">
                        {value ? (
                             (() => {
                                // Find the discipline object across all lists or current list
                                // Optimization: Look in current list first
                                const d = currentDisciplines.find(d => d.code === value);
                                if (d) return d.desc;
                                // Fallback just show value if desc not found (shouldn't happen often)
                                return value;
                             })()
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                     </span>
                </SelectTrigger>
                <SelectContent className="h-[300px] min-w-[300px]">
                    {currentDisciplines.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                            <span className="font-mono mr-2 text-gray-500">{item.code}</span>
                            {item.desc}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default DisciplineSelector;
