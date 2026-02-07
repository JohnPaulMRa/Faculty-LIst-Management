export const downloadTemplateE2 = (): void => {
    const headers = ["ID","Name","Rank","Degree","Status","Year"];
    const rowExample = ["001","Juan Cruz","Prof I","PhD","Completed","2024"];
    const fileName = "FORM_E2_PUBLIC.csv";

    const processRow = (row: string[]) => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",");
    const csvContent = "data:text/csv;charset=utf-8," + [processRow(headers), processRow(rowExample)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
