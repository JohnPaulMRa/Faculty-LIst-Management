import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
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
    hideCode?: boolean;
};

const DisciplineSelector: FC<Props> = ({
    value,
    onChange,
    placeholder = "Select Discipline",
    className,
    disabled,
    referenceData,
    showGroup = true,
    hideCode = false
}) => {
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    // Safe access to reference data
    const groups = referenceData?.groupDiscipline || [];
    const allDisciplines: Discipline[] = useMemo(() => {
        const specs = Array.isArray(referenceData?.disciplines) ? [...referenceData.disciplines] : [];
        if (groups && groups.length > 0) {
            // First, map each specific discipline to its correct major group by finding the longest matching prefix
            specs.forEach((d: Discipline) => {
                if (!d.major_group_code || String(d.major_group_code).length !== String(d.code).length) {
                    const matchedGroups = groups.filter((g: any) => String(d.code).startsWith(String(g.code)));
                    if (matchedGroups.length > 0) {
                        // Sort by descending length so we pick the most specific major group (e.g. 1401 over 14)
                        matchedGroups.sort((a: any, b: any) => String(b.code).length - String(a.code).length);
                        d.major_group_code = String(matchedGroups[0].code);
                    }
                }
            });

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
    }, [referenceData?.disciplines, groups]);

    const findDisciplineGroup = (code: string | number) => {
        if (!code) return "";

        // Find by checking the flat list for the code
        const found = allDisciplines.find(d => String(d.code) === String(code));
        if (found && found.major_group_code) {
            return String(found.major_group_code);
        }

        // Fallback to prefix matching
        const matchedGroups = groups.filter((g: any) => String(code).startsWith(String(g.code)));
        if (matchedGroups.length > 0) {
            matchedGroups.sort((a: any, b: any) => String(b.code).length - String(a.code).length);
            return String(matchedGroups[0].code);
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

    const hasData = showGroup ? groups.length > 0 : allDisciplines.length > 0;
    if (!hasData) {
        return (
            <div className={`text-red-500 text-[10px] font-medium py-2 ${className}`}>
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
                    className="w-full shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-md h-12 whitespace-normal text-left text-lg"
                />
            )}

            {/* Row 2: Code + Specific Discipline */}
            <div className={`flex ${hideCode ? 'gap-0 w-full' : 'gap-2 w-full'}`}>
                {/* Code Input (Read-only) */}
                {!hideCode && (
                    <Input
                        value={value || ''}
                        readOnly
                        className="w-32 shrink-0 bg-gray-50 text-center font-semibold   disabled:opacity-100 rounded-md border border-input h-12 text-lg flex items-center justify-center"
                        placeholder="Code"
                    />
                )}

                {/* Specific Discipline Select */}
                <Combobox
                    options={mapToOptions(currentDisciplines)}
                    value={value}
                    onChange={handleDisciplineChange}
                    disabled={disabled || (showGroup && !selectedGroup)}
                    placeholder={placeholder}
                    searchPlaceholder="Search disciplines..."
                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-md h-12 whitespace-normal text-left text-lg"
                />
            </div>
        </div>
    );
};

export default DisciplineSelector;

