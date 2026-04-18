/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePage } from '@inertiajs/react';
import type { FC } from 'react';
import { Combobox } from "@/components/ui/combobox";

type Props = {
    value?: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string; // Allow passing styles
};

const AcademicYearSelect: FC<Props> = ({
    value,
    onValueChange,
    disabled = false,
    placeholder = "Select Academic Year",
    className
}) => {
    const { academicYears } = usePage<any>().props;

    return (
        <Combobox
            value={value}
            onChange={onValueChange}
            disabled={disabled}
            placeholder={placeholder}
            options={(academicYears || []).map((year: any) => ({
                label: year.name,
                value: year.name
            }))}
            className={className}
        />
    );
};

export default AcademicYearSelect;
