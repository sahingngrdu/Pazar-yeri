import type { Meta, StoryObj } from '@storybook/react';
import { CategoryCard } from './CategoryCard';

const mockCategory = {
    id: 1,
    name: 'Elektronik',
    slug: 'elektronik',
    parentId: null,
    imageUrl: undefined,
    children: [
        { id: 11, name: 'Telefonlar', slug: 'telefonlar', parentId: 1 },
        { id: 12, name: 'Bilgisayarlar', slug: 'bilgisayarlar', parentId: 1 },
        { id: 13, name: 'TV & Ses', slug: 'tv-ses', parentId: 1 },
    ],
};

const meta: Meta<typeof CategoryCard> = {
    title: 'Molecules/CategoryCard',
    component: CategoryCard,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Kart boyutu',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Kategori kartı bileşeni. Kategori ismi, alt kategori sayısı ve hover efekti içerir.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        category: mockCategory,
        size: 'md',
    },
};

export const Small: Story = {
    args: {
        category: mockCategory,
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        category: mockCategory,
        size: 'lg',
    },
};

export const WithoutChildren: Story = {
    args: {
        category: {
            id: 2,
            name: 'Giyim',
            slug: 'giyim',
            parentId: null,
        },
        size: 'md',
    },
};
