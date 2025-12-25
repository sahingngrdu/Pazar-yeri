'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
    sortLabel: string;
    currentSort: string;
    options: { value: string; label: string }[];
}

export function SortSelect({ sortLabel, currentSort, options }: SortSelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">
                {sortLabel}:
            </label>
            <select
                id="sort"
                defaultValue={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
