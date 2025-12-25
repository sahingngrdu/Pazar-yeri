// Product Types based on Meshur API schema
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    categoryId: number;
    brandId: number | null;
    brand?: Brand;
    variants: ProductVariant[];
    images: ProductImage[];
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariant {
    id: number;
    productId: number;
    price: number;
    originalPrice?: number;
    stock: number;
    sku: string;
    barcode: string;
    options: VariantOption[];
    thumbnails: ProductImage[];
}

export interface VariantOption {
    id: number;
    title: string;
    value: string;
}

export interface ProductImage {
    id: number;
    url: string;
    alt: string;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    description?: string;
    websiteUrl?: string;
    logoUrl?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    imageUrl?: string;
    children?: Category[];
}

// Cart Types
export interface CartItem {
    id: number;
    variantId: number;
    productId: number;
    product: Product;
    variant: ProductVariant;
    quantity: number;
    isSelected: boolean;
}

export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

// User Types
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

export interface Address {
    id: number;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phone: string;
}

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    code: string;
    statusCode: number;
}
