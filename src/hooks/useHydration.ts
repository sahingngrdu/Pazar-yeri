'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

/**
 * Check if code is running on the server
 */
function getServerSnapshot() {
    return false;
}

/**
 * Check if code is running on the client
 */
function getClientSnapshot() {
    return true;
}

/**
 * Subscribe to nothing - this value never changes
 */
function subscribe() {
    return () => { };
}

/**
 * Hook to check if the component has hydrated
 * Returns false on server and during initial hydration, true after hydration completes
 * 
 * Uses useSyncExternalStore for better React 18+ compatibility
 */
export function useHydration() {
    return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * Alternative hook using useEffect for broader compatibility
 * Returns true only after the component has mounted on the client
 */
export function useMounted() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
}
