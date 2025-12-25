import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://pazaryeri.com';

    // Static pages
    const staticPages = [
        '',
        '/categories',
        '/favorites',
        '/about',
        '/contact',
    ];

    // Category slugs (in real app, fetch from API/DB)
    const categorySlugs = [
        'elektronik',
        'ev-mobilya',
        'kadin',
        'erkek',
        'ayakkabi-canta',
        'kozmetik',
        'spor-outdoor',
        'anne-cocuk',
    ];

    // Product slugs (in real app, fetch from API/DB)
    const productSlugs = [
        'iphone-15-pro-max-256gb',
        'samsung-galaxy-s24-ultra-512gb',
        'nike-air-max-270-erkek',
        'adidas-ultraboost-23',
        'zara-oversize-blazer',
        'macbook-pro-14-m3-pro',
        'hm-slim-fit-gomlek',
        'samsung-55-oled-4k',
    ];

    const locales = ['tr', 'en'];
    const now = new Date();

    const sitemap: MetadataRoute.Sitemap = [];

    // Add static pages for each locale
    for (const locale of locales) {
        for (const page of staticPages) {
            sitemap.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: now,
                changeFrequency: page === '' ? 'daily' : 'weekly',
                priority: page === '' ? 1 : 0.8,
            });
        }

        // Add category pages
        for (const slug of categorySlugs) {
            sitemap.push({
                url: `${baseUrl}/${locale}/categories/${slug}`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.7,
            });
        }

        // Add product pages
        for (const slug of productSlugs) {
            sitemap.push({
                url: `${baseUrl}/${locale}/products/${slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        }
    }

    return sitemap;
}
