import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { getCurrentAcademicYear } from '@/lib/utils';
import type { Faculty } from '@/types/faculty';

export interface UseFacultyFiltersProps {
    initialFacultyData: Faculty[];
    filters: {
        search?: string;
        year?: string;
    };
    availableYears: string[];
}

export const useFacultyFilters = ({ initialFacultyData, filters, availableYears }: UseFacultyFiltersProps) => {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const initialYear =
        filters.year || (availableYears && availableYears.length > 0 ? availableYears[0] : getCurrentAcademicYear());
    const [yearFilter, setYearFilter] = useState<string>(initialYear);

    // --- Client-side filtered list ---
    const filteredFacultyList = useMemo(() => {
        let list = initialFacultyData;

        if (yearFilter) {
            list = list.filter((f) => f.joined_year === yearFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (f) =>
                    (f.name && f.name.toLowerCase().includes(q)) ||
                    (f.degree && f.degree.toLowerCase().includes(q)) ||
                    (f.form_type === 'E2' && f.rank && f.rank.toLowerCase().includes(q)) ||
                    (f.form_type === 'E2' && f.import_group && f.import_group.toLowerCase().includes(q)) ||
                    (f.form_type === 'E5' && f.rankCode && f.rankCode.toLowerCase().includes(q))
            );
        }

        return list;
    }, [initialFacultyData, yearFilter, searchQuery]);

    const handleYearChange = (year: string) => {
        setYearFilter(year);
        // Assuming 'facultyprofile' is the current route name or using '/' if not available
        router.get(window.location.pathname, { search: searchQuery, year }, { preserveScroll: true });
    };

    return {
        searchQuery,
        setSearchQuery,
        yearFilter,
        setYearFilter,
        filteredFacultyList,
        handleYearChange,
    };
};
