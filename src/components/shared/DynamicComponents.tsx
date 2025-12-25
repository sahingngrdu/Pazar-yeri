'use client';

import dynamic from 'next/dynamic';

/**
 * Centralized dynamic component definitions for lazy loading.
 * This avoids code duplication across pages and ensures consistent loading states.
 */

/**
 * Lazy-loaded Header component with skeleton loading state.
 * SSR is enabled by default for better SEO.
 */
export const DynamicHeader = dynamic(
    () => import('@/components/organisms/Header').then(mod => ({ default: mod.Header })),
    {
        loading: () => (
            <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-pulse" />
        ),
        ssr: true,
    }
);

/**
 * Lazy-loaded Footer component with skeleton loading state.
 * SSR is enabled by default for better SEO.
 */
export const DynamicFooter = dynamic(
    () => import('@/components/organisms/Footer').then(mod => ({ default: mod.Footer })),
    {
        loading: () => (
            <footer className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ),
        ssr: true,
    }
);
