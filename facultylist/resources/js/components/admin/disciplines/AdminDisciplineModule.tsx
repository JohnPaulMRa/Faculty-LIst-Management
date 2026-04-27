/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { router } from '@inertiajs/react';
import { FileSpreadsheet, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AddDisciplineForm from './AddDisciplineForm';
import DisciplineTable, { type Program } from './DisciplineTable';
import EditDisciplineModal from './EditDisciplineModal';
import ImportDisciplineModal, { type ParsedDisciplineRow } from './ImportDisciplineModal';
import { useAlertDialog } from '@/components/faculty/hooks/useAlertDialog';
import AlertDialogModal from '@/components/common/AlertDialogModal';


interface SpecificDiscipline {
    code: string;
    description: string;
}

interface DisciplineGroup {
    code: string;
    description: string;
    specifics: SpecificDiscipline[];
}

interface MajorDiscipline {
    code: string;
    description: string;
    groups: DisciplineGroup[];
    specifics?: SpecificDiscipline[];
}

interface AdminDisciplineModuleProps {
    disciplines: MajorDiscipline[];
    serverPrograms?: any;
    serverFilters?: any;
}

export default function AdminDisciplineModule({ 
    disciplines = [], 
    serverPrograms, 
    serverFilters 
}: AdminDisciplineModuleProps) {
    // Sync search query with URL, using local state for immediate responsiveness
    const [searchQuery, setSearchQuery] = useState(serverFilters?.search || "");
    const [formResetKey, setFormResetKey] = useState(0);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    /** Rows parsed from Excel — shown in DisciplineTable as a preview */
    const [importPreviewRows, setImportPreviewRows] = useState<Program[] | null>(null);

    /** Local state for programs to enable optimistic UI updates (deletes) */
    const [localPrograms, setLocalPrograms] = useState<Program[]>(serverPrograms?.data || []);
    const { alertDialog, showAlert, showConfirm, closeDialog } = useAlertDialog();

    // Sync local state when server props change
    useEffect(() => {
        if (serverPrograms?.data) {
            setLocalPrograms(serverPrograms.data);
        }
    }, [serverPrograms]);

    // Inertia state for sorting
    const sortConfig = useMemo(() => ({
        key: serverFilters?.sort || 'code',
        direction: (serverFilters?.direction || 'asc') as 'asc' | 'desc'
    }), [serverFilters]);

    /** Map ParsedDisciplineRow[] → Program[] for the DisciplineTable */
    const handleParsed = (rows: ParsedDisciplineRow[]) => {
        const mapped: Program[] = rows.map((row, idx) => ({
            id: `import-${idx}-${row.code || 'no-code'}`,
            code: row.code,
            name: row.specificDiscipline ?? '',
            major: row.disciplineGroup,
            disciplineGroup: row.disciplineGroup,
            specificMajor: row.majorDiscipline ?? '',
            specificGroup: row.majorDiscipline ?? '',
            program: row.program,
            programLevel: '',
            originalData: {
                code: row.code,
                disciplineGroup: row.disciplineGroup,
                majorDiscipline: row.majorDiscipline ?? null,
                specificDiscipline: row.specificDiscipline ?? null,
                program: row.program,
                type: 'specific',
                _importStatus: row._status,
                _importError: row._error,
            },
        }));
        setImportPreviewRows(mapped);
    };

    const clearImportPreview = () => setImportPreviewRows(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    // Debounce search input to avoid hitting the server on every keystroke
    useEffect(() => {
        if (searchQuery === (serverFilters?.search || "")) return;

        const timer = setTimeout(() => {
            router.get(route('admin.disciplines'), {
                ...serverFilters,
                search: searchQuery,
                page: 1 // Reset to first page on new search
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, serverFilters]);

    const handleSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        router.get(route('admin.disciplines'), {
            ...serverFilters,
            sort: key,
            direction: direction
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Correctly identifying the actual rows to display
    // If import preview is active, USE that (all rows). Otherwise use localPrograms (which syncs with server).
    const displayPrograms = useMemo(() => {
        if (importPreviewRows !== null) return importPreviewRows;
        return localPrograms;
    }, [importPreviewRows, localPrograms]);


    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        showConfirm(
            'Are you sure you want to delete this discipline?',
            () => {
                // Optimistic update: remove from local state immediately
                const previousPrograms = [...localPrograms];
                setLocalPrograms(prev => prev.filter(p => p.id !== id));

                router.delete(route('admin.disciplines.destroy', id), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page: any) => {
                        const flash = (page.props as any).flash;
                        if (flash?.error) {
                            // Restore previous state on error
                            setLocalPrograms(previousPrograms);
                            toast.error('Error: ' + flash.error);
                        }
                    },
                    onError: (errors) => {
                        // Restore previous state on error
                        setLocalPrograms(previousPrograms);
                        const messages = Object.values(errors).join('\n');
                        toast.error('Error:\n' + messages);
                    }
                });
            },
            "Confirm Discipline Deletion",
            "error"
        );
    };

    const handleAddSubmit = (data: any, onSuccess?: () => void) => {
        setProcessing(true);
        router.post(route('admin.disciplines.store'), data, {
            onSuccess: (page: any) => {
                setProcessing(false);
                const flash = (page.props as any).flash;
                if (flash?.error) {
                    toast.error('Error: ' + flash.error);
                } else {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        setFormResetKey(prev => prev + 1);
                    }
                    toast.success('Discipline added successfully.');
                }
            },
            onError: (errors) => {
                setProcessing(false);
                const messages = Object.values(errors).join('\n');
                toast.error('Validation error:\n' + messages);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleEditSubmit = (data: any) => {
        if (!editingItem) return;
        setProcessing(true);
        const type = editingItem.type === 'specific' ? 'specific' : 'major';
        const newCode = data.code || editingItem.code;

        router.put(route('admin.disciplines.update', editingItem.id), {
            type,
            groupName: data.groupName,
            majorName: data.majorName,
            specificDiscipline: data.specificDiscipline,
            program: data.program,
            description: data.specificDiscipline || data.majorName || data.groupName || '', // Fallback for backward compatibility
            newCode: newCode !== editingItem.code ? newCode : undefined,
        }, {
            onSuccess: (page: any) => {
                setProcessing(false);
                const flash = (page.props as any).flash;
                if (flash?.error) {
                    toast.error('Error: ' + flash.error);
                } else {
                    setIsEditModalOpen(false);
                }
            },
            onError: (errors) => {
                setProcessing(false);
                const messages = Object.values(errors).join('\n');
                toast.error('Validation error:\n' + messages);
            },
        });
    };

    return (
        <div className="flex flex-col gap-8 w-full text-foreground bg-background">
            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discipline Management</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage academic disciplines, codes, and groups.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsImportModalOpen(true)}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-5 text-xs font-bold gap-2 shadow-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Import from Excel
                    </Button>
                </div>

                <div className="flex flex-col w-full">
                    <AddDisciplineForm
                        key={formResetKey}
                        onSubmit={handleAddSubmit}
                        majors={disciplines}
                        processing={processing}
                        serverPrograms={localPrograms}
                    />

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8">
                        {importPreviewRows !== null && (
                            <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <p className="text-xs font-semibold text-emerald-800">
                                        Previewing <span className="font-bold">{importPreviewRows.length}</span> rows from Excel import
                                    </p>
                                    <span className="text-xs text-emerald-600">— Click <strong>Import</strong> in the modal to save.</span>
                                </div>
                                <button
                                    onClick={clearImportPreview}
                                    className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" /> Clear
                                </button>
                            </div>
                        )}

                        <DisciplineTable
                            programs={displayPrograms}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                            searchQuery={searchQuery}
                            onSearchQueryChange={setSearchQuery}
                            serverPagination={serverPrograms}
                            serverFilters={serverFilters}
                            disciplines={disciplines}
                        />
                    </div>
                </div>
            </div>

            <AlertDialogModal
                open={alertDialog.open}
                message={alertDialog.message}
                type={alertDialog.type}
                title={alertDialog.title}
                onClose={closeDialog}
                onConfirm={alertDialog.onConfirm}
                confirmLabel="Delete"
            />

            <EditDisciplineModal
                isOpen={isEditModalOpen}
                onClose={() => { if (!processing) setIsEditModalOpen(false); }}
                onSubmit={handleEditSubmit}
                initialData={editingItem}
                processing={processing}
            />

            <ImportDisciplineModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onParsed={handleParsed}
                disciplines={disciplines}
            />
        </div>
    );
}
