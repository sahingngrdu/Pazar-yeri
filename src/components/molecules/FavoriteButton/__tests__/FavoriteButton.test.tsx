import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FavoriteButton } from '../FavoriteButton';
import { useFavoritesStore } from '@/store';

// Mock the favorites store
jest.mock('@/store', () => ({
    useFavoritesStore: jest.fn(),
}));

import { Product } from '@/types';

const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product',
    categoryId: 1,
    brandId: 1,
    brand: { id: 1, name: 'Test Brand', slug: 'test-brand' },
    images: [{ id: 1, url: '/test.jpg', alt: 'Test' }],
    variants: [{
        id: 1,
        productId: 1,
        price: 100,
        stock: 10,
        sku: 'TEST-1',
        barcode: '1234567890',
        options: [],
        thumbnails: [],
    }],
    rating: 4.5,
    reviewCount: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
};

describe('FavoriteButton', () => {
    const mockToggleFavorite = jest.fn();
    const mockIsFavorite = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
            isFavorite: mockIsFavorite,
            toggleFavorite: mockToggleFavorite,
        });
    });

    it('renders correctly', () => {
        mockIsFavorite.mockReturnValue(false);
        render(<FavoriteButton product={mockProduct} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('shows "Add to favorites" aria-label when not favorite', () => {
        mockIsFavorite.mockReturnValue(false);
        render(<FavoriteButton product={mockProduct} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Add to favorites');
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('shows "Remove from favorites" aria-label when is favorite', async () => {
        mockIsFavorite.mockReturnValue(true);
        const { rerender } = render(<FavoriteButton product={mockProduct} />);

        // Wait for mount effect
        await new Promise(resolve => setTimeout(resolve, 0));
        rerender(<FavoriteButton product={mockProduct} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Remove from favorites');
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls toggleFavorite when clicked', () => {
        mockIsFavorite.mockReturnValue(false);
        render(<FavoriteButton product={mockProduct} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockToggleFavorite).toHaveBeenCalledWith(mockProduct);
    });

    it('prevents event propagation on click', () => {
        mockIsFavorite.mockReturnValue(false);
        const parentClick = jest.fn();

        render(
            <div onClick={parentClick}>
                <FavoriteButton product={mockProduct} />
            </div>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(parentClick).not.toHaveBeenCalled();
    });

    it('applies correct size classes', () => {
        mockIsFavorite.mockReturnValue(false);

        const { rerender } = render(<FavoriteButton product={mockProduct} size="sm" />);
        expect(screen.getByRole('button')).toHaveClass('w-8', 'h-8');

        rerender(<FavoriteButton product={mockProduct} size="lg" />);
        expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12');
    });

    it('applies custom className', () => {
        mockIsFavorite.mockReturnValue(false);
        render(<FavoriteButton product={mockProduct} className="custom-class" />);

        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('has correct focus styles for accessibility', () => {
        mockIsFavorite.mockReturnValue(false);
        render(<FavoriteButton product={mockProduct} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('focus-visible:ring-2');
        expect(button).toHaveClass('focus-visible:ring-pink-500');
    });
});
