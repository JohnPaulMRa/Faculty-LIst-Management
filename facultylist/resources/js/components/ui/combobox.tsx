import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover"
import * as PopoverPrimitive from "@radix-ui/react-popover"

interface ComboboxProps {
    options: { label: string; value: string | number }[]
    value?: string | number
    onChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    disabled?: boolean
    className?: string
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    searchPlaceholder = "Search...", // Kept for backwards compatibility if needed
    emptyText = "No option found.",
    disabled = false,
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const selectedOption = React.useMemo(
        () => options.find((opt) => String(opt.value) === String(value)),
        [value, options]
    )

    // Sync input value with selected option
    React.useEffect(() => {
        if (selectedOption) {
            setInputValue(selectedOption.label)
        } else {
            setInputValue("")
        }
    }, [selectedOption])

    return (
        <Command shouldFilter={true} className="overflow-visible bg-transparent">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverPrimitive.Anchor asChild>
                    <div
                        className={cn(
                            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                            disabled && "opacity-50 pointer-events-none",
                            className
                        )}
                        onClick={() => !disabled && setOpen(true)}
                    >
                        <CommandPrimitive.Input
                            value={inputValue}
                            onValueChange={(val) => {
                                setInputValue(val)
                                if (!open) setOpen(true)
                                // Only explicitly clear the selection if the user deletes all text
                                if (val === '' && value) {
                                    onChange('')
                                }
                            }}
                            onBlur={(e) => {
                                // Important: We check relatedTarget to see if we're clicking an item inside the dropdown
                                // If we are clicking inside the popover, we DO NOT revert the text yet so onSelect can fire
                                const isClickingDropdown = e.relatedTarget?.closest('[data-radix-popper-content-wrapper]');

                                if (!isClickingDropdown) {
                                    if (selectedOption) {
                                        setInputValue(selectedOption.label)
                                    } else {
                                        setInputValue("")
                                    }
                                }
                            }}
                            onFocus={() => !disabled && setOpen(true)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                        />
                        <ChevronsUpDown
                            className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled) setOpen(!open);
                            }}
                        />
                    </div>
                </PopoverPrimitive.Anchor>
                <PopoverContent
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={String(option.label)}
                                    onSelect={() => {
                                        onChange(String(option.value) === String(value) ? "" : String(option.value))
                                        setInputValue(String(option.label))
                                        setOpen(false)
                                    }}
                                    className="flex items-start wrap-break-word"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 shrink-0 mt-[2px]",
                                            String(value) === String(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="flex-1 text-left">{option.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </PopoverContent>
            </Popover>
        </Command>
    )
}
