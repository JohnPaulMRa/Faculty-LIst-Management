import React, { useState } from 'react';
import { Search, University, Building2, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInput,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface School {
    id: number;
    name: string;
    code: string | null;
    faculty: number;
    type: 'Public' | 'Private';
    status: string;
}

interface AdminFacultySidebarProps {
    schools: School[];
    selectedSchoolId: number | null;
    onSchoolSelect: (id: number) => void;
    typeFilter?: string;
}

export function AdminFacultySidebar({ schools, selectedSchoolId, onSchoolSelect, typeFilter }: AdminFacultySidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const privateSchools = (!typeFilter || typeFilter === 'Private') ? filteredSchools.filter(s => s.type === 'Private') : [];
    const publicSchools = (!typeFilter || typeFilter === 'Public') ? filteredSchools.filter(s => s.type === 'Public') : [];

    return (
        <Sidebar className="" collapsible="none">
            <SidebarContent>
                <SidebarGroup className="py-2">
                    <SidebarGroupLabel>Find School</SidebarGroupLabel>
                    <SidebarGroupContent className="px-2 mt-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
                            <SidebarInput
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                <ScrollArea className="flex-1 -mx-2">
                    {privateSchools.length > 0 && (
                        <Collapsible defaultOpen className="group/collapsible">
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                                        Private Schools
                                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {privateSchools.map(school => (
                                                <SidebarMenuItem key={school.id}>
                                                    <SidebarMenuButton
                                                        isActive={selectedSchoolId === school.id}
                                                        onClick={() => onSchoolSelect(school.id)}
                                                        className="h-auto py-2"
                                                    >
                                                        <Building2 className="mr-2 h-4 w-4 shrink-0" />
                                                        <div className="flex flex-col items-start gap-1 overflow-hidden">
                                                            <span className="truncate w-full font-medium">{school.name}</span>
                                                            {school.code && (
                                                                <span className="text-xs text-muted-foreground font-mono">{school.code}</span>
                                                            )}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    )}

                    {publicSchools.length > 0 && (
                        <Collapsible defaultOpen className="group/collapsible">
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                                        Public Schools (SUCs)
                                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {publicSchools.map(school => (
                                                <SidebarMenuItem key={school.id}>
                                                    <SidebarMenuButton
                                                        isActive={selectedSchoolId === school.id}
                                                        onClick={() => onSchoolSelect(school.id)}
                                                        className="h-auto py-2"
                                                    >
                                                        <University className="mr-2 h-4 w-4 shrink-0" />
                                                        <div className="flex flex-col items-start gap-1 overflow-hidden">
                                                            <span className="truncate w-full font-medium">{school.name}</span>
                                                            {school.code && (
                                                                <span className="text-xs text-muted-foreground font-mono">{school.code}</span>
                                                            )}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    )}

                    {filteredSchools.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No schools found.
                        </div>
                    )}
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    );
}
