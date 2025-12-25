import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['sale', 'new', 'discount', 'default'],
            description: 'Badge türü',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Ürün kartlarında kullanılan etiket bileşeni. İndirim, yeni ürün vb. durumları gösterir.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sale: Story = {
    args: {
        children: '%25 İndirim',
        variant: 'sale',
    },
};

export const New: Story = {
    args: {
        children: 'Yeni',
        variant: 'new',
    },
};

export const Discount: Story = {
    args: {
        children: 'Son 3 ürün',
        variant: 'discount',
    },
};

export const Default: Story = {
    args: {
        children: 'Kategori',
        variant: 'default',
    },
};
