'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
}

export function MainLayout({
    children,
    showHeader = true,
    showFooter = true,
}: MainLayoutProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Skip to main content link for a11y */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:outline-none"
            >
                Ana içeriğe atla
            </a>

            {showHeader && <Header />}

            <main id="main-content" className="flex-1">
                {children}
            </main>

            {showFooter && <Footer />}
        </div>
    );
}
