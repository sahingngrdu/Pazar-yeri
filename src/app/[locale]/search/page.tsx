import { DynamicHeader as Header, DynamicFooter as Footer } from '@/components/shared';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/molecules/ProductCard';
import { ProductCardSkeleton } from '@/components/atoms/Skeleton';
import productsData from '@/data/products.json';
import type { Product } from '@/types';


interface Props {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { locale } = await params;
    const { q } = await searchParams;

    const title = q
        ? `"${q}" - ${locale === 'tr' ? 'Arama Sonuçları' : 'Search Results'}`
        : locale === 'tr' ? 'Arama' : 'Search';

    return { title };
}

export default async function SearchPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { q = '', sort = 'relevant', page = '1' } = await searchParams;

    setRequestLocale(locale);

    const t = await getTranslations('common');
    const tNav = await getTranslations('nav');

    // Simulate search (in real app, this would be an API call)
    const allProducts = productsData.products as unknown as Product[];

    let results: Product[] = [];

    if (q.trim()) {
        const searchTerms = q.toLowerCase().split(' ');
        results = allProducts.filter((product) => {
            const searchableText = `${product.name} ${product.description} ${product.brand?.name || ''}`.toLowerCase();
            return searchTerms.some((term) => searchableText.includes(term));
        });
    }

    // Sort results
    const sortedResults = [...results].sort((a, b) => {
        switch (sort) {
            case 'priceLowToHigh':
                return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
            case 'priceHighToLow':
                return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
            case 'rating':
                return b.rating - a.rating;
            default: // relevant - by review count as proxy for relevance
                return b.reviewCount - a.reviewCount;
        }
    });

    const sortOptions = [
        { value: 'relevant', label: locale === 'tr' ? 'En Alakalı' : 'Most Relevant' },
        { value: 'priceLowToHigh', label: locale === 'tr' ? 'Fiyat: Düşükten Yükseğe' : 'Price: Low to High' },
        { value: 'priceHighToLow', label: locale === 'tr' ? 'Fiyat: Yüksekten Düşüğe' : 'Price: High to Low' },
        { value: 'rating', label: locale === 'tr' ? 'En Yüksek Puan' : 'Highest Rated' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container-custom">
                    {/* Search Header */}
                    <div className="mb-8">
                        {q ? (
                            <>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    &ldquo;{q}&rdquo; {locale === 'tr' ? 'için sonuçlar' : 'results'}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {sortedResults.length} {locale === 'tr' ? 'ürün bulundu' : 'products found'}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {locale === 'tr' ? 'Ürün Ara' : 'Search Products'}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {locale === 'tr'
                                        ? 'Aradığınız ürünü bulmak için yukarıdaki arama çubuğunu kullanın.'
                                        : 'Use the search bar above to find what you\'re looking for.'
                                    }
                                </p>
                            </>
                        )}
                    </div>

                    {/* Sort Bar */}
                    {q && sortedResults.length > 0 && (
                        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {sortedResults.length} {locale === 'tr' ? 'sonuç' : 'results'}
                            </span>

                            <div className="flex items-center gap-2">
                                <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">
                                    {locale === 'tr' ? 'Sırala' : 'Sort'}:
                                </label>
                                <select
                                    id="sort"
                                    defaultValue={sort}
                                    onChange={(e) => {
                                        const url = new URL(window.location.href);
                                        url.searchParams.set('sort', e.target.value);
                                        window.location.href = url.toString();
                                    }}
                                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Results Grid */}
                    {q ? (
                        sortedResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {sortedResults.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {locale === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                    {locale === 'tr'
                                        ? `"${q}" için sonuç bulunamadı. Farklı anahtar kelimelerle tekrar deneyin.`
                                        : `No results found for "${q}". Try different keywords.`
                                    }
                                </p>
                            </div>
                        )
                    ) : (
                        /* Popular Products when no search */
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                {locale === 'tr' ? 'Popüler Ürünler' : 'Popular Products'}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {allProducts.slice(0, 8).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
