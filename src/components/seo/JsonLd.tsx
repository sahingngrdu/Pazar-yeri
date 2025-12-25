interface JsonLdProps {
    data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// Organization Schema
export function OrganizationJsonLd() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Pazaryeri',
        url: 'https://pazaryeri.com',
        logo: 'https://pazaryeri.com/logo.png',
        sameAs: [
            'https://www.facebook.com/pazaryeri',
            'https://www.instagram.com/pazaryeri',
            'https://twitter.com/pazaryeri',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+90-212-555-0000',
            contactType: 'customer service',
            availableLanguage: ['Turkish', 'English'],
        },
    };

    return <JsonLd data={data} />;
}

// WebSite Schema with SearchAction
export function WebsiteJsonLd({ locale }: { locale: string }) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: locale === 'tr' ? 'Pazaryeri' : 'Marketplace',
        url: `https://pazaryeri.com/${locale}`,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `https://pazaryeri.com/${locale}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return <JsonLd data={data} />;
}

// Product Schema
interface ProductJsonLdProps {
    name: string;
    description: string;
    image: string[];
    sku: string;
    brand: string;
    price: number;
    priceCurrency?: string;
    availability: 'InStock' | 'OutOfStock' | 'LimitedAvailability';
    rating?: number;
    reviewCount?: number;
    url: string;
}

export function ProductJsonLd({
    name,
    description,
    image,
    sku,
    brand,
    price,
    priceCurrency = 'TRY',
    availability,
    rating,
    reviewCount,
    url,
}: ProductJsonLdProps) {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image,
        sku,
        brand: {
            '@type': 'Brand',
            name: brand,
        },
        offers: {
            '@type': 'Offer',
            url,
            priceCurrency,
            price: price.toFixed(2),
            availability: `https://schema.org/${availability}`,
            seller: {
                '@type': 'Organization',
                name: 'Pazaryeri',
            },
        },
    };

    if (rating && reviewCount) {
        data.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: rating.toFixed(1),
            reviewCount,
            bestRating: '5',
            worstRating: '1',
        };
    }

    return <JsonLd data={data} />;
}

// BreadcrumbList Schema
interface BreadcrumbItem {
    name: string;
    url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return <JsonLd data={data} />;
}

// ItemList Schema for Category Pages
interface ItemListJsonLdProps {
    name: string;
    description: string;
    items: Array<{
        name: string;
        url: string;
        image: string;
        price: number;
    }>;
}

export function ItemListJsonLd({ name, description, items }: ItemListJsonLdProps) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        description,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Product',
                name: item.name,
                url: item.url,
                image: item.image,
                offers: {
                    '@type': 'Offer',
                    price: item.price.toFixed(2),
                    priceCurrency: 'TRY',
                },
            },
        })),
    };

    return <JsonLd data={data} />;
}
