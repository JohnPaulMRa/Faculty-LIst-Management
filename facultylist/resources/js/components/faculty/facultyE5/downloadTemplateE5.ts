import { utils, writeFile } from 'xlsx';

export const downloadTemplateE5 = (): void => {
    // 1. Title Row
    const title = ["CHED FORM E5 - FACULTY OR TEACHING STAFF IN HIGHER EDUCATION PROGRAMS"];

    // 2. Header Row (Reordered and Renamed to match image)
    const headers = [
        "Name of Faculty (LN, FN MI)",
        "Gender (use Code)",
        "Full-Time/ Part-Time (use Code)",
        "Primary Disc. Group",
        "Primary Disc. Code",
        "Highest Degree Code",
        "Bachelors Disc. Group",
        "Bachelors Disc. Code",
        "Masters Disc. Group",
        "Masters Disc. Code",
        "Doctorate Disc. Group",
        "Doctorate Disc. Code",
        "Professional License Code",
        "Tenure Code",
        "Rank Code",
        "Salary Code",
        "Load Code",
        "Subjects Taught"
    ];

    // 3. Example Row (Data reordered to match headers)
    const example = [
        "Dela Cruz, Juan M.",
        "1", // Gender (Male) - Moved to index 1
        "1", // FT/PT - Moved to index 2
        "46", // Mathematics Group
        "461103", // Statistics Code
        "903", // Doctorate
        "46", // Bach Group
        "460100", // Bach Code
        "46", // Mast Group
        "461101", // Mast Code
        "46", // Doc Group
        "461103", // Doc Code
        "1", // License
        "1", // Permanent
        "50", // Professor
        "6", // Salary
        "30", // Load
        "Calculus, Algebra"
    ];

    // 4. Construct Data Array
    const data = [
        title,
        headers,
        [], // Empty row for clarity if desired, but user image shows blank rows under headers. I'll include the example row for usability if not strictly "blank". Let's include example for now as previously done.
        example
    ];

    // 5. Create Workbook
    const worksheet = utils.aoa_to_sheet(data);

    // Merge Title Cell
    if(!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }); // Merge A1:R1

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Form E5");

    // 6. Download
    writeFile(workbook, "FORM_E5_PRIVATE.xlsx");
};
