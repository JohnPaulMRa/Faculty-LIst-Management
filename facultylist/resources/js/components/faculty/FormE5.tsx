import { FC, useState } from 'react';
import { Faculty } from '@/types/faculty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import ReferenceTableE5 from './ReferenceTableE5';

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

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
             {/* Header */}
             <div className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
                <h2 className="text-lg font-bold uppercase tracking-tight">FORM E5</h2>
                <div className="flex items-center gap-2">
                    <DialogClose className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                 {activeTab === 'Reference' ? (
                    <ReferenceTableE5 />
                ) : (
                    <div className="h-full overflow-auto p-4 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">

                            {/* Faculty Details Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Faculty Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                                        <Input 
                                            value={formData.name || ''} 
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="uppercase"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Full-Time/Part-Time </label>
                                        <Input 
                                            value={formData.fullTimeCode}
                                            onChange={(e) => handleChange('fullTimeCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Gender </label>
                                        <Input 
                                            value={formData.genderCode}
                                            onChange={(e) => handleChange('genderCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Primary Teaching Discipline</label>
                                        <Input 
                                            value={formData.disciplineCode}
                                            onChange={(e) => handleChange('disciplineCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Educational Credential Earned Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Educational Credential Earned</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Highest Degree Attained</label>
                                        <Input 
                                            value={formData.degree}
                                            onChange={(e) => handleChange('degree', e.target.value)}
                                            placeholder="Code (e.g. 503)"
                                        />
                                    </div>  
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Bachelors Degree</label>
                                        <div className="flex gap-2">
                                            <Input placeholder="Code" className="w-24 shrink-0" value={formData.bachelorsCode} onChange={e => handleChange('bachelorsCode', e.target.value)} />
                                            <Input placeholder="Program Name" className="w-full" value={formData.bachelors} onChange={e => handleChange('bachelors', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Masters Degree</label>
                                        <div className="flex gap-2">
                                            <Input placeholder="Code" className="w-24 shrink-0" value={formData.mastersCode} onChange={e => handleChange('mastersCode', e.target.value)} />
                                            <Input placeholder="Program Name" className="w-full" value={formData.masters} onChange={e => handleChange('masters', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Doctorate Degree</label>
                                        <div className="flex gap-1.5">
                                            <Input placeholder="Code" className="w-24 shrink-0" value={formData.doctorateCode} onChange={e => handleChange('doctorateCode', e.target.value)} />
                                            <Input placeholder="Program Name" className="w-full" value={formData.doctorate} onChange={e => handleChange('doctorate', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                {/* REMOVED HEADER */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Professional License</label>
                                        <Input 
                                            value={formData.licenseCode}
                                            onChange={(e) => handleChange('licenseCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Tenure of Employment</label>
                                        <Input 
                                            value={formData.tenureCode}
                                            onChange={(e) => handleChange('tenureCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Faculty Rank</label>
                                        <Input 
                                            value={formData.rankCode}
                                            onChange={(e) => handleChange('rankCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Annual Salary</label>
                                        <Input 
                                            value={formData.salaryCode}
                                            onChange={(e) => handleChange('salaryCode', e.target.value)}
                                            placeholder="Salary Grade Code"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Teaching Information Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                {/* REMOVED HEADER */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Teaching Load</label>
                                        <Input 
                                            value={formData.loadCode}
                                            onChange={(e) => handleChange('loadCode', e.target.value)}
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Subjects Taught</label>
                                        <Input 
                                            value={formData.subjects}
                                            onChange={(e) => handleChange('subjects', e.target.value)}
                                            placeholder="Enumerate subjects..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-white p-4 border-t border-gray-200 flex justify-end shrink-0">
                <Button 
                    size="sm" 
                    className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-md font-semibold flex items-center gap-2 shadow-sm transition-all"
                    onClick={handleSave}
                >
                    <Save className="h-4 w-4" /> Update
                </Button>
            </div>
        </div>
    );
};

export default FormE5;
