import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['tr', 'en'],

    // Used when no locale matches
    defaultLocale: 'tr',

    // Locale prefix strategy
    localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];
