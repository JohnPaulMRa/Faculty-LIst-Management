import React, { FC, useEffect, useState } from 'react';
import { Faculty } from '@/types/faculty';
import { ChevronLeft, ChevronRight, Plus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

const SHEET_TABS = [
    { id: 'A1', label: 'GROUP A1', title: 'GROUP A1: FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC', remarks: 'Every full-time faculty member with his/her own PS item, even if on leave without pay, should be listed here.' },
    { id: 'A2', label: 'GROUP A2', title: 'GROUP A2: HALF-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS', remarks: 'Every half-time faculty member with his/her own PS item, even if on leave without pay, should be listed here.' },
    { id: 'A3', label: 'GROUP A3', title: 'GROUP A3: PERSONS OCCUPYING RESEARCH PLANTILLA ITEMS BUT CLASSIFIED AS REGULAR FACULTY.', remarks: 'Please see instructions.' },
    { id: 'B', label: 'GROUP B', title: 'GROUP B: FULL-TIME FACULTY MEMBERS WITHOUT ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY.', remarks: 'Popularly known as "substitutes", these are the faculty members who take over temporarily the PS item of somebody on leave without pay.' },
    { id: 'C1', label: 'GROUP C1', title: 'GROUP C1:  FULL-TIME FACULTY MEMBERS  WITHOUT ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS.', remarks: 'Full-time without PS items. Salaries are paid from GAA PS Lump Sums.' },
    { id: 'C2', label: 'GROUP C2', title: 'GROUP C2: FULL-TIME FACULTY MEMBERS  WITHOUT ITEMS PAID DRAWING SALARIES FROM SUC INCOME.', remarks: 'Sometimes known as "contractual faculty", these are full-time faculty with no plantilla items. Salaries are paid from SUC income. ' },
    { id: 'C3', label: 'GROUP C3', title: 'GROUP C3: FULL-TIME FACULTY MEMBERS  WITH NO PS ITEMS  DRAWING SALARIES FROM LGU FUNDS.', remarks: 'Faculty members who have no PS items but teach full-time, with salaries paid from LGU funds.' },
    { id: 'D', label: 'GROUP D', title: 'GROUP D: TEACHING FELLOWS AND TEACHING ASSOCIATES  ( but not Graduate Assistants)', remarks: 'Technically, TA/TF are not faculty members. However, they do teach and study on official time.' },
    { id: 'E', label: 'GROUP E', title: 'GROUP E: LECTURERS AND ALL OTHER PART-TIME FACULTY WITH NO ITEMS ( e.g. PROFS EMERITI, ADJUNCT/ AFFILIATE FACULTY, VISITING PROFS, etc.)', remarks: 'List only the lecturers and/or part-time faculty who have actual teaching loads in First Sem.' },
    { id: 'Reference', label: 'Reference', title: 'REFERENCE CODES', remarks: 'Codes to be used in filling out the form.' },
];

const ReferenceTable = () => (
    <div className="flex h-full">
         <div className="flex-1 overflow-auto bg-white p-4">
            <h3 className="font-bold text-lg mb-4">Reference Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {/* Generic Faculty Rank */}
                 <div>
                    <h4 className="font-bold border-b border-black mb-2">Generic Faculty Rank</h4>
                    <table className="w-full text-xs">
                        <thead>
                            <tr><th className="text-left font-bold">Code</th><th className="text-left font-bold">Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>10</td><td>INSTRUCTOR</td></tr>
                            <tr><td>20</td><td>ASSISTANT PROFESSOR</td></tr>
                            <tr><td>30</td><td>ASSOCIATE PROFESSOR</td></tr>
                            <tr><td>40</td><td>FULL PROFESSOR</td></tr>
                            <tr><td>50</td><td>UNIVERSITY PROFESSOR</td></tr>
                        </tbody>
                    </table>
                 </div>

                 {/* Tenure */}
                 <div>
                    <h4 className="font-bold border-b border-black mb-2">Tenure</h4>
                    <table className="w-full text-xs">
                         <thead>
                            <tr><th className="text-left font-bold">Code</th><th className="text-left font-bold">Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>Faculty member is tenured</td></tr>
                            <tr><td>2</td><td>Faculty member has own plantilla item but NOT TENURED</td></tr>
                            <tr><td>3</td><td>Faculty member has no plantilla item</td></tr>
                        </tbody>
                    </table>
                 </div>

                  {/* Highest Degree */}
                  <div>
                    <h4 className="font-bold border-b border-black mb-2">Highest Degree</h4>
                    <table className="w-full text-xs">
                         <thead>
                            <tr><th className="text-left font-bold">Code</th><th className="text-left font-bold">Description</th></tr>
                        </thead>
                        <tbody>
                             <tr><td>100</td><td>No formal education</td></tr>
                             <tr><td>101</td><td>Partial elementary schooling</td></tr>
                             <tr><td>102</td><td>Completed elementary</td></tr>
                             <tr><td>201</td><td>Partial completion of High School</td></tr>
                             <tr><td>202</td><td>Secondary school graduate</td></tr>
                             <tr><td>302</td><td>Completed Tech/Voc</td></tr>
                             <tr><td>402</td><td>Completed pre-bacc certificate</td></tr>
                        </tbody>
                    </table>
                 </div>

                  {/* Gender */}
                  <div>
                    <h4 className="font-bold border-b border-black mb-2">Gender</h4>
                    <table className="w-full text-xs">
                         <thead>
                            <tr><th className="text-left font-bold">Code</th><th className="text-left font-bold">Description</th></tr>
                        </thead>
                        <tbody>
                             <tr><td>1</td><td>Male</td></tr>
                             <tr><td>2</td><td>Female</td></tr>
                        </tbody>
                    </table>
                 </div>
            </div>
         </div>
    </div>
);

type Props = {
    faculty?: Faculty;
    onCancel?: () => void;
    onSave?: (data: Partial<Faculty>) => void;
};

const FormE2: FC<Props> = ({ faculty, onSave }) => {
    const [activeTab, setActiveTab] = useState('A1');
    const [formData, setFormData] = useState<Partial<Faculty>>({});
    const currentGroup = SHEET_TABS.find(tab => tab.id === activeTab) || SHEET_TABS[0];

    useEffect(() => {
        if (faculty) {
            setFormData(faculty);
        }
    }, [faculty]);

    const handleChange = (field: keyof Faculty, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="bg-white text-black px-2 py-1 text-xl font-bold uppercase border border-black shrink-0 flex justify-between items-center">
                <span>FORM E-2: PROFILE OF EACH TERTIARY FACULTY IN AN SUC CAMPUS, as of [CD]</span>
                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        className="h-6 px-3 bg-green-500 hover:bg-green-400 text-black border border-black rounded-s text-[15px] uppercase tracking-wider font-bold flex items-center gap-1" 
                        onClick={handleSave}
                    >
                        <Save className="h-3 w-3" /> Save
                    </Button>
                    <DialogClose className="h-6 w-6 flex items-center justify-center text-black hover:bg-gray-200 rounded-sm">
                        <X className="h-4 w-4" />
                    </DialogClose>
                </div>
            </div>
            
            {/* Dynamic Header Moved to Table Thead */}

            <div className="flex-1 overflow-auto border border-black bg-white relative">
                {activeTab === 'Reference' ? (
                    <ReferenceTable />
                ) : (
                    <table className="w-full min-w-[3000px] border-collapse text-[11px] font-sans">
                        <thead className="bg-black text-white sticky top-0 z-30 shadow-md">
                            {/* COLUMN CODES */}
                            <tr className="bg-black border-b border-white/30">
                                <th className="border-r border-white/30 w-64 text-center py-1">A2</th>
                                <th className="border-r border-white/30 w-48 text-center">A3</th>
                                <th className="border-r border-white/30 w-48 text-center">A4</th>
                                <th className="border-r border-white/30 w-48 text-center">A5</th>
                                <th className="border-r border-white/30 w-20 text-center">A6</th>
                                <th className="border-r border-white/30 w-16 text-center">A7</th>
                                <th className="border-r border-white/30 w-24 text-center">A8</th>
                                <th className="border-r border-white/30 w-20 text-center">A9</th>
                                <th className="border-r border-white/30 w-20 text-center">A10</th>
                                <th className="border-r border-white/30 w-20 text-center">A11</th>
                                <th className="border-r border-white/30 w-48 text-center">B1</th>
                                <th className="border-r border-white/30 w-24 text-center">B2</th>
                                <th className="border-r border-white/30 w-24 text-center">B3</th>
                                <th className="border-r border-white/30 w-24 text-center">B4</th>
                                <th className="border-r border-white/30 w-24 text-center">B5</th>
                                <th className="border-r border-white/30 w-24 text-center">B6</th>
                                <th className="border-r border-white/30 w-24 text-center">B7</th>
                                <th className="border-r border-white/30 w-20 text-center">B8</th>
                                <th className="border-r border-white/30 w-20 text-center">B9</th>
                                {/* C Columns */}
                                <th className="border-r border-white/30 w-16 text-center">C1</th>
                                <th className="border-r border-white/30 w-16 text-center">C2</th>
                                <th className="border-r border-white/30 w-16 text-center">C3</th>
                                <th className="border-r border-white/30 w-16 text-center">C4</th>
                                <th className="border-r border-white/30 w-16 text-center">C5</th>
                                <th className="border-r border-white/30 w-16 text-center">C6</th>
                                <th className="border-r border-white/30 w-16 text-center">C7</th>
                                <th className="border-r border-white/30 w-16 text-center">C8</th>
                                <th className="border-r border-white/30 w-16 text-center">C9</th>
                                {/* D Columns */}
                                <th className="border-r border-white/30 w-16 text-center">D1</th>
                                <th className="border-r border-white/30 w-16 text-center">D2</th>
                                <th className="border-r border-white/30 w-16 text-center">D3</th>
                                <th className="border-r border-white/30 w-16 text-center">D7</th>
                                <th className="border-r border-white/30 w-16 text-center">D8</th>
                                <th className="border-r border-white/30 w-16 text-center">D9</th>
                                {/* E Columns */}
                                <th className="border-r border-white/30 w-20 text-center">E1</th>
                                <th className="border-r border-white/30 w-20 text-center">E2</th>
                                <th className="border-r border-white/30 w-20 text-center">E3</th>
                                <th className="border-r border-white/30 w-20 text-center">E4</th>
                                <th className="border-r border-white/30 w-20 text-center">E5</th>
                                <th className="border-r border-white/30 w-20 text-center">E6</th>
                                <th className="border-r border-white/30 w-20 text-center">E7</th>
                            </tr>
    
                            {/* HEADERS */}
                            <tr className="align-bottom h-24">
                                <th className="border border-white/30 px-2 text-left align-middle wrap-break-word whitespace-normal">NAME OF FACULTY (Last name, first name, middle initial)</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">GENERIC FACULTY RANK</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">HOME COLLEGE</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">HOME DEPT</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">IS FACULTY MEMBER TENURED?</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">SSL SALARY GRADE</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">ANNUAL BASIC SALARY</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">ON LEAVE WITHOUT PAY?</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">FULL-TIME EQUIVALENT OF THE FACULTY</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">GENDER OF FACULTY</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">HIGHEST DEGREE ATTAINED</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">ACTIVELY PURSUING NEXT DEGREE?</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">SPECIFIC DISCIPLINE (1) OF PRIMARY TEACHING LOAD</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">SPECIFIC DISCIPLINE (2) OF PRIMARY TEACHING LOAD</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">SPECIFIC DISCIPLINE OF BACHELORS DEGREE</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">SPECIFIC DISCIPLINE OF MASTERS DEGREE</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">SPECIFIC DISCIPLINE OF DOCTORATE</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">MASTERS DEGREE WITH THESIS?</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">DOCTORATE WITH DISSERTATION?</th>
                                
                                {/* C Headers */}
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">LAB CREDIT UNITS TEACHING Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">LECTURE CREDIT UNITS TEACHING Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">TOTAL TEACHING CREDIT UNITS Undergrad (Lab+Lect)</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">LAB HOURS PER WEEK TEACHING Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">LECTURE HOURS PER WEEK TEACHING Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">TOTAL TEACHING HOURS PER WEEK Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">Student Contact Hours Lab Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">Student Contact Hours Lecture Undergrad</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">STUDENT CONTACT-HOURS Undergrad (Lab+Lect)</th>
    
                                {/* D Headers */}
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">LAB CREDIT UNITS TEACHING Graduate Level</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">LECTURE CREDIT UNITS TEACHING Graduate Level</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">TOTAL TEACHING CREDIT UNITS Graduate (Lab+Lect)</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">Student ContactHrs LAB Graduate level</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">Student ContactHrs LECTURE Graduate level</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">Student ContactHrs GRADUATE Level (Lab+Lect)</th>
    
                                {/* E Headers */}
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">OFFICIAL RESEARCH LOAD</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">OFFICIAL EXTENSION SERVICES LOAD</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">OFFICIAL STUDY LOAD</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">OFFICIAL LOAD FOR PRODUCTION</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">OFFICIAL ADMINISTRATIVE LOAD</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">OTHER OFFICIAL LOAD CREDITS</th>
                                <th className="border border-white/30 px-1 align-middle whitespace-normal">TOTAL WORK LOAD</th>
                            </tr>
                            
                            {/* SUB HEADERS */}
                            <tr className="bg-black text-[9px] h-6">
                                <th className="border border-white/30 px-1 uppercase align-middle">Elem/ Secondary/ Tech Voc</th>
                                <th className="border border-white/30 px-1 align-middle">Use code.</th>
                                <th className="border border-white/30 px-1 bg-black"></th>
                                <th className="border border-white/30 px-1 bg-black"></th>
                                <th className="border border-white/30 px-1 align-middle">Use code.</th>
                                <th colSpan={3} className="border border-white/30 px-1 align-middle">Use code.</th>
                                <th className="border border-white/30 px-1 bg-black"></th>
                                <th className="border border-white/30 px-1 bg-black"></th>
                                
                                <th className="border border-white/30 px-1 align-middle">Use 3-digit code.</th>
                                <th className="border border-white/30 px-1 align-middle">Use code.</th>
                                <th colSpan={5} className="border border-white/30 px-1 align-middle">Use 6-digit code.</th>
                                
                                <th className="border border-white/30 px-1 align-middle">Use code.</th>
                                <th className="border border-white/30 px-1 bg-black"></th>
    
                                <th colSpan={3} className="border border-white/30 px-1 align-middle">CREDIT UNITS</th>
                                <th colSpan={3} className="border border-white/30 px-1 align-middle">HOURS PER WEEK TEACHING</th>
                                <th colSpan={3} className="border border-white/30 px-1 align-middle">CONTACT-HOURS</th>
                                
                                <th colSpan={3} className="border border-white/30 px-1 align-middle">CREDIT UNITS</th>
                                <th colSpan={3} className="border border-white/30 px-1 align-middle">CONTACT-HOURS</th>
    
                                <th colSpan={7} className="border border-white/30 px-1 align-middle">CREDIT UNITS</th>
                            </tr>
                            {/* DYNAMIC GROUP TITLE ROW */}
                            <tr className="bg-white border-b border-black">
                                <th colSpan={41} className="p-0 border border-black text-left">
                                     <div className="bg-white text-black text-left flex flex-col">
                                         <div className="px-2 py-1 text-[15px] font-bold italic whitespace-normal">
                                             {currentGroup.title}
                                         </div>
                                         <div className="px-2 pb-1 text-[11px] italic whitespace-normal">
                                             <span className="font-bold">REMARKS:</span> {currentGroup.remarks}
                                         </div>
                                         <div className="bg-black text-white text-[11px] font-bold px-2 w-full mt-1">
                                             START BELOW THIS ROW
                                         </div>
                                     </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* DATA ROW */}
                            <tr className="bg-white hover:bg-gray-100">
                                {/* A Columns */}
                                <td className="border border-black p-0 h-8 font-bold">
                                    <Input 
                                        className="h-full w-full border-none rounded-none bg-transparent px-2 text-left text-[11px] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black" 
                                        value={formData.name || ''} 
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Name"
                                    />
                                </td>
                                <td className="border border-black p-0">
                                    <Input 
                                        className="h-full w-full border-none rounded-none bg-transparent px-1 text-left text-[11px] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black" 
                                        value={formData.rank || ''} 
                                        onChange={(e) => handleChange('rank', e.target.value)}
                                        placeholder="Code"
                                    />
                                </td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-left text-[11px]" defaultValue="CAS" /></td>
                                <td className="border border-black p-0">
                                    <Input 
                                        className="h-full w-full border-none rounded-none bg-transparent px-1 text-left text-[11px] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black" 
                                        value={formData.department || ''} 
                                        onChange={(e) => handleChange('department', e.target.value)}
                                    />
                                </td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" placeholder="Code" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="18" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="350000" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="N" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1.0" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" placeholder="Code" /></td>
                                
                                {/* B Columns */}
                                <td className="border border-black p-0">
                                    <Input 
                                        className="h-full w-full border-none rounded-none bg-transparent px-1 text-left text-[11px] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black" 
                                        value={formData.degree || ''} 
                                        onChange={(e) => handleChange('degree', e.target.value)}
                                        placeholder="Code"
                                    />
                                </td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="2" placeholder="Code" /></td>
                                {[...Array(5)].map((_, i) => (
                                    <td key={`B${3+i}`} className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-[11px]" /></td>
                                ))}
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" placeholder="Code" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" placeholder="Code" /></td>
    
                                {/* C Columns - Zeros */}
                                {[...Array(9)].map((_, i) => (
                                    <td key={`C${1+i}`} className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="0" /></td>
                                ))}
    
                                {/* D Columns - Zeros */}
                                {[...Array(6)].map((_, i) => (
                                    <td key={`D${1+i}`} className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="0" /></td>
                                ))}
    
                                {/* E Columns - Zeros */}
                                {[...Array(7)].map((_, i) => (
                                    <td key={`E${1+i}`} className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="0" /></td>
                                ))}
                            </tr>
                            
                            {/* EMPTY ROWS */}
                            {[...Array(15)].map((_, r) => (
                                <tr key={r} className="hover:bg-gray-100">
                                    <td className="border border-black h-8"></td>
                                    {[...Array(40)].map((_, c) => (
                                        <td key={c} className="border border-black"></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* SHEET TABS */}
            <div className="flex items-center bg-[#f0f0f0] border-t border-gray-300 px-1 gap-1 h-8 shrink-0 overflow-x-auto">
                <div className="flex items-center space-x-2 mr-4 text-gray-500">
                     <div className="flex gap-1">
                        <button className="hover:bg-gray-200 p-0.5 rounded"><ChevronLeft className="h-3 w-3" /></button>
                        <button className="hover:bg-gray-200 p-0.5 rounded"><ChevronRight className="h-3 w-3" /></button>
                     </div>
                </div>
                {SHEET_TABS.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-1 text-[11px] font-medium transition-colors border-r border-black h-full relative top-px whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-black text-white border-t-2 border-t-black border-b-black shadow-sm' 
                                : 'bg-[#f0f0f0] text-gray-600 hover:bg-gray-200'}
                        `}
                     >
                        {tab.label}
                     </button>
                ))}
                <button className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded-full ml-1">
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default FormE2;
