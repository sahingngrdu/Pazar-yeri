import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'filled'],
            description: 'Input görünüm varyantı',
        },
        label: {
            control: 'text',
            description: 'Input etiketi',
        },
        error: {
            control: 'text',
            description: 'Hata mesajı',
        },
        helperText: {
            control: 'text',
            description: 'Yardımcı metin',
        },
        disabled: {
            control: 'boolean',
            description: 'Devre dışı durumu',
        },
    },
    parameters: {
        docs: {
            description: {
                component: 'Temel input bileşeni. Label, hata, icon ve farklı varyantları destekler.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Email adresinizi girin...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Email',
        placeholder: 'ornek@email.com',
    },
};

export const WithError: Story = {
    args: {
        label: 'Email',
        placeholder: 'ornek@email.com',
        error: 'Geçerli bir email adresi girin',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Şifre',
        type: 'password',
        placeholder: '••••••••',
        helperText: 'En az 8 karakter olmalıdır',
    },
};

export const Filled: Story = {
    args: {
        label: 'Ad Soyad',
        placeholder: 'Adınızı girin',
        variant: 'filled',
    },
};

export const WithIcon: Story = {
    args: {
        placeholder: 'Ürün ara...',
        leftIcon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
};

export const Disabled: Story = {
    args: {
        label: 'Kullanıcı Adı',
        placeholder: 'Devre dışı',
        disabled: true,
        value: 'degistirilemez',
    },
};
