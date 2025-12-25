import type { Product, ProductVariant, Brand, Category } from '@/types';
import type { ProductDTO, ProductVariantDTO, BrandDTO, CategoryDTO } from '@/types/api.types';

/**
 * Maps API ProductDTO to frontend Product type
 */
export function mapProduct(dto: ProductDTO): Product {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description || '',
        categoryId: dto.parentCategoryId,
        brandId: dto.brandId,
        brand: dto.brand ? mapBrand(dto.brand) : undefined,
        variants: dto.variants.map(mapProductVariant),
        images: dto.variants[0]?.thumbnails?.map((t) => ({
            id: t.id,
            url: t.url,
            alt: t.altText || dto.name,
        })) || [],
        rating: dto.rating || 0,
        reviewCount: dto.reviewCount || 0,
        createdAt: dto.createdAt || new Date().toISOString(),
        updatedAt: dto.updatedAt || new Date().toISOString(),
    };
}

/**
 * Maps API ProductVariantDTO to frontend ProductVariant type
 */
export function mapProductVariant(dto: ProductVariantDTO): ProductVariant {
    return {
        id: dto.id,
        productId: 0, // Will be set by parent
        price: dto.price,
        originalPrice: undefined, // API doesn't have this, calculate if needed
        stock: dto.stock,
        sku: dto.sku,
        barcode: dto.barcode,
        options: dto.options?.map((o) => ({
            id: o.id || 0,
            title: o.title,
            value: o.value,
        })) || [],
        thumbnails: dto.thumbnails?.map((t) => ({
            id: t.id,
            url: t.url,
            alt: t.altText || '',
        })) || [],
    };
}

/**
 * Maps API BrandDTO to frontend Brand type
 */
export function mapBrand(dto: BrandDTO): Brand {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description || undefined,
        websiteUrl: dto.websiteUrl || undefined,
        logoUrl: undefined, // API doesn't provide this directly
    };
}

/**
 * Maps API CategoryDTO to frontend Category type
 */
export function mapCategory(dto: CategoryDTO): Category {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentCategoryId,
        imageUrl: undefined, // Would need to fetch from imageId
        children: dto.children?.map(mapCategory),
    };
}

/**
 * Maps multiple products
 */
export function mapProducts(dtos: ProductDTO[]): Product[] {
    return dtos.map(mapProduct);
}

/**
 * Maps multiple categories
 */
export function mapCategories(dtos: CategoryDTO[]): Category[] {
    return dtos.map(mapCategory);
}
