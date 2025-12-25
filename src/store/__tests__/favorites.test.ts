import { renderHook, act } from '@testing-library/react';
import { useFavoritesStore } from '../favorites';
import type { Product } from '@/types';

// Mock product for testing
const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    categoryId: 1,
    brandId: 1,
    variants: [
        {
            id: 101,
            productId: 1,
            price: 100,
            stock: 10,
            sku: 'TEST-SKU',
            barcode: '1234567890',
            options: [],
            thumbnails: [],
        },
    ],
    images: [],
    rating: 4.5,
    reviewCount: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
};

const mockProduct2: Product = {
    ...mockProduct,
    id: 2,
    name: 'Test Product 2',
    slug: 'test-product-2',
};

describe('useFavoritesStore', () => {
    beforeEach(() => {
        // Clear store before each test
        const { result } = renderHook(() => useFavoritesStore());
        act(() => {
            result.current.clearFavorites();
        });
    });

    it('should start with empty favorites', () => {
        const { result } = renderHook(() => useFavoritesStore());

        expect(result.current.ids).toHaveLength(0);
        expect(result.current.getFavorites()).toHaveLength(0);
    });

    it('should add product to favorites', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addToFavorites(mockProduct);
        });

        expect(result.current.ids).toHaveLength(1);
        expect(result.current.isFavorite(mockProduct.id)).toBe(true);
    });

    it('should not add duplicate products', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addToFavorites(mockProduct);
            result.current.addToFavorites(mockProduct);
        });

        expect(result.current.ids).toHaveLength(1);
    });

    it('should remove product from favorites', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addToFavorites(mockProduct);
        });

        expect(result.current.isFavorite(mockProduct.id)).toBe(true);

        act(() => {
            result.current.removeFromFavorites(mockProduct.id);
        });

        expect(result.current.isFavorite(mockProduct.id)).toBe(false);
        expect(result.current.ids).toHaveLength(0);
    });

    it('should toggle favorite status', () => {
        const { result } = renderHook(() => useFavoritesStore());

        // Toggle on
        act(() => {
            result.current.toggleFavorite(mockProduct);
        });
        expect(result.current.isFavorite(mockProduct.id)).toBe(true);

        // Toggle off
        act(() => {
            result.current.toggleFavorite(mockProduct);
        });
        expect(result.current.isFavorite(mockProduct.id)).toBe(false);
    });

    it('should handle multiple products', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addToFavorites(mockProduct);
            result.current.addToFavorites(mockProduct2);
        });

        expect(result.current.ids).toHaveLength(2);
        expect(result.current.isFavorite(mockProduct.id)).toBe(true);
        expect(result.current.isFavorite(mockProduct2.id)).toBe(true);
    });

    it('should return all favorites via getFavorites', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addToFavorites(mockProduct);
            result.current.addToFavorites(mockProduct2);
        });

        const favorites = result.current.getFavorites();
        expect(favorites).toHaveLength(2);
        expect(favorites[0].id).toBe(mockProduct.id);
        expect(favorites[1].id).toBe(mockProduct2.id);
    });

    it('should clear all favorites', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addToFavorites(mockProduct);
            result.current.addToFavorites(mockProduct2);
        });

        expect(result.current.ids).toHaveLength(2);

        act(() => {
            result.current.clearFavorites();
        });

        expect(result.current.ids).toHaveLength(0);
        expect(result.current.getFavorites()).toHaveLength(0);
    });
});
