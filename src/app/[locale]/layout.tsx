import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import '@/app/globals.css';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        tr: 'Pazaryeri - Online Alışveriş',
        en: 'Marketplace - Online Shopping',
    };

    const descriptions: Record<string, string> = {
        tr: 'Giyim, moda, elektronik ve daha fazlasını keşfedin. En uygun fiyatlarla güvenli alışveriş.',
        en: 'Discover clothing, fashion, electronics and more. Safe shopping at the best prices.',
    };

    return {
        metadataBase: new URL('https://pazaryeri.com'),
        title: {
            default: titles[locale] || titles.tr,
            template: `%s | ${locale === 'tr' ? 'Pazaryeri' : 'Marketplace'}`,
        },
        description: descriptions[locale] || descriptions.tr,
        keywords: locale === 'tr'
            ? ['alışveriş', 'online', 'moda', 'giyim', 'elektronik', 'pazaryeri']
            : ['shopping', 'online', 'fashion', 'clothing', 'electronics', 'marketplace'],
        openGraph: {
            type: 'website',
            locale: locale === 'tr' ? 'tr_TR' : 'en_US',
            siteName: locale === 'tr' ? 'Pazaryeri' : 'Marketplace',
        },
        twitter: {
            card: 'summary_large_image',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as 'tr' | 'en')) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
