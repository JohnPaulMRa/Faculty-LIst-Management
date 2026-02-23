import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Combobox } from "@/components/ui/combobox";

type Discipline = {
    code: string;
    desc: string;
    major_group_code?: string;
};

type Props = {
    value?: string;
    onChange: (code: string, desc: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    referenceData?: any;
    showGroup?: boolean;
};

const DisciplineSelector: FC<Props> = ({
    value,
    onChange,
    placeholder = "Select Discipline",
    className,
    disabled,
    referenceData,
    showGroup = true
}) => {
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    // Safe access to reference data
    const groups = referenceData?.groupDiscipline || [];
    // Flattened disciplines from controller, augmenting with leaf major groups
    const allDisciplines: Discipline[] = (() => {
        const specs = Array.isArray(referenceData?.disciplines) ? [...referenceData.disciplines] : [];
        if (groups && groups.length > 0) {
            groups.forEach((g: any) => {
                const hasSpecific = specs.some((d: Discipline) => String(d.major_group_code) === String(g.code));
                if (!hasSpecific) {
                    // Inject the major group as a specific discipline if it has no children
                    specs.push({
                        code: String(g.code),
                        desc: g.desc,
                        major_group_code: String(g.code)
                    });
                }
            });
        }
        return specs;
    })();

    const findDisciplineGroup = (code: string | number) => {
        if (!code) return "";

        // Find by checking the flat list for the code
        const found = allDisciplines.find(d => String(d.code) === String(code));
        if (found && found.major_group_code) {
            return String(found.major_group_code);
        }

        // Fallback to prefix matching
        const prefix = String(code).substring(0, 2);
        if (groups.find((g: any) => String(g.code) === prefix)) {
            return prefix;
        }

        return "";
    };

    // Initialize group based on value
    useEffect(() => {
        // Debug logging to verify data reception
        if (!referenceData) {
            console.warn("DisciplineSelector: No referenceData provided");
        }

        if (value && referenceData) {
            const group = findDisciplineGroup(value);
            if (group) {
                setSelectedGroup(group);
            }
        }
    }, [value, referenceData]);

    const handleGroupChange = (groupCode: string) => {
        setSelectedGroup(groupCode);

        // Auto-select if the group has no specific disciplines (meaning it's the only option, which is the group itself)
        const specificForGroup = allDisciplines.filter(d => String(d.major_group_code) === String(groupCode));
        if (specificForGroup.length === 1 && String(specificForGroup[0].code) === String(groupCode)) {
            onChange(String(specificForGroup[0].code), specificForGroup[0].desc);
            return;
        }

        onChange("", "");
    };

    const handleDisciplineChange = (code: string) => {
        // Find from flat list
        const discipline = allDisciplines.find((d) => String(d.code) === String(code));
        if (discipline) {
            onChange(String(discipline.code), discipline.desc);
        } else {
            onChange("", "");
        }
    };

    // Filter disciplines for the selected group
    const currentDisciplines = showGroup
        ? allDisciplines.filter(d => d.major_group_code === selectedGroup)
        : allDisciplines;

    if (groups.length === 0) {
        return (
            <div className={`text-red-500 text-xs ${className}`}>
                Error: Reference data not loaded.
            </div>
        );
    }

    const mapToOptions = (list: any[]) => {
        return (list || [])
            .filter(item => item && item.desc && item.desc.trim() !== "")
            .map(item => ({ label: item.desc, value: item.code }));
    };

    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {/* Row 1: Major Group Select (Conditional) */}
            {showGroup && (
                <Combobox
                    options={mapToOptions(groups)}
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    disabled={disabled}
                    placeholder="Select Major Group"
                    searchPlaceholder="Search groups..."
                    className="w-full shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                />
            )}

            {/* Row 2: Code + Specific Discipline */}
            <div className="flex gap-2 w-full">
                {/* Code Input (Read-only) */}
                <Input
                    value={value || ''}
                    readOnly
                    className="w-24 shrink-0 bg-gray-50 text-center font-mono disabled:opacity-100 rounded-none h-auto"
                    placeholder="Code"
                />

                {/* Specific Discipline Select */}
                <Combobox
                    options={mapToOptions(currentDisciplines)}
                    value={value}
                    onChange={handleDisciplineChange}
                    disabled={disabled || (showGroup && !selectedGroup)}
                    placeholder={placeholder}
                    searchPlaceholder="Search disciplines..."
                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                />
            </div>
        </div>
    );
};

export default DisciplineSelector;

