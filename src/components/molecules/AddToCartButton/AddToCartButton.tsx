'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { useCartStore } from '@/store';
import { useMounted } from '@/hooks';
import type { Product } from '@/types';

interface AddToCartButtonProps {
    product: Product;
    variantId?: number;
    quantity?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullWidth?: boolean;
}

export function AddToCartButton({
    product,
    variantId,
    quantity = 1,
    size = 'lg',
    className = '',
    fullWidth = true,
}: AddToCartButtonProps) {
    const t = useTranslations('product');
    const mounted = useMounted();
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const addToCart = useCartStore((state) => state.addToCart);
    const cartItemCount = useCartStore((state) => state.getItemCount());

    const handleAddToCart = () => {
        setIsAdding(true);

        // Add to cart
        addToCart(product, quantity, variantId);

        // Show success animation
        setTimeout(() => {
            setIsAdding(false);
            setShowSuccess(true);

            // Hide success after 2 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        }, 500);
    };

    if (!mounted) {
        return (
            <Button size={size} className={`${fullWidth ? 'w-full' : ''} ${className}`} disabled>
                {t('addToCart')}
            </Button>
        );
    }

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`flex items-center justify-center gap-2 py-4 px-6 bg-emerald-500 text-white rounded-xl font-semibold ${fullWidth ? 'w-full' : ''}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('addedToCart') || 'Sepete Eklendi!'}
                    </motion.div>
                ) : (
                    <motion.div key="button" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Button
                            size={size}
                            className={`${fullWidth ? 'w-full' : ''} ${className}`}
                            onClick={handleAddToCart}
                            isLoading={isAdding}
                            leftIcon={
                                !isAdding ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                ) : undefined
                            }
                        >
                            {t('addToCart')}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
