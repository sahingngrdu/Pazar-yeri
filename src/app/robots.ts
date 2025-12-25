import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://pazaryeri.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/cart',
                    '/checkout',
                    '/account',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
