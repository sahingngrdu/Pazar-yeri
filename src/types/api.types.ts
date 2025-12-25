import type { Product, ProductVariant, Category } from '@/types';

// Raw API response types (from meshur.co API)
export interface ProductDTO {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parentCategoryId: number;
    brandId: number | null;
    previewVideoId: number | null;
    variants: ProductVariantDTO[];
    brand?: BrandDTO;
    rating?: number;
    reviewCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductVariantDTO {
    id: number;
    price: number;
    stock: number;
    barcode: string;
    sku: string;
    thumbnailIds: number[];
    options?: VariantOptionDTO[];
    thumbnails?: ThumbnailDTO[];
}

export interface VariantOptionDTO {
    id?: number;
    title: string;
    value: string;
    optionId?: number;
}

export interface ThumbnailDTO {
    id: number;
    url: string;
    altText?: string;
}

export interface BrandDTO {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    websiteUrl?: string | null;
}

export interface CategoryDTO {
    id: number;
    name: string;
    slug: string;
    parentCategoryId: number | null;
    imageId?: number | null;
    attributes?: CategoryAttributeDTO[];
    children?: CategoryDTO[];
}

export interface CategoryAttributeDTO {
    inputType: string;
    label: string;
    options?: string[];
}

// API Error Response
export interface ApiErrorDTO {
    message: string;
    statusCode: number;
    error?: string;
}

// Paginated Response
export interface PaginatedDTO<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
