import {
    formatPrice,
    calculateDiscountPercent,
    formatDate,
    formatNumber,
    truncateText,
    slugify,
    formatStockStatus,
} from '../formatters';

describe('formatters', () => {
    describe('formatPrice', () => {
        it('should format price in TRY', () => {
            const result = formatPrice(1000);
            expect(result).toContain('1.000');
            expect(result).toContain('₺');
        });

        it('should format price without currency symbol', () => {
            const result = formatPrice(1000, { showCurrency: false });
            expect(result).toBe('1.000');
        });
    });

    describe('calculateDiscountPercent', () => {
        it('should calculate correct discount percentage', () => {
            expect(calculateDiscountPercent(100, 75)).toBe(25);
            expect(calculateDiscountPercent(200, 100)).toBe(50);
        });

        it('should return 0 for invalid discounts', () => {
            expect(calculateDiscountPercent(0, 100)).toBe(0);
            expect(calculateDiscountPercent(100, 100)).toBe(0);
            expect(calculateDiscountPercent(100, 150)).toBe(0);
        });
    });

    describe('formatDate', () => {
        it('should format date in Turkish locale', () => {
            const result = formatDate('2024-01-15', { locale: 'tr-TR', format: 'medium' });
            expect(result).toContain('2024');
            expect(result).toContain('15');
        });
    });

    describe('formatNumber', () => {
        it('should format number with thousands separator', () => {
            expect(formatNumber(1000)).toBe('1.000');
            expect(formatNumber(1000000)).toBe('1.000.000');
        });
    });

    describe('truncateText', () => {
        it('should truncate long text', () => {
            const result = truncateText('This is a very long text', 10);
            expect(result).toBe('This is a...');
        });

        it('should not truncate short text', () => {
            const result = truncateText('Short', 10);
            expect(result).toBe('Short');
        });
    });

    describe('slugify', () => {
        it('should convert text to slug', () => {
            expect(slugify('Hello World')).toBe('hello-world');
        });

        it('should handle Turkish characters', () => {
            expect(slugify('Türkçe Karakterler')).toBe('turkce-karakterler');
            expect(slugify('Öğrenci Çantası')).toBe('ogrenci-cantasi');
        });
    });

    describe('formatStockStatus', () => {
        it('should return danger for out of stock', () => {
            const result = formatStockStatus(0, 'tr');
            expect(result.variant).toBe('danger');
            expect(result.text).toBe('Stokta Yok');
        });

        it('should return warning for low stock', () => {
            const result = formatStockStatus(3, 'tr');
            expect(result.variant).toBe('warning');
            expect(result.text).toContain('3');
        });

        it('should return success for in stock', () => {
            const result = formatStockStatus(10, 'tr');
            expect(result.variant).toBe('success');
            expect(result.text).toBe('Stokta');
        });
    });
});
