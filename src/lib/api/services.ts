import { apiClient } from './client';
import { mapProducts, mapProduct, mapCategories, mapCategory } from '@/mappers';
import type { Product, Category } from '@/types';
import type { ProductDTO, CategoryDTO, PaginatedDTO } from '@/types/api.types';

// Products API
export const productsApi = {
    /**
     * Get all products with optional filters
     */
    async getProducts(params?: {
        page?: number;
        limit?: number;
        categoryId?: number;
        brandId?: number;
        sortBy?: string;
    }): Promise<{ products: Product[]; total: number; totalPages: number }> {
        const response = await apiClient.get<PaginatedDTO<ProductDTO>>('/api/products', { params });
        return {
            products: mapProducts(response.data.data),
            total: response.data.meta.total,
            totalPages: response.data.meta.totalPages,
        };
    },

    /**
     * Get single product by ID
     */
    async getProduct(id: number): Promise<Product> {
        const response = await apiClient.get<ProductDTO>(`/api/products/${id}`);
        return mapProduct(response.data);
    },

    /**
     * Get product by slug
     */
    async getProductBySlug(slug: string): Promise<Product> {
        const response = await apiClient.get<ProductDTO>(`/api/products/slug/${slug}`);
        return mapProduct(response.data);
    },

    /**
     * Search products
     */
    async searchProducts(query: string, params?: {
        page?: number;
        limit?: number;
    }): Promise<{ products: Product[]; total: number }> {
        const response = await apiClient.get<PaginatedDTO<ProductDTO>>('/api/products/search', {
            params: { q: query, ...params },
        });
        return {
            products: mapProducts(response.data.data),
            total: response.data.meta.total,
        };
    },
};

// Categories API
export const categoriesApi = {
    /**
     * Get all categories with tree structure
     */
    async getCategories(hasTree = true): Promise<Category[]> {
        const response = await apiClient.get<CategoryDTO[]>('/api/categories', {
            params: { hasTree },
        });
        return mapCategories(response.data);
    },

    /**
     * Get single category by ID
     */
    async getCategory(id: number): Promise<Category> {
        const response = await apiClient.get<CategoryDTO>(`/api/categories/${id}`);
        return mapCategory(response.data);
    },

    /**
     * Get category by slug
     */
    async getCategoryBySlug(slug: string): Promise<Category> {
        const response = await apiClient.get<CategoryDTO>(`/api/categories/slug/${slug}`);
        return mapCategory(response.data);
    },
};

// Brands API
export const brandsApi = {
    /**
     * Get all brands
     */
    async getBrands(): Promise<{ id: number; name: string; slug: string }[]> {
        const response = await apiClient.get<{ id: number; name: string; slug: string }[]>('/api/brands');
        return response.data;
    },
};
