import { useState } from 'react';
import { getCurrentAcademicYear } from '@/lib/utils';
import type { Faculty } from '@/types/faculty';

export interface UseFacultyModalsProps {
    schoolType: string;
}

export const useFacultyModals = ({ schoolType }: UseFacultyModalsProps) => {
    // --- Modal / UI state ---
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
    const [importType, setImportType] = useState<'E2' | 'E5'>(schoolType?.toLowerCase() === 'public' ? 'E2' : 'E5');
    const [importGroup, setImportGroup] = useState<string>('');
    const [importYear, setImportYear] = useState<string>(getCurrentAcademicYear());
    const [submitYear, setSubmitYear] = useState<string>(getCurrentAcademicYear());
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<Faculty | null>(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);

    const openSubmitModal = () => setIsSubmitModalOpen(true);
    const closeSubmitModal = () => setIsSubmitModalOpen(false);

    return {
        isImportModalOpen, setIsImportModalOpen,
        isDownloadModalOpen, setIsDownloadModalOpen,
        importType, setImportType,
        importGroup, setImportGroup,
        importYear, setImportYear,
        submitYear, setSubmitYear,
        isSubmitModalOpen, setIsSubmitModalOpen,
        selectedFile, setSelectedFile,
        isFileModalOpen, setIsFileModalOpen,
        isCopyModalOpen, setIsCopyModalOpen,
        openSubmitModal, closeSubmitModal,
    };
};
