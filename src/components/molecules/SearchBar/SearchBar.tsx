'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/atoms/Input';

interface SearchBarProps {
    variant?: 'default' | 'minimal' | 'expanded';
    placeholder?: string;
    autoFocus?: boolean;
    onClose?: () => void;
}

export function SearchBar({
    variant = 'default',
    placeholder,
    autoFocus = false,
    onClose,
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('common');

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (query.trim()) {
                router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
                onClose?.();
            }
        },
        [query, router, locale, onClose]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                setQuery('');
                onClose?.();
            }
        },
        [onClose]
    );

    const searchIcon = (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );

    const clearButton = query && (
        <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label={t('clear')}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );

    if (variant === 'minimal') {
        return (
            <form onSubmit={handleSearch} className="relative">
                <Input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder || t('searchPlaceholder')}
                    leftIcon={searchIcon}
                    rightIcon={clearButton}
                    className="w-full"
                />
            </form>
        );
    }

    if (variant === 'expanded') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4"
                >
                    <div className="container-custom">
                        <div className="flex items-center gap-4">
                            <form onSubmit={handleSearch} className="flex-1">
                                <Input
                                    ref={inputRef}
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={placeholder || t('searchPlaceholder')}
                                    leftIcon={searchIcon}
                                    rightIcon={clearButton}
                                    className="w-full text-lg"
                                />
                            </form>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Default variant
    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div
                className={`
          relative flex items-center rounded-xl border-2 transition-all duration-200
          ${isFocused
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 bg-white dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                    }
        `}
            >
                <span className="pl-4 text-gray-400">{searchIcon}</span>
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder || t('searchPlaceholder')}
                    className="w-full py-2.5 px-3 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 !outline-none !border-none !ring-0 !shadow-none appearance-none focus:!outline-none focus:!border-none focus:!ring-0 focus-visible:!outline-none focus-visible:!border-none focus-visible:!ring-0"
                />
                <AnimatePresence>
                    {query && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="pr-3"
                        >
                            {clearButton}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}
