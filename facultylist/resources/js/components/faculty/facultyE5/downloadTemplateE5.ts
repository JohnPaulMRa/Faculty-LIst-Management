import * as XLSX from "xlsx-js-style";

export const downloadTemplateE5 = (): void => {

  /* =========================
     SHEET 1 – MAIN TEMPLATE
  ========================= */

  const mainData = [
    ["Name of Faculty", "", "", "", ""],
    ["Last Name", "First Name", "Middle Name", "", "Gender (use Code)"],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(mainData);

  // Merge A1:E1
  ws1["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }
  ];

  // Column widths
  ws1["!cols"] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 5 },
    { wch: 22 }
  ];

  // Title style
  ws1["A1"].s = {
    font: { bold: true, size: 17, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" }
  };

  ["B1","C1","D1","E1"].forEach(cell => {
    ws1[cell] = { t: "s", v: "", s: { fill: { fgColor: { rgb: "000000" } } } };
  });

  // Blue headers
  ["A2","B2","C2"].forEach(cell => {
    ws1[cell].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
  });

  // Yellow Gender header
  ws1["E2"].s = {
    font: { bold: true },
    fill: { fgColor: { rgb: "FFFF00" } },
    alignment: { horizontal: "center", vertical: "center" }
  };

  /* =========================
     SHEET 2 – REFERENCE
  ========================= */

  const refData = [
    ["Gender Code", "Description"],
    ["1", "Male"],
    ["2", "Female"]
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(refData);

  ws2["!cols"] = [
    { wch: 15 },
    { wch: 15 }
  ];

  /* =========================
     DATA VALIDATION (Dropdown)
  ========================= */

  ws1["!dataValidation"] = [
    {
      sqref: "E3:E1000",
      type: "list",
      formula1: '"1 - Male,2 - Female"',
      showDropDown: true
    }
  ];

  /* =========================
     CREATE WORKBOOK
  ========================= */

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "Faculty Data Entry Form");
  XLSX.utils.book_append_sheet(wb, ws2, "Reference");

  XLSX.writeFile(wb, "CHED_FORM_E5.xlsx");
};
