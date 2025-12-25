import { clsx } from 'clsx';

interface BadgeProps {
    variant?: 'sale' | 'new' | 'discount' | 'default';
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    const variants = {
        sale: 'bg-red-500 text-white',
        new: 'bg-emerald-500 text-white',
        discount: 'bg-amber-500 text-white',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
