import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const mockProduct = {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB - Doğal Titanyum',
    slug: 'iphone-15-pro-max-256gb',
    description: 'Apple iPhone 15 Pro Max en yeni A17 Pro çipi ile...',
    categoryId: 11,
    brandId: 1,
    brand: { id: 1, name: 'Apple', slug: 'apple' },
    variants: [
        {
            id: 101,
            productId: 1,
            price: 64999,
            originalPrice: 69999,
            stock: 25,
            sku: 'IPHONE15PM-256-TITAN',
            barcode: '194253401234',
            options: [{ id: 1, title: 'Renk', value: 'Doğal Titanyum' }],
            thumbnails: [{ id: 1, url: '/images/products/iphone15-1.jpg', alt: 'iPhone 15 Pro Max' }],
        },
    ],
    images: [{ id: 1, url: '/images/products/iphone15-1.jpg', alt: 'iPhone 15 Pro Max' }],
    rating: 4.9,
    reviewCount: 234,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
};

const meta: Meta<typeof ProductCard> = {
    title: 'Molecules/ProductCard',
    component: ProductCard,
    tags: ['autodocs'],
    argTypes: {
        priority: {
            control: 'boolean',
            description: 'Görüntü önceliği (LCP için)',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Ürün kartı bileşeni. Görüntü, marka, isim, rating, fiyat ve favori butonu içerir.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        product: mockProduct,
    },
};

export const WithDiscount: Story = {
    args: {
        product: mockProduct,
    },
};

export const LowStock: Story = {
    args: {
        product: {
            ...mockProduct,
            variants: [
                {
                    ...mockProduct.variants[0],
                    stock: 3,
                },
            ],
        },
    },
};

export const NoRating: Story = {
    args: {
        product: {
            ...mockProduct,
            rating: 0,
            reviewCount: 0,
        },
    },
};

export const Priority: Story = {
    args: {
        product: mockProduct,
        priority: true,
    },
};
