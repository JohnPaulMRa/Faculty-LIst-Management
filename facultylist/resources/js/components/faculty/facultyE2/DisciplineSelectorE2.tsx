import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Combobox } from "@/components/ui/combobox";
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";

type Discipline = {
    code: string;
    desc: string;
    major_group_code?: string;
    is_group?: boolean;
};

type Props = {
    value?: string;
    onChange: (code: string, desc: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    referenceData?: any;
    showGroup?: boolean;
    hideCode?: boolean;
    filterKeyword?: string;
    filterCategory?: 'primary' | 'bachelors' | 'masters' | 'doctorate' | 'education';
    showClear?: boolean;
    readOnly?: boolean;
};

const DisciplineSelectorE2: FC<Props> = ({
    value,
    onChange,
    placeholder = "Select Discipline",
    className,
    disabled,
    referenceData,
    showGroup = true,
    hideCode = false,
    filterKeyword,
    filterCategory,
    showClear = false,
    readOnly = false
}) => {
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    // Safe access to reference data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const groups = referenceData?.groupDiscipline || [];
    const allDisciplines: Discipline[] = useMemo(() => {
        const specs = Array.isArray(referenceData?.disciplines) ? [...referenceData.disciplines] : [];
        if (groups && groups.length > 0) {
            // First, map each specific discipline to its correct major group by finding the longest matching prefix
            specs.forEach((d: Discipline) => {
                if (!d.major_group_code || String(d.major_group_code).length !== String(d.code).length) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const matchedGroups = groups.filter((g: any) => String(d.code).startsWith(String(g.code)));
                    if (matchedGroups.length > 0) {
                        // Sort by descending length so we pick the most specific major group (e.g. 1401 over 14)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        matchedGroups.sort((a: any, b: any) => String(b.code).length - String(a.code).length);
                        d.major_group_code = String(matchedGroups[0].code);
                    }
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            groups.forEach((g: any) => {
                const hasSpecific = specs.some((d: Discipline) => String(d.major_group_code) === String(g.code));
                if (!hasSpecific) {
                    // Inject the major group as a specific discipline if it has no children
                    specs.push({
                        code: String(g.code),
                        desc: g.desc,
                        major_group_code: String(g.code),
                        is_group: true
                    });
                }
            });
        }
        
        // Deduplicate disciplines based on code + description to prevent identical UI entries
        // while allowing multiple records with the same code but different descriptions
        return Array.from(new Map(specs.map(item => [String(item.code) + "_" + String(item.desc), item])).values());
    }, [referenceData?.disciplines, groups]);

    const findDisciplineGroup = (code: string | number) => {
        if (!code) return "";

        // Find by checking the flat list for the code
        const found = allDisciplines.find(d => String(d.code) === String(code));
        if (found && found.major_group_code) {
            return String(found.major_group_code);
        }

        // Fallback to prefix matching
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchedGroups = groups.filter((g: any) => String(code).startsWith(String(g.code)));
        if (matchedGroups.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            matchedGroups.sort((a: any, b: any) => String(b.code).length - String(a.code).length);
            return String(matchedGroups[0].code);
        }

        return "";
    };

    // Initialize group based on value
    useEffect(() => {
        // Debug logging to verify data reception
        if (!referenceData) {
            console.warn("DisciplineSelectorE2: No referenceData provided");
        }

        if (value && referenceData) {
            const group = findDisciplineGroup(value);
            if (group) {
                setSelectedGroup(group);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onChange(code, ""); // Still update code even if no matching description yet (allows typing)
        }
    };

    // Filter disciplines for the selected group and apply keyword/category filters
    const currentDisciplines = useMemo(() => {
        // For 'education' category, directly use the pre-fetched educationDisciplines from backend
        if (filterCategory === 'education') {
            const eduList: Discipline[] = Array.isArray(referenceData?.educationDisciplines)
                ? referenceData.educationDisciplines
                : [];

            if (filterKeyword) {
                const lowerFilter = filterKeyword.toLowerCase().trim();
                return eduList.filter(d =>
                    (d.desc && d.desc.toLowerCase().includes(lowerFilter)) ||
                    (d.code && d.code.toLowerCase().includes(lowerFilter))
                );
            }
            return eduList;
        }

        let filtered = showGroup
            ? allDisciplines.filter(d => d.major_group_code === selectedGroup)
            : allDisciplines;

        // Apply Category Filtering
        if (filterCategory) {
            const code = (d: Discipline) => String(d.code || '');
            const desc = (d: Discipline) => d.desc || '';

            if (filterCategory === 'bachelors') {
                filtered = filtered.filter(d => 
                    (
                        /\bbachelor(s)?\b/i.test(desc(d)) || 
                        /\bab\b/i.test(desc(d)) ||
                        /\bbs\b/i.test(desc(d)) ||
                        /\bassociate\b/i.test(desc(d)) ||
                        /\b(?:certificate|cert)\b/i.test(desc(d)) ||
                        /\bdiploma\b/i.test(desc(d)) ||
                        /\bpre-/i.test(desc(d)) ||
                        code(d).startsWith('507')
                    )
                );
            } else if (filterCategory === 'masters') {
                filtered = filtered.filter(d => 
                    (
                        /\bmaster(s)?\b/i.test(desc(d)) || 
                        /\bma\b/i.test(desc(d)) ||
                        /\bms\b/i.test(desc(d)) ||
                        /graduate certificate/i.test(desc(d)) ||
                        /\bprofessional\b/i.test(desc(d)) ||
                        code(d).startsWith('80')
                    )
                );
            } else if (filterCategory === 'doctorate') {
                filtered = filtered.filter(d => 
                    (
                        /\bdoctor(?:ate)?\b/i.test(desc(d)) || 
                        /\bph\.?d\.?\b/i.test(desc(d)) ||
                        /\bed\.?d\.?\b/i.test(desc(d)) ||
                        /post(?:\s|-)graduate/i.test(desc(d)) ||
                        code(d).startsWith('90') ||
                        desc(d).toLowerCase().includes('doctor') ||
                        desc(d).toLowerCase().includes('phd') ||
                        desc(d).toLowerCase().includes('ed.d')
                    )
                );
            } else if (filterCategory === 'primary') {
                // Primary Teaching: Exclude rows that are purely degree-focused
                filtered = filtered.filter(d => 
                    !d.is_group && (
                        !/\bbachelor(s)?\b/i.test(desc(d)) && 
                        !/\bmaster(s)?\b/i.test(desc(d)) && 
                        !/\bdoctor(?:ate)?\b/i.test(desc(d)) &&
                        !/\bphd\b/i.test(desc(d)) &&
                        !/\bab\b/i.test(desc(d)) &&
                        !/\bbs\b/i.test(desc(d)) &&
                        !/\bma\b/i.test(desc(d)) &&
                        !/\bms\b/i.test(desc(d)) &&
                        !/\bassociate\b/i.test(desc(d)) &&
                        !/post(?:\s|-)graduate/i.test(desc(d)) &&
                        !code(d).startsWith('507') &&
                        !code(d).startsWith('80') &&
                        !code(d).startsWith('90')
                    )
                );
            }
        }

        if (filterKeyword) {
            const lowerFilter = filterKeyword.toLowerCase().trim();
            filtered = filtered.filter(d => 
                (d.desc && d.desc.toLowerCase().includes(lowerFilter)) ||
                (d.code && d.code.toLowerCase().includes(lowerFilter))
            );
        }

        // --- DATA ACCURACY ENSURANCE ---
        if (value && !filtered.some(d => String(d.code) === String(value))) {
            const originalRecord = allDisciplines.find(d => String(d.code) === String(value));
            if (originalRecord) {
                filtered = [originalRecord, ...filtered];
            }
        }

        return filtered;
    }, [allDisciplines, showGroup, selectedGroup, filterKeyword, filterCategory, referenceData?.educationDisciplines, value]);

    const hasData = showGroup ? groups.length > 0 : allDisciplines.length > 0;
    if (!hasData) {
        return (
            <div className={`text-red-500 text-[10px] font-medium py-2 ${className}`}>
                Error: Reference data not loaded.
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    disabled={disabled || readOnly}
                    placeholder="Select Major Group"
                    showClear={showClear && !readOnly}
                    className="w-full shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-not-allowed disabled:border-gray-200 text-gray-900 rounded-md h-12 whitespace-normal text-left text-[15px]"
                />
            )}

            {/* Row 2: Code + Specific Discipline */}
            <div className={`flex ${hideCode ? 'gap-0 w-full' : 'gap-2 w-full'}`}>
                {/* Code Input (Read-only) */}
                {!hideCode && (
                    <Input
                        value={value || ''}
                        onChange={(e) => handleDisciplineChange(e.target.value)}
                        readOnly={readOnly}
                        className={cn(
                            "w-32 shrink-0 bg-gray-50 text-center font-bold text-gray-900 disabled:opacity-100 rounded-md border border-input h-12 text-[15px] flex items-center justify-center focus-visible:ring-0 shadow-none",
                            readOnly ? "cursor-not-allowed" : "cursor-text"
                        )}
                        placeholder="Code"
                        disabled={readOnly}
                    />
                )}

                {/* Specific Discipline Select */}
                <Combobox
                    options={mapToOptions(currentDisciplines)}
                    value={value}
                    onChange={handleDisciplineChange}
                    disabled={disabled || readOnly || (showGroup && !selectedGroup)}
                    placeholder={placeholder}
                    showClear={showClear && !readOnly}
                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-not-allowed disabled:border-gray-200 text-gray-900 rounded-md h-12 whitespace-normal text-left text-[15px]"
                />
            </div>
        </div>
    );
};

export default DisciplineSelectorE2;
