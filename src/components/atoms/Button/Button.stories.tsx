import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger'],
            description: 'Buton görünüm varyantı',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Buton boyutu',
        },
        isLoading: {
            control: 'boolean',
            description: 'Yükleme durumu',
        },
        disabled: {
            control: 'boolean',
            description: 'Devre dışı durumu',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Temel buton bileşeni. Farklı varyant ve boyutları destekler.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Primary Button',
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary Button',
        variant: 'secondary',
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost Button',
        variant: 'ghost',
    },
};

export const Danger: Story = {
    args: {
        children: 'Danger Button',
        variant: 'danger',
    },
};

export const Small: Story = {
    args: {
        children: 'Small Button',
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        children: 'Large Button',
        size: 'lg',
    },
};

export const Loading: Story = {
    args: {
        children: 'Loading...',
        isLoading: true,
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
};

export const WithIcons: Story = {
    args: {
        children: 'Sepete Ekle',
        leftIcon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
    },
};
