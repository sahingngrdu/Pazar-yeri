import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, ProductCardSkeleton, CategoryCardSkeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'Atoms/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['text', 'circular', 'rectangular'],
            description: 'Skeleton şekli',
        },
        width: {
            control: 'text',
            description: 'Genişlik (px veya %)',
        },
        height: {
            control: 'text',
            description: 'Yükseklik (px veya %)',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Yükleme durumunda gösterilen placeholder bileşeni.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
    args: {
        variant: 'text',
        width: 200,
        height: 20,
    },
};

export const Circular: Story = {
    args: {
        variant: 'circular',
        width: 48,
        height: 48,
    },
};

export const Rectangular: Story = {
    args: {
        variant: 'rectangular',
        width: 200,
        height: 100,
    },
};

export const ProductCard: StoryObj = {
    render: () => <ProductCardSkeleton />,
    parameters: {
        docs: {
            description: {
                story: 'Ürün kartı yükleme placeholder\'ı',
            },
        },
    },
};

export const CategoryCard: StoryObj = {
    render: () => <CategoryCardSkeleton />,
    parameters: {
        docs: {
            description: {
                story: 'Kategori kartı yükleme placeholder\'ı',
            },
        },
    },
};
