/**
 * Formats a number as Turkish Lira currency
 */
export function formatPrice(
    price: number,
    options: {
        currency?: string;
        locale?: string;
        showCurrency?: boolean;
    } = {}
): string {
    const { currency = 'TRY', locale = 'tr-TR', showCurrency = true } = options;

    if (showCurrency) {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    }

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}

/**
 * Calculates discount percentage
 */
export function calculateDiscountPercent(
    originalPrice: number,
    currentPrice: number
): number {
    if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Formats a date to localized string
 */
export function formatDate(
    date: string | Date,
    options: {
        locale?: string;
        format?: 'short' | 'medium' | 'long' | 'full';
    } = {}
): string {
    const { locale = 'tr-TR', format = 'medium' } = options;
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const formats: Record<string, Intl.DateTimeFormatOptions> = {
        short: { day: 'numeric', month: 'numeric', year: '2-digit' },
        medium: { day: 'numeric', month: 'short', year: 'numeric' },
        long: { day: 'numeric', month: 'long', year: 'numeric' },
        full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    };

    return dateObj.toLocaleDateString(locale, formats[format]);
}

/**
 * Formats a number with thousands separator
 */
export function formatNumber(num: number, locale = 'tr-TR'): string {
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * Truncates text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generates a URL-friendly slug from text
 */
export function slugify(text: string): string {
    const turkishChars: Record<string, string> = {
        ç: 'c',
        ğ: 'g',
        ı: 'i',
        ö: 'o',
        ş: 's',
        ü: 'u',
        Ç: 'C',
        Ğ: 'G',
        İ: 'I',
        Ö: 'O',
        Ş: 'S',
        Ü: 'U',
    };

    return text
        .toLowerCase()
        .replace(/[çğıöşüÇĞİÖŞÜ]/g, (char) => turkishChars[char] || char)
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Formats rating as stars (for aria-label)
 */
export function formatRating(rating: number): string {
    return `${rating.toFixed(1)} / 5 yıldız`;
}

/**
 * Formats stock status
 */
export function formatStockStatus(
    stock: number,
    locale: string = 'tr'
): { text: string; variant: 'success' | 'warning' | 'danger' } {
    if (stock === 0) {
        return {
            text: locale === 'tr' ? 'Stokta Yok' : 'Out of Stock',
            variant: 'danger',
        };
    }
    if (stock <= 5) {
        return {
            text: locale === 'tr' ? `Son ${stock} ürün` : `Only ${stock} left`,
            variant: 'warning',
        };
    }
    return {
        text: locale === 'tr' ? 'Stokta' : 'In Stock',
        variant: 'success',
    };
}
