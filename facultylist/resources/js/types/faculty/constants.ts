export const IMPORT_GROUPS = [
    { 
        value: "GROUP A1", 
        label: "GROUP A1: FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC", 
        remarks: "Every full-time faculty member with his/her own PS item, even if on leave without pay, should be listed here." 
    },
    { 
        value: "GROUP A2", 
        label: "GROUP A2: HALF-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS", 
        remarks: "Every half-time faculty member with his/her own PS item, even if on leave without pay, should be listed here." 
    },
    { 
        value: "GROUP A3", 
        label: "GROUP A3: PERSONS OCCUPYING RESEARCH PLANTILLA ITEMS BUT CLASSIFIED AS REGULAR FACULTY.", 
        remarks: "" 
    },
    { 
        value: "GROUP B", 
        label: "GROUP B: FULL-TIME FACULTY MEMBERS WITHOUT ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY.", 
        remarks: "Popularly known as \"substitutes\", these are the faculty members who take over temporarily the PS item of somebody on leave without pay." 
    },
    { 
        value: "GROUP C1", 
        label: "GROUP C1: FULL-TIME FACULTY MEMBERS WITHOUT ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS.", 
        remarks: "Full-time without PS items. Salaries are paid from GAA PS Lump Sums." 
    },
    { 
        value: "GROUP C2", 
        label: "GROUP C2: FULL-TIME FACULTY MEMBERS WITHOUT ITEMS PAID DRAWING SALARIES FROM SUC INCOME.", 
        remarks: "Sometimes known as \"contractual faculty\", these are full-time faculty with no plantilla items. Salaries are paid from SUC income." 
    },
    { 
        value: "GROUP C3", 
        label: "GROUP C3: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM LGU FUNDS", 
        remarks: "Faculty members who have no PS items but teach full-time, with salaries paid from LGU funds." 
    },
    { 
        value: "GROUP D", 
        label: "GROUP D: TEACHING FELLOWS AND TEACHING ASSOCIATES ( but not Graduate Assistants)", 
        remarks: "Technically, TA/TF are not faculty members. However, they do teach and study on official time." 
    },
    { 
        value: "GROUP E", 
        label: "GROUP E: LECTURERS AND ALL OTHER PART-TIME FACULTY WITH NO ITEMS ( e.g. PROFS EMERITI, ADJUNCT/ AFFILIATE FACULTY, VISITING PROFS, etc.)", 
        remarks: "List only the lecturers and/or part-time faculty who have actual teaching loads in First Sem." 
    }
] as const;

export const IMPORT_GROUP_OPTIONS = IMPORT_GROUPS.map(g => g.value);

export const EMPLOYMENT_TYPE_OPTIONS = [
    'Plantilla', 
    'Contract of Service', 
    'Part-time'
] as const;
