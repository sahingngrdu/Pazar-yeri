'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/atoms';
import { FavoriteButton } from '@/components/molecules/FavoriteButton';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

const ProductCardComponent = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
    const mainVariant = product.variants[0];
    const mainImage = product.images[0] || mainVariant?.thumbnails[0];

    const hasDiscount = mainVariant?.originalPrice && mainVariant.originalPrice > mainVariant.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - mainVariant.price / mainVariant.originalPrice!) * 100)
        : 0;

    const formattedPrice = useMemo(() => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(mainVariant?.price || 0);
    }, [mainVariant?.price]);

    const formattedOriginalPrice = useMemo(() => {
        if (!hasDiscount) return null;
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(mainVariant.originalPrice!);
    }, [hasDiscount, mainVariant?.originalPrice]);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
            <Link href={`/products/${product.slug}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {mainImage ? (
                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt || product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority={priority}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-gray-300 dark:text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hasDiscount && (
                            <Badge variant="sale">%{discountPercent}</Badge>
                        )}
                        {mainVariant?.stock <= 5 && mainVariant.stock > 0 && (
                            <Badge variant="discount">Son {mainVariant.stock} ürün</Badge>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3">
                        <FavoriteButton product={product} size="sm" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Brand */}
                    {product.brand && (
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            {product.brand.name}
                        </p>
                    )}

                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= Math.round(product.rating)
                                            ? 'text-amber-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({product.reviewCount})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {formattedPrice}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                                {formattedOriginalPrice}
                            </span>
                        )}
                    </div>

                    {/* Free Shipping Badge */}
                    {mainVariant?.price >= 500 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Ücretsiz Kargo
                        </div>
                    )}
                </div>
            </Link>
        </motion.article>
    );
}, (prevProps, nextProps) => {
    // Custom comparison: only re-render if product id or priority changes
    return prevProps.product.id === nextProps.product.id &&
        prevProps.priority === nextProps.priority;
});

// Export with displayName for debugging
ProductCardComponent.displayName = 'ProductCard';
export { ProductCardComponent as ProductCard };
