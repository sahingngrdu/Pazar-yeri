import type { Meta, StoryObj } from '@storybook/react';
import { FavoriteButton } from './FavoriteButton';

const mockProduct = {
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

const meta: Meta<typeof FavoriteButton> = {
    title: 'Molecules/FavoriteButton',
    component: FavoriteButton,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Buton boyutu',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Favori butonu bileşeni. Animasyonlu kalp ikonu ile ürünü favorilere ekler/çıkarır.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
    args: {
        product: mockProduct,
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        product: mockProduct,
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        product: mockProduct,
        size: 'lg',
    },
};
