'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore } from '@/store';
import type { Product } from '@/types';

interface FavoriteButtonProps {
    product: Product;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const FavoriteButton = memo(function FavoriteButton({ product, size = 'md', className = '' }: FavoriteButtonProps) {
    const [mounted, setMounted] = useState(false);
    const { isFavorite, toggleFavorite } = useFavoritesStore();

    // Prevent hydration mismatch - always render as "not favorite" on server
    const isActive = mounted && isFavorite(product.id);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    }, [toggleFavorite, product]);

    return (
        <button
            onClick={handleClick}
            className={`
        ${sizes[size]}
        flex items-center justify-center
        rounded-full
        bg-white/90 dark:bg-gray-800/90
        backdrop-blur-sm
        shadow-md
        transition-all duration-200
        hover:scale-110
        focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500
        ${className}
      `}
            aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isActive}
            role="button"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.svg
                    key={isActive ? 'filled' : 'outline'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`${iconSizes[size]} ${isActive ? 'text-pink-500' : 'text-gray-600 dark:text-gray-400'}`}
                    fill={isActive ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                </motion.svg>
            </AnimatePresence>
        </button>
    );
});

FavoriteButton.displayName = 'FavoriteButton';
