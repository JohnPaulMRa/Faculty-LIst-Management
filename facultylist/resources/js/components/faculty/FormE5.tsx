import { FC, useState } from 'react';
import { Faculty } from '@/types/faculty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';

type Props = {
    faculty?: Faculty;
    onCancel?: () => void;
    onSave?: (data: any) => void;
};

const FormE5: FC<Props> = ({ faculty, onSave }) => {
    const [activeTab, setActiveTab] = useState('DataEntry');
    const [formData, setFormData] = useState({
        name: faculty?.name || '',
        fullTimeCode: '',
        genderCode: '',
        disciplineCode: '',
        degree: '',
        bachelors: '',
        bachelorsCode: '',
        masters: '',
        mastersCode: '',
        doctorate: '',
        doctorateCode: '',
        licenseCode: '',
        tenureCode: '',
        rankCode: '',
        loadCode: '',
        subjects: '',
        salaryCode: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave?.({ 
            ...faculty, 
            ...formData,
            activeTab // Save the active sheet context if needed
        } as any); 
    };

    const tabs = [
        { id: 'DataEntry', label: 'Faculty Data Entry Form' },
        { id: 'Reference', label: 'Reference' }
    ];

    const ReferenceTable = () => (
        <div className="p-4 bg-white min-h-full">
            <h3 className="font-bold text-lg mb-4 text-black uppercase">Reference Codes</h3>
            <div className="grid grid-cols-2 gap-8 text-[11px]">
                <div>
                   <h4 className="font-bold border-b border-black mb-2">1. Full-Time / Part-Time</h4>
                   <ul className="space-y-1">
                       <li>1 - Full-time</li>
                       <li>2 - Part-time</li>
                   </ul>
                </div>
                 <div>
                   <h4 className="font-bold border-b border-black mb-2">2. Gender</h4>
                   <ul className="space-y-1">
                       <li>1 - Male</li>
                       <li>2 - Female</li>
                   </ul>
                </div>
                 <div>
                   <h4 className="font-bold border-b border-black mb-2">3. Faculty Rank</h4>
                   <ul className="space-y-1">
                       <li>1 - Instructor</li>
                       <li>2 - Asst. Prof</li>
                       <li>3 - Assoc. Prof</li>
                       <li>4 - Professor</li>
                   </ul>
                </div>
                 <div>
                   <h4 className="font-bold border-b border-black mb-2">4. Tenure</h4>
                   <ul className="space-y-1">
                       <li>1 - Permanent</li>
                       <li>2 - Temporary</li>
                       <li>3 - Contractual</li>
                   </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full">
             {/* Header */}
             <div className="bg-white text-black px-2 py-1 text-xl font-bold uppercase border border-black shrink-0 flex justify-between items-center">
                <span>CHED FORM E5 - FACULTY OR TEACHING STAFF IN HIGHER EDUCATION PROGRAMS</span>
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

            <div className="flex-1 overflow-auto border border-black bg-white relative">
                 {activeTab === 'Reference' ? (
                    <ReferenceTable />
                ) : (
                    <table className="w-full min-w-[2500px] border-collapse text-[11px] font-sans">
                        {/* ... Thead content is preserved ... */}
                        <thead className="bg-white text-black sticky top-0 z-30 shadow-sm text-center">
                            {/* Main Headers - Merged and Multi-row */}
                            <tr className="bg-black text-white border-b border-white/30 h-10">
                                {/* Row 1: Main Headers */}
                                <th rowSpan={2} className="border border-white/30 w-64 px-1">Name of Faculty (LN, FN, MI)</th>
                                <th rowSpan={2} className="border border-white/30 w-20 px-1">Full-Time/ Part-Time (use Code)</th>
                                <th rowSpan={2} className="border border-white/30 w-16 px-1">Gender (use Code)</th>
                                <th rowSpan={2} className="border border-white/30 w-24 px-1">Primary Teaching Discipline (use Code)</th>
                                
                                <th colSpan={7} className="border border-white/30 py-1">Educational Credential Earned</th>
                                
                                <th rowSpan={2} className="border border-white/30 w-24 px-1">Professional License (use Code)</th>
                                <th rowSpan={2} className="border border-white/30 w-24 px-1">Tenure of Employment (use Code)</th>
                                <th rowSpan={2} className="border border-white/30 w-20 px-1">Faculty Rank (use Code)</th>
                                <th rowSpan={2} className="border border-white/30 w-20 px-1">Teaching Load (use Code)</th>
                                <th rowSpan={2} className="border border-white/30 w-64 px-1">Subjects Taught (please enumerate)</th>
                                <th rowSpan={2} className="border border-white/30 w-24 px-1">Annual Salary (use Code)</th>
                            </tr>
                            <tr className="bg-black text-white border-b border-white/30 h-16">
                                {/* Educational Credential Sub-headers */}
                                <th className="border border-white/30 w-24 px-1">HIGHEST DEGREE ATTAINED <br/><span className="text-[9px] font-normal">Use 3-digit code</span></th>
                                
                                <th className="border border-white/30 w-40 px-1">SPECIFIC DISCIPLINE OF BACHELORS DEGREE <br/><span className="text-[9px] font-normal">Program Name</span></th>
                                <th className="border border-white/30 w-20 px-1">Use 6-digit code</th>
                                
                                <th className="border border-white/30 w-40 px-1">SPECIFIC DISCIPLINE OF MASTERS DEGREE <br/><span className="text-[9px] font-normal">Program Name</span></th>
                                <th className="border border-white/30 w-20 px-1">Use 6-digit code</th>
                                
                                <th className="border border-white/30 w-40 px-1">SPECIFIC DISCIPLINE OF DOCTORATE <br/><span className="text-[9px] font-normal">Program Name</span></th>
                                <th className="border border-white/30 w-20 px-1">Use 6-digit code</th>
                            </tr>
                            
                            {/* "PLEASE START BELOW" ROW */}
                            <tr className="bg-black text-white border-b border-black">
                                <th colSpan={18} className="text-left px-2 py-1 font-bold italic">PLEASE START BELOW</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* DATA INPUT ROW */}
                             <tr className="bg-white hover:bg-gray-100">
                                <td className="border border-black p-0 h-8 font-bold">
                                    <Input 
                                        className="h-full w-full border-none rounded-none bg-transparent px-2 text-left text-[11px] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-black uppercase" 
                                        value={formData.name || ''} 
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="DELA CRUZ, JUAN V."
                                    />
                                </td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="450100" /></td>
                                
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="503" /></td>
                                
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="178912" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" /></td>
                                
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="178912" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" /></td>
                                
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="178912" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" /></td>

                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="24" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="1" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="20" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="30" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-left text-[11px]" defaultValue="Algebra 1 & 2, Trigonometry" /></td>
                                <td className="border border-black p-0"><Input className="h-full w-full border-none rounded-none bg-transparent px-1 text-center text-[11px]" defaultValue="9" /></td>
                            </tr>

                            {/* EMPTY ROWS */}
                            {[...Array(15)].map((_, r) => (
                                <tr key={r} className="hover:bg-gray-100">
                                    <td className="border border-black h-8"></td>
                                    {[...Array(16)].map((_, c) => (
                                        <td key={c} className="border border-black"></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* SHEET TABS */}
            {/* SHEET TABS - MATCHED TO E2 STYLE */}
            <div className="flex items-center bg-[#f0f0f0] border-t border-gray-300 px-1 gap-1 h-8 shrink-0 overflow-x-auto">
                <div className="flex items-center space-x-2 mr-4 text-gray-500">
                     <div className="flex gap-1">
                        <button className="hover:bg-gray-200 p-0.5 rounded"><ChevronLeft className="h-3 w-3" /></button>
                        <button className="hover:bg-gray-200 p-0.5 rounded"><ChevronRight className="h-3 w-3" /></button>
                     </div>
                </div>
                {tabs.map((tab) => (
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

export default FormE5;
