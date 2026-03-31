import * as XLSX from "xlsx-js-style";

export const downloadTemplateE2 = (): void => {
    const workbook = XLSX.utils.book_new();

    // --- SHEET 1: TEMPLATE ---
    // Note: Empty strings used for spacers and merged areas
    const templateData = [
        ["Public Faculty Profile (Form E2)", "", "", "", "", "", ""], // Row 1 (A1:G1)
        ["Name of Faculty", "", "", "", "", "", ""],                 // Row 2 (A2:C2)
        ["Last Name", "First Name", "Middle Name", "", "Group", "", "Gender (use Code)"], // Row 3
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Merging Cells
    worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // A1:G1 (Public Faculty Profile)
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // A2:C2 (Name of Faculty)
    ];

    // Styling Definitions
    const styles = {
        headerBlack: {
            fill: { fgColor: { rgb: "000000" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
        },
        headerBlueLight: {
            fill: { fgColor: { rgb: "5B9BD5" } },
            font: { color: { rgb: "FFFFFF" }, bold: true },
            alignment: { horizontal: "center", vertical: "center" },
        },
        headerBlueDark: {
            fill: { fgColor: { rgb: "2F5597" } },
            font: { color: { rgb: "FFFFFF" }, bold: true },
            alignment: { horizontal: "center", vertical: "center" },
        },
        headerOrange: {
            fill: { fgColor: { rgb: "ED7D31" } },
            font: { color: { rgb: "FFFFFF" }, bold: true },
            alignment: { horizontal: "center", vertical: "center" },
        },
        headerYellow: {
            fill: { fgColor: { rgb: "FFFF00" } },
            font: { color: { rgb: "000000" }, bold: true },
            alignment: { horizontal: "center", vertical: "center" },
        },
    };

    // Helper to apply style to a range
    const applyStyleToRange = (
        ws: XLSX.WorkSheet,
        startRow: number,
        endRow: number,
        startCol: number,
        endCol: number,
        style: Record<string, unknown>
    ) => {
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cellAddress = XLSX.utils.encode_cell({ r, c });
                if (!ws[cellAddress]) ws[cellAddress] = { v: "" };
                ws[cellAddress].s = style;
            }
        }
    };

    // Apply styles to Top Header (Row 1, A-G)
    applyStyleToRange(worksheet, 0, 0, 0, 6, styles.headerBlack);

    // Apply styles to Sub Header (Row 2, A-C)
    applyStyleToRange(worksheet, 1, 1, 0, 2, styles.headerBlueLight);

    // Apply styles to Row 3 Column Headers
    const row3Cells = [
        { c: 0, s: styles.headerBlueDark }, // Last Name
        { c: 1, s: styles.headerBlueDark }, // First Name
        { c: 2, s: styles.headerBlueDark }, // Middle Name
        { c: 4, s: styles.headerOrange },   // Group
        { c: 6, s: styles.headerYellow },   // Gender
    ];

    row3Cells.forEach(cell => {
        const addr = XLSX.utils.encode_cell({ r: 2, c: cell.c });
        if (worksheet[addr]) worksheet[addr].s = cell.s;
    });

    // Set Column Widths
    worksheet["!cols"] = [
        { wch: 20 }, // Last Name
        { wch: 20 }, // First Name
        { wch: 20 }, // Middle Name
        { wch: 5 },  // Spacer
        { wch: 15 }, // Group
        { wch: 5 },  // Spacer
        { wch: 20 }, // Gender
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "TEMPLATE");

    // --- SHEET 2: REFERENCE ---
    const referenceData = [
        ["REFERENCE"],
        [],
        ["GENDER"],
        ["Code", "Description"],
        ["1", "Male"],
        ["2", "Female"],
        [],
        ["FACULTY GROUPS (A1-E)"],
        ["Code", "Description"],
        ["A1", "FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC"],
        ["A2", "HALF-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS"],
        ["A3", "PERSONS OCCUPYING RESEARCH PLANTILLA ITEMS BUT CLASSIFIED AS REGULAR FACULTY."],
        ["B", "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY."],
        ["C1", "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS."],
        ["C2", "FULL-TIME FACULTY MEMBERS WITHOUT ITEMS PAID DRAWING SALARIES FROM SUC INCOME."],
        ["C3", "FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM LGU FUNDS"],
        ["D", "TEACHING FELLOWS AND TEACHING ASSOCIATES ( but not Graduate Assistants)"],
        ["E", "LECTURERS AND ALL OTHER PART-TIME FACULTY WITH NO ITEMS ( e.g. PROFS EMERITI, ADJUNCT/ AFFILIATE FACULTY, VISITING PROFS, etc.)"],
    ];

    const refSheet = XLSX.utils.aoa_to_sheet(referenceData);

    // Style REFERENCE sheet headers
    const boldStyle = { font: { bold: true } };
    const bigBoldStyle = { font: { bold: true, sz: 14 } };

    refSheet["A1"].s = bigBoldStyle;
    refSheet["A3"].s = boldStyle;
    refSheet["A4"].s = boldStyle;
    refSheet["B4"].s = boldStyle;
    refSheet["A8"].s = boldStyle;
    refSheet["A9"].s = boldStyle;
    refSheet["B9"].s = boldStyle;

    // REFERENCE widths
    refSheet["!cols"] = [{ wch: 10 }, { wch: 110 }];

    XLSX.utils.book_append_sheet(workbook, refSheet, "REFERENCE");

    // --- EXECUTE DOWNLOAD ---
    XLSX.writeFile(workbook, "FORM_E2_PUBLIC_FACULTY.xlsx");
};
