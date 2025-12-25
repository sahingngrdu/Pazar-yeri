import { DynamicHeader as Header, DynamicFooter as Footer } from '@/components/shared';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { FavoriteButton } from '@/components/molecules/FavoriteButton';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { AddToCartButton } from '@/components/molecules/AddToCartButton';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Product, Category } from '@/types';
import { formatPrice, calculateDiscountPercent, formatStockStatus } from '@/lib/utils/formatters';


interface Props {
    params: Promise<{ locale: string; slug: string }>;
}

// Generate static params for SSG
export async function generateStaticParams() {
    const products = productsData.products as unknown as Product[];
    return products.map((product) => ({
        slug: product.slug,
    }));
}

function findProductBySlug(slug: string): Product | undefined {
    const products = productsData.products as unknown as Product[];
    return products.find((p) => p.slug === slug);
}

function findCategoryById(id: number): Category | undefined {
    const categories = categoriesData.categories as unknown as Category[];
    for (const cat of categories) {
        if (cat.id === id) return cat;
        if (cat.children) {
            const found = cat.children.find((c) => c.id === id);
            if (found) return found;
        }
    }
    return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const product = findProductBySlug(slug);

    if (!product) return { title: 'Not Found' };

    const mainVariant = product.variants[0];
    const price = formatPrice(mainVariant?.price || 0, { showCurrency: false });

    return {
        title: product.name,
        description: product.description || `${product.name} - ${price} TL`,
        openGraph: {
            title: product.name,
            description: product.description || undefined,
            type: 'website',
            images: product.images.map((img) => ({
                url: img.url,
                alt: img.alt,
            })),
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('product');
    const tNav = await getTranslations('nav');

    const product = findProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const category = findCategoryById(product.categoryId);
    const mainVariant = product.variants[0];
    const hasDiscount = mainVariant?.originalPrice && mainVariant.originalPrice > mainVariant.price;
    const discountPercent = hasDiscount
        ? calculateDiscountPercent(mainVariant.originalPrice!, mainVariant.price)
        : 0;
    const stockStatus = formatStockStatus(mainVariant?.stock || 0, locale);

    // Breadcrumb items
    const breadcrumbItems = [
        { name: locale === 'tr' ? 'Ana Sayfa' : 'Home', url: `https://pazaryeri.com/${locale}` },
    ];

    if (category) {
        breadcrumbItems.push({
            name: category.name,
            url: `https://pazaryeri.com/${locale}/categories/${category.slug}`,
        });
    }

    breadcrumbItems.push({
        name: product.name,
        url: `https://pazaryeri.com/${locale}/products/${product.slug}`,
    });

    return (
        <div className="min-h-screen flex flex-col">
            {/* JSON-LD Structured Data */}
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <ProductJsonLd
                name={product.name}
                description={product.description}
                image={product.images.map((img) => img.url)}
                sku={mainVariant?.sku || ''}
                brand={product.brand?.name || 'Unknown'}
                price={mainVariant?.price || 0}
                availability={mainVariant?.stock > 0 ? 'InStock' : 'OutOfStock'}
                rating={product.rating}
                reviewCount={product.reviewCount}
                url={`https://pazaryeri.com/${locale}/products/${product.slug}`}
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
                            {category && (
                                <>
                                    <li className="text-gray-400">/</li>
                                    <li>
                                        <a
                                            href={`/${locale}/categories/${category.slug}`}
                                            className="text-gray-500 hover:text-indigo-600"
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                </>
                            )}
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
                                {product.name}
                            </li>
                        </ol>
                    </nav>

                    {/* Product Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {product.images[0] ? (
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.images[0].alt || product.name}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {hasDiscount && <Badge variant="sale">%{discountPercent}</Badge>}
                                </div>

                                {/* Favorite Button */}
                                <div className="absolute top-4 right-4">
                                    <FavoriteButton product={product} size="lg" />
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {mainVariant?.thumbnails && mainVariant.thumbnails.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {mainVariant.thumbnails.map((thumb, index) => (
                                        <button
                                            key={thumb.id}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <Image
                                                src={thumb.url}
                                                alt={thumb.alt}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Brand */}
                            {product.brand && (
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                    {product.brand.name}
                                </p>
                            )}

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {product.rating > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(product.rating)
                                                    ? 'text-amber-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {product.rating.toFixed(1)} ({product.reviewCount} {t('reviews', { count: product.reviewCount })})
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(mainVariant?.price || 0)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(mainVariant.originalPrice!)}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1 text-sm font-medium ${stockStatus.variant === 'success'
                                        ? 'text-emerald-600'
                                        : stockStatus.variant === 'warning'
                                            ? 'text-amber-600'
                                            : 'text-red-600'
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${stockStatus.variant === 'success'
                                            ? 'bg-emerald-500'
                                            : stockStatus.variant === 'warning'
                                                ? 'bg-amber-500'
                                                : 'bg-red-500'
                                            }`}
                                    />
                                    {stockStatus.text}
                                </span>
                            </div>

                            {/* Variant Options */}
                            {mainVariant?.options && mainVariant.options.length > 0 && (
                                <div className="space-y-4">
                                    {mainVariant.options.map((option) => (
                                        <div key={option.id}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {option.title}
                                            </label>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-2 border-2 border-indigo-500 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                    {option.value}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <AddToCartButton
                                    product={product}
                                    variantId={mainVariant?.id}
                                    className="flex-1"
                                />
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('freeShipping')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('fastDelivery')}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('description')}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* SKU */}
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {t('sku')}: {mainVariant?.sku}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
