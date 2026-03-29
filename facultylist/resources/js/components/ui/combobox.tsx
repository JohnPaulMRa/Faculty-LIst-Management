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
    onInputChange?: (inputValue: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    disabled?: boolean
    className?: string
    containerClassName?: string
    allowFreeInput?: boolean
    showCodePrefix?: boolean
}

export function Combobox({
    options,
    value,
    onChange,
    onInputChange,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    disabled = false,
    className,
    containerClassName,
    allowFreeInput = false,
    showCodePrefix = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const isMouseDownOnDropdown = React.useRef(false)

    const selectedOption = React.useMemo(
        () => options.find((opt) => String(opt.value) === String(value)),
        [value, options]
    )

    // Sync input value with selected option or clear if value is explicitly cleared
    React.useEffect(() => {
        if (selectedOption) {
            setInputValue(selectedOption.label)
        } else {
            // If there's no selected option and we're not allowing free input, or if the value is explicitly cleared
            if (!allowFreeInput || !value) {
                setInputValue("")
            }
        }
    }, [selectedOption, allowFreeInput, value])

    return (
        <Command shouldFilter={true} className={cn("overflow-visible bg-transparent", containerClassName)}>
            <Popover open={open} onOpenChange={() => { }}>
                <PopoverPrimitive.Anchor asChild>
                    <div
                        className={cn(
                            "flex w-full items-center rounded-md border border-input bg-white text-sm shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden h-12 px-3",
                            disabled && "opacity-50 pointer-events-none",
                            className
                        )}
                    >
                        {showCodePrefix && (
                            <div className="shrink-0 h-full w-[80px] bg-[#F8F9FA] rounded-l-md border-r border-input flex items-center justify-center text-sm font-bold text-[#6B7280] select-none tracking-wide uppercase -ml-3 mr-3">
                                {selectedOption ? String(selectedOption.value) : "Code"}
                            </div>
                        )}
                        <div className="flex flex-1 items-center h-full min-w-0">
                            <CommandPrimitive.Input
                                value={inputValue}
                                onValueChange={(val) => {
                                    setInputValue(val)
                                    if (!open) setOpen(true)
                                    if (onInputChange) onInputChange(val)
                                    if (val === '' && value) {
                                        onChange('')
                                    }
                                }}
                                onFocus={() => {
                                    if (!disabled) setOpen(true)
                                }}
                                onBlur={() => {
                                    if (isMouseDownOnDropdown.current) return
                                    setOpen(false)
                                    if (!allowFreeInput) {
                                        if (selectedOption) {
                                            setInputValue(selectedOption.label)
                                        } else {
                                            setInputValue("")
                                        }
                                    }
                                    // if allowFreeInput, keep whatever was typed
                                }}
                                placeholder={placeholder}
                                disabled={disabled}
                                className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
                            />
                            <ChevronsUpDown
                                className="ml-2 h-4 w-4 shrink-0 opacity-40 cursor-pointer hover:opacity-70 transition-opacity"
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    if (!disabled) setOpen((prev) => !prev)
                                }}
                            />
                        </div>
                    </div>
                </PopoverPrimitive.Anchor>
                <PopoverContent
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        // Prevent Radix from auto-closing; we control open state manually
                        e.preventDefault()
                    }}
                    onMouseDown={() => { isMouseDownOnDropdown.current = true }}
                    onMouseUp={() => { isMouseDownOnDropdown.current = false }}
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
                                    className="flex items-start wrap-break-word py-3"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 shrink-0 mt-[2px]",
                                            String(value) === String(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="flex-1 text-left text-sm">{option.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </PopoverContent>
            </Popover>
        </Command>
    )
}
