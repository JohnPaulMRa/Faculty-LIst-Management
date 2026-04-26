import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function getCurrentAcademicYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11, so June is 5

    // Academic year usually starts around June/July in PH
    // If we are in Jan-May (0-4), we are in the 2nd sem of PREVIOUS year started
    // e.g., Feb 2026 is part of 2025-2026 AY.
    // If we are in June-Dec (5-11), we are in the 1st sem of CURRENT year.
    // e.g., June 2026 is part of 2026-2027 AY.

    // Let's assume cutoff is June (Month 5)
    if (month >= 5) {
        return `${year}-${year + 1}`;
    } else {
        return `${year - 1}-${year}`;
    }
}

export function normalizeProgramName(name: string): string {
    if (!name) return "";
    let normalized = name.trim();

    const mappings: Record<string, string> = {
        "BS": "Bachelor of Science",
        "AB": "Bachelor of Arts",
        "MS": "Master of Science",
        "MA": "Master of Arts",
        "B.S.": "Bachelor of Science",
        "A.B.": "Bachelor of Arts",
        "M.S.": "Master of Science",
        "M.A.": "Master of Arts",
    };

    // Replace abbreviations at the start of the string
    // We look for patterns like "BS ", "BS.", "BS-" or just "BS" if it's the whole string
    for (const [abbr, full] of Object.entries(mappings)) {
        // Create a regex that matches the abbreviation at the start, 
        // followed by a space, dot, comma, dash, or end of string.
        const escapedAbbr = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${escapedAbbr}(\\s|[.,-]|$)`, "i");
        
        if (regex.test(normalized)) {
            // Replace the abbreviation and keep the separator
            normalized = full + normalized.substring(abbr.length);
            break; 
        }
    }

    return normalized;
}
