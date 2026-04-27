/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from "@inertiajs/react";
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { normalizeProgramName } from "@/lib/utils";
import { toast } from "sonner";

export interface ParsedDisciplineRow {
    code: string;
    disciplineGroup: string;
    majorDiscipline: string | null;
    specificDiscipline: string | null;
    program: string;
    _status?: "pending" | "success" | "error";
    _error?: string;
}

interface ImportDisciplineModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called immediately after a file is successfully parsed, with valid rows only */
    onParsed: (rows: ParsedDisciplineRow[]) => void;
    /** Existing disciplines for duplicate prevention */
    disciplines?: any[];
}

// Column header mapping (case-insensitive, trimmed):
//   CODE               → code
//   DISCIPLINE GROUP   → disciplineGroup
//   MAJOR DISCIPLINE   → majorDiscipline   (optional, but at least one of major/specific required)
//   SPECIFIC DISCIPLINE→ specificDiscipline (optional, but at least one of major/specific required)
//   PROGRAM            → program

// Validation Rules:
//   - CODE, DISCIPLINE GROUP, PROGRAM → required
//   - MAJOR DISCIPLINE and SPECIFIC DISCIPLINE → optional, but at least one must be non-empty
//   - Allowed combinations:
//       Group + Major + Specific
//       Group + Major only
//       Group + Specific only
//
// Duplicate key: disciplineGroup + majorDiscipline + specificDiscipline + program

/** Normalise a raw cell value: trim whitespace, return null for empty strings */
function cellValue(raw: any): string | null {
    const s = String(raw ?? "").trim();
    return s === "" ? null : s;
}

/** Build the composite duplicate key used for deduplication */
function dupKey(
    disciplineGroup: string,
    majorDiscipline: string | null,
    specificDiscipline: string | null,
    program: string
): string {
    return [
        disciplineGroup.toUpperCase(),
        (majorDiscipline ?? "").toUpperCase(),
        (specificDiscipline ?? "").toUpperCase(),
        program.toUpperCase(),
    ].join("|");
}

export default function ImportDisciplineModal({
    isOpen,
    onClose,
    onParsed,
    disciplines = [],
}: ImportDisciplineModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isCancelled = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [rows, setRows] = useState<ParsedDisciplineRow[]>([]);
    const [parseError, setParseError] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [importDone, setImportDone] = useState(false);
    const [importStats, setImportStats] = useState<{
        total_excel: number;
        total_inserted: number;
        total_duplicates: number;
        total_invalid: number;
        final_total: number;
        errors: any[];
    } | null>(null);

    const reset = () => {
        setFileName(null);
        setRows([]);
        setParseError(null);
        setImporting(false);
        setImportDone(false);
        setImportStats(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        if (importing) {
            isCancelled.current = true;
            return;
        }
        reset();
        onClose();
    };

    const parseFile = useCallback(
        (file: File) => {
            setParseError(null);
            setRows([]);
            setImportDone(false);
            setImportStats(null);
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

                    // Read with column-letter keys so we can scan for the header row first
                    const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, {
                        header: "A",
                        defval: "",
                    });

                    if (rawRows.length === 0) {
                        setParseError("The file has no data rows.");
                        return;
                    }

                    // ── 1. Locate the header row ──────────────────────────────────────
                    // We look for the row that contains all five expected headers.
                    const HEADER_ALIASES: Record<string, keyof ParsedDisciplineRow> = {
                        "CODE": "code",
                        "DISCIPLINE CODE": "code",
                        "PROGDIS": "code",
                        "PROG CODE": "code",
                        "DISCIPLINE GROUP": "disciplineGroup",
                        "GROUP": "disciplineGroup",
                        "GROUP NAME": "disciplineGroup",
                        "MAJOR DISCIPLINE": "majorDiscipline",
                        "MAJOR": "majorDiscipline",
                        "MAJOR NAME": "majorDiscipline",
                        "SPECIFIC DISCIPLINE": "specificDiscipline",
                        "SPECIFIC": "specificDiscipline",
                        "SPECIFIC NAME": "specificDiscipline",
                        "DISCIPLINE NAME": "specificDiscipline",
                        "PROGRAM": "program",
                        "PROGRAM NAME": "program",
                        "PROG": "program",
                    };

                    let headerRowIndex = -1;
                    const colKeyMap: Partial<Record<keyof ParsedDisciplineRow, string>> = {};

                    for (let ri = 0; ri < rawRows.length; ri++) {
                        const row = rawRows[ri];
                        const localMap: Partial<Record<keyof ParsedDisciplineRow, string>> = {};

                        for (const colKey of Object.keys(row)) {
                            const val = String(row[colKey]).trim().toUpperCase();
                            if (HEADER_ALIASES[val]) {
                                localMap[HEADER_ALIASES[val]] = colKey;
                            }
                        }

                        // Header row must at minimum contain CODE, DISCIPLINE GROUP, and PROGRAM
                        if (localMap.code && localMap.disciplineGroup && localMap.program) {
                            headerRowIndex = ri;
                            Object.assign(colKeyMap, localMap);
                            break;
                        }
                    }

                    if (headerRowIndex === -1 || !colKeyMap.code || !colKeyMap.disciplineGroup || !colKeyMap.program) {
                        setParseError(
                            "Could not find a valid header row. " +
                            "Ensure your file contains columns: CODE, DISCIPLINE GROUP, PROGRAM " +
                            "(and optionally MAJOR DISCIPLINE, SPECIFIC DISCIPLINE)."
                        );
                        return;
                    }

                    // ── 2. Parse data rows ────────────────────────────────────────────
                    const parsed: ParsedDisciplineRow[] = [];
                    rawRows.forEach((row, rowIndex) => {
                        // Skip header row and everything above it
                        if (rowIndex <= headerRowIndex) return;

                        const rawCode            = cellValue(row[colKeyMap.code!]);
                        const rawGroup           = cellValue(row[colKeyMap.disciplineGroup!]);
                        const rawMajor           = colKeyMap.majorDiscipline
                                                       ? cellValue(row[colKeyMap.majorDiscipline])
                                                       : null;
                        const rawSpecific        = colKeyMap.specificDiscipline
                                                       ? cellValue(row[colKeyMap.specificDiscipline])
                                                       : null;
                        const rawProgram         = cellValue(row[colKeyMap.program!]);

                        // Skip completely blank rows
                        if (!rawCode && !rawGroup && !rawMajor && !rawSpecific && !rawProgram) return;

                        // Push all non-blank rows as pending, letting the backend handle missing fields
                        parsed.push({
                            code: rawCode ?? "",
                            disciplineGroup: rawGroup ?? "",
                            majorDiscipline: rawMajor,
                            specificDiscipline: rawSpecific,
                            program: normalizeProgramName(rawProgram ?? ""),
                            _status: "pending",
                        });
                    });

                    if (parsed.length === 0) {
                        setParseError("No data rows found after the header row.");
                        return;
                    }

                    setRows(parsed);
                    onParsed(parsed);
                } catch {
                    setParseError("Failed to read the file. Ensure it is a valid Excel or CSV file.");
                }
            };
            reader.readAsArrayBuffer(file);
        },
        [onParsed, disciplines]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseFile(file);
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) parseFile(file);
        },
        [parseFile]
    );

    const validRows   = rows.filter((r) => r._status === "pending");
    const invalidRows = rows.filter((r) => r._status === "error");

    const handleImport = async () => {
        if (validRows.length === 0) return;
        setImporting(true);
        setImportStats(null);
        isCancelled.current = false;

        const CHUNK_SIZE = 500;
        const pendingRows = rows.filter(r => r._status === "pending");
        
        const finalStats = {
            total_excel: rows.length,
            total_inserted: 0,
            total_duplicates: 0,
            total_invalid: 0,
            final_total: 0,
            errors: [] as any[]
        };

        const chunks: ParsedDisciplineRow[][] = [];
        for (let i = 0; i < pendingRows.length; i += CHUNK_SIZE) {
            chunks.push(pendingRows.slice(i, i + CHUNK_SIZE));
        }

        try {
            for (let i = 0; i < chunks.length; i++) {
                if (isCancelled.current) break;
                const chunk = chunks[i];
                const payload = chunk.map(row => ({
                    code: row.code,
                    groupName: row.disciplineGroup,
                    majorName: row.majorDiscipline,
                    specificDiscipline: row.specificDiscipline,
                    program: row.program,
                }));

                const response = await axios.post(route("admin.disciplines.bulkStore"), { rows: payload });
                
                if (response.data.success && response.data.report) {
                    const r = response.data.report;
                    finalStats.total_inserted += r.total_inserted;
                    finalStats.total_duplicates += r.total_duplicates;
                    finalStats.total_invalid += r.total_invalid;
                    finalStats.final_total = r.final_total;
                    finalStats.errors.push(...(r.errors || []));

                    chunk.forEach(row => { row._status = "success"; });
                } else {
                    chunk.forEach(row => { row._status = "error"; });
                }
                setRows([...rows]);
                onParsed([...rows]);
            }
            setImportStats(finalStats);
            router.reload({ only: ['programs'], preserveScroll: true } as any);
        } catch (error: any) {
            console.error("Bulk import error:", error);
            toast.error("Error: " + (error.response?.data?.message || "Bulk import failed."));
        } finally {
            setImporting(false);
            setImportDone(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={!importing ? handleClose : undefined}
            />

            {/* Modal */}
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
                                Required columns:{" "}
                                <span className="font-semibold text-white">
                                    CODE · DISCIPLINE GROUP · PROGRAM
                                </span>
                                {" "}+ at least one of{" "}
                                <span className="font-semibold text-white">
                                    MAJOR / SPECIFIC DISCIPLINE
                                </span>
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
                            {rows.filter((r) => r._status === "success").length > 0 && (
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-xs font-semibold text-green-700">
                                    {rows.filter((r) => r._status === "success").length} imported ✓
                                </span>
                            )}
                        </div>
                    )}

                    {/* Import done reconciliation report */}
                    {importDone && importStats && (
                        <div className="flex flex-col gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Import Reconciliation Report</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Excel Rows</p>
                                    <p className="text-lg font-black text-slate-700">{importStats.total_excel}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Total Inserted</p>
                                    <p className="text-lg font-black text-green-600">{importStats.total_inserted}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Duplicates Skipped</p>
                                    <p className="text-lg font-black text-orange-600">{importStats.total_duplicates}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Invalid Rows</p>
                                    <p className="text-lg font-black text-red-600">{importStats.total_invalid}</p>
                                </div>
                            </div>

                            <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-900/10">
                                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Final Total in Database</p>
                                <p className="text-2xl font-black text-white">{importStats.final_total}</p>
                            </div>

                            {importStats.errors.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs font-bold text-slate-600 mb-2">Error Details ({importStats.errors.length}):</p>
                                    <div className="max-h-32 overflow-y-auto bg-red-50 rounded-lg p-3 border border-red-100">
                                        {importStats.errors.slice(0, 50).map((err, i) => (
                                            <p key={i} className="text-[10px] text-red-700 mb-1 leading-relaxed">
                                                <span className="font-bold">Row {err.row}:</span> {err.reason}
                                            </p>
                                        ))}
                                        {importStats.errors.length > 50 && (
                                            <p className="text-[10px] text-red-400 italic mt-2">Showing first 50 errors...</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="rounded-xl border-gray-300 text-gray-600 h-9 px-5 text-xs font-semibold"
                    >
                        {importing ? "Stop Import" : importDone ? "Close" : "Cancel"}
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
