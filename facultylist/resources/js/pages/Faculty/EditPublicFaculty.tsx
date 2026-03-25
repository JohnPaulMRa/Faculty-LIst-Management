import { Head, router } from '@inertiajs/react';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { FC } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import FacultyFormE2 from '@/components/faculty/facultyE2/FacultyFormE2';
import { PublicFaculty } from '@/types/faculty';
import { update } from '@/routes/faculty';
import { facultyprofile } from '@/routes';

interface EditProps {
    faculty: PublicFaculty;
    referenceData: any;
}

const EditPublicFaculty: FC<EditProps> = ({ faculty, referenceData }) => {
    const [formData, setFormData] = useState<Partial<PublicFaculty>>(faculty);
    const [processing, setProcessing] = useState(false);

    const handleChange = (field: keyof PublicFaculty, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setProcessing(true);

        router.put(update({ id: faculty.id }).url, formData, {
            onSuccess: () => {
                router.visit(facultyprofile().url);
            },
            onError: (errors) => {
                let msg = "Failed to update faculty.";
                if (Object.keys(errors).length > 0) {
                    msg += "\n" + Object.values(errors).join("\n");
                }
                alert(msg);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleBack = () => {
        router.visit(facultyprofile().url);
    };

    const breadcrumbs = [
        { title: 'Edit Faculty', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Faculty - ${faculty.name}`} />

            <div className="flex flex-1 flex-col gap-6 w-full py-18 px-2 md:px-20 max-w-8xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Edit Faculty Details
                        </h1>
                        <p className="text-gray-500 mt-1 uppercase text-xs font-semibold tracking-wider">
                            {faculty.import_group || 'Form E-2 Entry'}
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={processing}
                        className="bg-green-800 hover:bg-green-600 text-white"
                    >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <FacultyFormE2 
                    formData={formData}
                    onChange={handleChange}
                    referenceData={referenceData}
                    onCancel={handleBack}
                    hideHeader={true}
                />
            </div>
        </AppLayout>
    );
};

export default EditPublicFaculty;
