import { DynamicHeader as Header, DynamicFooter as Footer } from '@/components/shared';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import categoriesData from '@/data/categories.json';
import type { Category } from '@/types';


interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: locale === 'tr' ? 'Tüm Kategoriler' : 'All Categories',
        description: locale === 'tr'
            ? 'Tüm kategorileri keşfedin. Elektronik, giyim, ev & mobilya ve daha fazlası.'
            : 'Explore all categories. Electronics, clothing, home & furniture and more.',
    };
}

export default async function CategoriesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('nav');
    const categories = categoriesData.categories as unknown as Category[];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-8 md:py-12">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li>
                                <a href={`/${locale}`} className="text-gray-500 hover:text-indigo-600">
                                    {t('home')}
                                </a>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 dark:text-white font-medium">
                                {t('allCategories')}
                            </li>
                        </ol>
                    </nav>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        {t('allCategories')}
                    </h1>

                    {/* Main Categories Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} size="md" />
                        ))}
                    </div>

                    {/* Subcategories by Main Category */}
                    <div className="mt-16 space-y-12">
                        {categories
                            .filter((cat) => cat.children && cat.children.length > 0)
                            .map((category) => (
                                <section key={category.id}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {category.name}
                                        </h2>
                                        <a
                                            href={`/${locale}/categories/${category.slug}`}
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                                        >
                                            {locale === 'tr' ? 'Tümünü Gör' : 'See All'} →
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {category.children?.slice(0, 6).map((subcat) => (
                                            <CategoryCard key={subcat.id} category={subcat} size="sm" />
                                        ))}
                                    </div>
                                </section>
                            ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
