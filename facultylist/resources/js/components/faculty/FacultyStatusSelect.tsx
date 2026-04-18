import type { FC } from 'react';
import { Combobox } from "@/components/ui/combobox";

type Props = {
    value?: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
};

const STATUS_OPTIONS = [
    "Not Updated",
    "Submitted"
];

const FacultyStatusSelect: FC<Props> = ({
    value,
    onValueChange,
    disabled = false,
    placeholder = "Select Status",
    className
}) => {
    return (
        <Combobox
            value={value}
            onChange={onValueChange}
            disabled={disabled}
            placeholder={placeholder}
            options={STATUS_OPTIONS.map((status) => ({
                label: status,
                value: status
            }))}
            className={className}
        />
    );
};

export default FacultyStatusSelect;
