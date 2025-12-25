import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
    theme: Theme;
    isMobileMenuOpen: boolean;
    isSearchOpen: boolean;
    isLoading: boolean;

    // Theme actions
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;

    // Menu actions
    setMobileMenuOpen: (isOpen: boolean) => void;
    toggleMobileMenu: () => void;

    // Search actions
    setSearchOpen: (isOpen: boolean) => void;
    toggleSearch: () => void;

    // Loading
    setLoading: (isLoading: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            theme: 'system',
            isMobileMenuOpen: false,
            isSearchOpen: false,
            isLoading: false,

            setTheme: (theme: Theme) => {
                set({ theme });
                updateDocumentTheme(theme);
            },

            toggleTheme: () => {
                const current = get().theme;
                const next = current === 'dark' ? 'light' : 'dark';
                set({ theme: next });
                updateDocumentTheme(next);
            },

            setMobileMenuOpen: (isOpen: boolean) => set({ isMobileMenuOpen: isOpen }),
            toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

            setSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen }),
            toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

            setLoading: (isLoading: boolean) => set({ isLoading }),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);

function updateDocumentTheme(theme: Theme) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
    } else {
        root.classList.add(theme);
    }
}
