'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/molecules/ProductCard';
import { useFavoritesStore } from '@/store';
import { DynamicHeader as Header, DynamicFooter as Footer } from '@/components/shared';


export default function FavoritesPage() {
    const t = useTranslations('favorites');
    const tNav = useTranslations('nav');

    // Select primitive values from store to avoid hydration issues
    const items = useFavoritesStore((state) => state.items);
    const ids = useFavoritesStore((state) => state.ids);

    // Compute favorites array from selected values
    const favorites = useMemo(() => {
        return ids.map((id) => items[id]).filter(Boolean);
    }, [items, ids]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container-custom">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        {t('title')}
                    </h1>

                    {favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {t('empty')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                                {t('addProducts')}
                            </p>
                            <Link
                                href="/"
                                className="btn btn-primary px-8"
                            >
                                {tNav('home')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {favorites.length} ürün
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {favorites.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
