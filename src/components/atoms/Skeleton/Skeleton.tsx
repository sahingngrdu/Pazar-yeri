import { clsx } from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    ...props
}: SkeletonProps) {
    const baseStyles = 'animate-shimmer bg-gray-200 dark:bg-gray-700';

    const variants = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    return (
        <div
            className={clsx(baseStyles, variants[variant], className)}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
            {...props}
        />
    );
}

// Preset skeletons for common use cases
export function ProductCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <Skeleton height={20} className="w-3/4" />
                <Skeleton height={16} className="w-1/2" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton height={24} className="w-1/3" />
                    <Skeleton variant="circular" width={36} height={36} />
                </div>
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-3">
                <Skeleton height={18} className="w-2/3 mx-auto" />
            </div>
        </div>
    );
}
