'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useFavoritesStore, useCartStore } from '@/store';
import { MegaMenu } from '@/components/molecules/MegaMenu';
import { SearchBar } from '@/components/molecules/SearchBar';
import { Category } from '@/types';
import categoriesData from '@/data/categories.json';

export function Header() {
    const t = useTranslations('nav');
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    const { theme, toggleTheme, isMobileMenuOpen, toggleMobileMenu } = useUIStore();
    const favoriteCount = useFavoritesStore((state) => state.ids.length);
    const cartItemCount = useCartStore((state) => state.getItemCount());

    const categories = categoriesData.categories as Category[];

    // Ref for menu close timeout (debounce)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced mouse enter handler - cancel pending close
    const handleMenuMouseEnter = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsMegaMenuOpen(true);
    }, []);

    // Debounced mouse leave handler - close after delay
    const handleMenuMouseLeave = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
            setIsMegaMenuOpen(false);
            closeTimeoutRef.current = null;
        }, 150); // 150ms delay before closing
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mega menu when navigating
    useEffect(() => {
        setIsMegaMenuOpen(false);
    }, [pathname]);

    const toggleCategoryExpand = (categoryId: number) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                            Pazaryeri
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {t('home')}
                        </Link>

                        {/* Categories Dropdown Trigger */}
                        <div
                            className="relative"
                            onMouseEnter={handleMenuMouseEnter}
                            onMouseLeave={handleMenuMouseLeave}
                        >
                            <button
                                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname.startsWith('/categories') || isMegaMenuOpen
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {t('categories')}
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Mega Menu */}
                            <MegaMenu
                                isOpen={isMegaMenuOpen}
                                onClose={() => setIsMegaMenuOpen(false)}
                                categories={categories}
                            />
                        </div>
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <SearchBar />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle - only show after mount to prevent hydration mismatch */}
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Tema değiştir"
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>
                        )}

                        {/* Placeholder for theme button before mount */}
                        {!mounted && (
                            <div className="p-2 w-9 h-9" />
                        )}

                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center gap-1">
                            <Link
                                href={pathname}
                                locale="tr"
                                className="px-2 py-1 text-xs font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                TR
                            </Link>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <Link
                                href={pathname}
                                locale="en"
                                className="px-2 py-1 text-xs font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                EN
                            </Link>
                        </div>

                        {/* Favorites */}
                        <Link
                            href="/favorites"
                            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={t('favorites')}
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {mounted && favoriteCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        <Link
                            href="/account"
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={t('account')}
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={t('cart')}
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Menü"
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800"
                        >
                            <nav className="py-4 space-y-2">
                                {/* Mobile Search */}
                                <div className="px-4 mb-4">
                                    <SearchBar onClose={toggleMobileMenu} />
                                </div>

                                <Link
                                    href="/"
                                    className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                    onClick={toggleMobileMenu}
                                >
                                    {t('home')}
                                </Link>

                                {/* Mobile Categories Accordion */}
                                <div className="px-4">
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === -1 ? null : -1)}
                                        className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        {t('categories')}
                                        <svg
                                            className={`w-4 h-4 transition-transform ${expandedCategory === -1 ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {expandedCategory === -1 && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 py-2 space-y-1">
                                                    {categories.map((category) => (
                                                        <div key={category.id}>
                                                            <button
                                                                onClick={() => toggleCategoryExpand(category.id)}
                                                                className="w-full flex items-center justify-between py-2 text-sm text-gray-600 dark:text-gray-400"
                                                            >
                                                                {category.name}
                                                                {category.children && category.children.length > 0 && (
                                                                    <svg
                                                                        className={`w-4 h-4 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                )}
                                                            </button>

                                                            <AnimatePresence>
                                                                {expandedCategory === category.id && category.children && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="overflow-hidden pl-4"
                                                                    >
                                                                        {category.children.map((subcategory) => (
                                                                            <Link
                                                                                key={subcategory.id}
                                                                                href={`/categories/${category.slug}/${subcategory.slug}`}
                                                                                className="block py-2 text-sm text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                                                onClick={toggleMobileMenu}
                                                                            >
                                                                                {subcategory.name}
                                                                            </Link>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))}

                                                    <Link
                                                        href="/categories"
                                                        className="block py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                                                        onClick={toggleMobileMenu}
                                                    >
                                                        {t('allCategories')}
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link
                                    href="/favorites"
                                    className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                    onClick={toggleMobileMenu}
                                >
                                    {t('favorites')}
                                </Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
