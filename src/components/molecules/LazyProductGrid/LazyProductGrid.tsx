'use client';

import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { ProductCardSkeleton } from '@/components/atoms/Skeleton';
import type { Product } from '@/types';

// Lazy load ProductCard
const ProductCard = dynamic(
    () => import('@/components/molecules/ProductCard').then(mod => ({ default: mod.ProductCard })),
    { loading: () => <ProductCardSkeleton /> }
);

interface LazyProductGridProps {
    products: Product[];
    priorityCount?: number;
}

export function LazyProductGrid({ products, priorityCount = 4 }: LazyProductGridProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px', // Start loading 200px before viewport
    });

    if (!products || products.length === 0) return null;

    // Immediately render priority items (above the fold usually)
    const priorityItems = products.slice(0, priorityCount);
    // Lazy load the rest
    const lazyItems = products.slice(priorityCount);

    return (
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {priorityItems.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    priority={true}
                />
            ))}

            {inView && lazyItems.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    priority={false}
                />
            ))}
        </div>
    );
}
