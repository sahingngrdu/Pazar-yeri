import { DynamicHeader as Header, DynamicFooter as Footer } from '@/components/shared';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { LazyProductGrid } from '@/components/molecules/LazyProductGrid';
import { Link } from '@/i18n/navigation';
import { OrganizationJsonLd, WebsiteJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Product, Category } from '@/types';


interface Props {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('nav');
    const tCommon = await getTranslations('common');

    // Cast mock data to proper types
    const products = productsData.products as unknown as Product[];
    const categories = categoriesData.categories as unknown as Category[];

    return (
        <div className="min-h-screen flex flex-col">
            {/* JSON-LD Structured Data */}
            <OrganizationJsonLd />
            <WebsiteJsonLd locale={locale} />
            <ItemListJsonLd
                name={locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
                description={locale === 'tr' ? 'En popüler ürünlerimiz' : 'Our most popular products'}
                items={products.slice(0, 8).map((p) => ({
                    name: p.name,
                    url: `https://pazaryeri.com/${locale}/products/${p.slug}`,
                    image: p.images[0]?.url || '',
                    price: p.variants[0]?.price || 0,
                }))}
            />

            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
                    <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
                    <div className="container-custom relative py-20 md:py-32">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                {locale === 'tr'
                                    ? 'Tüm İhtiyaçlarınız İçin Tek Adres'
                                    : 'Your One-Stop Destination'}
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-8">
                                {locale === 'tr'
                                    ? 'Binlerce ürün, güvenli ödeme ve hızlı teslimat ile alışverişin keyfini çıkarın.'
                                    : 'Enjoy shopping with thousands of products, secure payment and fast delivery.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/categories"
                                    className="btn bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    {t('allCategories')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {t('categories')}
                            </h2>
                            <Link
                                href="/categories"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                            >
                                {tCommon('seeAll')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categories.slice(0, 6).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all text-center border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                                >
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden group-hover:scale-110 transition-transform">
                                        {category.imageUrl ? (
                                            <Image
                                                src={category.imageUrl}
                                                alt={category.name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {category.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="py-12 md:py-16">
                    <div className="container-custom">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
                            </h2>
                            <Link
                                href="/products"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                            >
                                {tCommon('seeAll')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="mt-8">
                            <LazyProductGrid
                                products={products.slice(0, 8)}
                                priorityCount={4}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
                    <div className="container-custom">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Free Shipping */}
                            <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {locale === 'tr' ? 'Ücretsiz Kargo' : 'Free Shipping'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {locale === 'tr' ? '500₺ üzeri siparişlerde' : 'On orders over ₺500'}
                                    </p>
                                </div>
                            </div>

                            {/* Secure Payment */}
                            <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {locale === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {locale === 'tr' ? '3D Secure ile güvenli alışveriş' : 'Shop safely with 3D Secure'}
                                    </p>
                                </div>
                            </div>

                            {/* Easy Returns */}
                            <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {locale === 'tr' ? 'Kolay İade' : 'Easy Returns'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {locale === 'tr' ? '14 gün içinde ücretsiz iade' : 'Free returns within 14 days'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
