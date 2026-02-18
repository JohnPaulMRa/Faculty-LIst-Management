import type { FC } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePage } from '@inertiajs/react';

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
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {academicYears && academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.name}>
                        {year.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default AcademicYearSelect;
