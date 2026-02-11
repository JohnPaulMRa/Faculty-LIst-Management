import type { FC } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {Array.from({ length: 15 }, (_, i) => {
                    const currentYear = new Date().getFullYear();
                    // Generate range: 
                    // Let's frame it relative to current year.
                    // e.g. Current = 2026.
                    // We want options for a few years ahead and many years back.
                    // i=0 -> offset +5 (2031) -- maybe too far?
                    // Let's stick to the previous logic but slightly expanded if needed
                    // Previous logic: currentYear + 1 - i
                    // if i=0, 2027. Range 2027-2028.
                    // if i=14, 2013-2014.
                    
                    const startYear = currentYear + 1 - i;
                    const yearStr = `${startYear}-${startYear + 1}`;
                    return (
                        <SelectItem key={yearStr} value={yearStr}>
                            {yearStr}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};

export default AcademicYearSelect;
