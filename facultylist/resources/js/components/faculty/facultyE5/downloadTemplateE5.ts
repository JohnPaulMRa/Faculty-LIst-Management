import { utils, writeFile } from 'xlsx';

export const downloadTemplateE5 = (): void => {
    // 1. Sheet 1: Faculty Data Entry Form
    // ------------------------------------
    const headers = [
        "Name of Faculty (LN, FN MI)",
        "Full-Time/ Part-Time (use Code)",
        "Gender (use Code)"
    ];

    const dataSheet1 = [
        headers
    ];

    const ws1 = utils.aoa_to_sheet(dataSheet1);

    // 2. Sheet 2: Reference
    // ------------------------------------
    const refHeaders = ["No.", "Full-Time / Part-Time", "No.", "Gender"];
    
    const refData = [
        // Headers
        refHeaders,
        // Rows
        [1, "The person is a full-time employee of the HEI.", 1, "Male"],
        [2, "The person is a half-time employee of the HEI.", 2, "Female"],
        [3, "Student employee such as Student Assistant or Graduate Assistant"],
        [4, "Teaching Fellow, Associate or Assistant."],
        [5, "None of the above and therefore part-time. This includes: lecturers (all \nranks), adjunct or affiliate faculty, visiting professors, professors \nemeriti, Physicians on call, lawyers or accountants on retainer basis, etc."],
        [9, "Not known or not indicated."]
    ];

    const ws2 = utils.aoa_to_sheet(refData);

    // 4. Set Column Widths (Sheet 1)
    ws1['!cols'] = [
        { wch: 30 }, // A: Name (Wide)
        { wch: 25 }, // B: FT/PT (Medium)
        { wch: 15 }  // C: Gender (Narrower)
    ];

    // 5. Data Validation (Sheet 1)
    // Note: This uses the '!dataValidation' property which is supported by some SheetJS versions/formats.
    // If not supported, it will just be ignored but won't break the file.
    // We target rows 2 to 1000 for data entry.
    ws1['!dataValidation'] = [
        {
            sqref: "B2:B1000",
            formula1: "=Reference!$A$2:$A$7",
            type: "list",
            operator: "equal",
            showDropDown: true
        },
        {
            sqref: "C2:C1000",
            formula1: "=Reference!$C$2:$C$3",
            type: "list",
            operator: "equal",
            showDropDown: true
        }
    ];
    
    // Since basic SheetJS write often strips validation, we rely on the Reference sheet being present.
    // However, if the environment supports it, we try adding it.
    
    // Set Row Heights (especially for Row 6 - Code 5)
    ws2['!rows'] = [
        { hpt: 20 }, // Header
        { hpt: 20 }, // Row 2
        { hpt: 20 }, // Row 3
        { hpt: 20 }, // Row 4
        { hpt: 20 }, // Row 5
        { hpt: 60 }, // Row 6 (Code 5 - Taller for wrapped text)
        { hpt: 20 }, // Row 7
        { hpt: 20 }, // Row 8
        { hpt: 20 }  // Row 9
    ];

    // 6. Set Column Widths (Sheet 2: Reference)
    ws2['!cols'] = [
        { wch: 5 },  // A: No.
        { wch: 60 }, // B: Description (Even Wider for wrapped text)
        { wch: 5 },  // C: No.
        { wch: 10 }  // D: Gender
    ];

    // 7. Create Workbook
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, ws1, "Faculty Data Entry Form");
    utils.book_append_sheet(workbook, ws2, "Reference");

    // 8. Download
    writeFile(workbook, "CHED FORM E5.xlsx");
};
