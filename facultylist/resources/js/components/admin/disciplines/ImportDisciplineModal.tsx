/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from "@inertiajs/react";
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

export interface ParsedDisciplineRow {
    code: string;
    groupName: string;
    majorName: string;
    specificDiscipline: string;
    _status?: "pending" | "success" | "error";
    _error?: string;
}

interface ImportDisciplineModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called immediately after a file is successfully parsed, with valid rows only */
    onParsed: (rows: ParsedDisciplineRow[]) => void;
}

// Extracting by strict Excel Column Letters instead of dynamic headers
// Column C: PROGDIS (Code)
// Column D: CLUSTER_OF_DISCIPLINE (Major Discipline)
// Column G: PROGRAM (Specific Discipline)
// Column K or L: CHEDClass-DESCRIPTION (Discipline Group)

export default function ImportDisciplineModal({ isOpen, onClose, onParsed }: ImportDisciplineModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [rows, setRows] = useState<ParsedDisciplineRow[]>([]);
    const [parseError, setParseError] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [importDone, setImportDone] = useState(false);
    const [importStats, setImportStats] = useState({ success: 0, error: 0 });

    const reset = () => {
        setFileName(null);
        setRows([]);
        setParseError(null);
        setImporting(false);
        setImportDone(false);
        setImportStats({ success: 0, error: 0 });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const parseFile = useCallback((file: File) => {
        setParseError(null);
        setRows([]);
        setImportDone(false);
        setImportStats({ success: 0, error: 0 });
        setFileName(file.name);

        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["xlsx", "xls", "csv"].includes(ext ?? "")) {
            setParseError("Unsupported file. Please upload a .xlsx, .xls, or .csv file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                // Read using A, B, C column letter keys instead of row headers
                const jsonRows: any[] = XLSX.utils.sheet_to_json(sheet, { header: "A", defval: "" });

                if (jsonRows.length === 0) {
                    setParseError("The file has no data rows.");
                    return;
                }

                const parsed: ParsedDisciplineRow[] = [];

                jsonRows.forEach((row) => {
                    const rawCode = String(row["C"] ?? "").trim();
                    // Skip actual header rows or empty rows
                    if (!rawCode || rawCode.toLowerCase().includes("progdis") || rawCode.toLowerCase() === "code") {
                        return;
                    }

                    const code = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                    // Merged columns sometimes push value to K, sometimes to L
                    const groupName = String(row["K"] || row["L"] || "").trim();
                    const majorName = String(row["D"] || "").trim();
                    const specificDiscipline = String(row["G"] || "").trim();

                    if (!code || code.length < 2) {
                        parsed.push({ code, groupName, majorName, specificDiscipline, _status: "error" as const, _error: "Code is missing or too short." });
                        return;
                    }
                    if (!majorName && !specificDiscipline) {
                        parsed.push({ code, groupName, majorName, specificDiscipline, _status: "error" as const, _error: "MajorName or SpecificDiscipline is required." });
                        return;
                    }
                    parsed.push({ code, groupName, majorName, specificDiscipline, _status: "pending" as const });
                });

                if (parsed.length === 0) {
                    setParseError("Could not find any valid discipline data in Column C, D, G, K/L. Please check the Excel format.");
                    return;
                }

                setRows(parsed);

                // Emit all rows (valid + invalid) to parent so table can preview them
                onParsed(parsed);

            } catch {
                setParseError("Failed to read the file. Ensure it is a valid Excel or CSV file.");
            }
        };
        reader.readAsArrayBuffer(file);
    }, [onParsed]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseFile(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) parseFile(file);
    }, [parseFile]);

    const validRows = rows.filter((r) => r._status === "pending");
    const invalidRows = rows.filter((r) => r._status === "error");

    const handleImport = async () => {
        if (validRows.length === 0) return;
        setImporting(true);

        let success = 0;
        let error = 0;
        const updatedRows = [...rows];

        for (let i = 0; i < updatedRows.length; i++) {
            const row = updatedRows[i];
            if (row._status !== "pending") continue;

            await new Promise<void>((resolve) => {
                router.post(
                    route("admin.disciplines.store"),
                    {
                        code: row.code,
                        groupName: row.groupName,
                        majorName: row.majorName,
                        specificDiscipline: row.specificDiscipline || null,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page: any) => {
                            const flash = (page.props as any).flash;
                            if (flash?.error) {
                                updatedRows[i] = { ...row, _status: "error", _error: flash.error };
                                error++;
                            } else {
                                updatedRows[i] = { ...row, _status: "success" };
                                success++;
                            }
                            setRows([...updatedRows]);
                            // Keep parent preview in sync with row statuses
                            onParsed([...updatedRows]);
                            resolve();
                        },
                        onError: (errors) => {
                            const msg = Object.values(errors).join(", ");
                            updatedRows[i] = { ...row, _status: "error", _error: msg };
                            error++;
                            setRows([...updatedRows]);
                            onParsed([...updatedRows]);
                            resolve();
                        },
                    }
                );
            });
        }

        setImportStats({ success, error });
        setImporting(false);
        setImportDone(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={!importing ? handleClose : undefined}
            />

            {/* Modal – intentionally compact; preview is shown in the table behind */}
            <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-blue-600 to-blue-500">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <FileSpreadsheet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">Import Disciplines from Excel</h2>
                            <p className="text-xs text-blue-100 mt-0.5">
                                Required columns: <span className="font-semibold">PROGDIS · CHEDClass-DESCRIPTION · CLUSTER_OF_DISCIPLINE · PROGRAM</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={importing}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors disabled:opacity-40"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">

                    {/* Drop zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => !importing && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200
                            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"}
                            ${importing ? "pointer-events-none opacity-60" : ""}
                        `}
                    >
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
                            <Upload className={`h-6 w-6 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
                        </div>
                        {fileName ? (
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-800">{fileName}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Click to replace file</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">
                                    {isDragging ? "Drop file here" : "Drag & drop or click to browse"}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">.xlsx · .xls · .csv</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Parse error */}
                    {parseError && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-700 font-medium">{parseError}</p>
                        </div>
                    )}

                    {/* Row summary badges */}
                    {rows.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                                {rows.length} rows parsed
                            </span>
                            {validRows.length > 0 && (
                                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-xs font-semibold text-blue-700">
                                    {validRows.length} ready — preview shown in table below
                                </span>
                            )}
                            {invalidRows.length > 0 && (
                                <span className="px-3 py-1.5 rounded-lg bg-red-100 text-xs font-semibold text-red-600">
                                    {invalidRows.length} invalid (will be skipped)
                                </span>
                            )}
                            {rows.filter(r => r._status === "success").length > 0 && (
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-xs font-semibold text-green-700">
                                    {rows.filter(r => r._status === "success").length} imported ✓
                                </span>
                            )}
                        </div>
                    )}

                    {/* Import done banner */}
                    {importDone && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-green-800">Import Complete</p>
                                <p className="text-xs text-green-600 mt-0.5">
                                    {importStats.success} imported · {importStats.error} failed
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={importing}
                        className="rounded-xl border-gray-300 text-gray-600 h-9 px-5 text-xs font-semibold"
                    >
                        {importDone ? "Close" : "Cancel"}
                    </Button>

                    <Button
                        onClick={handleImport}
                        disabled={importing || validRows.length === 0 || importDone}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-9 px-6 text-xs font-bold gap-2 disabled:opacity-50"
                    >
                        {importing ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="h-3.5 w-3.5" />
                                Import {validRows.length > 0 ? `${validRows.length} Rows` : ""}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
