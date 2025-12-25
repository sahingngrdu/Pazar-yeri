import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { ProductCard } from '@/components/molecules/ProductCard';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { SortSelect } from '@/components/atoms/SortSelect';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';
import type { Category, Product } from '@/types';

interface Props {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ sort?: string; page?: string }>;
}

// Find category by slug recursively
function findCategoryBySlug(categories: Category[], slug: string): Category | undefined {
    for (const cat of categories) {
        if (cat.slug === slug) return cat;
        if (cat.children) {
            const found = findCategoryBySlug(cat.children, slug);
            if (found) return found;
        }
    }
    return undefined;
}

// Get parent category for breadcrumb
function getParentCategory(categories: Category[], childId: number): Category | undefined {
    for (const cat of categories) {
        if (cat.children?.some(c => c.id === childId)) return cat;
    }
    return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const categories = categoriesData.categories as unknown as Category[];
    const category = findCategoryBySlug(categories, slug);

    if (!category) return { title: 'Not Found' };

    return {
        title: category.name,
        description: locale === 'tr'
            ? `${category.name} kategorisindeki ürünleri keşfedin. En uygun fiyatlarla güvenli alışveriş.`
            : `Discover products in ${category.name} category. Safe shopping at the best prices.`,
        openGraph: {
            title: category.name,
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { locale, slug } = await params;
    const { sort = 'newest', page = '1' } = await searchParams;

    setRequestLocale(locale);

    const t = await getTranslations('category');
    const tNav = await getTranslations('nav');

    const categories = categoriesData.categories as unknown as Category[];
    const category = findCategoryBySlug(categories, slug);

    if (!category) {
        notFound();
    }

    const parentCategory = getParentCategory(categories, category.id);

    // Get products for this category (mock: filter by categoryId)
    const allProducts = productsData.products as unknown as Product[];
    let categoryProducts = allProducts.filter(
        (p) => p.categoryId === category.id ||
            category.children?.some(c => c.id === p.categoryId)
    );

    // If no products found in subcategory, show some products as demo
    if (categoryProducts.length === 0) {
        categoryProducts = allProducts.slice(0, 4);
    }

    // Sort products
    const sortedProducts = [...categoryProducts].sort((a, b) => {
        switch (sort) {
            case 'priceLowToHigh':
                return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
            case 'priceHighToLow':
                return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
            case 'popular':
                return b.reviewCount - a.reviewCount;
            case 'rating':
                return b.rating - a.rating;
            default: // newest
                return 0;
        }
    });

    const sortOptions = [
        { value: 'newest', label: t('sortOptions.newest') },
        { value: 'priceLowToHigh', label: t('sortOptions.priceLowToHigh') },
        { value: 'priceHighToLow', label: t('sortOptions.priceHighToLow') },
        { value: 'popular', label: t('sortOptions.popular') },
        { value: 'rating', label: t('sortOptions.rating') },
    ];

    // Breadcrumb items for JSON-LD
    const breadcrumbItems = [
        { name: locale === 'tr' ? 'Ana Sayfa' : 'Home', url: `https://pazaryeri.com/${locale}` },
        { name: locale === 'tr' ? 'Kategoriler' : 'Categories', url: `https://pazaryeri.com/${locale}/categories` },
    ];

    if (parentCategory) {
        breadcrumbItems.push({
            name: parentCategory.name,
            url: `https://pazaryeri.com/${locale}/categories/${parentCategory.slug}`,
        });
    }

    breadcrumbItems.push({
        name: category.name,
        url: `https://pazaryeri.com/${locale}/categories/${category.slug}`,
    });

    return (
        <div className="min-h-screen flex flex-col">
            {/* JSON-LD Structured Data */}
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <ItemListJsonLd
                name={category.name}
                description={`${category.name} kategorisindeki ürünler`}
                items={sortedProducts.map((p) => ({
                    name: p.name,
                    url: `https://pazaryeri.com/${locale}/products/${p.slug}`,
                    image: p.images[0]?.url || '',
                    price: p.variants[0]?.price || 0,
                }))}
            />

            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 flex-wrap">
                            <li>
                                <a href={`/${locale}`} className="text-gray-500 hover:text-indigo-600">
                                    {tNav('home')}
                                </a>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <a href={`/${locale}/categories`} className="text-gray-500 hover:text-indigo-600">
                                    {tNav('allCategories')}
                                </a>
                            </li>
                            {parentCategory && (
                                <>
                                    <li className="text-gray-400">/</li>
                                    <li>
                                        <a
                                            href={`/${locale}/categories/${parentCategory.slug}`}
                                            className="text-gray-500 hover:text-indigo-600"
                                        >
                                            {parentCategory.name}
                                        </a>
                                    </li>
                                </>
                            )}
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 dark:text-white font-medium">
                                {category.name}
                            </li>
                        </ol>
                    </nav>

                    {/* Category Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {category.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('results', { count: sortedProducts.length })}
                        </p>
                    </div>

                    {/* Subcategories */}
                    {category.children && category.children.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Alt Kategoriler
                            </h2>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {category.children.map((subcat) => (
                                    <CategoryCard key={subcat.id} category={subcat} size="sm" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters & Sort Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {t('filter')}
                            </button>
                        </div>

                        <SortSelect
                            sortLabel={t('sort')}
                            currentSort={sort}
                            options={sortOptions}
                        />
                    </div>

                    {/* Products Grid */}
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {sortedProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} priority={index < 4} />
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400">{t('noProducts')}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
