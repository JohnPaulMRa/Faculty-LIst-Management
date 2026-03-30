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
    className?: string;
};

const STATUS_OPTIONS = [
    "Updated",
    "Not Yet Completed",
    "Submitted",
    "No Submission"
];

const FacultyStatusSelectE2: FC<Props> = ({
    value,
    onValueChange,
    disabled = false,
    placeholder = "Select Status",
    className
}) => {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                        {status}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default FacultyStatusSelectE2;
