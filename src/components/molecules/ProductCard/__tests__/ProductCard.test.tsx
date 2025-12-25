import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '../ProductCard';
import type { Product } from '@/types';

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} fill={undefined} priority={undefined} />;
    },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        article: ({ children, ...props }: React.PropsWithChildren<object>) => (
            <article {...props}>{children}</article>
        ),
    },
}));

// Mock navigation
jest.mock('@/i18n/navigation', () => ({
    Link: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

// Mock FavoriteButton
jest.mock('@/components/molecules/FavoriteButton', () => ({
    FavoriteButton: () => <button data-testid="favorite-button">Favorite</button>,
}));

// Mock product data
const mockProduct: Product = {
    id: 1,
    name: 'Test Product Name',
    slug: 'test-product-name',
    description: 'Test description',
    categoryId: 1,
    brandId: 1,
    brand: { id: 1, name: 'Test Brand', slug: 'test-brand' },
    variants: [
        {
            id: 101,
            productId: 1,
            price: 1500,
            originalPrice: 2000,
            stock: 10,
            sku: 'TEST-SKU-001',
            barcode: '1234567890',
            options: [],
            thumbnails: [],
        },
    ],
    images: [
        { id: 1, url: '/images/test-product.jpg', alt: 'Test Product Image' },
    ],
    rating: 4.5,
    reviewCount: 100,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
};

const mockProductNoDiscount: Product = {
    ...mockProduct,
    id: 2,
    variants: [
        {
            ...mockProduct.variants[0],
            id: 102,
            price: 1500,
            originalPrice: undefined,
        },
    ],
};

const mockProductLowStock: Product = {
    ...mockProduct,
    id: 3,
    variants: [
        {
            ...mockProduct.variants[0],
            id: 103,
            stock: 3,
        },
    ],
};

describe('ProductCard Component', () => {
    describe('Rendering', () => {
        it('renders product name', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.getByText('Test Product Name')).toBeInTheDocument();
        });

        it('renders product brand', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.getByText('Test Brand')).toBeInTheDocument();
        });

        it('renders product image', () => {
            render(<ProductCard product={mockProduct} />);
            const image = screen.getByAltText('Test Product Image');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/images/test-product.jpg');
        });

        it('renders favorite button', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
        });

        it('renders link to product page', () => {
            render(<ProductCard product={mockProduct} />);
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/products/test-product-name');
        });
    });

    describe('Price Display', () => {
        it('formats and displays price correctly', () => {
            render(<ProductCard product={mockProduct} />);
            // Turkish Lira format
            expect(screen.getByText('₺1.500')).toBeInTheDocument();
        });

        it('displays original price with strikethrough for discounted products', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.getByText('₺2.000')).toBeInTheDocument();
            expect(screen.getByText('₺2.000')).toHaveClass('line-through');
        });

        it('does not show original price when no discount', () => {
            render(<ProductCard product={mockProductNoDiscount} />);
            expect(screen.queryByText('₺2.000')).not.toBeInTheDocument();
        });
    });

    describe('Discount Badge', () => {
        it('shows discount percentage badge', () => {
            render(<ProductCard product={mockProduct} />);
            // 25% discount (2000 -> 1500)
            expect(screen.getByText('%25')).toBeInTheDocument();
        });

        it('does not show discount badge for non-discounted products', () => {
            render(<ProductCard product={mockProductNoDiscount} />);
            expect(screen.queryByText(/%\d+/)).not.toBeInTheDocument();
        });
    });

    describe('Stock Warning', () => {
        it('shows low stock warning when stock is 5 or less', () => {
            render(<ProductCard product={mockProductLowStock} />);
            expect(screen.getByText('Son 3 ürün')).toBeInTheDocument();
        });

        it('does not show low stock warning when stock is above 5', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.queryByText(/Son \d+ ürün/)).not.toBeInTheDocument();
        });
    });

    describe('Rating Display', () => {
        it('renders rating stars', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.getByText('(100)')).toBeInTheDocument();
        });

        it('does not render rating when rating is 0', () => {
            const productNoRating = { ...mockProduct, rating: 0 };
            render(<ProductCard product={productNoRating} />);
            expect(screen.queryByText('(100)')).not.toBeInTheDocument();
        });
    });

    describe('Free Shipping', () => {
        it('shows free shipping badge for products >= 500 TL', () => {
            render(<ProductCard product={mockProduct} />);
            expect(screen.getByText('Ücretsiz Kargo')).toBeInTheDocument();
        });

        it('does not show free shipping badge for products < 500 TL', () => {
            const cheapProduct = {
                ...mockProduct,
                variants: [{ ...mockProduct.variants[0], price: 300 }],
            };
            render(<ProductCard product={cheapProduct} />);
            expect(screen.queryByText('Ücretsiz Kargo')).not.toBeInTheDocument();
        });
    });

    describe('Priority Loading', () => {
        it('accepts priority prop for image loading', () => {
            render(<ProductCard product={mockProduct} priority={true} />);
            // Just verify it renders without error with priority
            expect(screen.getByText('Test Product Name')).toBeInTheDocument();
        });
    });
});
