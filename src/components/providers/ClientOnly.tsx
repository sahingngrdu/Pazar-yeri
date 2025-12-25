'use client';

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Wrapper component that only renders children on the client side
 * to prevent hydration mismatches with localStorage, window, etc.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
